import React, { Fragment } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import { Row, Col, Card, Form, Input } from 'antd';
// import { connect } from 'dva';

import { connect } from 'dva';
import styles from './index.less';

// const formItemLayout = {
//   labelCol: {
//     span: 6,
//   },
//   wrapperCol: {
//     span: 18,
//   },
// };

const { TextArea } = Input;
@connect(({ loading }) => ({
  loading: loading.effects['EvaluationAnalysis/getCamCompartion'],
}))
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compartionData: {},
    };
  }

  componentDidMount() {
    console.log('props', this.props);
    this.fetchCompartion();
  }

  fetchCompartion = () => {
    const { dispatch, location } = this.props;
    const { state } = location;
    const { selectedRows } = state;
    dispatch({
      type: 'EvaluationAnalysis/getCamCompartion',
      payload: {
        camIds: [selectedRows[0].id, selectedRows[1].id],
      },
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          compartionData: data,
        });
      },
    });
  };

  render() {
    // const { form,  } = this.props;
    // // const { getFieldDecorator } = form;

    const { compartionData } = this.state;
    // console.log('compartionData',compartionData)

    return (
      <Fragment>
        <Card
          size="small"
          title={formatMessage(
            {
              id: '活动营销对比',
            },
            '评估分析',
          )}
          className={styles.labelListCard}
          /* eslint-disable  react/jsx-wrap-multilines  */
          extra={
            <a
              onClick={() => {
                router.replace({
                  pathname: '/activityScheduling',
                });
              }}
            >
              返回
            </a>
          }
        >
          <div className={styles.tableLayout}>
            <Row>
              <Col span={4} style={{ backgroundColor: '#CCD6EC', height: '400px' }}>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  活动名称
                </div>
                <div className={styles.tableText} style={{ height: '100px' }}>
                  分群标签
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  业务类型
                </div>

                <div className={styles.tableText} style={{ height: '112px' }}>
                  话术模版
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  商品
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  执行频率
                </div>
              </Col>
              <Col
                span={10}
                style={{
                  backgroundColor: '#fff',
                  height: '400px',
                  border: ' 1px solid rgba(217, 217, 217, 1)',
                }}
              >
                <div
                  className={styles.tableText}
                  style={{ height: '44px', fontWeight: 'bold', backgroundColor: '#CCD6EC' }}
                >
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[0].campaignName
                    : '无'}
                </div>
                <div className={styles.tableText} style={{ height: '100px', overflowY: 'auto' }}>
                  <div className={styles.inputLayout}>
                    {compartionData &&
                      JSON.stringify(compartionData) != '{}' &&
                      compartionData[0].wheres && (
                        <Row gutter={10}>
                          {compartionData[0].wheres[0].map(ability => {
                            console.log(ability.ruleType);
                            return ability.ruleType === 'simpleCond' ? (
                              <div>
                                <Col span={5}>
                                  <Input disabled value={ability.name} />
                                </Col>
                                <Col span={5}>
                                  <Input disabled value={ability.ruleOperator} />
                                </Col>
                                <Col span={5}>
                                  <Input disabled value={ability.ruleValue} />
                                </Col>
                              </div>
                            ) : (
                              <Col span={5}>
                                <Input disabled value={ability.ruleValue} />
                              </Col>
                            );
                          })}
                        </Row>
                      )}
                  </div>
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[0].camType
                    : ''}
                </div>

                <div className={styles.tableText} style={{ height: '112px' }}>
                  <div className={styles.inputLayout}>
                    <TextArea
                      disabled
                      style={{ height: '90px' }}
                      value={
                        compartionData && JSON.stringify(compartionData) != '{}'
                          ? compartionData[0].creativeInfoName
                          : ''
                      }
                    />
                  </div>
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[0].offerNames
                    : ''}
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[0].executeFrequency
                    : ''}
                </div>
              </Col>

              <Col
                span={10}
                style={{
                  backgroundColor: '#fff',
                  height: '400px',
                  border: ' 1px solid rgba(217, 217, 217, 1)',
                }}
              >
                <div
                  className={styles.tableText}
                  style={{ height: '44px', fontWeight: 'bold', backgroundColor: '#CCD6EC' }}
                >
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[1].campaignName
                    : '无'}
                </div>
                <div className={styles.tableText} style={{ height: '100px', overflowY: 'auto' }}>
                  <div className={styles.inputLayout}>
                    {compartionData &&
                      JSON.stringify(compartionData) != '{}' &&
                      compartionData[1].wheres && (
                        <Row gutter={10}>
                          {compartionData[1].wheres[0].map(ability =>
                            ability.ruleType == 'simpleCond' ? (
                              <div>
                                <Col span={5}>
                                  <Input disabled value={ability.name} />
                                </Col>
                                <Col span={5}>
                                  <Input disabled value={ability.ruleOperator} />
                                </Col>
                                <Col span={5}>
                                  <Input disabled value={ability.ruleValue} />
                                </Col>
                              </div>
                            ) : (
                              <Col span={5}>
                                <Input disabled value={ability.ruleValue} />
                              </Col>
                            ),
                          )}
                        </Row>
                      )}
                  </div>
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[1].camType
                    : ''}
                </div>

                <div className={styles.tableText} style={{ height: '112px' }}>
                  <div className={styles.inputLayout}>
                    <TextArea
                      disabled
                      style={{ height: '90px' }}
                      value={
                        compartionData && JSON.stringify(compartionData) != '{}'
                          ? compartionData[1].creativeInfoName
                          : ''
                      }
                    />
                  </div>
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[1].offerNames
                    : ''}
                </div>
                <div className={styles.tableText} style={{ height: '44px' }}>
                  {compartionData && JSON.stringify(compartionData) != '{}'
                    ? compartionData[1].executeFrequency
                    : ''}
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default Form.create({ name: 'evalution_form' })(Index);
