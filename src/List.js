import React, { Component } from 'react';
import './List.less';
import Th from 'img/th.jpg';

class List extends Component {
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
            </div>
        );
    }
}

export default List;
