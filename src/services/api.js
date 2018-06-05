import request from '../utils/request';

export async function queryProjectNotice() {
    return request('/api/project/notice');
}

export async function queryRule(params) {
    return request(`/api/rule?${JSON.stringify(params)}`);
}

export async function addRule(params) {
    return request('/api/rule', {
        method: 'POST',
        body: {
            ...params,
            method: 'post',
        },
    });
}

export async function fakeAccountLogin(params) {
    return request('/api/login/account', {
        method: 'POST',
        body: params,
    });
}

export async function fakeRegister(params) {
    return request('/api/register', {
        method: 'POST',
        body: params,
    });
}
