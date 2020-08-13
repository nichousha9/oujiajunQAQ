/* eslint-disable */
import React, { Component } from 'react';
import echarts from 'echarts';
import { Empty } from 'antd';
// import { getIframePixel } from "../../../../../utils/utils";

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
    const { barChartData = [] } = this.props;
    if (!barChartData.length) {
      return;
    }

    const dataSource = [];

    const that = this;

    this.mychart = echarts.init(this.echartDiv.current);

    const xData = [];
    const y1Data = [];
    const rData = [];

    barChartData.map((item) => {
      xData.push(item.x1);
      y1Data.push(item.y1);
      rData.push(item.r);
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
          fontSize: 14 * that.scale,
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
            if (name == '日环比') {
              showHtm += name + '：' + m.num + '%' + '<br>';
            } else {
              showHtm += name + '：' + m.num + m.unit + '<br>';
            }
          }

          return showHtm;
        },
      },
      // legend: {
      //     data: [{
      //         name: '发展量', textStyle: {
      //             fontSize: '0.12rem',
      //             fontWeight: 'bolder',
      //             color: '#fff'
      //         },
      //     }, ]
      // },
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
            fontSize: 14 * that.scale,
          },
          nameTextStyle: {
            color: '#fff',
            fontSize: 14 * that.scale,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '日发展量',
          // min: 0,
          // max: 250,
          // interval: 50,
          axisLabel: {
            color: '#fff',
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
              m.num = Math.round((curentNum * 100).toFixed(1)) / 100;
              m.unit = curentUnit;
              return m.num + m.unit;
            },
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
        {
          type: 'value',
          name: '日环比',
          // min: 0,
          // max: 100,
          // interval: 50,
          axisLabel: {
            color: '#fff',
            formatter: '{value} %',
            fontSize: 14 * that.scale,
          },
          nameTextStyle: {
            color: '#fff',
            fontSize: 14 * that.scale,
          },
          splitLine: {
            show: false,
            lineStyle: { color: ['rgba(108,123,138,0.1)'] },
          },
          axisLine: {
            color: '#6C7B8A',
          },
        },
      ],
      series: [
        {
          name: '发展量',
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
                  color: '#F4E741',
                },
                {
                  offset: 1,
                  color: '#FFB741',
                },
              ]),
            },
          },
          label: {
            show: true, // 开启显示
            // rotate: 70, // 旋转70度
            position: 'top', // 在上方显示
            distance: 20, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
            verticalAlign: 'middle',
            textStyle: {
              // 数值样式
              color: 'rgba(235,235,235,1)',
              fontSize: 12 * that.scale,
            },
          },
        },
        {
          name: '日环比',
          type: 'line',
          yAxisIndex: 1,
          data: rData,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: '#32AFF2',
                },
                {
                  offset: 1,
                  color: '#0079FF',
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
