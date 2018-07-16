<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/order', function(Request $request) {
    \Stripe\Stripe::setApiKey('sk_test_blws6RCBcXCR7TOAtL1dkrhH');
    $charge = \Stripe\Charge::create([
        'amount' => $request->json('price') * 100,
        'currency' => 'gbp',
        'source' => $request->json('tokenId')
    ]);

    $orderData = [
        'transaction_id'      => $charge->id,
        'balance_transaction' => $charge->balance_transaction,
        'amount'              => $request->json('price'),
        'selected_drinks'     => $request->json('selectedDrinks'),
        'order_number'        => rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9)
    ];

    $options = [];

    \Ratchet\Client\connect('ws://127.0.0.1:8080')->then(function($conn) use ($orderData) {
        $conn->send(json_encode(['type' => 'new_order', 'data' => $orderData]));
        $conn->close();
    }, function ($e) {
        echo "Could not connect: {$e->getMessage()}\n";
    });



    return $orderData;
});