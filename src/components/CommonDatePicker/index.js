import React from 'react';
import {  Menu, Dropdown,DatePicker,Button,Icon} from 'antd';
import moment from 'moment';
import {getTimeForFmortat } from '../../utils/utils'
import classnames from 'classnames';
import styles from './index.less';

const MenuItem = Menu.Item;
const { RangePicker } = DatePicker;
const CALENDARFORMATS =  {
  sameDay: '[今天]',
  lastDay: '[昨天]',
}
const defaultData = {
  today: { key: 'today', text:'今天', getDate: () => { return moment().calendar(null,CALENDARFORMATS)}},
  yesterday: {key: 'yesterday', text: '昨天', getDate: () => {return `${moment().subtract(1, 'days').calendar(null,CALENDARFORMATS)}~${moment().calendar(null,CALENDARFORMATS)}`}},
  pastWeek: {key: 'pastWeek', text: '过去7天', getDate: () => {return `${moment().subtract(7, 'days').calendar(null,CALENDARFORMATS)}~${moment().calendar(null,CALENDARFORMATS)}`}},
  pastMonth: {key: 'pastMonth', text: '过去30天', getDate: () => {return `${moment().subtract(30, 'days').calendar(null,CALENDARFORMATS)}~${moment().calendar(null,CALENDARFORMATS)}`}},
  };
export default class CommonDatePicker extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      date: props.defaultDate || moment().calendar(null,CALENDARFORMATS), // 时间默认是今天
      display: 'none',
      menueData: this.getCurrMenueData() || Object.values(defaultData),
    }
  }
  onChange = (date, dateString) => {
    // 自定义
    this.setdate({},'custom',dateString);
  }
  getCurrMenueData = () => {
    const { menuData =[] } = this.props;
    if(!menuData.length) return Object.values(defaultData);
    const newMenuData = menuData.map((menu) => {
      // 已经有默认数据；
      if( typeof menu === 'string' && defaultData[menu]){
        return defaultData[menu];
      }
      // 获取自定的时间
      if( typeof menu === 'object' && menu.text && menu.key && menu.getDate){
        return menu;
      }
      return '';
    });
    return newMenuData.filter((menu) => { return menu});
  }
  // 设置当前的确定时间；
  setdate = (curMenue = {} ,key,timeArr) => {
    const curKey = curMenue.key || key || '';
    if(!curKey) return;
    const { getDataPickerDate } = this.props;
    const selectedDate = getTimeForFmortat(curKey,timeArr);
    this.selectedDate = selectedDate;
    this.setState({
      date:timeArr ? `${timeArr[0]}~${timeArr[1]}` : (curKey === 'yesterday' ? '昨天': curMenue.getDate()) ,
      visible: false,
      display: 'none',
    },()=>{
      if(getDataPickerDate) getDataPickerDate(selectedDate);
    })
  }
  // 设置选中的时间
  handleMenuClick = (e) => {
    const { menueData } = this.state;
    const curMenue = (menueData.filter((menu) => { return e.key === menu.key }) || [])[0];
    // 自定义显示时间
    if(e.key === 'custom'){
      this.setState({display:'block'},() => {
       document.getElementsByClassName('ant-calendar-picker-input')[0].click();
       document.getElementsByClassName('ant-calendar-picker-input')[0].style.visibility="hidden";
       document.getElementsByClassName('ant-calendar-picker')[0].style.height="0";
      })
      return;
    }
    // 有固定的时间计算方法
    this.setdate(curMenue,curMenue.key)
  }
  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  dataPack = () => {
    this.setState({
      visible: true,
    })
  }
  selectedDate =  getTimeForFmortat('today') // 当前选中的时间
  render(){
    const { menueData, date,visible } = this.state;
    const { className } = this.props;
    const menu = (
      <div className={classnames('commonDatePickerMenue')}>
        <Menu onClick={this.handleMenuClick}>
          {
            menueData.map((data) => {
              return <MenuItem key={data.key}>{ data.text }</MenuItem>
            })
          }
          <MenuItem key="custom">自定义</MenuItem>
        </Menu>
      </div>
    );
    return(
      <div style={{maxWidth: 200}} className={classnames(styles.commonDatePicker,className)}>
        <Dropdown
          trigger={['click']}
          overlay={menu}
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button style={{ maxWidth: 200,padding:0,minWidth:120,lineHeight:"32px",display:'flex' }}>
            <span style={{flex:1}}>{date}</span>
            <Icon style={{ width:26,marginRight:5,marginLeft:0,height:32,lineHeight:'32px'}}type={visible ? 'up' :"down"} />
          </Button>
        </Dropdown>
        <RangePicker
          style={{ display: this.state.display }}
          onChange={this.onChange}
          onOpenChange={this.dataPack}
          placeholder={['开始日期', '结束日期']}
        />
      </div>
    );
  }
}
