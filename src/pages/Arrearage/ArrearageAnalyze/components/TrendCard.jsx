import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont';
import styles from '../style.less';

const rankIcons = {
  0: { icon: 'icon-first', color: '#FFBC00' },
  1: { icon: 'icon-second', color: '#92D074' },
  2: { icon: 'iconthird', color: '#6C96FF' },
};

@connect(({ loading, arrearageAnalyze }) => ({
  loading: loading.effects['arrearageAnalyze/fetch'] || loading.effects['arrearageAnalyze/fetch'],
  monthId: arrearageAnalyze.monthId,
}))
class TrendCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rankingList: [], // 城市欠费排名
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { monthNum } = this.props;
    if (monthNum !== prevProps.monthNum) {
      this.fetchData();
    }
  }

  // 获取数据
  fetchData = () => {
    const { dispatch, monthNum } = this.props;
    // 城市欠费排名
    dispatch({
      type: 'arrearageAnalyze/qryCityOweRank',
      payload: {
        monthNum,
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        this.setState({ rankingList: data });
      },
    });
  };

  render() {
    const { loading, regionName, children, monthId } = this.props;
    const { rankingList } = this.state;
    return (
      <Card
        loading={loading}
        title={`${regionName}${monthId.slice(0, 4)}年欠费分布图`}
        bordered={false}
        headStyle={styles}
      >
        <div className={styles.salesCard}>
          <Row type="flex" gutter={[24, 0]}>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              {children}
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} className={styles.ranking}>
              <Card
                size="small"
                bordered={false}
                title={
                  <h4 className={styles.rankTitle}>
                    <span className={styles.rankingNumber}>
                      {formatMessage({ id: 'arrearage.analyze.rank', defaultMessage: '排名' })}
                    </span>
                    <span className={styles.rankingTitle}>
                      {formatMessage({ id: 'arrearage.analyze.city', defaultMessage: '地市' })}
                    </span>
                    <span className={styles.rankingValue}>
                      {formatMessage({
                        id: 'arrearage.analyze.owe',
                        defaultMessage: '欠费额(万元)',
                      })}
                    </span>
                  </h4>
                }
                headStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                bodyStyle={{ padding: '0' }}
              >
                <ul className={styles.rankingList}>
                  {rankingList.map((item, i) => (
                    <li key={item.lanId}>
                      <span className={`${styles.rankingNumber} ${i < 3 ? styles.active : ''}`}>
                        {i < 3 ? (
                          <Iconfont
                            type={rankIcons[i].icon}
                            style={{ color: `${rankIcons[i].color}` }}
                          />
                        ) : (
                          i + 1
                        )}
                      </span>
                      <span className={styles.rankingTitle} title={item.lanName}>
                        {item.lanName}
                      </span>
                      <span className={styles.rankingValue}>{item.oweAmount}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    );
  }
}

export default TrendCard;
