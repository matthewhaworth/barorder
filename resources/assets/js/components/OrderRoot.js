import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {CardElement, Elements, StripeProvider} from "react-stripe-elements";
import CheckoutForm from "./CheckoutForm";

const drinks = [
    {
        code: 'pepsi',
        label: 'Pepsi',
        price: 1.99
    },
    {
        code: 'guinness',
        label: 'Guinness',
        price: 4.05
    }
];

function formatPrice(x) {
    return Number.parseFloat(x);
}

export default class OrderRoot extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedDrinks: [],
            totalPrice: formatPrice(0),
            placeOrderReady: false
        };
    }

    onSelectDrink(selectedDrink) {
        if (this.state.selectedDrinks.indexOf(selectedDrink.code) === -1) {
            // Add drink
            this.setState(prevState => ({
                selectedDrinks: [...prevState.selectedDrinks, selectedDrink.code],
                totalPrice: formatPrice(prevState.totalPrice += selectedDrink.price)
            }));
        } else {
            // Remove drink
            this.setState(prevState => ({
                selectedDrinks: prevState.selectedDrinks.filter( drink => selectedDrink.code !== drink),
                totalPrice: formatPrice(prevState.totalPrice -= selectedDrink.price)
            }));
        }
    };

    placeOrder() {
        this.setState(prevState => ({
            placeOrderReady: !prevState.placeOrderReady
        }));
    }

    render() {
        const { selectedDrinks, totalPrice, placeOrderReady } = this.state;
        return (
            <StripeProvider apiKey="pk_test_rY5lZt46KAdX9vbb1InVUt4D">
                <div className="container">
                    <div className='row'>
                        <div className='col'>
                            <h1>Order your drink</h1>
                            {drinks.map(drink =>
                                <div className="form-check" key={drink.code}>
                                    <input className="form-check-input"
                                           type="checkbox"
                                           checked={selectedDrinks.indexOf(drink.code) !== -1}
                                           id={drink.code}
                                           disabled={placeOrderReady}
                                           onClick={() => this.onSelectDrink(drink)} />
                                    <label className="form-check-label" htmlFor={drink.code}>
                                        {drink.label}
                                    </label>
                                </div>
                            )}
                            <h3>{totalPrice.toFixed(2)}</h3>
                            <button type="button" onClick={() => this.placeOrder()}
                                    className="btn btn-primary" disabled={totalPrice <= 0}>
                                {placeOrderReady ? 'Cancel Order' : 'Place Order'}
                                </button>
                        </div>
                    </div>
                    {placeOrderReady && <div className='row'>
                        <div className='col-12'>
                            <Elements>
                                <CheckoutForm selectedDrinks={selectedDrinks}
                                              price={totalPrice} />
                            </Elements>
                        </div>
                    </div>}
                </div>
            </StripeProvider>
        );
    }
}

if (document.getElementById('order_root')) {
    ReactDOM.render(<OrderRoot />, document.getElementById('order_root'));
}
