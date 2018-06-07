import React from 'react';
import ReactDOM from 'react-dom';
// import { Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createHashHistory';
import 'moment/locale/zh-cn';

import App from './router';
import models from './models';
import reducersBuild from './utils/reducerBuild';
import sagasBuild from './utils/sagaBuild';
import './index.less';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const middleware = routerMiddleware(history);
const reducers = reducersBuild(models);
const sagas = sagasBuild(models);

export const store = createStore(
    combineReducers({
        ...reducers,
        router: routerReducer,
    }),
    compose(
        applyMiddleware(
            middleware,
            sagaMiddleware,
        ),
        process.env.NODE_ENV === 'development' && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);
sagaMiddleware.run(sagas);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);
