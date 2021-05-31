import React, { Component } from 'react'
import './customers.css';
// const custo = [
//     { id: 1, firstName: 'John', lastName: 'Doe' },
//     { id: 2, firstName: 'steve', lastName: 'smith' },
//     { id: 3, firstName: 'mark', lastName: 'Carl' }
// ];

export default class Custoemers extends Component {
    constructor (){
        super();
        this.state ={
            customers:[]
}
    }
    componentDidMount(){
        fetch('/a/b')
        .then(res=> res.json())
        .then(cust => this.setState({customers:cust}, () => console.log('customers fetched ..', cust)));
    }

    
    render() {
        return (
            <div>
                <h2>Customers</h2>
                <ul>
                   {this.state.customers.map(customer =>
                    <li key={customer.id}>{customer.firstName} {customer.lastName}</li>
                    )}
                </ul>
            </div>
        )
    }
}
