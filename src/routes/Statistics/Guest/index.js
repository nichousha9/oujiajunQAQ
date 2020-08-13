/* eslint-disable import/first */
import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import classnames from 'classnames';
import styles from '../index.less';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { getHourByMills, formatDatetime, getDayByMills } from '../../../utils/utils';

const DataSet = require('@antv/data-set');

@connect(({ statisticBasicIndex, guestStatistic, loading }) => {
  return { statisticBasicIndex, guestStatistic, loading: loading.models.guestStatistic };
})
export default class Guest extends React.Component {
  constructor(props) {
    super(props);
    const {
      statisticBasicIndex: { channel, starttime, endtime, status },
    } = props;
    this.state = {
      channel,
      starttime,
      endtime,
      status,
    };
  }
  componentDidMount() {
    this.loadPage();
  }
  componentWillReceiveProps(nextProps) {
    const currActiveKey = this.props.activeKey;
    const {
      activeKey,
      statisticBasicIndex: { channel, starttime, endtime, status },
    } = nextProps;
    if ((currActiveKey !== activeKey && activeKey === 1) || endtime !== this.state.endtime) {
      this.setState({ starttime, endtime, status, channel }, () => {
        this.loadPage();
      });
      return;
    }
    if (
      channel !== this.state.channel ||
      endtime !== this.state.endtime ||
      starttime !== this.state.starttime ||
      status !== this.state.status
    ) {
      if (activeKey === 1) {
        this.setState({ channel, starttime, endtime, status }, () => {
          this.loadPage();
        });
      }
    }
  }
  loadPage = () => {
    const {
      statisticBasicIndex: { channel, starttime, endtime, status },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'guestStatistic/fetchAgentuserStatistical',
      payload: {
        channel,
        starttime,
        endtime,
        status,
      },
    });
    // 暂时注释标签的统计
    /* dispatch({
      type:'guestStatistic/fetchAgentLabelStatistical',
      payload:{
        channel,
        starttime,
        endtime,
        status,
      },
    }) */
    dispatch({
      type: 'guestStatistic/fetchAgentRegionStatistical',
      payload: {
        level: 3,
        channel,
        starttime,
        endtime,
        status,
      },
    });
  };
  handleGraphData = (graphData) => {
    if (!graphData || !graphData.length) return [];
    const {
      guestStatistic: { status },
    } = this.props;
    return graphData.map((data) => {
      // 按小时获取
      if (!status) {
        const time = getHourByMills(data.statisticaltime);
        return {
          ...data,
          time,
          detailTime: formatDatetime(data.statisticaltime),
        };
      }
      if (status === 1) {
        const time = getDayByMills(data.statisticaltime);
        return {
          ...data,
          time,
          detailTime: formatDatetime(data.statisticaltime),
        };
      }
      return data;
    });
  };
  handleAgenUserLabel = (data = []) => {
    if (!data || !data.length) return [];
    return data.map((item) => {
      return {
        ...item,
        name: (item.sysDic && item.sysDic.name) || '',
        sysDic: '',
      };
    });
  };
  render() {
    const {
      loading,
      guestStatistic: {
        guestGraphData = [],
        guestStatisticInfo = {},
        agentLabelList = [],
        agentRegionList = [],
      },
    } = this.props;
    const newAgentRegionList = agentRegionList.map((item) => {
      if (item.name && item.name.length > 3) {
        return {
          ...item,
          allName: item.name,
          name: item.name.substring(0, 3),
        };
      }
      return {
        ...item,
        allName: item.name,
      };
    });
    const ds = new DataSet();
    const dv = ds.createView().source(this.handleGraphData(guestGraphData));
    dv.transform({
      type: 'fold',
      fields: ['sessionnumber', 'effectivenumber', 'responsenumber'], // 展开字段集
      key: 'type', // key字段
      value: 'number', // value字段
    });
    const title = {
      autoRotate: true,
      offset: 10,
      textStyle: {
        fontSize: '12',
        textAlign: 'center',
        fill: '#404040',
        rotate: 0, // 20,
        textBaseline: 'top',
        marginTop: 10,
      }, // 坐标轴文本属性配置
    };
    const cols = {
      time: {
        range: [0, 1],
      },
      number: {
        alias: '数量',
      },
    };
    const agentLabelListData = this.handleAgenUserLabel(agentLabelList);
    const { DataView } = DataSet;
    const dv2 = new DataView();
    dv2.source(agentLabelListData).transform({
      type: 'percent',
      field: 'rate',
      dimension: 'name',
      as: 'percent',
    });
    const clientHeight =
      window.innerHeight || window.document.documentElement.clientHeight || window.document.body;
    return (
      <div
        className="bgWhite margin-bottom-20"
        style={{ overflow: 'auto', height: clientHeight - 192 }}
      >
        <Spin spinning={loading}>
          <div>
            <div className="totalTitle margin-bottom-20">会话量统计</div>
            <div className="flexBox margin-bottom-20">
              <div style={{ width: 320 }}>
                <div className="border flexBox">
                  <div className="flex1 verticalCenter">
                    <div className="padding-left-50" style={{ position: 'relative' }}>
                      <i className={classnames('iconfont commonFontIcon', styles.guestIconFont)}>
                        &#xe604;
                      </i>
                      <div className={styles.guestTotal}>
                        {guestStatisticInfo.sessionnumber || 0}
                      </div>
                      <div className={styles.guestTotalText}>会话总量</div>
                    </div>
                  </div>
                  <div className={classnames('flex1', 'border-left')}>
                    <div className={styles.details}>
                      <div className={styles.detailItem}>
                        <span>有效会话</span>
                        <span>{guestStatisticInfo.effectivenumber || 0}</span>
                      </div>
                      <div className="line" />
                      <div className={styles.detailItem}>
                        <span>响应会话</span>
                        <span>{guestStatisticInfo.responsenumber || 0}</span>
                      </div>
                      <div className="line" />
                      <div className={styles.detailItem}>
                        <span>响应效率</span>
                        <span>{guestStatisticInfo.responserate || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border flexBox margin-top-10">
                  <div className="flex1 verticalCenter">
                    <div className="padding-left-50" style={{ position: 'relative' }}>
                      <i className={classnames('iconfont commonFontIcon', styles.guestIconFont)}>
                        &#xe60a;
                      </i>
                      <div className={styles.guestTotal}>
                        {guestStatisticInfo.messagenumber || 0}
                      </div>
                      <div className={styles.guestTotalText}>消息总量</div>
                    </div>
                  </div>
                  <div className={classnames('flex1', 'border-left')}>
                    <div className={styles.details}>
                      <div className={styles.detailItem}>
                        <span>接受总量</span>
                        <span>{guestStatisticInfo.receptnumber || 0}</span>
                      </div>
                      <div className="line" />
                      <div className={styles.detailItem}>
                        <span>发送总量</span>
                        <span>{guestStatisticInfo.sendnumber || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex1">
                <div className="padding-left-20">
                  <div>
                    <span className="bold font14 padding-left-20">数量</span>
                    <span className="floatRight margin-right-30">
                      <i
                        className="userStatus margin-left-10 margin-right-10"
                        style={{ backgroundColor: '#F2637B' }}
                      />
                      会话总量
                      <i
                        className="userStatus margin-left-10 margin-right-10"
                        style={{ backgroundColor: '#52C41A' }}
                      />
                      有效会话
                      <i
                        className="userStatus margin-left-10 margin-right-10"
                        style={{ backgroundColor: '#1890FF' }}
                      />
                      响应回话
                    </span>
                  </div>
                  <Chart
                    placeholder
                    height={280}
                    padding={{ top: 20, left: 60, bottom: 40, right: 30 }}
                    data={dv}
                    scale={cols}
                    forceFit
                  >
                    <Axis name="time" />
                    <Axis name="number" />
                    <Tooltip
                      title="title"
                      g2-tooltip={{
                        position: 'absolute',
                        visibility: 'hidden',
                        border: '1px solid #efefef',
                        backgroundColor: 'white',
                        color: '#000',
                        padding: '5px 15px',
                      }}
                    />
                    <Geom
                      tooltip={[
                        'time*number*detailTime*type',
                        (time, number, detailTime, type) => {
                          return {
                            title: `<div>${detailTime}</div>`,
                            name:
                              type === 'responsenumber'
                                ? '响应会话'
                                : type === 'sessionnumber'
                                ? '会话总量'
                                : '有效会话',
                            value: number,
                          };
                        },
                      ]}
                      type="line"
                      position="time*number"
                      size={2}
                      color={['type', ['#F2637B', '#52C41A', '#1890FF']]}
                    />
                    <Geom
                      type="point"
                      position="time*number"
                      size={4}
                      shape="circle"
                      color={['type', ['#F2637B', '#52C41A', '#1890FF']]}
                      tooltip={[
                        'time*number*detailTime*type',
                        (time, number, detailTime, type) => {
                          return {
                            title: `<div>${detailTime}</div>`,
                            name:
                              type === 'responsenumber'
                                ? '响应会话'
                                : type === 'sessionnumber'
                                ? '会话总量'
                                : '有效会话',
                            value: number,
                          };
                        },
                      ]}
                    />
                  </Chart>
                </div>
              </div>
            </div>
          </div>
          <div className="flexBox margin-bottom-20 margin-top-20 margin-right-20">
            <div style={{ width: '100%' }}>
              <div className="flex1">
                <div className="totalTitle margin-bottom-20">访客分布排行</div>
                <div className={classnames('border', 'height300')}>
                  <Chart
                    height={300}
                    padding={{ top: 20, left: 40, bottom: 40, right: 20 }}
                    scale={{ sales: { tickInterval: 20 } }}
                    data={newAgentRegionList || []}
                    forceFit
                  >
                    <Axis name="name" label={title} />
                    <Axis name="number" />
                    <Tooltip />
                    <Geom
                      size={20}
                      tooltip={[
                        'name*number*allName',
                        (name, number, allName) => {
                          return {
                            title: `<div>${allName}</div>`,
                            name: '访客',
                            value: number,
                          };
                        },
                      ]}
                      type="interval"
                      position="name*number"
                    />
                  </Chart>
                </div>
              </div>
            </div>
            <div style={{ width: 15 }} />
            {/* 暂时注释标签的统计 */}
            {/* <div className="flex1">
            <div className="totalTitle margin-bottom-20">访客标签对比统计</div>
            <div className={classnames('border','height300')}>
              <Chart unChecked="true" height={280} data={dv2} scale={cols2} padding={[ 20, 60,0, -200 ]} forceFit>
                <Coord type='theta' radius={0.6} innerRadius={0.8} />
                <Axis name="percent" />
                <Legend
                  position='right'
                  useHtml="true"
                  offsetX={-200}
                  offsetY={-150}
                  itemTpl={
                    (value, color, checked, index) => {
                      const obj = dv2.rows[index] || {};
                      const curChecked = checked ? 'checked' : 'unChecked';
                      return '<div class="g2-legend-list-item item-' + index + ' ' + curChecked +
                          '" data-value="' + value + '" data-color=' + color +
                          ' style="cursor: pointer;font-size: 14px;">' +
                          '<span width=150 style="border: none;padding:0;"><i class="g2-legend-marker" style="width:10px;height:10px;display:inline-block;margin-right:10px;background-color:' + color + ';"></i>' +
                          '<span style="color:rgba(0,0,0,0.65);">' + value + '</span></span>' +
                          '<span style="margin:0 10px;color:#D9D9D9;width:1px;height:6px;overflow: hidden">|</span>' +
                          '<span class="g2-legend-text">' + obj.rate + '%</span>' +
                          '<span class="g2-legend-text"style="margin-left:10px;border: none;color:rgba(0,0,0,0.65)">' + obj.labelnumber + '</span>' +
                          '</div>';
                      }
                  }

                />
                <Tooltip
                  showTitle={false}
                  itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                />
                <Geom
                  color={['rate', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0']]}
                  style={{lineWidth: 2,stroke: '#fff'}}
                  type="intervalStack"
                  position="percent"
                  color='name'
                  tooltip={['name*percent',(name, percent) => {
                    return {
                      name,
                      value: `${percent * 100}%`,
                    };
                  }]}
                >
                </Geom>
              </Chart>
            </div>
          </div> */}
          </div>
        </Spin>
      </div>
    );
  }
}
