import React from 'react';
import { connect } from 'react-redux';

class Counter extends React.Component {

    increment = () => {
        this.props.dispatch({ type: 'COUNTER_INCREMENT' });
    }
    
    decrement = () => {
        this.props.dispatch({ type: 'COUNTER_DECREMENT' });
    }

    render() {
        return (
            <div>
                <h2>Counter</h2>
                <div>
                    <button onClick={this.decrement}>-</button>
                    <span>{this.props.count}</span>
                    <button onClick={this.increment}>+</button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
          count: state.counter.count
    };
}

export default connect(mapStateToProps)(Counter);