// CheckoutForm.js
import React from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

class CardForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false };
        this.submit = this.submit.bind(this);
    }

    async submit(ev) {
        // We don't want to let default form submission happen here, which would refresh the page.
        ev.preventDefault();
        this.setState({ loading: true });
        const { stripe, price, selectedDrinks } = this.props;
        stripe.createToken({name: 'Matthew Haworth'}).then(({token}) => {
            const body = {
                tokenId: token.id,
                price,
                selectedDrinks
            };

            fetch('/api/order', {
                method: 'post',
                body: JSON.stringify(body)
            }).then(res => {
                return res.json();
            }).then(json => {
                console.log(json);
                this.setState({ loading: false });
            });
        });
    }

    render() {
        const { loading } = this.state;
        return (
            <div className="checkout">
                <hr />
                <p>Payment Method</p>
                <br />
                <CardElement style={{base: {fontSize: '18px'}}} />
                <br />
                <button type='button' className='btn btn-primary'
                        disabled={loading}
                        onClick={this.submit}>{loading ? "Processing!" : "Send"}</button>
            </div>
        );
    }
}

export default injectStripe(CardForm);