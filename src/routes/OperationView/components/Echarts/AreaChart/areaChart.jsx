/* eslint-disable */
import React, { Component } from 'react';
import echarts from 'echarts';
import { Empty } from 'antd';

import './index.less';

/**
 *@description 柱状图
 *
 * @class BarChart
 * @extends {Component}
 */

class AreaChart extends Component {
  scale = document.body.clientWidth / 1940;
  constructor(props) {
    super(props);
    this.echartDiv = React.createRef();
  }

  componentDidMount() {
    this.setOption();
  }

  componentDidUpdate(preProps) {
    const { barChartData, lines } = this.props;
    if (preProps.barChartData !== barChartData) {
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
      barChartData = [],
      lines = [],
      label,
      colors,
      labelValueKey = { label: 'label', value: 'value' },
      yAxisName = '上报人数',
    } = this.props;
    const that = this;
    if (!barChartData.length) {
      return;
    }

    const xData = [];
    const y1Data = [];
    const y2Data = [];
    const y3Data = [];
    // const y1Name = barChartData[0].y1Name;
    // const y2Name = barChartData[0].y2Name;
    // const y3Name = barChartData[0].y3Name || '';

    barChartData.map((item) => {
      xData.push(item.x1);
      y1Data.push(item.y1);
      y2Data.push(item.y2);
      y3Data.push(item.y3);
    });

    let y1 = [];
    let y2 = [];
    let y3 = [];

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
      y3 = y3Data;
    } else {
      y3 = [];
    }

    // const labelList = y3Name ? [y1Name, y2Name, y3Name] : [y1Name, y2Name];

    const dataSource = [];

    this.mychart = echarts.init(this.echartDiv.current);

    // const colors = ['#5793f3', '#d14a61', '#675bba'];

    const option = {
      color: colors,
      grid: {
        left: '15%',
      },
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
        formatter: function (params, ticket, callback) {
          // console.log('params', params);
          let showHtm = '';
          for (let i = 0; i < params.length; i++) {
            //x轴名称
            let name = params[i].seriesName;
            //名称
            //值
            let value = params[i].value;

            let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
            if (!reg.test(name)) {
              name = '支付宝';
            }
            // if(i==2){
            //     name = '支付宝'
            // }
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

            showHtm += name + '：' + m.num + m.unit + '<br>';
          }

          return showHtm;
        },
      },
      // legend: {
      //   orient: 'horizontal',
      //   left: 'center',
      //   data: labelList,
      //   textStyle: {
      //     color: 'rgba(255,255,255,1)',
      //     fontSize: 14 * that.scale,
      //   },
      //   y: 'bottom',
      //   icon: 'circle',
      // },
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
            fontSize: 14 * that.scale,
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
              m.num = (curentNum.toFixed(1) * 10) / 10;
              m.unit = curentUnit;
              return m.num + m.unit;
            },
          },
          nameTextStyle: {
            color: '#9AA1A9',
            fontSize: 12 * that.scale,
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
          name: label,
          // name: '知识数量',
          type: 'line',
          smooth: 0.6,
          data: y1Data,
          areaStyle: {
            normal: {
              barBorderRadius: [48, 48, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: 'rgba(95,220,226,0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(255,255,255,0)',
                },
              ]),
            },
          },
          // barWidth: 16,
          lineStyle: {
            normal: {
              width: 4 * that.scale,
              barBorderRadius: [48, 48, 0, 0],
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: 'rgba(251,233,88,0.5)',
                },
                {
                  offset: 1,
                  color: '#30C15B',
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
    const { height, width } = this.props;
    return (
      <React.Fragment>
        <div className="flexVHCenter" style={{ height, width }} ref={this.echartDiv}>
          <Empty />
        </div>
      </React.Fragment>
    );
  }
}

export default AreaChart;
