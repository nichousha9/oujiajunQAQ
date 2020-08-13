import React, { Component } from 'react';
import { withRouter } from 'umi';

class LineChartShow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // 初始化
    const { initialCharts, setOptions } = this.props;
    this.barChart = initialCharts('lineChart', 'effectLineChart');
    setOptions();
  }

  render() {
    return <div id="effectLineChart" style={{ height: 350 }} />;
  }
}

export default withRouter(LineChartShow);
