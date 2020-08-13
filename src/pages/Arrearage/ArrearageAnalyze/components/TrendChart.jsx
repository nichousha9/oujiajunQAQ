import { connect } from 'dva';
import { Card, Radio } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Bar } from '@/components/Charts';
import styles from '../style.less';

@connect(({ loading, arrearageAnalyze }) => ({
  loading: loading.effects['arrearageAnalyze/fetch'] || loading.effects['arrearageAnalyze/fetch'],
  monthId: arrearageAnalyze.monthId,
}))
class TrendChart extends React.Component {
  state = {
    trendData: {}, // 趋势数据
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { lanId, monthNum } = this.props;
    if (lanId !== prevProps.lanId || monthNum !== prevProps.monthNum) {
      this.fetchData();
    }
  }

  // 获取数据
  fetchData = () => {
    const { dispatch, lanId, monthNum } = this.props;
    // 欠费趋势
    dispatch({
      type: 'arrearageAnalyze/qryOweTrend',
      payload: {
        monthNum,
        lanId,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        this.setState({
          trendData: this.formatTrend(data),
        });
        // 获取最新的月份
        if (data.length) {
          dispatch({
            type: 'arrearageAnalyze/setMonthId',
            payload: {
              monthId: data[data.length - 1].monthId,
            },
          });
        }
      },
    });
  };

  // 处理趋势图数据格式
  formatTrend = (data = []) => {
    const result = [];
    data.forEach(item => {
      result.push(
        {
          name: formatMessage({ id: 'arrearage.analyze.allOweAmount' }), // '欠费总额',
          x: item.monthId,
          y: item.allOweAmount || 0,
        },
        {
          name: formatMessage({ id: 'arrearage.analyze.largeOweAmount' }), // '大额欠费总额',
          x: item.monthId,
          y: item.largeOweAmount || 0,
        },
      );
    });
    return result;
  };

  render() {
    const { loading, lanName, onClick, monthNum, handleChangeMonth, monthId } = this.props;
    const { trendData } = this.state;
    return (
      <Card
        loading={loading}
        title={`${lanName}${monthId.slice(0, 4)}年欠费分布图`}
        bordered={false}
        extra={
          <div className={styles.salesCardExtra}>
            <div className={styles.salesTypeRadio}>
              <Radio.Group size="small" value={monthNum} onChange={handleChangeMonth}>
                <Radio.Button value={6}>
                  {formatMessage({ id: 'arrearage.analyze.nearHalfYear' })}
                </Radio.Button>
                <Radio.Button value={12}>
                  {formatMessage({ id: 'arrearage.analyze.nearYear' })}
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        }
      >
        <div className={styles.salesBar}>
          <Bar height={295} active onClick={onClick} data={trendData} />
        </div>
      </Card>
    );
  }
}

export default TrendChart;
