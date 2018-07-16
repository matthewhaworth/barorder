import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class AdminRoot extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            orders: []
        };

        const webSocket = new WebSocket('ws://127.0.0.1:8080');
        webSocket.onopen = () => {
            webSocket.send(JSON.stringify({ type: 'auth', auth: 'admin' }));
        };

        webSocket.onmessage = (order) => {
            const newOrderItem = JSON.parse(order.data);
            this.setState(prevState => ({
                orders: [...prevState.orders, newOrderItem]
            }));
        }
    }

    render() {
        const { orders } = this.state;
        return (
            <div className="container">
                <table className="table">
                    <thead className="thead-dark">
                    <tr>
                        <th scope="col">Order #</th>
                        <th scope="col">Items</th>
                        <th scope="col">Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => <tr key={order.order_number}>
                        <th scope="row">{order.order_number}</th>
                        <td>{order.selected_drinks.map(drink => <span key={drink}>{drink}</span>)}</td>
                        <td>{order.amount}</td>
                    </tr>)}
                    </tbody>
                </table>
            </div>
        );
    }
}

if (document.getElementById('admin_root')) {
    ReactDOM.render(<AdminRoot />, document.getElementById('admin_root'));
}
