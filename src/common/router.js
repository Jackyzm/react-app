import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

import Dashboard from '../routes/Dashboard/index';
import UserLayout from '../routes/User/UserLayout';
import Login from '../routes/User/Login';
import Register from '../routes/User/Register';
import RegisterResult from '../routes/User/RegisterResult';

let routerDataCache;

const modelNotExisted = (app, model) => (
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
    // () => require('module')
    // transformed by babel-plugin-dynamic-import-node-sync
    if (component.toString().indexOf('.then(') < 0) {
        models.forEach((model) => {
            if (modelNotExisted(app, model)) {
                // eslint-disable-next-line
                app.model(require(`../models/${model}`).default);
            }
        });
        return (props) => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            // return createElement(component().default, {
            //     ...props,
            //     routerData: routerDataCache,
            // });
            // 不使用异步模块
            return createElement(component(), {
                ...props,
                routerData: routerDataCache,
            });
        };
    }
    // () => import('module')
    return dynamic({
        app,
        models: () => models.filter(
            model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
        ),
        // add routerData prop
        component: () => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return component().then((raw) => {
                // const Component = raw.default || raw;
                // 不使用异步模块
                const Component = raw;
                return props => createElement(Component, {
                    ...props,
                    routerData: routerDataCache,
                });
            });
        },
    });
};

function getFlatMenuData(menus) {
    let keys = {};
    menus.forEach((item) => {
        if (item.children) {
            keys[item.path] = { ...item };
            keys = { ...keys, ...getFlatMenuData(item.children) };
        } else {
            keys[item.path] = { ...item };
        }
    });
    return keys;
}

export const getRouterData = (app) => {
    const routerConfig = {
        '/': {
            component: dynamicWrapper(app, [], () => Dashboard),
        },
        // '/form/step-form': {
        //   component: dynamicWrapper(app, ['form'], () => StepForm),
        // },
        // '/form/step-form/info': {
        //   name: '分步表单（填写转账信息）',
        //   component: dynamicWrapper(app, ['form'], () => Step1),
        // },
        // '/form/step-form/confirm': {
        //   name: '分步表单（确认转账信息）',
        //   component: dynamicWrapper(app, ['form'], () => Step2),
        // },
        // '/form/step-form/result': {
        //   name: '分步表单（完成）',
        //   component: dynamicWrapper(app, ['form'], () => Step3),
        // },
        '/user': {
            component: dynamicWrapper(app, [], () => UserLayout),
        },
        '/user/login': {
            component: dynamicWrapper(app, ['login'], () => Login),
        },
        '/user/register': {
            component: dynamicWrapper(app, ['register'], () => Register),
        },
        '/user/register-result': {
            component: dynamicWrapper(app, [], () => RegisterResult),
        },
    };
    // Get name from ./menu.js or just set it in the router data.
    const menuData = getFlatMenuData(getMenuData());

    // Route configuration data
    // eg. {name,authority ...routerConfig }
    const routerData = {};
    // The route matches the menu
    Object.keys(routerConfig).forEach((path) => {
        // Regular match item name
        // eg.  router /user/:id === /user/chen
        const pathRegexp = pathToRegexp(path);
        const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
        let menuItem = {};
        // If menuKey is not empty
        if (menuKey) {
            menuItem = menuData[menuKey];
        }
        let router = routerConfig[path];
        // If you need to configure complex parameter routing,
        // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
        // eg . /list/:type/user/info/:id
        router = {
            ...router,
            name: router.name || menuItem.name,
            authority: router.authority || menuItem.authority,
        };
        routerData[path] = router;
    });
    return routerData;
};
