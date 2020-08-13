import React, { Component } from 'react';
import { Card, Row, Col, Table, Spin, Button } from 'antd';
import { connect } from 'dva';
import { router, withRouter } from 'umi';
import echarts from 'echarts';
import ChartDataShow from './components/ChartDataShow';
import LineChartShow from './components/LineChartShow';
import { getRate } from './utils';
import styles from './index.less';
import BarChartShow from '@/pages/EffectEvaluation/components/BarChartShow';

@connect()
class EffectEvaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [
        {
          id: '0',
          batch: '全批次', // 批次
          targetTotal: 7716, // 目标总数
          accept: 7432, // 接收数
          contacted: 6635, // 已接触
          interested: 5350, // 感兴趣
          success: 2843, // 成功
          outflow: 1792, // 流失
        },
        {
          id: '1',
          batch: '2020-03-22', // 批次
          targetTotal: 3834, // 目标总数
          accept: 3740, // 接收数
          contacted: 3173, // 已接触
          interested: 2816, // 感兴趣
          success: 1177, // 成功
          outflow: 898, // 流失
          dataList: [
            {
              batch: '0316',
              contacted: 137,
              contactedRate: 43,
              successRate: 11,
            },
            {
              batch: '03117',
              contacted: 354,
              contactedRate: 49,
              successRate: 15,
            },
            {
              batch: '0318',
              contacted: 956,
              contactedRate: 52,
              successRate: 21,
            },
            {
              batch: '0319',
              contacted: 1342,
              contactedRate: 54,
              successRate: 29,
            },
            {
              batch: '0320',
              contacted: 1601,
              contactedRate: 63,
              successRate: 34,
            },
            {
              batch: '0321',
              contacted: 2148,
              contactedRate: 69,
              successRate: 42,
            },
            {
              batch: '0322',
              contacted: 2871,
              contactedRate: 74,
              successRate: 48,
            },
          ],
          dateList: ['0316', '0317', '0318', '0319', '0320', '0321', '0322'],
        },
        {
          id: '2',
          batch: '2020-03-15', // 批次
          targetTotal: 3874, // 目标总数
          accept: 3692, // 接收数
          contacted: 3462, // 已接触
          interested: 2534, // 感兴趣
          success: 1666, // 成功
          outflow: 894, // 流失
          dataList: [
            {
              batch: '0309',
              contacted: 275,
              contactedRate: 21,
              successRate: 9,
            },
            {
              batch: '0310',
              contacted: 315,
              contactedRate: 48,
              successRate: 15,
            },
            {
              batch: '0311',
              contacted: 654,
              contactedRate: 53,
              successRate: 21,
            },
            {
              batch: '0312',
              contacted: 1092,
              contactedRate: 59,
              successRate: 31,
            },
            {
              batch: '0313',
              contacted: 1893,
              contactedRate: 67,
              successRate: 37,
            },
            {
              batch: '0314',
              contacted: 2471,
              contactedRate: 75,
              successRate: 43,
            },
            {
              batch: '0315',
              contacted: 3013,
              contactedRate: 83,
              successRate: 56,
            },
          ],
          dateList: ['0309', '0310', '0311', '0312', '0313', '0314', '0315'],
        },
      ], // 分批次情况表格数据
      lineChartData: {}, // 折线图数据
      barChartData: {}, // 柱状图数据
      spinning: true, // loading
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // 请求数据
  fetchData = () => {
    const { tableData } = this.state;
    this.formatLineData(tableData[1]);
    this.formatBarData(tableData[1]);
    setTimeout(() => {
      this.setState({
        spinning: false,
      });
    }, 2000);
  };

  // 初始化图表
  initialCharts = (name, value) => {
    this[name] = echarts.init(document.getElementById(value));
    return this[name];
  };

  // 格式化数据给折线图用
  formatLineData = data => {
    // 接触人数
    const contactedNum = {
      name: '接触人数',
      type: 'line',
      lineStyle: {
        width: 4,
      },
      smooth: true,
      yAxisIndex: 0,
      data: [],
    };
    // 接触率
    const contactedRate = {
      name: '接触率',
      type: 'line',
      lineStyle: {
        width: 4,
      },
      smooth: true,
      yAxisIndex: 1,
      data: [],
    };
    // 成功率
    const successRate = {
      name: '成功率',
      type: 'line',
      lineStyle: {
        width: 4,
      },
      smooth: true,
      yAxisIndex: 1,
      data: [],
    };
    const { dataList, dateList } = data;
    for (let i = 0; i < dataList.length; i += 1) {
      contactedNum.data.push(dataList[i].contacted);
      contactedRate.data.push(dataList[i].contactedRate);
      successRate.data.push(dataList[i].successRate);
    }
    this.setState({
      lineChartData: { dateList, seriesData: [contactedNum, contactedRate, successRate] },
    });
  };

  // 格式化数据给柱状图用
  formatBarData = data => {
    // 接收率
    const acceptRate = getRate(data.accept, data.targetTotal);
    // 接触率
    const contactedRate = getRate(data.contacted, data.targetTotal);
    // 成功率
    const successRate = getRate(data.success, data.targetTotal);
    // y轴设置
    const yAxisData = [
      `成功总数\n${data.success}`,
      `接触总数\n${data.contacted}`,
      `接收总数\n${data.accept}`,
      `派发总数\n${data.targetTotal}`,
    ];
    // 数据设置
    const seriesData = [
      {
        type: 'bar',
        barWidth: '50%',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(220, 220, 220, 0.8)',
        },
        itemStyle: {
          color: params => {
            const colorList = ['#FAD337', '#4DCB73', '#36CBCB', '#1890FF'];
            return colorList[params.dataIndex];
          },
        },
        data: [successRate, contactedRate, acceptRate, 100],
      },
    ];
    this.setState({
      barChartData: {
        yAxisData,
        seriesData,
      },
    });
  };

  // 设置折线图数据和配置
  setLineOptions = () => {
    const { lineChartData } = this.state;
    const { dateList, seriesData } = lineChartData;
    this.lineChart.setOption({
      color: ['#3BA0FF', '#2FC25B', '#FFBF00'],
      title: {
        text: '活动趋势分析',
        textStyle: {
          color: 'rgba( 0, 0, 0, 0.85)',
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        formatter: params => {
          return `
          ${params[0].name}
          <br>
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#3BA0FF;"></span>
          ${params[0].seriesName}: ${params[0].value}
          <br>
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#2FC25B;"></span>
          ${params[1].seriesName}: ${Number.isNaN(params[1].value) ? 0 : params[1].value}%
          <br>
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FFBF00;"></span>
          ${params[2].seriesName}: ${Number.isNaN(params[2].value) ? 0 : params[2].value}%
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dateList,
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
        },
        {
          type: 'value',
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: seriesData,
    });
  };

  // 设置柱状图数据和配置
  setBarOptions = () => {
    const { barChartData } = this.state;
    const { yAxisData, seriesData } = barChartData;
    this.barChart.setOption({
      title: {
        text: '漏斗分析',
        textStyle: {
          color: 'rgba( 0, 0, 0, 0.85)',
          fontWeight: 'bold',
          fontSize: 14,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'value',
          position: 'top',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      yAxis: [
        {
          type: 'category',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            lineHeight: 20,
          },
          data: yAxisData,
        },
      ],
      series: seriesData,
    });
  };

  // 表格鼠标移入事件
  handleMouseEnter = async (e, record) => {
    const { tableData } = this.state;
    if (this.lineChart) {
      this.lineChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: 5,
      });
      if (record.id === '1' || record.id === '2') await this.formatLineData(tableData[record.id]);
      await this.formatBarData(record);
      this.setLineOptions();
      this.setBarOptions();
    }
  };

  render() {
    const { tableData, lineChartData, barChartData, spinning } = this.state;
    const columns = [
      {
        title: '批次',
        dataIndex: 'batch',
      },
      {
        title: '目标总数',
        dataIndex: 'targetTotal',
      },
      {
        title: '已接触',
        dataIndex: 'contacted',
      },
      {
        title: '感兴趣',
        dataIndex: 'interested',
      },
      {
        title: '成功',
        dataIndex: 'success',
      },
      {
        title: '流失',
        dataIndex: 'outflow',
      },
    ];

    // 接触量
    const contactedNum = (tableData.length && tableData[0].contacted) || 0;
    // 接触率
    const contactedRate =
      (tableData.length && getRate(tableData[0].contacted, tableData[0].targetTotal, true)) || '0%';
    // 成功量
    const successNum = (tableData.length && tableData[0].success) || 0;
    // 成功率
    const successRate =
      (tableData.length && getRate(tableData[0].success, tableData[0].contacted, true)) || '0%';

    return (
      <Spin spinning={spinning}>
        <div className={styles.container}>
          <Card
            title="活动效果评估"
            extra={
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  router.goBack();
                }}
              >
                返回
              </Button>
            }
          >
            <Row gutter={12}>
              <Col span={4}>
                <ChartDataShow
                  type="bar-chart"
                  backgroundColor="#678BF9"
                  name="接触量"
                  value={contactedNum}
                />
              </Col>
              <Col span={4}>
                <ChartDataShow
                  type="pie-chart"
                  backgroundColor="#7CC7F5"
                  name="接触率"
                  value={contactedRate}
                />
              </Col>
              <Col span={4}>
                <ChartDataShow
                  type="bar-chart"
                  backgroundColor="#4CDAE0"
                  name="成功量"
                  value={successNum}
                />
              </Col>
              <Col span={4}>
                <ChartDataShow
                  type="pie-chart"
                  backgroundColor="#64D2B7"
                  name="成功率"
                  value={successRate}
                />
              </Col>
            </Row>
          </Card>
          <div style={{ height: 16 }} />
          <Card title="分批次情况" bordered={false}>
            <Table
              rowKey="id"
              dataSource={tableData}
              columns={columns}
              onRow={record => ({
                onMouseEnter: e => {
                  this.handleMouseEnter(e, record);
                },
              })}
              pagination={false}
            />
            <div style={{ height: 26 }} />
            <Row gutter={12}>
              <Col span={12}>
                {lineChartData.seriesData && (
                  <LineChartShow
                    initialCharts={this.initialCharts}
                    setOptions={this.setLineOptions}
                  />
                )}
              </Col>
              <Col span={12}>
                {barChartData.seriesData && (
                  <BarChartShow
                    initialCharts={this.initialCharts}
                    setOptions={this.setBarOptions}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </div>
      </Spin>
    );
  }
}

export default withRouter(EffectEvaluation);
