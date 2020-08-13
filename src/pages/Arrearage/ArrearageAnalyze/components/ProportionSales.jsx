import React, { Component } from 'react';
import { Card } from 'antd';
import { Pie } from '@/components/Charts';
import { connect } from 'dva';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

@connect(({ arrearageAnalyze }) => ({
  monthId: arrearageAnalyze.monthId,
}))
class ProportionSales extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, loading, pieData, extra, monthId } = this.props;
    return (
      <Card
        loading={loading}
        className={styles.salesCard}
        title={title}
        bordered={false}
        extra={extra}
      >
        <Card
          title={`${monthId}月账单`}
          bordered={false}
          headStyle={{ border: 'none' }}
          size="small"
        >
          <Pie
            hasLegend
            subTitle=""
            data={pieData}
            valueFormat={value => <Yuan>{value}</Yuan>}
            height={200}
            lineWidth={4}
            legendTitle={<span style={{ marginLeft: 90 }}>占比</span>}
            showTitle={{
              textAlign: 'center',
            }}
          />
        </Card>
      </Card>
    );
  }
}

export default ProportionSales;
