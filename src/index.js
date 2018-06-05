import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createHashHistory';
import 'moment/locale/zh-cn';

import App from './router';
import './index.less';

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();
const sagas = {};
const reducers = {};
const store = createStore(
    combineReducers(
        reducers
    ),
    compose(
        applyMiddleware(sagaMiddleware),
        process.env.NODE_ENV === 'development' && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);
sagaMiddleware.run(sagas);
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
