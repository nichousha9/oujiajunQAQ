/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Form, Input, DatePicker, Button, Card, Radio, Icon, message } from 'antd';
import CommonEditor from '../../components/CommonEditor';
import CommonSelect from '../../components/CommonSelect';
import CommonModalArea from '../../components/CommonModalArea';
import RelQuestionModal from './RelQuestionModal';
import RelKnowledgeModal from './RelKnowledgeModal';
import { getMonmentByms } from '../../utils/utils';
import styles from './Knowledgebase.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 5 },
  },
};
@connect(({ addStandardQuestion, loading, dataDic }) => {
  return {
    addStandardQuestion,
    dataDic: (dataDic || {}).dataDic || {},
    loading: loading.effects['addStandardQuestion/getStandardQuesDetail'],
  };
})
@Form.create()
export default class AddQuestion extends React.Component {
  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    if (query) {
      localStorage.setItem('addQuestion', JSON.stringify(query));
      this.query = query;
    } else {
      this.query = JSON.parse(localStorage.getItem('addQuestion'));
    }
  }
  state = {
    showTime: true, // 时间范围是否出现
    endtime: '',
    begintime: '',
    relQuestionModalVisible: false,
    relKnowledgeModalVisible: false,
    questionList: [{}],
    relQuestionList: [], // 关联问题，
    relKnowledgeList: [], // 关联知识点
    curQuestionInfo: {}, // 当前修改的问题的信息
    knowledgeList: {
      list: [],
      pagination: {
        pageSize: 10,
        total: 0,
      },
    }, // 知识点
    standardQuesList: {
      list: [],
      pagination: {
        pageSize: 10,
        total: 0,
      },
    },
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const { questionId } = this.query;
    dispatch({ type: 'addStandardQuestion/clearState' });
    if (questionId) {
      dispatch({
        type: 'addStandardQuestion/getStandardQuesDetail',
        payload: {
          id: questionId,
        },
      });
    }
    dispatch({ type: 'dataDic/fetchGetOrgList', payload: { parent: 0 } });
    dispatch({ type: 'dataDic/fetchGetKnowledgeType' });
  }
  componentWillReceiveProps(nextProps) {
    const {
      addStandardQuestion: {
        questionList,
        standardQuesList,
        relQuestionList,
        relKnowledgeList,
        knowledgeList,
        curQuestionInfo,
      },
    } = nextProps;
    if (
      JSON.stringify(questionList) !== JSON.stringify(this.state.questionList) ||
      JSON.stringify(knowledgeList) !== JSON.stringify(this.state.knowledgeList) ||
      JSON.stringify(standardQuesList) !== JSON.stringify(this.state.standardQuesList) ||
      JSON.stringify(relQuestionList) !== JSON.stringify(this.state.relQuestionList) ||
      JSON.stringify(relKnowledgeList) !== JSON.stringify(this.state.relKnowledgeList) ||
      JSON.stringify(curQuestionInfo) !== JSON.stringify(this.state.curQuestionInfo)
    ) {
      this.setState({
        questionList,
        standardQuesList,
        relQuestionList,
        relKnowledgeList,
        knowledgeList,
        curQuestionInfo,
        begintime: curQuestionInfo.begintime,
        endtime: curQuestionInfo.endtime,
      });
    }
  }
  onSubmit = () => {
    const {
      form: { getFieldsValue, validateFields },
    } = this.props;
    const { curQuestionInfo } = this.state;
    const { kdbid } = this.query;
    validateFields((errors) => {
      if (errors) return;
      const temp = getFieldsValue();
      const { dispatch } = this.props;
      // 获取
      const { relQuestionList, relKnowledgeList, questionList } = this.state;

      const relquesids = relQuestionList.map((question) => {
        return question.id;
      });
      const quesitemids = questionList.map((question) => {
        return question.id;
      });
      const relknowlids = relKnowledgeList.map((knowledge) => {
        return knowledge.id;
      });
      const info = JSON.parse(localStorage.getItem('treeInfor')) || {};
      const obj = {
        ...temp,
        kdbid,
        catecodeid: info.selectedCateId,
        relquesids,
        quesitemids,
        relknowlids,
        begintime: this.begintime || '',
        endtime: this.endtime || '',
      };
      if (curQuestionInfo.id) {
        obj.id = curQuestionInfo.id;
      }
      dispatch({
        type: 'addStandardQuestion/fetchstandardQuesSave',
        payload: obj,
      }).then(() => {
        this.backToKnowledge();
        message.success('添加成功');
      });
    });
  };
  backToKnowledge = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/clearState',
    });
    dispatch(routerRedux.push({ pathname: '/knowledgebase/info', query: { from: 'addQuestion' } }));
  };
  addNewQuestion = (e) => {
    e.preventDefault();
    const { questionList } = this.state;
    const isEmptyQuestion = questionList.some((question) => {
      return !question.id;
    });
    if (isEmptyQuestion) {
      message.error('当前存在未保存成功的相似问题');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/addEmptyQuestion',
    });
  };
  saveQuestion = (e) => {
    if (!e.target.value) {
      message.error('请输入相关问题的内容');
      return;
    }
    const { dispatch } = this.props;
    const { kdbid } = this.query;
    dispatch({
      type: 'addStandardQuestion/fetchQuestionItemSave',
      payload: {
        question: e.target.value,
        kdbid,
      },
    });
  };
  closeModal = () => {
    this.setState({
      relQuestionModalVisible: false,
      relKnowledgeModalVisible: false,
    });
  };
  openModal = () => {
    this.setState({ relQuestionModalVisible: true });
  };
  openKnowledgeModal = () => {
    this.setState({ relKnowledgeModalVisible: true });
  };
  loadRelQuestionList = (page, pagination = {}) => {
    const { relQuestionList } = this.state;
    const { dispatch } = this.props;
    const { kdbid } = this.query;
    dispatch({
      type: 'addStandardQuestion/fetchStandardQuesList',
      payload: {
        exceptids: this.handleExceptIds(relQuestionList),
        kdbid,
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    });
  };
  loadRelKnowledgeList = (page, pagination = {}) => {
    const { relKnowledgeList } = this.state;
    const { dispatch } = this.props;
    const { kdbid } = this.query;
    dispatch({
      type: 'addStandardQuestion/fetchKnowledgeList',
      payload: {
        kdbid,
        exceptids: this.handleExceptIds(relKnowledgeList),
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    });
  };
  relQuestionOk = (selectedRows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/saveRelQuestionList',
      payload: selectedRows,
    });
    this.closeModal();
  };
  relKnowledgeOk = (selectedRows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/saveRelKnowledgeList',
      payload: selectedRows,
    });
    this.closeModal();
  };
  deleteRelQuestion = (rel) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/deleteRelQuestionList',
      payload: rel.id,
    });
  };
  deleteQuestion = (e, question) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/deleteQuestionList',
      payload: question.id,
    });
  };
  deleteRelKnowledge = (rel) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/deleteRelKnowledgeList',
      payload: rel.id,
    });
  };
  timeRadioChange = (e) => {
    this.setState({
      showTime: e.target.value,
    });
  };
  editorChange = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ content: value });
  };
  timeChange = (e) => {
    this.begintime = moment(new Date(e[0]._d)).format('YYYY-MM-DD HH:mm:ss');
    this.endtime = moment(new Date(e[1]._d)).format('YYYY-MM-DD HH:mm:ss');
    this.setState({ begintime: this.begintime, endtime: this.endtime });
  };
  handleExceptIds = (data = []) => {
    if (!data.length) return '';
    const newData = [];
    data.forEach((item) => {
      if (item.id) newData.push(item.id);
    });
    return newData.join(',');
  };
  getArea = (area) => {
    if (!area) return [];
    return area.split(',').map((item) => {
      return { value: item, label: '' };
    });
  };
  query = {};
  begintime;
  endtime;
  count = 0;
  render() {
    const {
      submitting,
      dataDic: { knowledgeType = [] },
    } = this.props;
    const {
      questionList,
      relQuestionList,
      relQuestionModalVisible,
      knowledgeList,
      curQuestionInfo,
      standardQuesList,
      relKnowledgeList,
      relKnowledgeModalVisible,
      showTime,
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    const relQuestionModalProps = {
      exceptids: this.handleExceptIds(relQuestionList),
      standardQuesList,
      onloadList: this.loadRelQuestionList,
      visible: relQuestionModalVisible,
      closeModal: this.closeModal,
      handleModalOk: this.relQuestionOk,
    };
    const relKnowledgeModalProps = {
      knowledgeList,
      onloadList: this.loadRelKnowledgeList,
      visible: relKnowledgeModalVisible,
      closeModal: this.closeModal,
      handleModalOk: this.relKnowledgeOk,
    };
    return (
      <Fragment>
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} hasFeedback label="问题">
              {getFieldDecorator('question', {
                rules: [
                  {
                    required: true,
                    message: '请输入问题',
                  },
                ],
                initialValue: curQuestionInfo.question || '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <div className={styles.divFormItem}>
              <div className={styles.divlabel}>相似问题: </div>
              <div className={styles.divFormContent}>
                {questionList.map((question, index) => {
                  if (!question.id) {
                    return (
                      <Input
                        key={`questionNoId${index}`}
                        placeholder="请输入相关问题"
                        className="margin-top-10"
                        onBlur={(e) => {
                          this.saveQuestion(e);
                        }}
                      />
                    );
                  } else {
                    return (
                      <div key={question.id} className={styles.added_col}>
                        <div className={styles.content}>{question.question}</div>
                        <a
                          className={styles.del_icon}
                          onClick={(e) => {
                            this.deleteQuestion(e, question);
                          }}
                        >
                          <i className="iconfont">&#xe618;</i>
                        </a>
                      </div>
                    );
                  }
                })}
                <a
                  className="margin-top-10"
                  onClick={(e) => {
                    this.addNewQuestion(e);
                  }}
                >
                  <Icon type="plus-circle-o" style={{ paddingRight: 4 }} />
                  添加相似问题
                </a>
              </div>
            </div>
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator('sorttype', {
                rules: [
                  {
                    required: true,
                    message: '请选中标准问题分类',
                  },
                ],
                initialValue: curQuestionInfo.sorttype || '',
              })(<CommonSelect placeholder="请选择" optionData={{ datas: knowledgeType || [] }} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="地区">
              {getFieldDecorator('area', {
                rules: [
                  {
                    required: true,
                    message: '请选中标准问题地区',
                  },
                ],
                initialValue: curQuestionInfo.area ? curQuestionInfo.area.split(',') : '',
              })(
                <CommonModalArea
                  noWidth
                  onChange={(e) => {
                    console.log(e);
                  }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} hasFeedback label="标准答案">
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '标准答案',
                  },
                ],
                initialValue: curQuestionInfo.content || '',
              })(
                <CommonEditor
                  defaultVal={curQuestionInfo.content}
                  onChangeCallBack={this.editorChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="时效">
              {getFieldDecorator('public')(
                <div>
                  <Radio.Group
                    onChange={(e) => {
                      this.timeRadioChange(e);
                    }}
                    defaultValue={curQuestionInfo.id && !curQuestionInfo.begintime ? 0 : 1}
                  >
                    <Radio value={0}>永久</Radio>
                    <Radio value={1}>时限</Radio>
                  </Radio.Group>
                  {showTime && (
                    <RangePicker
                      format="YYYY/MM/DD"
                      value={[
                        getMonmentByms(this.state.begintime),
                        getMonmentByms(this.state.endtime),
                      ]}
                      onChange={(e) => {
                        this.timeChange(e);
                      }}
                      hasFeedback
                      placeholder={['开始日期', '结束日期']}
                    />
                  )}
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="关联问题">
              {relQuestionList.map((rel) => {
                return (
                  <div key={rel.id} className={styles.added_col}>
                    <div className={styles.content}>{rel.question}</div>
                    <a
                      onClick={() => {
                        this.deleteRelQuestion(rel);
                      }}
                      className={styles.del_icon}
                    >
                      <i className="iconfont">&#xe618;</i>
                    </a>
                  </div>
                );
              })}
              <a onClick={this.openModal}>
                <Icon type="plus-circle-o" style={{ paddingRight: 4 }} />
                添加相关问题
              </a>
            </FormItem>
            <FormItem style={{ clear: 'both' }} {...formItemLayout} label="关联知识点">
              {relKnowledgeList.map((rel) => {
                return (
                  <div className={styles.added_col} key={rel.id}>
                    <div className={styles.content}>{rel.title}</div>
                    <a
                      onClick={() => {
                        this.deleteRelKnowledge(rel);
                      }}
                      className={styles.del_icon}
                    >
                      <i className="iconfont">&#xe618;</i>
                    </a>
                  </div>
                );
              })}
              <a onClick={this.openKnowledgeModal}>
                <Icon type="plus-circle-o" style={{ paddingRight: 4 }} />
                添加相关知识点
              </a>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" onClick={this.onSubmit} loading={submitting}>
                保存
              </Button>
              <Button onClick={this.backToKnowledge} style={{ marginLeft: 8 }}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
        {relQuestionModalVisible && <RelQuestionModal {...relQuestionModalProps} />}
        {relKnowledgeModalVisible && <RelKnowledgeModal {...relKnowledgeModalProps} />}
      </Fragment>
    );
  }
}
