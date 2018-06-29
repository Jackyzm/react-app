/**
 * @param {any} initialState
 * @param {any} handlers
 * @return {fun}
 */
const createReducer = (initialState, handlers) => {
    return (state = initialState, action) => {
        if (!action || !action.type) {
            return state;
        }

        const handler = handlers[action.type];
        const newState = handler ? handler(state, action) : state;

        return newState;
    };
};

/**
 * @param {any} options
 * @return {obj}
 */
const buildReducer = (options) => {
    const reducers = {};
    const reducerGroups = new Map();

    Object.entries(options).map((item) => {
        return collectReducers(reducerGroups, item[1]);
    });
    for (const [key, reducerGroup] of reducerGroups.entries()) {
        reducers[key] = initialReducerGroup(reducerGroup);
    }
    return reducers;
};

/**
 * @param {any} reducerGroups
 * @param {any} reducers
 */
const collectReducers = (reducerGroups, reducers) => {
    reducers.forEach((reducer) => {
        const keys = reducer.key.split('/');
        const [groupKey, ...subKeys] = keys;
        let group = reducerGroups.get(groupKey);
        if (!group) {
            group = new Map();
            reducerGroups.set(groupKey, group);
        }
        if (subKeys.length === 0) {
            reducer.single = true;
        } else {
            reducer.subKeys = subKeys;
        }
        group.set(reducer.key, reducer);
    });
};

/**
 * @param {any} reducerGroup
 * @return {obj}
 */
const initialReducerGroup = (reducerGroup) => {
    const handlers = {};
    let initialState = {};
    for (const reducer of reducerGroup.values()) {
        if (!reducer.resultKey) {
            reducer.resultKey = 'result';
        }
        if (reducer.single) {
            initialState = reducer.initialState || {};
        } else {
            overrideState(initialState, reducer.subKeys, reducer.initialState);
        }

        handlers[reducer.key] = reducerHandler(reducer, 'loading', (state, action) => {
            if (action && action.state) return { [reducer.resultKey]: action.state };
            return { [reducer.resultKey]: null, payload: action.payload, success: false, loading: true };
        });

        handlers[`${reducer.key}/@reset`] = reducerHandler(reducer, 'loading', () => {
            return { };
        });

        handlers[`${reducer.key}/@success`] = reducerHandler(reducer, 'success', (state, action) => {
            return { [reducer.resultKey]: action.result, payload: action.payload, success: true, loading: false };
        });

        handlers[`${reducer.key}/@fail`] = reducerHandler(reducer, 'fail', (state, action) => {
            return { payload: action.payload, error: action.error, success: false, loading: false };
        });
    }
    return createReducer(initialState, handlers);
};

/**
 * @param {any} state
 * @param {any} keys
 * @param {any} value
 */
const overrideState = (state, keys, value = {}) => {
    const { length } = keys;
    if (length === 1) {
        state[keys[0]] = value;
        return;
    }
    let previous = state;
    for (let i = 0; i < length; ++i) {
        if (i === length - 1) {
            previous[keys[i]] = value;
        } else {
            let next = previous[keys[i]];
            if (!next) {
                next = previous[keys[i]] = {};
            }
            previous = next;
        }
    }
};

/**
 * @param {any} reducer
 * @param {any} method
 * @param {any} handler
 * @return {fun}
 */
const reducerHandler = (reducer, method, handler) => {
    return (state, action) => {
        let result;
        if (reducer[method]) {
            result = reducer[method](state, action);
        } else {
            result = handler(state, action);
        }
        if (reducer.single) {
            state = result;
        } else {
            state = { ...state };
            overrideState(state, reducer.subKeys, result);
        }
        return state;
    };
};

export default buildReducer;
