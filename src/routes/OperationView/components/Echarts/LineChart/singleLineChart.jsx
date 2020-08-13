/* eslint-disable */
import React, { Component } from 'react';
import echarts from 'echarts';
import { Empty } from 'antd';
import { getIframePixel } from '../../../../../utils/utils';

import './index.less';
import TrendChart from '@/pages/Arrearage/ArrearageAnalyze/components/TrendChart';

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
    const { data } = this.props;
    if (preProps.data !== data) {
      this.setOption();
    }
  }

  setOption() {
    const {
      data = [],
      label,
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
    const rData = [];

    data.map((item) => {
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
          fontSize: 14 * TrendChart.scale,
        },
        formatter: function (params, ticket, callback) {
          //  console.log('params', params);
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
      legend: {
        left: 'center',
        y: 'bottom',
        icon: 'circle',
        data: [
          {
            name: '销量',
            textStyle: {
              fontSize: 14 * that.scale,
              fontWeight: 'bolder',
              color: '#fff',
            },
          },
          {
            name: '日终端销量',
            textStyle: {
              fontSize: 14 * that.scale,
              fontWeight: 'bolder',
              color: '#fff',
            },
          },
          {
            name: '交易额',
            textStyle: {
              fontSize: 14 * that.scale,
              fontWeight: 'bolder',
              color: '#fff',
            },
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
          name: '销量',
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
        {
          type: 'value',
          name: '交易额',
          min: 0,
          // max: 25,
          // interval: 5,
          axisLabel: {
            color: '#fff',
            // formatter: "{value}",
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
            color: '#fff',
            fontSize: 14 * that.scale,
          },
          axisLine: {
            color: '#6C7B8A',
          },
          splitLine: {
            show: false,
            // lineStyle: { color: ['#6C7B8A'] }
          },
        },
      ],
      series: [
        {
          name: '销量',
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
                  color: '#32D8F2',
                },
                {
                  offset: 1,
                  color: '#3686FF',
                },
              ]),
            },
          },
        },
        {
          name: '交易额',
          type: 'line',
          yAxisIndex: 1,
          data: rData,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                  offset: 0,
                  color: '#00FDC8',
                },
                {
                  offset: 1,
                  color: '#05BD3B',
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
