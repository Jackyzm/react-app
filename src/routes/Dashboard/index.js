import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.less';

@connect(
    (state) => {
        return {
            state,
        };
    }
)
class Dashboard extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'user/asdsd', payload: {} });
    }
    render() {
        console.debug(this.props);
        return (
            <div>Hello word!</div>
        );
    }
}

export default Dashboard;
