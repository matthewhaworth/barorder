<?php

namespace App\Console\Commands;

use App\Http\Controllers\SocketService;
use Illuminate\Console\Command;

class WebSocketServer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'websocket:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    protected $socketService;

    /**
     * Create a new command instance.
     *
     * @param SocketService $socketService
     */
    public function __construct(SocketService $socketService)
    {
        parent::__construct();
        $this->socketService = $socketService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $loop   = \React\EventLoop\Factory::create();
        // Set up our WebSocket server for clients wanting real-time updates
        $webSocket = new \React\Socket\Server('0.0.0.0:8080', $loop); // Binding to 0.0.0.0 means remotes can connect
        new \Ratchet\Server\IoServer(
            new \Ratchet\Http\HttpServer(
                new \Ratchet\WebSocket\WsServer($this->socketService)
            ),
            $webSocket
        );

        $loop->run();
    }
}
