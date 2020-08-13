/* eslint-disable */
import React, { Component } from 'react';
import echarts from 'echarts';
import { Empty } from 'antd';
// import { getIframePixel } from '../../../../../utils/utils';

import './index.less';

/**
 *@description 空心饼图
 *
 * @class BarChart
 * @extends {Component}
 */
class BarChart extends Component {
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
      name,
      labelValueKey = { label: 'label', value: 'value' },
      yAxisName = '上报人数',
      type,
    } = this.props;
    const that = this;
    if (!barChartData.length) {
      return;
    }

    const dataSource = [];
    const colorList1 = ['#3686FF', '#FF9041', '#00CC42', '#3BD0D2'];
    const colorList2 = ['#32D8F2', '#F4E741', '#03F691', '#00FFFF'];
    if (type == 3) {
      for (let i = 0; i < barChartData.length; i += 1) {
        if (barChartData[i].name == '查询服务量') {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                    offset: 0,
                    color: '#3686FF',
                  },
                  {
                    offset: 1,
                    color: '#32D8F2',
                  },
                ]),
              },
            },
          });
        }
        if (barChartData[i].name == '充缴服务量') {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
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
          });
        }
        if (barChartData[i].name == '办理服务量') {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                    offset: 0,
                    color: '#FF9041',
                  },
                  {
                    offset: 1,
                    color: '#F4E741',
                  },
                ]),
              },
            },
          });
        }
      }
    } else {
      for (let i = 0; i < barChartData.length; i += 1) {
        if (barChartData[i].name == '支付宝') {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                    offset: 0,
                    color: '#3686FF',
                  },
                  {
                    offset: 1,
                    color: '#32D8F2',
                  },
                ]),
              },
            },
          });
        }
        if (barChartData[i].name == '微信') {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
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
          });
        }
        if (barChartData[i].name == '自营' && type != 2) {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                    offset: 0,
                    color: '#3BD0D2',
                  },
                  {
                    offset: 1,
                    color: '#00FFFF',
                  },
                ]),
              },
            },
          });
        }
        if (barChartData[i].name == '自营' && type == 2) {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                    offset: 0,
                    color: '#FF9041',
                  },
                  {
                    offset: 1,
                    color: '#F4E741',
                  },
                ]),
              },
            },
          });
        }
        if (barChartData[i].name == '合作(其他)') {
          dataSource.push({
            ...barChartData[i],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  {
                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                    offset: 0,
                    color: '#FF9041',
                  },
                  {
                    offset: 1,
                    color: '#F4E741',
                  },
                ]),
              },
            },
          });
        }
      }
    }

    this.mychart = echarts.init(this.echartDiv.current);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        textStyle: {
          fontSize: 24 * that.scale,
        },
      },
      // legend: {
      //   orient: 'vertical',
      //   data: label,
      //   right: 10*that.scale,
      //   top: 20*that.scale,
      //   bottom: 20*that.scale,
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: 22*that.scale,
      //   },
      //   icon: 'circle',
      //   itemHeight: 8*that.scale,
      // },
      series: [
        {
          name: name,
          type: 'pie',
          radius: ['30%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'outer',
            alignTo: 'labelLine',
            bleedMargin: 5 * that.scale,
            textStyle: {
              color: '#fff',
              fontSize: 22 * that.scale,
            },
            formatter: '{b} : \n {c} ({d}%)',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: '#fff',
            },
          },

          labelLine: {
            show: true,
          },
          data: dataSource,
        },
      ],
    };

    this.mychart.setOption(option, true);
  }

  render() {
    const { height } = this.props;
    return (
      <React.Fragment>
        <div className="flexVHCenter" style={{ height, width: '100%' }} ref={this.echartDiv}>
          <Empty />
        </div>
      </React.Fragment>
    );
  }
}

export default BarChart;
