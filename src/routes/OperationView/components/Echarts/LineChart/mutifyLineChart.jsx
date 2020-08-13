/* eslint-disable */
import React, { Component } from 'react';
import echarts from 'echarts';
import { Empty } from 'antd';
import { getIframePixel } from '../../../../../utils/utils';

import './index.less';

/**
 *@description 柱状图
 *
 * @class BarChart
 * @extends {Component}
 */
class LineChart extends Component {
  scale = document.body.clientWidth / 1940;
  constructor(props) {
    super(props);
    this.echartDiv = React.createRef();
  }

  componentDidMount() {
    this.setOption();
  }

  componentDidUpdate(preProps) {
    const { barChartData } = this.props;
    if (preProps.barChartData !== barChartData) {
      this.setOption();
    }
  }

  setOption() {
    const {
      barChartData = [],
      label,
      labelValueKey = { label: 'label', value: 'value' },
      yAxisName = '上报人数',
    } = this.props;
    if (!barChartData.length) {
      return;
    }
    const that = this;
    const dataSource = [];

    this.mychart = echarts.init(this.echartDiv.current);

    const xData = [];
    const y1Data = [];
    const y2Data = [];
    const y3Data = [];
    const y4Data = [];
    const rData = [];

    barChartData.map(item => {
      xData.push(item.x1);
      y1Data.push(item.y1);
      y2Data.push(item.y2);
      y3Data.push(item.y3);
      y4Data.push(item.y4);
    });

    const colors = ['#5793f3', '#d14a61', '#675bba'];

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        textStyle: {
          fontSize: 12 * that.scale,
        },
      },
      legend: {
        orient: 'horizontal',
        left: 'center',
        data: label,
        textStyle: {
          color: 'rgba(255,255,255,1)',
          fontSize: 12 * that.scale,
        },
        y: 'bottom',
        icon: 'circle',
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisPointer: {
            type: 'shadow',
          },
          axisLabel: {
            color: '#fff',
            formatter: '{value}',
            fontSize: 12 * that.scale,
          },
          nameTextStyle: {
            color: '#fff',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '数量',
          min: 0,
          // max: 250,
          // interval: 50,
          axisLabel: {
            color: '#fff',
            formatter: '{value}',
            fontSize: 12 * that.scale,
          },
          nameTextStyle: {
            color: '#fff',
            fontSize: 14 * that.scale,
          },
          axisLine: {
            color: '#6C7B8A',
          },
          splitLine: {
            show: true,
            lineStyle: { color: ['rgba(108,123,138,0.1)'] },
          },
        },
        // {
        //     type: 'value',
        //     name: '近7天趋势',
        //     // min: 0,
        //     // max: 25,
        //     interval: 5,
        //     axisLabel: {
        //         color: 'rgba(255,255,255,1)',
        //         formatter: '{value} %'
        //     },
        //     nameTextStyle: {
        //         color: 'rgba(255,255,255,1)',
        //     },
        //     axisLine: {
        //         color: '#6C7B8A',
        //     }
        // }
      ],
      series: [
        {
          name: label[3],
          type: 'bar',
          data: y4Data,
          barWidth: 11 * that.scale,
          itemStyle: {
            normal: {
              barBorderRadius: [48, 48, 0, 0],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: '#F4E741',
                },
                {
                  offset: 1,
                  color: '#FFB741',
                },
              ]),
            },
          },
        },

        {
          name: label[1],
          type: 'bar',
          data: y2Data,
          barWidth: 11 * that.scale,
          itemStyle: {
            normal: {
              barBorderRadius: [48, 48, 0, 0],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: label.length == 4 ? '#32D8F2' : '#3BD0D2',
                },
                {
                  offset: 1,
                  color: label.length == 4 ? '#3686FF' : '#00FFFF',
                },
              ]),
            },
          },
        },
        {
          name: label[2],
          type: 'bar',
          data: y3Data,
          barWidth: 11 * that.scale,
          itemStyle: {
            normal: {
              barBorderRadius: [48, 48, 0, 0],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: '#00CC42',
                },
                {
                  offset: 1,
                  color: '#03F691',
                },
              ]),
            },
          },
        },

        {
          name: label[0],
          type: 'bar',
          data: y1Data,
          barWidth: 11 * that.scale,
          itemStyle: {
            normal: {
              barBorderRadius: [48, 48, 0, 0],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: label.length == 4 ? '#3BD0D2' : '#F4E741',
                },
                {
                  offset: 1,
                  color: label.length == 4 ? '#00FFFF' : '#FFB741',
                },
              ]),
            },
          },
        },
      ],
    };

    this.mychart.setOption(option, true);
  }

  render() {
    const { height } = this.props;
    return (
      <React.Fragment>
        <div className="flexVHCenter" style={{ height }} ref={this.echartDiv}>
          <Empty />
        </div>
      </React.Fragment>
    );
  }
}

export default LineChart;
