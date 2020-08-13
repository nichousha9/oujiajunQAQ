import React, { Component } from 'react';

class BarChartShow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 初始化
    const { initialCharts, setOptions } = this.props;
    this.barChart = initialCharts('barChart', 'effectBarChart');
    setOptions();
  }

  render() {
    return <div id="effectBarChart" style={{ height: 350 }} />;
  }
}

export default BarChartShow;
