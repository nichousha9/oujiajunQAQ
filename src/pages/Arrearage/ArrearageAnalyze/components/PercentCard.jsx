import { connect } from 'dva';
import { Card, Col, Icon, Row } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Pie } from '@/components/Charts';
import styles from '../style.less';

@connect(({ loading, arrearageAnalyze }) => ({
  loading: loading.effects['arrearageAnalyze/qryLargeOwePer'],
  monthId: arrearageAnalyze.monthId,
}))
class PercentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 图标
  getCreateIcon = num => {
    const pnum = parseFloat(num);
    if (pnum > 0) {
      return <Icon type="caret-up" style={{ color: '#F5222D' }} />;
    }
    if (pnum < 0) {
      return <Icon type="caret-down" style={{ color: '#7ED321' }} />;
    }
    return '';
  };

  // 格式化百分比
  formatPercent = num => {
    if (num || num == 0) {
      return `${num}%`;
    }
    return '';
  };

  render() {
    const { loading, extra, monthId } = this.props;
    const { info } = this.props;
    const { amountPerDetail = {}, custNumPerDetail = {} } = info;
    return (
      <Card
        loading={loading}
        title={formatMessage({
          id: 'arrearage.analyze.largeOwePerAnalyze',
          defaultMessage: '大额欠费占比分析',
        })}
        className={styles.card}
        bordered={false}
        extra={extra}
      >
        <Card
          title={`${monthId}月账单`}
          bordered={false}
          headStyle={{ border: 'none' }}
          size="small"
        >
          <Row gutter={68} type="flex">
            <Col sm={12} xs={24}>
              <Pie
                subTitle={formatMessage({
                  id: 'arrearage.analyze.largeOwePer',
                  defaultMessage: '大额欠费占比',
                })}
                percent={amountPerDetail.largeAmountPer}
                total={this.formatPercent(amountPerDetail.largeAmountPer)}
                height={160}
                inner="0.85"
              />
              <div className={styles.radit}>
                <span>
                  {formatMessage({
                    id: 'arrearage.analyze.largeOweSamePer',
                    defaultMessage: '月同比',
                  })}
                  {this.getCreateIcon(amountPerDetail.largeOweSamePer)}
                  <span>{this.formatPercent(amountPerDetail.largeOweSamePer)}</span>
                </span>
                <span>
                  {formatMessage({
                    id: 'arrearage.analyze.largeOweCirlePer',
                    defaultMessage: '月环比',
                  })}
                  {this.getCreateIcon(amountPerDetail.largeOweCirlePer)}
                  <span>{this.formatPercent(amountPerDetail.largeOweCirlePer)}</span>
                </span>
              </div>
            </Col>
            <Col sm={12} xs={24}>
              <Pie
                subTitle={formatMessage({
                  id: 'arrearage.analyze.largeOweMenPer',
                  defaultMessage: '大额欠费客户占比',
                })}
                percent={custNumPerDetail.largeOweNumPer}
                total={this.formatPercent(custNumPerDetail.largeOweNumPer)}
                height={160}
                color="#FFE700"
                inner="0.85"
              />
              <div className={styles.radit}>
                <span>
                  {formatMessage({
                    id: 'arrearage.analyze.largeOweSamePer',
                    defaultMessage: '月同比',
                  })}
                  {this.getCreateIcon(custNumPerDetail.custNumSamePer)}
                  <span>{this.formatPercent(custNumPerDetail.custNumSamePer)}</span>
                </span>
                <span>
                  {formatMessage({
                    id: 'arrearage.analyze.largeOweCirlePer',
                    defaultMessage: '月环比',
                  })}
                  {this.getCreateIcon(custNumPerDetail.custNumCirlePer)}
                  <span>{this.formatPercent(custNumPerDetail.custNumCirlePer)}</span>
                </span>
              </div>
            </Col>
          </Row>
        </Card>
      </Card>
    );
  }
}

export default PercentCard;
