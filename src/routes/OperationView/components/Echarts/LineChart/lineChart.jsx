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
    const { data, lines } = this.props;
    if (preProps.data !== data || JSON.stringify(preProps.lines) !== JSON.stringify(lines)) {
      this.setOption();
    }
  }

  strNumSize = (tempNum) => {
    let stringNum = tempNum.toString();
    let index = stringNum.indexOf('.');
    let newNum = stringNum;
    if (index != -1) {
      newNum = stringNum.substring(0, index);
    }
    return newNum.length;
  };

  unitConvert = (num) => {
    let moneyUnits = ['', '万', '亿', '万亿'];
    let dividend = 10000;
    let curentNum = num;
    //转换数字
    let curentUnit = moneyUnits[0];
    //转换单位
    for (let i = 0; i < 4; i++) {
      curentUnit = moneyUnits[i];
      if (this.strNumSize(curentNum) < 5) {
        break;
      }
      curentNum = curentNum / dividend;
    }
    let m = {
      num: 0,
      unit: '',
    };
    m.num = Math.round((curentNum * 100).toFixed(1)) / 100;
    m.unit = curentUnit;
    return m;
  };

  setOption() {
    const {
      data = [],
      lines = [],
      labels,
      labelValueKey = { label: 'label', value: 'value' },
      yAxisName = '上报人数',
    } = this.props;
    const that = this;

    if (!data.length) {
      return;
    }

    this.mychart = echarts.init(this.echartDiv.current);

    const xData = [];
    const y1Data = [];
    const y2Data = [];
    const y3Data = [];
    const rData = [];

    data.map((item) => {
      xData.push(item.x1);
      y1Data.push(item.y1);
      y2Data.push(item.y2);
      y3Data.push(item.y3);
      // rData.push(item.r * 100);
    });

    const colors = ['#5793f3', '#d14a61', '#675bba'];

    let y1 = [];
    let y2 = [];
    let r = [];

    if (lines[0] == 1 || (lines[0] == 0 && lines[1] == 0 && lines[2] == 0)) {
      y1 = y1Data;
    } else {
      y1 = [];
    }
    if (lines[1] == 1 || (lines[0] == 0 && lines[1] == 0 && lines[2] == 0)) {
      y2 = y2Data;
    } else {
      y2 = [];
    }
    if (lines[2] == 1 || (lines[0] == 0 && lines[1] == 0 && lines[2] == 0)) {
      r = rData;
    } else {
      r = [];
    }

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
          fontSize: 14 * that.scale,
        },
        formatter: function (params, ticket, callback) {
          // console.log('params', params);
          var showHtm = '';
          for (var i = 0; i < params.length; i++) {
            //x轴名称
            var name = params[i].seriesName;
            //名称
            //值
            var value = params[i].value;
            if (name == '激活率') {
              showHtm += name + '：' + Math.round(value * 100) / 100 + '%' + '<br>';
            } else {
              let moneyUnits = ['', '万', '亿', '万亿'];
              let dividend = 10000;
              let curentNum = value;
              //转换数字
              let curentUnit = moneyUnits[0];
              //转换单位
              for (let i = 0; i < 4; i++) {
                curentUnit = moneyUnits[i];

                let stringNum = curentNum.toString();
                let index = stringNum.indexOf('.');
                let newNum = stringNum;
                if (index != -1) {
                  newNum = stringNum.substring(0, index);
                }
                if (newNum.length < 5) {
                  break;
                }
                curentNum = curentNum / dividend;
              }
              let m = {
                num: 0,
                unit: '',
              };
              m.num = Math.round((curentNum * 100).toFixed(1)) / 100;
              m.unit = curentUnit;
              // return m.num + m.unit;

              showHtm += name + '：' + m.num + m.unit + '<br>';
            }
          }

          return showHtm;
        },
      },
      color: ['#2cd9c5', '#2d99ff', '#ffc543'],
      legend: {
        left: 'center',
        y: 'bottom',
        data: [
          {
            name: labels[0],
            textStyle: {
              fontSize: 14 * that.scale,
              fontWeight: 'bolder',
              color: '#9AA1A9',
            },

            icon: 'circle',
          },
          {
            name: labels[1],
            textStyle: {
              fontSize: 14 * that.scale,
              fontWeight: 'bolder',
              color: '#9AA1A9',
            },
            icon: 'circle',
          },
          {
            name: labels[2],
            textStyle: {
              fontSize: 14 * that.scale,
              fontWeight: 'bolder',
              color: '#9AA1A9',
            },
            icon: 'circle',
          },
        ],
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisPointer: {
            type: 'shadow',
          },
          axisLabel: {
            color: '#9AA1A9',
            formatter: '{value}',
            fontSize: 12 * that.scale,
          },
          nameTextStyle: {
            color: '#9AA1A9',
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
            color: '#9AA1A9',
            // formatter: '{value}',
            fontSize: 12 * that.scale,
            formatter: function (val) {
              let moneyUnits = ['', '万', '亿', '万亿'];
              let dividend = 10000;
              let curentNum = val;
              //转换数字
              let curentUnit = moneyUnits[0];
              //转换单位
              for (let i = 0; i < 4; i++) {
                curentUnit = moneyUnits[i];

                let stringNum = curentNum.toString();
                let index = stringNum.indexOf('.');
                let newNum = stringNum;
                if (index != -1) {
                  newNum = stringNum.substring(0, index);
                }
                if (newNum.length < 5) {
                  break;
                }
                curentNum = curentNum / dividend;
              }
              let m = {
                num: 0,
                unit: '',
              };
              m.num = Math.round((curentNum * 100).toFixed(1)) / 100;
              m.unit = curentUnit;
              return m.num + m.unit;
            },
          },
          nameTextStyle: {
            color: '#9AA1A9',
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
      ],
      series: [
        {
          name: labels[0],
          type: 'line',
          smooth: 0.6,
          data: y1Data,

          // barWidth: 16,
          lineStyle: {
            normal: {
              width: 4 * that.scale,
              barBorderRadius: [48, 48, 0, 0],
              color: '#2cd9c5',
            },
          },
        },
        {
          name: labels[1],
          type: 'line',
          smooth: 0.6,
          data: y2Data,

          // barWidth: 16,
          lineStyle: {
            normal: {
              width: 4 * that.scale,
              barBorderRadius: [48, 48, 0, 0],
              color: '#2d99ff',
            },
          },
        },
        {
          name: labels[2],
          type: 'line',
          smooth: 0.6,
          data: y3Data,

          // barWidth: 16,
          lineStyle: {
            normal: {
              width: 4 * that.scale,
              barBorderRadius: [48, 48, 0, 0],
              color: '#ffc543',
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
