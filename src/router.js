import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import './index.less';

const { ConnectedRouter } = routerRedux;
dynamic.setDefaultLoadingComponent(() => {
    return <Spin size="large" className={'globalSpin'} />;
});

function RouterConfig({ history, app }) {
    const routerData = getRouterData(app);
    const Dashboard = routerData['/'].component;
    const UserLayout = routerData['/user'].component;
    return (
        <LocaleProvider locale={zhCN}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/user" component={UserLayout} />
                </Switch>
            </ConnectedRouter>
        </LocaleProvider>
    );
}

export default RouterConfig;
