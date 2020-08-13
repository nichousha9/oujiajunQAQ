/* eslint-disable import/first */
import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { formatDatetime,getDayByMills,getHourByMills} from "../../../utils/utils";
import classnames from 'classnames';
import styles from '../index.less'

const DataSet = require('@antv/data-set');
@connect((props) => {
  const { robotResponse,statisticBasicIndex,loading} = props;
  return {robotResponse,statisticBasicIndex,loading:loading.models.robotResponse};
})
export default class RobotResponse extends React.Component{
  constructor(props){
    super(props);
    const {statisticBasicIndex:{channel, starttime, endtime, status}} = props;
    this.state = {
      channel,
      starttime,
      endtime,
      status,
  }

  }
  componentDidMount(){
    this.loadPage();
  }
  componentWillReceiveProps(nextProps){
    const currActiveKey = this.props.activeKey;
    const { activeKey,statisticBasicIndex: { starttime,endtime,status,channel} } = nextProps;
    if(currActiveKey !== activeKey && activeKey===3){
      this.setState({starttime,endtime,status,channel},() => {
        this.loadPage();
      })
      return;
    }
    if(starttime!==this.state.starttime ||
      endtime!==this.state.endtime ||
      status !== this.state.status||
      channel!== this.state.channel){
      if(activeKey===3){
        this.setState({starttime,endtime,status,channel},() => {
          this.loadPage();
        })
      }
    }
  }
  loadPage= () => {
    const {starttime,endtime,status,channel} = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'robotResponse/fetchRobotStatistical',
      payload:{ starttime,endtime,status,channel},
    });
  }
  handleGraphData =(graphData) => {
    if(!graphData || !graphData.length) return [];
    const { robotResponse:{ status } } = this.props;
    return graphData.map((data)=>{
      // 按小时获取
      if(!status){
        const time = getHourByMills(data.statisticaltime);
        return {
          ...data,
          time,
          detailTime:formatDatetime(data.statisticaltime),
        }
      }
      if(status === 1){
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
  render(){
    const { robotResponse: { statisticalData ={},graphData = [] },loading } = this.props;
    const ds = new DataSet();
    const dv = ds.createView().source(this.handleGraphData(graphData));
    dv.transform({
      type: 'fold',
      fields: [ 'tandardnumber', 'unidentifiednumber' ], // 展开字段集
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
    return(
      <Spin spinning={loading}>
        <div className={styles.statisticalRobot}>
          <div className="totalTitle margin-bottom-20">机器人回复总量</div>
          <div className="flexBox">
            <div style={{width: 320}}>
              <div>
                <div className={classnames(styles.totalBox,'border')}>
                  <div className={classnames(styles.total)}>
                    <div className={classnames(styles.img)}>
                      <i className="iconfont" >&#xe604;</i>
                    </div>
                    <div className={classnames('')}>
                      <div className={styles.totalNumber}>{statisticalData.totalnumber ||0}</div>
                      <span className={styles.totalText}>总回复数</span>
                    </div>
                  </div>
                  <div>
                    <div className="padding-12">
                      <div className={classnames(styles.totalItem,'height50')}>
                        <div className={styles.text}>回复标准答案</div>
                        <div className={styles.number}>{statisticalData.tandardnumber||0}</div>
                      </div>
                      <div className="line margin-top-bottom-12" />
                      <div className={classnames(styles.totalItem,'height50')}>
                        <div className={styles.text}>未识别问题</div>
                        <div className={styles.number}>{statisticalData.unidentifiednumber||0}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classnames(styles.totalBox,'border','margin-top-10')}>
                  <div className={classnames(styles.total)}>
                    <div className={classnames(styles.img)}>
                      <i className="iconfont" >&#xe60c;</i>
                    </div>
                    <div className={classnames('')}>
                      <div className={styles.totalNumber}>{statisticalData.negativerate||0}<span>%</span></div>
                      <span className={styles.totalText}>会话差评率</span>
                    </div>
                  </div>
                  <div>
                    <div className="padding-12">
                      <div className={classnames(styles.totalItem,'height50')}>
                        <div className={styles.text}>差评总数量</div>
                        <div className={styles.number}>{statisticalData.negativetotal||0}</div>
                      </div>
                      <div className="line margin-top-bottom-12" />
                      <div className={classnames(styles.totalItem,'height50')}>
                        <div className={styles.text}>机器人差评数</div>
                        <div className={styles.number}>{statisticalData.negativenumber||0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex1">
              <div className="margin-left-20" >
                {!!graphData.length && (
                <div>
                  <div>
                    <span className="bold font14">数量</span>
                    <span className='floatRight margin-right-20'>
                      <i className="userStatus margin-left-10 margin-right-10" style={{backgroundColor:'#1890FF'}} />回复标准答案
                      <i className="userStatus margin-left-10 margin-right-10" style={{backgroundColor:'#F2637B'}} />未识别问题
                    </span>
                  </div>
                  <Chart
                    placeholder
                    height={300}
                    padding={{ top:28,left:40,bottom:40,right:20}}
                    data={dv}
                    scale={cols}
                    forceFit
                  >
                    {/*                     <Legend
                       position="top"
                       custom
                       marker='circle'
                       items={[
                         { value: '回复标准答案', marker:{fill: '#1890FF'}},
                         { value: '未识别问题', marker:{fill: '#F2637B'}},
                       ]}
                     /> */}
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
                           name:type==='tandardnumber' ? '回复标准答案':'未识别问题',
                           value: number,
                         }
                       }]}
                      type="line"
                      position="time*number"
                      size={2}
                      color={['type',['#1890FF','#F2637B']]}
                    />
                    <Geom
                      type='point'
                      position="time*number"
                      size={4}
                      shape="circle"
                      color={['type',['#1890FF','#F2637B']]}
                      tooltip={['time*number*detailTime*type', (time,number,detailTime,type)=>{
                         return {
                           title:`<div>${detailTime}</div>`,
                           name:type==='tandardnumber' ? '回复标准答案':'未识别问题',
                           value: number,
                         }
                       }]}
                    />
                  </Chart>
                </div>
                )}
                {!graphData.length && <div className="contentCenter" style={{height:300}}>暂无数据</div>}
              </div>
            </div>
          </div>
        </div>
      </Spin>
    )
  }
}
