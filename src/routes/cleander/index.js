import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'antd';
import store from 'store';

import MyCalendar from './MyCalendar';
import REDUX_ACTION_TYPES from 'Common/constant/REDUX_ACTION_TYPES';
import FormErrorPanel, { ERROR_TYPE_MESSAGE_REDIRECT } from 'Common/component/FormErrorPanel';
import CommonService from 'Common/service/CommonService';
import './index.less';

const dateSelect = Symbol('dateSelect');
const getData = Symbol('getData');
const judgeProduct = Symbol('judgeProduct');
/**
 * @class
 */
class DealHistory extends Component {
    static propTypes = {
        dispatch: PropTypes.any,
        productId: PropTypes.any,
    };
    /**
     * Creates an instance of DealHistory.
     * @param {any} props
     * @memberof DealHistory
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tableData: [],
        };
        this.columns = [
            { dataIndex: 'date', title: '日期' },
            { dataIndex: 'code', title: '代码' },
            { dataIndex: 'name', title: '简称' },
            { dataIndex: 'Amount', title: '金额', className: 'table-money' },
            { dataIndex: 'type', title: '类型' },
        ];
    }
    /**
     * @memberof DealHistory
     */
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch({ type: `${REDUX_ACTION_TYPES.SET_ERROR_INFO}_RESET` });
    }
    /**
     * @param {any} nextProps
     * @memberof DealHistory
     */
    componentWillReceiveProps(nextProps) {
        // console.debug(nextProps);
        const { dispatch, productId } = nextProps;
        if (productId) {
            let value = productId;
            productId == 'overview' ? value = false : null;
            this.setState({ productId: value }, () => {
                // this[getTableData]();
                dispatch({ type: `${REDUX_ACTION_TYPES.SET_ERROR_INFO}_RESET` });
                dispatch({ type: `${REDUX_ACTION_TYPES.SET_PRODUCT_ID}_RESET` });
            });
        } else {
            const defaultTag = store.get('defaultActive');
            const { dispatch } = this.props;
            if (!defaultTag) {
                const errorInfo = {
                    code: 402,
                    msg: '请选择一个产品！',
                };
                this.setState({ panelData: [], tableData: [], loading: true });
                dispatch({ type: REDUX_ACTION_TYPES.SET_ERROR_INFO, state: errorInfo });
                return;
            }
        }

        // 日历数据
        let result = CommonService.getPropertyX(nextProps, 'panelData.result');
        if (CommonService.judgeResult(result, this.props, REDUX_ACTION_TYPES, ERROR_TYPE_MESSAGE_REDIRECT)) return;
        if (!result || CommonService.isEmptyObject(result)) return;
        const data = CommonService.getPropertyX(result, 'data');
        this.setState({ panelData: data });

        // 表格数据
        let loading = CommonService.getPropertyX(nextProps, 'tableData.loading');
        if (loading === true) {
            this.setState({ loading });
        } else {
            let result = CommonService.getPropertyX(nextProps, 'tableData.result');
            if (CommonService.judgeResult(result, this.props, REDUX_ACTION_TYPES, ERROR_TYPE_MESSAGE_REDIRECT)) return;
            let data = CommonService.getPropertyX(result, 'data');
            this.setState({ tableData: data, loading });
        }
        dispatch({ type: `${REDUX_ACTION_TYPES.SET_ERROR_INFO}_RESET` });
    }
    /**
     * @param {any} selectDate
     * @param {any} dateRange
     * @return {any}
     * @memberof DealHistory
     */
    [dateSelect](selectDate, dateRange) {
        const oldDateRange = this.state.dateRange;
        if (dateRange == oldDateRange) return this.setState({ selectDate }, () => this[getData](false));
        this.setState({ selectDate, dateRange }, () => this[getData](true));
    }
    /**
     * @param {any} change
     * @memberof DealHistory
     */
    [getData](change) {
        const status = this[judgeProduct]();
        if (!status) return;

        const defaultTag = store.get('defaultActive');
        const { dispatch } = this.props;
        const { selectDate, dateRange } = this.state;

        const values = {
            productId: defaultTag,
            date: selectDate,
        };
        this.setState({ loading: true });
        dispatch({ type: REDUX_ACTION_TYPES.DEAL_HISTORY_TABLE_DATA, payload: values });

        if (!change) return;

        const value = {
            productId: defaultTag,
            from: dateRange.from,
            to: dateRange.to,
        };
        dispatch({ type: REDUX_ACTION_TYPES.DEAL_HISTORY_PANEL_DATA, payload: value });
    }

    /**
     * @return {boolean}
     * @memberof DealHistory
     */
    [judgeProduct]() {
        const defaultTag = store.get('defaultActive');
        const { dispatch } = this.props;
        if (defaultTag) return true;
        const errorInfo = {
            code: 402,
            msg: '请选择一个产品！',
        };
        dispatch({ type: REDUX_ACTION_TYPES.SET_ERROR_INFO, state: errorInfo });
        return false;
    }
    /**
     * render
     * @return {dom}
     */
    render() {
        const { panelData, loading, tableData } = this.state;
        return (
            <div className={'DealHistory'}>
                <FormErrorPanel />
                <MyCalendar
                    onSelect={(date, dateRange) => this[dateSelect](date, dateRange)}
                    data={panelData}
                />
                <Table
                    className={'DealHistory-table'}
                    columns={this.columns}
                    loading={loading}
                    dataSource={tableData}
                    pagination={false}
                    scroll={{ x: 600, y: 300 }}
                />
            </div>
        );
    }
}

export default connect(
    (state) => {
        return {
            panelData: state.dealHistory.panelData,
            tableData: state.dealHistory.TableData,
            productId: state.setProductId.result,
        };
    }
)(DealHistory);
