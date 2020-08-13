import { Col, Row } from 'antd';
import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import echarts from 'echarts';
import dataMapping from './map';
import styles from './style.less';

const TrendCard = React.lazy(() => import('./components/TrendCard'));
const PercentCard = React.lazy(() => import('./components/PercentCard'));
const ProportionSales = React.lazy(() => import('./components/ProportionSales'));
const TrendChart = React.lazy(() => import('./components/TrendChart'));

@connect(({ loading, arrearageAnalyze }) => ({
  typeComposeloading: loading.effects['arrearageAnalyze/qryProdTypeCompose'],
  channelComposeloading: loading.effects['arrearageAnalyze/qryProdChannelCompose'],
  reasonComposeloading: loading.effects['arrearageAnalyze/qryOweReasonCompose'],
  monthId: arrearageAnalyze.monthId,
}))
class ArrearageAnalyze extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monthNum: 6, // 查询区间
      regionName: '', // 省份
      lanId: '', // 地市id
      lanName: '', // 地市名称
      LargeOwePer: {}, // 是否为大额欠费
      typeComposeData: [],
      channelComposeData: [],
      reasonComposeData: [],
    };
  }

  componentDidMount() {
    this.fetchMapData();
  }

  // montId更改后重新获取数据
  componentDidUpdate(prevProps) {
    const { monthId } = this.props;
    if (monthId !== prevProps.monthId) {
      this.fetchLargeData();
      this.fetchTypeData();
      this.fetchChannelData();
      this.fetchReasonData();
    }
  }

  // 获取地图数据
  fetchMapData = () => {
    const { dispatch } = this.props;
    const { monthNum } = this.state;
    dispatch({
      type: 'arrearageAnalyze/qryMap',
      payload: {
        orgLevel: 2,
        monthNum,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        const { province, list } = data;
        this.setState({
          regionName: province.regionName,
          lanName: province.regionName,
        });
        this.drawMap(province.regionName, list);
      },
    });
  };

  // 绘制地图
  drawMap = (regionName, oweData) => {
    this.mapChart = echarts.init(document.getElementById('oweMap'));
    const mapData = oweData.map(item => {
      return {
        name: item.regionName,
        value: item.allOweAmount,
        lanId: item.lanId,
      };
    });
    import(`${dataMapping[regionName]}`).then(map => {
      echarts.registerMap('trendMap', JSON.stringify(map));
      this.mapChart.setOption({
        tooltip: {
          trigger: 'item',
          alwaysShowContent: true,
          triggerOn: 'click',
          formatter: params => {
            if (!params.data) return '';
            const { name, value } = params.data;
            return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
              params.color
            };"></span>
                    ${name}<br />${value.toLocaleString()}万元`;
          },
        },
        visualMap: {
          align: 'right',
          min: 0,
          max: 50000,
          text: ['高', '低'],
          calculable: true,
          realtime: true,
          inRange: {
            color: ['#BFE2FF', '#6BBBFF', '#0C90FF'],
          },
        },
        series: [
          {
            type: 'map',
            map: 'trendMap',
            name: 'trendMap',
            data: mapData,
          },
        ],
      });
      // 监听点击地图区域，更改lanId，重新请求数据
      this.mapChart.on('click', params => {
        if (!params.data) return;
        const { lanId, name } = params.data;
        const { lanId: lanIdState } = this.state;
        if (lanIdState === lanId) return;
        localStorage.setItem('lanName', name);
        this.setState(
          {
            lanId,
            lanName: name,
          },
          () => {
            this.fetchLargeData();
            this.fetchTypeData();
            this.fetchChannelData();
            this.fetchReasonData();
          },
        );
      });
    });
  };

  // 切换半年/一年
  handleChangeMonth = e => {
    const monthNum = e.target.value;
    this.setState({ monthNum }, this.fetchMapData);
  };

  // 获取大额欠费占比分析数据
  fetchLargeData = () => {
    const { dispatch, monthId } = this.props;
    const { lanId } = this.state;
    dispatch({
      type: 'arrearageAnalyze/qryLargeOwePer',
      payload: {
        monthId,
        lanId,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        this.setState({ LargeOwePer: data });
      },
    });
  };

  // 获取产品分析数据
  fetchTypeData = () => {
    const { dispatch, monthId } = this.props;
    const { lanId } = this.state;
    dispatch({
      type: 'arrearageAnalyze/qryProdTypeCompose',
      payload: {
        monthId,
        lanId,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        this.setState({ typeComposeData: this.formatPieData(data, 'prodTypeName', 'prodType') });
      },
    });
  };

  // 获取客户来源分析数据
  fetchChannelData = () => {
    const { dispatch, monthId } = this.props;
    const { lanId } = this.state;
    dispatch({
      type: 'arrearageAnalyze/qryProdChannelCompose',
      payload: {
        monthId,
        lanId,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        this.setState({ channelComposeData: this.formatPieData(data, 'operChannel', 'oweAmount') });
      },
    });
  };

  // 获取欠费原因分析数据
  fetchReasonData = () => {
    const { dispatch, monthId } = this.props;
    const { lanId } = this.state;
    dispatch({
      type: 'arrearageAnalyze/qryOweReasonCompose',
      payload: {
        monthId,
        lanId,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        this.setState({
          reasonComposeData: this.formatPieData(data, 'oweReasonDesc', 'oweAmount'),
        });
      },
    });
  };

  // 格式化数据
  formatPieData = (data = [], xName, yName) => {
    const result = [];
    if (data && data.length) {
      data.forEach(item => {
        result.push({
          x: item[xName],
          y: item[yName] && parseFloat(item[yName]),
        });
      });
    }
    return result;
  };

  // 点击不同月份展示不同数据
  handleClickMonth = ev => {
    if (!ev.length) return;
    const { dispatch } = this.props;
    const month = ev[0].title;
    dispatch({
      type: 'arrearageAnalyze/setMonthId',
      payload: {
        monthId: month,
      },
    });
  };

  render() {
    const { typeComposeloading, channelComposeloading, reasonComposeloading, monthId } = this.props;
    const {
      typeComposeData,
      channelComposeData,
      reasonComposeData,
      lanId,
      lanName,
      regionName,
      LargeOwePer,
      monthNum,
    } = this.state;

    return (
      <Row type="flex" className={styles.gridCon} style={{ margin: '0 auto' }} gutter={[24, 0]}>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <TrendCard regionName={regionName} monthNum={monthNum}>
              <div id="oweMap" style={{ height: 425 }} />
            </TrendCard>
          </Suspense>
        </Col>
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <TrendChart
              lanId={lanId}
              monthNum={monthNum}
              lanName={lanName}
              onClick={this.handleClickMonth}
              handleChangeMonth={this.handleChangeMonth}
            />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            {/* 大额欠费占比分析 */}
            <PercentCard
              info={LargeOwePer}
              extra={
                <Link to={`/arrearage/detail?monthId=${monthId}&lanId=${lanId}&type`}>
                  {formatMessage({ id: 'arrearage.analyze.seeDetails' })}
                </Link>
              }
            />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            {/* 行业产品分析 */}
            <ProportionSales
              title={formatMessage({ id: 'arrearage.analyze.typeComposeTitle' })}
              loading={typeComposeloading}
              pieData={typeComposeData}
              extra={
                <Link to={`/arrearage/detail?monthId=${monthId}&lanId=${lanId}&type=prod`}>
                  {formatMessage({ id: 'arrearage.analyze.seeDetails' })}
                </Link>
              }
            />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            {/* 客户来源分析 */}
            <ProportionSales
              title={formatMessage({ id: 'arrearage.analyze.channelComposeTitle' })}
              loading={channelComposeloading}
              pieData={channelComposeData}
              extra={
                <Link to={`/arrearage/detail?monthId=${monthId}&lanId=${lanId}&type=channel`}>
                  {formatMessage({ id: 'arrearage.analyze.seeDetails' })}
                </Link>
              }
            />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            {/* 欠费原因分析 */}
            <ProportionSales
              title={formatMessage({ id: 'arrearage.analyze.reasonCompose' })}
              loading={reasonComposeloading}
              pieData={reasonComposeData}
              extra={
                <Link to={`/arrearage/detail?monthId=${monthId}&lanId=${lanId}&type=reason`}>
                  {formatMessage({ id: 'arrearage.analyze.seeDetails' })}
                </Link>
              }
            />
          </Suspense>
        </Col>
      </Row>
    );
  }
}

export default ArrearageAnalyze;
