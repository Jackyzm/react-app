import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
import './MyCalendar.less';

const DATE_FORMAT = 'YYYY-MM-DD';
const getMonthDay = Symbol('getMonthDay');
const setCalendarDom = Symbol('setCalendarDom');
const getClassName = Symbol('getClassName');

/**
 * @class Calendar
 * @extends {Component}
 */
class MyCalendar extends Component {
    static propTypes = {
        onSelect: PropTypes.any,
        data: PropTypes.any,
    };
    /**
     * Creates an instance of MyCalendar.
     * @param {any} props
     * @memberof MyCalendar
     */
    constructor(props) {
        super(props);
        this.state={
            weekArr: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
            selectedDay: moment().format(DATE_FORMAT),
            today: moment().format(DATE_FORMAT),
        };
    }

    /**
     * @memberof MyCalendar
     */
    componentWillMount() {
        const { onSelect } = this.props;
        // onSelect(moment().format(DATE_FORMAT));
        this.setState({ daysArr: this[getMonthDay](moment()) }, ()=>{
            const { daysArr } = this.state;
            onSelect(moment().format(DATE_FORMAT), { from: daysArr[0][0].date, to: daysArr[daysArr.length-1][6].date});
        });
    }
    /**
     * @param {any} nextProps
     * @memberof MyCalendar
     */
    componentWillReceiveProps(nextProps) {
        const { data } = nextProps;
        const { daysArr } = this.state;
        if (!data || !data.length) return;
        daysArr.map((item)=>{
            item.map((value)=>{
                nextProps.data.map((val)=>{
                    if (val.date == value.date) value.content = val;
                });
            });
        });
    }
    /**
     * @param {any} num
     * @memberof MyCalendar
     * @return {number}
     */
    zeroFilling(num) {
        if (num >= 10) {
            return num;
        } else {
            return `0${num}`;
        }
    }
    /**
     * @param {any} date
     * @return {array}
     * @memberof MyCalendar
     */
    [getMonthDay](date) {
        const daysArr = [];
        const currentWeekday = moment(date).date(1).weekday(); // 获取当月1日为星期几
        const lastMonthDays = moment(date).month((moment(date).month()-1)).daysInMonth(); // 获取上月天数
        const currentMonthDays = moment(date).daysInMonth(); // 获取当月天数
        for (let i = 0; i < 6; i++) {
            let arr =[];
            let day = lastMonthDays - currentWeekday + (i*7);
            for (let j = 1; j <= 7; j++) {
                let newDay = day + j;
                let value = {};
                if (newDay <= lastMonthDays) {
                    value={
                        num: newDay,
                        date: `${moment(date).month((moment(date).month()-1)).format('YYYY-MM')}-${this.zeroFilling(newDay)}`,
                    };
                } else if (newDay-lastMonthDays <= currentMonthDays) {
                    value = {
                        num: newDay-lastMonthDays,
                        date: `${moment(date).format('YYYY-MM')}-${this.zeroFilling(newDay-lastMonthDays)}`,
                        month: 'thisMonth',
                    };
                } else {
                    value = {
                        num: newDay-lastMonthDays-currentMonthDays,
                        date: `${moment(date).month((moment(date).month()+1)).format('YYYY-MM')}-${this.zeroFilling(newDay-lastMonthDays-currentMonthDays)}`,
                    };
                }
                arr.push(value);
            }
            daysArr.push(arr);
        }
        if (daysArr[daysArr.length-1][0].num <= 7) daysArr.pop();
        return daysArr;
    }
    /**
     * @param {any} e
     * @param {any} data
     * @memberof MyCalendar
     */
    [setCalendarDom](e, data) {
        if (!data) return;
        let top = e.clientY+20;
        let left = e.clientX+20;
        // console.debug(e.clientY, e.clientX, document.body.clientHeight, document.body.clientWidth);
        if (document.body.clientWidth - e.clientX < 170 ) left = e.clientX - 170;
        if (document.body.clientHeight - e.clientY < parseInt(16.7*data.length) + 40) top = e.clientY - parseInt(16.7*data.length) - 30;
        const arr = data.map((item, index)=>{
            return `<p key=${index}>${item.name}：<span>${item.value}</span></p>`;
        });
        document.getElementById('MyCalendar-hover-box').innerHTML=`<div class='MyCalendar-hover-box' style='top: ${top}px; left: ${left}px '>${arr.join('')}</div>`;
    }
    /**
     * @param {any} value
     * @memberof MyCalendar
     * @return {string}
     */
    [getClassName](value) {
        const { selectedDay, today } = this.state;
        if (!value.month) return 'myCalendar-not-this-month';
        if (value.date == selectedDay) {
            if (value.date == today) return 'myCalendar-select-day myCalendar-today';
            return 'myCalendar-select-day';
        } else {
            if (value.date == today) return 'myCalendar-today';
            return 'myCalendar-cell';
        }
    }
    /**
     * @return {dom}
     * @memberof Calendar
     */
    render() {
        const { weekArr, daysArr, selectedDay } = this.state;
        const { onSelect } = this.props;
        let timer = '';
        let Table=()=>{
            return (
                <table>
                    <thead>
                        <tr>
                            {
                                weekArr.map((item, index)=>{
                                    return <th key={index}><span>{item}</span></th>;
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {daysArr.map((item, index)=>{
                            return (
                                <tr key={index}>
                                    {
                                        item.map((value, num)=>{
                                            return (
                                                <td
                                                    key={value.date}
                                                    // title={moment(value.date).format('ll')}
                                                    className={`myCalendar-cell ${this[getClassName](value)}`}
                                                >
                                                    <div className={'myCalendar-date'}
                                                        onClick={()=>{
                                                            if (value.date == selectedDay) return;
                                                            onSelect(moment(value.date).format(DATE_FORMAT), { from: daysArr[0][0].date, to: daysArr[daysArr.length-1][6].date});
                                                            if (value.month) return this.setState({selectedDay: value.date});
                                                            this.setState({ selectedDay: value.date, daysArr: this[getMonthDay](value.date) });
                                                        }}
                                                        onMouseEnter={(e)=>{
                                                            if (!value.content) return document.getElementById('MyCalendar-hover-box').innerHTML='';
                                                            if (timer) {
                                                                window.clearTimeout(timer);
                                                                timer = '';
                                                                this[setCalendarDom](e, value.content.transactionDetails);
                                                            }
                                                        }}
                                                        onMouseLeave={(e)=>{
                                                            if (!value.content) return;
                                                            timer = window.setTimeout(()=>document.getElementById('MyCalendar-hover-box').innerHTML='', 100);
                                                        }}
                                                        onMouseMove={(e)=>{
                                                            if (!value.content) return;
                                                            this[setCalendarDom](e, value.content.transactionDetails);
                                                        }}
                                                    >
                                                        <div className={'myCalendar-content'}>
                                                            {
                                                                value.content && (value.content.totalIncome/1 || value.content.totalOutcome/1) ?
                                                                <div>
                                                                    <p>{`gddas：${value.content.num}`}</p>
                                                                    <p>{`gfdsg：${value.content.totalIncome}`}</p>
                                                                    <p>{`dfgdf：${value.content.totalOutcome}`}</p>
                                                                    <p>{`fsdfs：${value.content.netValue}`}</p>
                                                                </div>
                                                                : ''
                                                            }
                                                        </div>
                                                        <div className={'myCalendar-value'}>{value.num}</div>
                                                    </div>
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        }) }
                    </tbody>
                </table>
            );
        };
        return (
            <div className={'MyCalendar'}>
                <div className={'MyCalendar-DatePicker'}>
                    <DatePicker allowClear={false} format={'ll'} defaultValue={moment()} value={moment(selectedDay)} onChange={(date, dateString)=>{
                        if (!date || date == null || moment(date).format(DATE_FORMAT) == selectedDay) return;
                        if ((moment(date).format('YYYY-MM') == moment(selectedDay).format('YYYY-MM'))) {
                            this.setState({ selectedDay: moment(date).format(DATE_FORMAT) });
                            onSelect(moment(date).format(DATE_FORMAT), { from: daysArr[0][0].date, to: daysArr[daysArr.length-1][6].date});
                        } else {
                            this.setState({ selectedDay: moment(date).format(DATE_FORMAT), daysArr: this[getMonthDay](moment(date).format(DATE_FORMAT)) });
                            onSelect(moment(date).format(DATE_FORMAT), { from: daysArr[0][0].date, to: daysArr[daysArr.length-1][6].date});
                        }
                    }}/>
                </div>
                <div className={'MyCalendar-table'}>
                    <Table/>
                    <div id={'MyCalendar-hover-box'}>

                    </div>
                </div>
            </div>
        );
    }
}

export default MyCalendar;
