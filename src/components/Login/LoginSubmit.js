import React from 'react';
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
