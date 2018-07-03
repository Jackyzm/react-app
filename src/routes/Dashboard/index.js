import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
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
            <div>Hello word!
                <Button type={'primary'}>dsadasda</Button>
            </div>
        );
    }
}

export default Dashboard;
