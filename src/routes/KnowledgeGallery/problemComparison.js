/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Input, Row, Col, Select, Button, Tag, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import styles from './index.less';
import AddQuestionModel from './knowledgeModal';
import { standardQuesDelete } from '../../services/knowledgeGallery';

const { Search } = Input;
@connect(({ knowledgeGallery, loading }) => ({
  knowledgeGallery,
  loading: loading.models.knowledgeGallery,
}))
export default class Knowledgebase extends Component {
  state = {
    // kdbid: '',
    addQuestionVisible: false,
    quesDetail: {},
    updateQuestion: false,
    params1: {},
    params2: {},
  };
  componentDidMount() {
    // console.log(this.props.location.query);
    // const { dispatch } = this.props;
    this.qryQuestion();
    // dispatch({
    //   type: 'knowledgeGallery/qryDetail',
    //   payload: {
    //     ids: this.props.location.query.compareId,
    //   },
    // });
  }

  getTabs = (label) => {
    let labelArr = [];
    if (label) {
      labelArr = label.split('|');
    }
    return labelArr;
  };

  getTitle = (title) => {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'row', marginTop: '24px', alignItem: 'center' }}
      >
        <div
          style={{
            width: '4px',
            height: '16px',
            background: '#1890FF',
            marginRight: '8px',
            alignSelf: 'center',
          }}
        />
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{title}</div>
      </div>
    );
  };

  closeEditorModal = () => {
    const { location, dispatch } = this.props;
    const { params } = location.query;
    this.setState({ addQuestionVisible: false, quesDetail: {} }, () => {
      dispatch(
        routerRedux.push({
          pathname: '/knowledgebase/heathTest',
          query: {
            id: params ? params.kdbid : '',
          },
        })
      );
    });
    this.qryQuestion();
  };
  // this.props.location.query.compareId
  qryQuestion = () => {
    const { location, dispatch } = this.props;
    const { params } = location.query;
    dispatch({
      type: 'knowledgeGallery/qryDetail',
      payload: {
        ids: params.formId,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        this.setState({ params1: res.data });
      }
    });
    dispatch({
      type: 'knowledgeGallery/qryDetail',
      payload: {
        ids: params.compareId,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        this.setState({ params2: res.data });
      }
    });
  };

  oldQuestion = (params) => {
    this.setState({
      addQuestionVisible: true,
      quesDetail: {
        id: params.id,
        kdbid: params.kdbid,
        question: params.question,
        textContent: params.textContent,
        begintime: params.begintime,
        endtime: params.endtime,
        keyword: params.keyword,
        synoym: params.synonym,
        label: params.label,
      },
      updateQuestion: true,
    });
    standardQuesDelete({
      ids: this.props.location.query.params.compareId,
    });
    const { location, dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/usePrimalProblem',
      payload: {
        healthId: location.query.params.healthId,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        // message.info('启用成功');
      }
    });
  };

  delete = (ids) => {
    const { dispatch } = this.props;
    if (ids) {
      dispatch({
        type: 'knowledgeGallery/deleteReq',
        payload: {
          ids,
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          message.success('删除成功');
        }
      });
    }
  };

  newQuestion = (params) => {
    this.setState({
      addQuestionVisible: true,
      quesDetail: {
        id: params.id,
        kdbid: params.kdbid,
        question: params.question,
        textContent: params.textContent,
        begintime: params.begintime,
        endtime: params.endtime,
        keyword: params.keyword,
        synoym: params.synonym,
        label: params.label,
      },
      updateQuestion: true,
    });
    standardQuesDelete({
      ids: this.props.location.query.params.formId,
    });
    const { location, dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/useSimilarProblem',
      payload: {
        healthId: location.query.params.healthId,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        // message.info('启用成功');
      }
    });
  };

  unProcess = () => {
    const { location, dispatch } = this.props;
    const { params } = location.query;
    dispatch({
      type: 'knowledgeGallery/noProcess',
      payload: {
        healthId: params.healthId,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        message.info('启用成功');
      }
    });
    dispatch(
      routerRedux.push({
        pathname: '/knowledgebase/heathTest',
        query: {
          id: params ? params.kdbid : '',
        },
      })
    );
  };

  render() {
    // rowSelection object indicates the need for row selection

    const { location, dispatch } = this.props;
    const params = location.query;
    const { addQuestionVisible, quesDetail = {}, updateQuestion, params1, params2 } = this.state;
    // console.log(quesDetail);
    const addQuestionProps = {
      visible: addQuestionVisible,
      query: Object.keys(quesDetail).length > 0 ? quesDetail : undefined,
      kdbId: params ? params.kdbid : '',
      // onOk: this.loadTabList,
      closeAddQuesModal: this.closeEditorModal,
      updateQuestion,
    };

    // className="selfAdapt"
    return (
      <div className={styles.selfAdapt}>
        <Row gutter={10}>
          <Col span={12}>
            {this.getTitle('原问题')}
            <div className={styles.table}>
              <Row>
                <Col span={4}>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    问题
                  </div>
                  {/* <div style={{height:'54px'}} className={styles.tabletitle}>相似问题</div> */}
                  <div style={{ height: '182px', overflow: 'auto' }} className={styles.tabletitle}>
                    标准答案
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    时效
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    核心词
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    同义词
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    标签
                  </div>
                </Col>
                <Col span={20}>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    {params1.question}
                  </div>
                  {/* <div style={{height:'54px'}} className={styles.tablecontent}><Select placeholder='相似问题'/></div> */}
                  <div
                    style={{ height: '182px', overflow: 'auto' }}
                    className={styles.tablecontent}
                  >
                    {params1.textContent}
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    {`${params1.begintime}-${params1.endtime}`}
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    {params1.keyword}
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    <span>
                      {this.getTabs(params1.synonym).map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </span>
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    <span>
                      {this.getTabs(params1.label).map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            {this.getTitle('对比问题')}
            <div className={styles.table}>
              <Row>
                <Col span={4}>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    问题
                  </div>
                  {/* <div style={{height:'54px'}} className={styles.tabletitle}>相似问题</div> */}
                  <div style={{ height: '182px', overflow: 'auto' }} className={styles.tabletitle}>
                    标准答案
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    时效
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    核心词
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    同义词
                  </div>
                  <div style={{ height: '54px' }} className={styles.tabletitle}>
                    标签
                  </div>
                </Col>
                <Col span={20}>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    {params2.question}
                  </div>
                  {/* <div style={{height:'54px'}} className={styles.tablecontent}><Select placeholder='相似问题'/></div> */}
                  <div
                    style={{ height: '182px', overflow: 'auto' }}
                    className={styles.tablecontent}
                  >
                    {params2.textContent}
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    {`${params2.begintime}-${params2.endtime}`}
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    {params2.keyword}
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    <span>
                      {this.getTabs(params2.synonym).map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </span>
                  </div>
                  <div style={{ height: '54px' }} className={styles.tablecontent}>
                    <span>
                      {this.getTabs(params2.label).map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Button type="primary" onClick={() => this.oldQuestion(params1)}>
            问题相似，启用原问题信息
          </Button>
          <Button
            style={{ marginLeft: '8px' }}
            type="primary"
            onClick={() => this.newQuestion(params2)}
          >
            问题相似，使用比对问题其他信息
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={() => this.unProcess()}>
            问题不相似，不做处理
          </Button>
          <Button
            style={{ marginLeft: '8px' }}
            onClick={() =>
              dispatch(
                routerRedux.push({
                  pathname: '/knowledgebase/heathTest',
                })
              )
            }
          >
            返回
          </Button>
        </div>

        {addQuestionVisible && <AddQuestionModel {...addQuestionProps} />}
      </div>
    );
  }
}
