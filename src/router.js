import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
// import Authorized from './utils/Authorized';
import './index.less';

const { ConnectedRouter } = routerRedux;
// const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
    return <Spin size="large" className={'globalSpin'} />;
});

function RouterConfig({ history, app }) {
    const routerData = getRouterData(app);
    const Dashboard = routerData['/'].component;
    // const UserLayout = routerData['/user'].component;
    return (
        <LocaleProvider locale={zhCN}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route
                        path="/"
                        component={Dashboard}
                    />
                    {/* <AuthorizedRoute
                        path="/"
                        render={props => <Dashboard {...props} />}
                        authority={['admin', 'user']}
                        redirectPath="/user/login"
                    /> */}
                </Switch>
            </ConnectedRouter>
        </LocaleProvider>
    );
}

export default RouterConfig;
