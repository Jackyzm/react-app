import React from 'react';
import classNames from 'classnames';
import { Button, Form } from 'antd';
import './index.less';

const FormItem = Form.Item;

export default ({ className, ...rest }) => {
    return (
        <FormItem>
            <Button size="large" className={'submit'} type="primary" htmlType="submit" {...rest} />
        </FormItem>
    );
};
