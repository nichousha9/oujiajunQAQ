/* eslint-disable react/sort-comp */
import React from 'react';
import { Row, Col, Spin, Icon } from 'antd';
import { connect } from 'dva';
import { Chart, Geom, Axis, Tooltip, Coord } from 'bizcharts';
import CommonAreaLevelOne from '../../components/CommonAreaLevelOne';
import CommonList from '../../components/CommonList';
import { indexTopColor } from '../../utils/color';
import { getTimeForFmortat } from '../../utils/utils';

const DataSet = require('@antv/data-set');

@connect(({ homens, loading }) => {
  return {
    homens,
    loading: loading.effects['homens/fetchGetUnsolvedQuestionList'],
  };
})
class UnsolvedQuestion extends React.Component {
  componentDidMount() {
    this.loadSolvedQuestion();
  }
  componentWillReceiveProps(nextProps) {
    const nextTime = nextProps.dateData.join(',');
    const curTime = this.props.dateData.join(',');
    if (nextTime !== curTime) {
      this.loadSolvedQuestion(nextProps.dateData);
    }
  }
  loadSolvedQuestion = (curTime = []) => {
    const { dateData, dispatch } = this.props;
    const curDate = curTime.length
      ? curTime
      : dateData.length
      ? dateData
      : getTimeForFmortat('today');
    const starttime = new Date(curDate[0]).getTime();
    const endtime = new Date(curDate[1]).getTime();
    dispatch({
      type: 'homens/fetchGetUnsolvedQuestionList',
      payload: {
        ps: 10,
        starttime,
        endtime,
        areapath: this.areaData,
      },
    });
  };
  loadPageByArea = (areaData) => {
    this.areaData = areaData;
    this.loadSolvedQuestion();
  };
  renderItem = (item, index) => {
    return (
      <div span={24} style={{ paddingTop: 6, paddingBottom: 6, width: '100%', display: 'flex' }}>
        <div style={{ width: '5%' }}>
          <Icon
            className="dot"
            style={{ fontSize: 12, marginRight: 10, backgroundColor: indexTopColor[index] }}
          />
        </div>
        <div style={{ width: '70%', wordBreak: 'break-all' }}>{item.question}</div>
        <div style={{ width: '10%' }} className="text-center">{`${item.rate}%`}</div>
        <div style={{ width: '15%' }} className="text-center">
          {item.total}
        </div>
      </div>
    );
  };
  areaData = ''; // 当前的地区的数据
  render() {
    const {
      loading,
      homens: { mostUnUsedQuestionList = {} },
    } = this.props;
    const { DataView } = DataSet;
    const pictureList = mostUnUsedQuestionList.list ? [...mostUnUsedQuestionList.list] : [];
    if (
      mostUnUsedQuestionList.others &&
      !!pictureList.length &&
      pictureList[pictureList.length - 1].id !== 'others'
    ) {
      pictureList.push(mostUnUsedQuestionList.others);
    }
    const dv = new DataView();
    dv.source(pictureList || []).transform({
      type: 'percent',
      field: 'number',
      dimension: 'question',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: (val) => {
          return `${val * 100}%`;
        },
      },
    };

    return (
      <Row>
        <Spin spinning={loading}>
          <Col span={18}>
            <div className="padding-right-10">
              <CommonList
                height={380}
                dataSource={mostUnUsedQuestionList.list}
                renderItem={this.renderItem}
              />
            </div>
          </Col>
          <Col span={6}>
            <div>
              <CommonAreaLevelOne loadPageByArea={this.loadPageByArea} defaultText="全部地区" />
            </div>
            {!pictureList.length && <div className="text-center margin-top-10">暂无数据</div>}
            {!!pictureList.length && (
              <Chart height={340} data={dv} scale={cols} padding={[-80, 0, 0, 0]} forceFit>
                <Coord type="theta" radius={0.7} />
                <Axis name="percent" />
                <Tooltip
                  showTitle={false}
                  // itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name1}: {value1}<p><span style="margin-left:13px" className="g2-tooltip-marker"></span>{name2}: {value2}</p></li>'
                />
                <Geom
                  color={['question', indexTopColor]}
                  type="intervalStack"
                  position="percent"
                  // tooltip={['id*percent*number',(id, percent,number) => {
                  //   return {
                  //     name1: id==='others'? '其它':`数量`,
                  //     name2: `占比`,
                  //     value1: number,
                  //     value2: `${percent*100}%`,
                  //   };
                  // }]}
                  style={{ lineWidth: 1, stroke: '#fff' }}
                />
              </Chart>
            )}
          </Col>
        </Spin>
      </Row>
    );
  }
}
export default UnsolvedQuestion;
