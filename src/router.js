import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Dashboard from './routes/Dashboard';
import UserLayout from './routes/User/UserLayout';

class App extends Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/user" component={UserLayout} />
                </Switch>
            </LocaleProvider>
        );
    }
}

export default App;
