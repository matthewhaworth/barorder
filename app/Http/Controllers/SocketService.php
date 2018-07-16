<?php
namespace App\Http\Controllers;

use Ratchet\ConnectionInterface;

use Ratchet\MessageComponentInterface;


class SocketService implements MessageComponentInterface
{
    /**
     * @var ConnectionInterface[]
     */
    public $admins = [];
    public $orders = [];

    /**
     * When a new connection is opened it will be passed to this method
     * @param  ConnectionInterface $conn The socket/connection that just connected to your application
     * @throws \Exception
     */
    public function onOpen(ConnectionInterface $conn)
    {
        echo "opened\n";
    }

    /**
     * This is called before or after a socket is closed (depends on how it's closed).  SendMessage to $conn will not result in an error if it has already been closed.
     * @param  ConnectionInterface $conn The socket/connection that is closing/closed
     * @throws \Exception
     */
    public function onClose(ConnectionInterface $conn)
    {
        echo "closed\n";
        // TODO: Implement onClose() method.
    }

    /**
     * If there is an error with one of the sockets, or somewhere in the application where an Exception is thrown,
     * the Exception is sent back down the stack, handled by the Server and bubbled back up the application through this method
     * @param  ConnectionInterface $conn
     * @param  \Exception $e
     * @throws \Exception
     */
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo $e->getMessage() . "\n";
    }

    /**
     * Triggered when a client sends data through the socket
     * @param  \Ratchet\ConnectionInterface $connFrom The socket/connection that sent the message to your application
     * @param  string $msg The message received
     * @throws \Exception
     */
    public function onMessage(ConnectionInterface $connFrom, $msg)
    {
        echo "{$msg}\n";
        //echo "New connection\n";
        $message = @json_decode($msg, true);
        if (!$message) {
            echo "ERROR: Invalid format\n";
            return;
        }

        if (!array_key_exists('type', $message)) {
            echo "ERROR: No type in message\n";
            return;
        }

        if ($message['type'] === 'auth') {
            if ($message['auth'] === 'admin') {
                echo "Registered new admin!\n";
                $this->admins[] = $connFrom;
            } elseif ($message['auth'] === 'customer') {
                $this->orders[$message['balance_transaction']] = $connFrom;
            }
            //echo "New auth\n";
            return;
        }

        if ($message['type'] === 'new_order') {
            $this->orders[$message['data']['balance_transaction']] = $message['data'];
            foreach ($this->admins as $admin) {
                echo "New order\n";
                $admin->send(json_encode($message['data']));
            }
        }

        echo "end\n";
    }
}