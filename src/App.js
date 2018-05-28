import React, { Component } from 'react';
import './App.less';
import Th from 'img/th.jpg';
import List from './List';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div>Hello,world!
                <img src={Th} alt="" />
                <span className={'iconfont icon-shezhibiaotou'}></span>
                <List />
            </div>
        );
    }
}

export default App;
