import { fork, put, takeEvery } from 'redux-saga/effects';
import { request } from './request';

/**
 * @param {any} options
 * @return {*}
 */
const buildSagas = (options) => {
    const sagaArr = [];

    Object.entries(options).map((value) => {
        for (const item of value[1]) {
            return item.url && sagaArr.push(createSaga(item));
        }
        return null;
    });

    return function* () {
        for (const saga of sagaArr) {
            yield fork(saga);
        }
    };
};

/**
 * @param {any} item
 * @return {fun}
 */
const createSaga = (item) => {
    return function* () {
        if (item.key) {
            yield takeEvery(item.key, function* ({ payload }) {
                let result;
                try {
                    result = yield request(item.url(payload), { });
                } catch (error) {
                    result = { success: false, errMessage: '服务端连接异常' };
                }

                if (result.success) {
                    yield put({ type: `${item.key}/@success`, result, payload });
                } else {
                    yield put({ type: `${item.key}/@fail`, error: result, payload });
                }
            });
        } else {
            // console.warn(`sagaBuilder.createSaga: action is null or undefined in data model with key: ${item.key}`);
        }
    };
};

export default buildSagas;
