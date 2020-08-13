/* eslint-disable no-param-reassign */
/* eslint-disable import/first */
import React from 'react';
import { connect } from 'dva';
import { Spin,Radio } from 'antd';
import classnames from 'classnames';
import styles from '../index.less'
import { Chart, Geom, Axis, Tooltip} from 'bizcharts';
import { getHourByMills, formatDatetime, getDayByMills, getMintByMs} from "../../../utils/utils";
import StandardTable from '../../../components/StandardTable';

const DataSet = require('@antv/data-set');

@connect(({statisticBasicIndex, communication, loading}) => {
 return {statisticBasicIndex,communication, loading:loading.models.communication}
})
export default class Communication extends React.Component{

  constructor(props){
    super(props);
    const {statisticBasicIndex:{channel, starttime, endtime, status, organid}} = props;
    this.state = {
      channel,
      starttime,
      endtime,
      status,
      organid,
      tabType: 'summary', // 默认显示概况,
      orgSummaryInfo:{},// 部门概况-信息
      orgSumGraphInfo:{},// 部门概况-折线图信息
      childOrgDetailList:[],// 概况-子部门明细列表
      userSummaryInfoList:[],// 用户情况-明细列表
    }
  }
  componentDidMount(){
    this.loadPage();
  }
  componentWillReceiveProps(nextProps){
    // const currActiveKey = this.props.activeKey;
    const { statisticBasicIndex:{channel, starttime, endtime, status, organid}} = nextProps;
    // if(currActiveKey !== activeKey && activeKey===1){
    //   this.setState({starttime,endtime,status,channel},() => {
    //     this.loadPage();
    //   })
    //   return;
    // }
    if(channel !== this.state.channel || endtime !== this.state.endtime ||
      starttime !== this.state.starttime || status !== this.state.status
      || organid !== this.state.organid){
      this.setState({channel, starttime, endtime, status, organid},() => {
        this.loadPage();
      })
    }
    const { communication:{orgSummaryInfo={},orgSumGraphInfo={}, childOrgDetailList, userSummaryInfoList}} = nextProps;
    if((orgSummaryInfo && orgSummaryInfo !== this.state.orgSummaryInfo) || orgSumGraphInfo !== this.state.orgSumGraphInfo ||
      childOrgDetailList !== this.state.childOrgDetailList || userSummaryInfoList !== this.state.userSummaryInfoList){
      this.setState({orgSummaryInfo, orgSumGraphInfo, childOrgDetailList, userSummaryInfoList});
    }

  }
  pageSize = 10;
  loadPage =(pageIndex) =>{
    const {statisticBasicIndex:{channel, starttime, endtime, status, organid}} = this.props;
    const { dispatch } = this.props;
    if(!pageIndex){
      pageIndex = 0;
    }
    dispatch({
      type:'communication/fetchComChildOrgDetail',
      payload:{
        channel,
        starttime,
        endtime,
        status,
        organid,
        p:pageIndex,
        ps:this.pageSize,
      },
    });
    dispatch({
      type:'communication/fetchComGraphicSummary',
      payload:{
        channel,
        starttime,
        endtime,
        status,
        organid,
      },
    });
    dispatch({
      type:'communication/fetchComOrganSummary',
      payload:{
        channel,
        starttime,
        endtime,
        status,
        organid,
      },
    });
    dispatch({
      type:'communication/fetchComUserSummary',
      payload:{
        channel,
        starttime,
        endtime,
        status,
        organid,
      },
    });
  }
  loadOrgPage =(pageIndex) =>{
    const {statisticBasicIndex:{channel, starttime, endtime, status, organid}} = this.props;
    const { dispatch } = this.props;
    if(!pageIndex){
      pageIndex = 0;
    }
    dispatch({
      type:'communication/fetchComChildOrgDetail',
      payload:{
        channel,
        starttime,
        endtime,
        status,
        organid,
        p:pageIndex,
        ps:this.pageSize,
      },
    });
  }
  loadUserPage =(pageIndex) =>{
    const {statisticBasicIndex:{channel, starttime, endtime, status, organid}} = this.props;
    const { dispatch } = this.props;
    if(!pageIndex){
      pageIndex = 0;
    }
    dispatch({
      type:'communication/fetchComUserSummary',
      payload:{
        channel,
        starttime,
        endtime,
        status,
        organid,
        p:pageIndex,
        ps:this.pageSize,
      },
    });
  }
  handleGraphData =(graphData) => {
    if(!graphData || !graphData.length) return [];
    const { statisticBasicIndex:{ endtime, starttime } } = this.props;
    return graphData.map((data)=>{
      // 按小时获取
      if(endtime - starttime <= 86400000){
        const time = getHourByMills(data.statisticaltime);
        return {
          ...data,
          time,
          detailTime:formatDatetime(data.statisticaltime),
        }
      }
      if(endtime - starttime > 86400000){
        const time = getDayByMills(data.statisticaltime);
        return {
          ...data,
          time,
          detailTime:formatDatetime(data.statisticaltime),
        }
      }
      return data;
    })
  }
  handleModeChange=(e)=>{
    this.setState({tabType: e.target.value})
    // 每次Tab切换的时候查询的参数清空了
  }
  tableChange = (pagination) =>{
    this.loadOrgPage(pagination.current);
  }
  usertableChange = (pagination) =>{
    this.loadUserPage(pagination.current);
  }
  render(){
    const { tabType, orgSummaryInfo = {}, orgSumGraphInfo={}, childOrgDetailList, userSummaryInfoList } = this.state;
    const { loading} = this.props;
    const columns = [
      {
        title: '组织',
        dataIndex: 'organName',
        fixed: 'left',
        width: 150,
      },
      {
        title: '登录人数',
        dataIndex: 'loginPersonCount',
      },
      {
        title:'登录次数',
        dataIndex:'loginTotalCount',

      },
      {
        title:'日平均在线时长',
        dataIndex:'avgOnlineTime',
        render: val => `${getMintByMs(val)} 分钟`,
      },
      {
        title:'发送消息总量',
        dataIndex:'sendMsgCount',
      },
      {
        title:'问题记录数',
        dataIndex:'questionCount',
      },
      {
        title:'机器人咨询量',
        dataIndex:'askRobotCount',
      },
      {
        title:'机器人回复准确率',
        dataIndex:'robotAvailableRate',
      },
      {
        title:'收藏数量',
        dataIndex:'chatfavCount',
      },
      {
        title:'知识收录总量',
        dataIndex:'solutionCount',
      },
    ];
    const usercolumns = [
      {
        title: '人员',
        dataIndex: 'username',
        fixed: 'left',
        width: 150,
      },
      {
        title: '组织',
        dataIndex: 'organname',
      },
      {
        title: '登录次数',
        dataIndex: 'loginNumber',
      },
      {
        title:'日平均在线时长',
        dataIndex:'onlinetime',
        render: val => `${getMintByMs(val)} 分钟`,
      },
      {
        title:'发送消息条数',
        dataIndex:'sendmessageNumber',
      },
      {
        title:'机器人咨询量',
        dataIndex:'consultationNumber',
      },
      {
        title:'机器人回复条数',
        dataIndex:'replyNumber',
      },
      {
        title:'收藏数量',
        dataIndex:'favNumber',
      },
      {
        title:'未解决问题条数',
        dataIndex:'unsolveNumber',
      },
    ];
    const tableProps = {
      ref:(ele)=>{this.tableRef = ele;},
      loading,
      noSelect:true,
      tableClass:'padding-10',
      data:childOrgDetailList,
      onChange:this.tableChange,
      columns,
      cutHeight:350,
      scroll:{ x: 1300, y:400 },
      rowKey:"organId",
    }
    // 用户情况
    const usertableProps = {
      ref:(ele)=>{this.tableRef = ele;},
      loading,
      noSelect:true,
      tableClass:'padding-10',
      data:userSummaryInfoList,
      onChange:this.usertableChange,
      columns:usercolumns,
      cutHeight:350,
      scroll:{ x: 1300, y:400 },
      rowKey:"id",
    }
    const ds = new DataSet();
    const dv = ds.createView().source(this.handleGraphData(orgSumGraphInfo));
    dv.transform({
      type: 'fold',
      fields: [ 'sendMsgCount','askRobotCount','groupMsgCount' ], // 展开字段集
      key: 'type', // key字段
      value: 'number', // value字段
    });
    const cols = {
      time: {
        range: [ 0, 1 ],
      },
      number: {
        alias:'数量',
      },
    }
    const clientHeight = window.innerHeight || window.document.documentElement.clientHeight || window.document.body;
    return(
      <div className="bgWhite margin-bottom-20" style={{overflow:'auto',height:clientHeight-192}}>
        <div>
          <Radio.Group onChange={this.handleModeChange} value={tabType} style={{ marginBottom: 8 }}>
            <Radio.Button value="summary">概况</Radio.Button>
            <Radio.Button value="usermary">用户情况</Radio.Button>
          </Radio.Group>
          { tabType==='summary'&& (
            <Spin spinning={loading}>
              <div>
                <div className="flexBox margin-bottom-20">
                  <div style={{width:320}}>
                    <div className="border flexBox margin-top-10">
                      <div className="flex1 verticalCenter">
                        <div className="padding-left-50"style={{position:'relative'}}>
                          <i className={classnames('iconfont commonFontIcon',styles.guestIconFont)}>&#xe60a;</i>
                          <div className={styles.guestTotal}>{orgSummaryInfo.loginPersonCount || 0}</div>
                          <div className={styles.guestTotalText}>登录人数</div>
                        </div>
                      </div>
                      <div className={classnames('flex1','border-left')}>
                        <div className={styles.details}>
                          <div className={styles.detailItem}>
                            <span>登录次数</span>
                            <span>{orgSummaryInfo.loginTotalCount || 0}</span>
                          </div>
                          <div className="line" />
                          <div className={styles.detailItem}>
                            <span style={{display:'block'}}>日平均在线时长</span>
                            <span>{getMintByMs(orgSummaryInfo.avgOnlineTime || 0)} 分钟</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border flexBox  margin-top-10">
                      <div className="flex1 verticalCenter">
                        <div className="padding-left-50"style={{position:'relative'}}>
                          <i className={classnames('iconfont commonFontIcon',styles.guestIconFont)}>&#xe604;</i>
                          <div className={styles.guestTotal}>{orgSummaryInfo.sendMsgCount || 0}</div>
                          <div className={styles.guestTotalText}>发送消息总量</div>
                        </div>
                      </div>
                      <div className={classnames('flex1','border-left')}>
                        <div className={styles.details}>
                          <div className={styles.detailItem}>
                            <span>机器人咨询量</span>
                            <span>{orgSummaryInfo.askRobotCount || 0}</span>
                          </div>
                          <div className="line" />
                          <div className={styles.detailItem}>
                            <span>群消息量</span>
                            <span>{orgSummaryInfo.groupMsgCount || 0}</span>
                          </div>
                          <div className="line" />
                          <div className={styles.detailItem}>
                            <span>私聊消息量</span>
                            <span>{orgSummaryInfo.privateMsgCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="flex1">
                    <div className="padding-left-20">
                      <div>
                        <span className="bold font14 padding-left-20">数量</span>
                        <span className='floatRight margin-right-30'>
                          <i className="userStatus margin-left-10 margin-right-10" style={{backgroundColor:'#F2637B'}} />消息总量
                          <i className="userStatus margin-left-10 margin-right-10" style={{backgroundColor:'#52C41A'}} />机器人咨询总量
                          <i className="userStatus margin-left-10 margin-right-10" style={{backgroundColor:'#1890FF'}} />群消息总量
                        </span>
                      </div>
                      <Chart
                        placeholder
                        height={280}
                        padding={{ top:20,left:60,bottom:40,right:30}}
                        data={dv}
                        scale={cols}
                        forceFit
                      >
                        <Axis name="time" />
                        <Axis name="number" />
                        <Tooltip
                          title="title"
                          g2-tooltip={{position: 'absolute', visibility: 'hidden', border : '1px solid #efefef',
                            backgroundColor: 'white', color: '#000', padding: '5px 15px'}}
                        />
                        <Geom
                          tooltip={['time*number*detailTime*type', (time,number,detailTime,type)=>{
                            return {
                              title:`<div>${detailTime}</div>`,
                              name:type==='sendMsgCount' ? '消息总量':(type === 'askRobotCount'? '机器人咨询总量' :'群消息总量'),
                              value: number,
                            }
                          }]}
                          type="line"
                          position="time*number"
                          size={2}
                          color={['type',['#F2637B','#52C41A','#1890FF']]}
                        />
                        <Geom
                          type='point'
                          position="time*number"
                          size={4}
                          shape='circle'
                          color={['type',['#F2637B','#52C41A','#1890FF']]}
                          tooltip={['time*number*detailTime*type', (time,number,detailTime,type)=>{
                            return {
                              title:`<div>${detailTime}</div>`,
                              name:type==='sendMsgCount' ? '消息总量':(type === 'askRobotCount'? '机器人咨询总量' :'群消息总量'),
                              value: number,
                            }
                          }]}
                        />
                      </Chart>
                    </div>
                  </div>
                </div>
                <StandardTable {...tableProps} />
              </div>
            </Spin>
          )}
          { tabType==='usermary'&& (
            <div>
              <StandardTable {...usertableProps} />
            </div>
          )}
        </div>

      </div>
    )
  }
}
