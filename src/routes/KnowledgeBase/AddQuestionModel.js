/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Form, Input, DatePicker, Button, Card, Icon, message, Modal, Upload, Mention } from 'antd';
import CommonEditor from '../../components/CommonEditor';
import EditableTagGroup from '../../components/EditableTagGroup';
import RelQuestionModal from './RelQuestionModal';
import RelKnowledgeModal from './RelKnowledgeModal';
import { getMonmentByms } from '../../utils/utils';
import styles from './Knowledgebase.less';
// import CommonModalArea from '../../components/CommonModalArea'
import { getCurUserArea } from '../../services/systemSum';

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
const { toString, toContentState } = Mention;
@connect(({ addStandardQuestion, loading, dataDic }) => {
  return {
    addStandardQuestion,
    dataDic: (dataDic || {}).dataDic || {},
    loading: loading.effects['addStandardQuestion/getStandardQuesDetail'],
  };
})
@Form.create()
export default class AddQuestionModel extends React.Component {
  constructor(props) {
    super(props);
    const { query } = props;
    if (query) {
      localStorage.setItem('addQuestion', JSON.stringify(query));
      this.query = query;
    } else {
      this.query = JSON.parse(localStorage.getItem('addQuestion'));
    }
  }
  state = {
    area: [],
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
    coreWord: [],
    coreWordInput: '',
    checkedNodeInfoProps: [],
    uploadFile: '',
    uploadFileList: [],
    synonyms: '',
    allowAdd: false,
    keywordStatus: '',
    curKeyWord: '',
    keyWordSugList: [],
    btnLoad: false,
  };

  componentDidMount() {
    const { dispatch, query } = this.props;
    this.query = query;
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
    const { dataDic = {}, type = 'pickup' } = this.props;
    const curType = type === 'pickup' ? 'common_region_type_kdbPickup' : 'common_region_type_kdb';
    const curUserAreaList = dataDic[`curUserAreaList${curType}`] || [];
    if (!curUserAreaList.length) {
      // 获取树
      dispatch({
        type: 'dataDic/fetchGetCurUserAreaList',
        payload: {
          type: curType,
          parentId: 0,
        },
      });
    }
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

    const arr =
      curQuestionInfo.fileList &&
      curQuestionInfo.fileList.map((item) => ({
        uid: item.fileid,
        name: item.filename,
        status: 'done',
        url: `${global.req_url}${item.filepath}?attname=${item.filename}`,
      }));
    if (
      JSON.stringify(questionList) !== JSON.stringify(this.state.questionList) ||
      JSON.stringify(knowledgeList) !== JSON.stringify(this.state.knowledgeList) ||
      JSON.stringify(standardQuesList) !== JSON.stringify(this.state.standardQuesList) ||
      JSON.stringify(relQuestionList) !== JSON.stringify(this.state.relQuestionList) ||
      JSON.stringify(relKnowledgeList) !== JSON.stringify(this.state.relKnowledgeList) ||
      JSON.stringify(curQuestionInfo) !== JSON.stringify(this.state.curQuestionInfo)
    ) {
      const defaultArea = this.getArea(curQuestionInfo);
      this.setState({
        questionList,
        standardQuesList,
        relQuestionList,
        relKnowledgeList,
        knowledgeList,
        area: defaultArea,
        curQuestionInfo,
        begintime: curQuestionInfo.begintime,
        endtime: curQuestionInfo.endtime,
        // checkedNodeInfoProps: checkedNodeInfo,
        uploadFileList: arr,
        synonyms: curQuestionInfo.synonym,
      });

      this.child.changeTags((curQuestionInfo.synonym && curQuestionInfo.synonym.split('|')) || '');
    }
  }

  onRef = (e) => {
    this.child = e;
  };

  onSubmit = () => {
    const {
      form: { getFieldsValue, validateFields },
    } = this.props;
    const { curQuestionInfo, area, begintime, endtime, uploadFile, keywordStatus } = this.state;
    const { kdbid } = this.query;
    if (begintime === '' || endtime === '') {
      message.info('请输入时效');
      return;
    }
    // if(!area.length){
    //   message.info('请选中标准问题地区')
    //   return
    // }
    if (keywordStatus === 'error') {
      message.error('核心词输入有误！');
      return;
    }
    validateFields((errors) => {
      this.setState({ btnLoad: true });
      if (errors) return;
      const temp = getFieldsValue();
      if (temp.public === undefined) {
        temp.public = 1;
      }
      temp.area = area.map((v) => v.value).join(',');
      const { dispatch, closeAddQuesModal } = this.props;
      // 获取
      const { relQuestionList, relKnowledgeList, questionList, synonyms } = this.state;

      const relquesids = relQuestionList.map((question) => {
        return question.id;
      });
      const quesitemids = questionList
        .map((question) => {
          return question.id ? question.id : '';
        })
        .filter((v) => v)
        .join(',');
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
        attachmentids: uploadFile,
        synonym: synonyms,
        keyword: toString(temp.keyword),
      };

      if (curQuestionInfo.id) {
        obj.id = curQuestionInfo.id;
      }
      dispatch({
        type: 'addStandardQuestion/fetchstandardQuesSave',
        payload: obj,
      }).then((res) => {
        if (res) {
          if (res.status === 'OK') {
            this.backToKnowledge();
            message.success('添加成功');
            this.setState({
              btnLoad: false,
            });
          } else if (res.status === 'QUESTION_REDUNDANCY') {
            message.error('问题重复，无法保存');
          }
        }

        closeAddQuesModal();
      });
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
    setFieldsValue({ content: value.replace('target="_self"', 'target="_blank"') });
  };
  timeChange = (e) => {
    if (e.length >= 2) {
      this.begintime = `${moment(new Date(e[0]._d === undefined ? '' : e[0]._d)).format(
        'YYYY-MM-DD HH:mm:ss'
      )}.0`;
      this.endtime = `${moment(new Date(e[1]._d === undefined ? '' : e[1]._d)).format(
        'YYYY-MM-DD HH:mm:ss'
      )}.0`;
    } else {
      this.begintime = '';
      this.endtime = '';
    }
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
  handleBtnClick = (e) => {
    const { coreWord: cw } = this.state;
    // this.coreWordInputs.focus();
    // this.setState({coreWordInput:''})

    if (e.target.value === '') {
      return;
    }
    let flag = false;
    cw.forEach((item) => {
      if (item === e.target.value) {
        message.info('关键词已存在');
        flag = true;
      }
    });
    if (flag) {
      return;
    }
    cw.push({ title: e.target.value });
    this.setState({ coreWord: cw });
    message.info('添加成功');
  };
  onChangeCoreWord = (e) => {
    this.setState({ coreWordInput: e.target.value });
  };
  backToKnowledge = () => {
    const { dispatch, onOk } = this.props;
    dispatch({
      type: 'addStandardQuestion/clearState',
    });
    onOk();
    dispatch(routerRedux.push({ pathname: '/knowledgebase/info', query: { from: 'addQuestion' } }));
  };
  getArea = (curQuestionInfo = {}) => {
    if (!curQuestionInfo.area || !curQuestionInfo.regionName) return [];
    const labels = curQuestionInfo.regionName.split(',');
    const areaValue = curQuestionInfo.area.split(',').map((item, index) => {
      return { value: item, label: labels[index] };
    });
    return areaValue;
  };
  closeModal = () => {
    this.setState({
      relQuestionModalVisible: false,
      relKnowledgeModalVisible: false,
    });
  };
  saveQuestion = (id, e) => {
    // if (!e.target.value) {
    //   message.error('请输入相关问题的内容');
    //   return;
    // }
    const { dispatch } = this.props;
    const { kdbid } = this.query;
    dispatch({
      type: 'addStandardQuestion/fetchQuestionItemSave',
      payload: {
        question: e.target.value,
        kdbid,
        id,
      },
    });
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
  deleteCoreWord = (word) => {
    const { coreWord: cw } = this.state;
    let index = 0;
    for (let i = 0; i < cw.length; i += 1) {
      if (cw[i] === word) {
        index = i;
        break;
      }
    }
    cw.splice(index, 1);
    this.setState({ coreWord: cw });
  };
  showArea = (area) => {
    this.setState({ area });
  };

  onLoadData = (treeNodeProps) =>
    new Promise((resolve) => {
      getCurUserArea({ parentId: treeNodeProps.regionId }).then((res) => {
        resolve(res.data);
      });
    });

  savaFileInfo = ({ file, fileList }) => {
    this.setState({
      uploadFileList: fileList,
    });
    if (file.status !== 'uploading') {
      const arr = [];
      if (fileList) {
        fileList.forEach((item) => {
          let curId;
          if (item.response) {
            const { data } = item.response;
            const { id } = data;
            curId = id;
          } else {
            curId = item.uid;
          }

          arr.push(curId);
        });
      }
      const str = arr.join(',');
      this.setState({
        uploadFile: str,
      });
    }
  };

  getAllTags = (e) => {
    this.setState({
      synonyms: e.join('|'),
    });
  };

  judgeTags = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/checkSynonym',
      payload: {
        synonym: e,
      },
    }).then((res) => {
      if (res && res.status === 'OK' && res.data) {
        this.child.dealData(true);
      } else {
        this.child.dealData(false);
      }
    });
  };

  onKeywordBlur = () => {
    const { form, dispatch } = this.props;
    const value = toString(form.getFieldValue('keyword'));
    dispatch({
      type: 'addStandardQuestion/checkKeyword',
      payload: {
        keyword: value,
      },
    }).then((res) => {
      if (res && res.status === 'OK' && res.data) {
        this.setState({
          keywordStatus: 'success',
        });
      } else {
        this.setState({
          keywordStatus: 'error',
        });
        message.error('核心词输入有误！');
      }
    });
  };

  onKeywordChange = (e) => {
    // /smartim/knowledge/standardQues/getKeywordList
    const { form, dispatch } = this.props;
    const value = toString(form.getFieldValue('keyword'));
    this.setState({
      curKeyWord: value,
    });
    if (!e) return;
    dispatch({
      type: 'addStandardQuestion/getKeywordList',
      payload: {
        searchKeyword: value,
      },
    }).then((res) => {
      if (res && res.status === 'OK' && res.data) {
        this.setState({
          keyWordSugList: res.data,
        });
      }
    });
  };

  editCoreWord = () => {};
  query = {};
  begintime;
  endtime;
  count = 0;
  render() {
    const { closeAddQuesModal, visible } = this.props;
    const {
      questionList,
      relQuestionList,
      relQuestionModalVisible,
      knowledgeList,
      curQuestionInfo,
      standardQuesList,
      relKnowledgeModalVisible,
      // begintime,
      // endtime
      uploadFileList,
      synonyms,
      curKeyWord,
      keyWordSugList,
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
    const { kdbid } = this.query;
    const props = {
      name: 'file',
      withCredentials: true,
      action: `${global.req_url}/smartim/system/attachment/upload`,
      data: {
        kdbid,
        catecode: '003',
        catecodeid: 62,
        importtype: 'kdb_standard_ques_import',
      },
      onChange: this.savaFileInfo,
      // fileList: curQuestionInfo.fileList && curQuestionInfo.fileList.map((item) => ({
      //   uid: item.id,
      //   name: item.filename,
      //   status: 'done',
      //   url: `${global.req_url}${item.filepath}?attname=${item.filename}`,
      // })),
    };
    const editProps = {
      getAllTags: this.getAllTags,
      judgeTags: this.judgeTags,
      tags: (synonyms && synonyms.split('|')) || '',
    };
    const { btnLoad } = this.state;
    return (
      <Modal
        width="800px"
        title="知识收录"
        visible={visible}
        onCancel={closeAddQuesModal}
        onOk={this.onSubmit}
        maskClosable={false}
        confirmLoading={btnLoad}
      >
        <Fragment>
          <Card bordered={false}>
            <Form>
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
                            this.saveQuestion('', e);
                          }}
                        />
                      );
                    } else {
                      return (
                        <div key={question.id} className={styles.added_col}>
                          <Input
                            defaultValue={question.question}
                            addonAfter={
                              <i
                                style={{ cursor: 'pointer' }}
                                className="iconfont"
                                onClick={(e) => {
                                  this.deleteQuestion(e, question);
                                }}
                              >
                                &#xe618;
                              </i>
                            }
                            onBlur={this.saveQuestion.bind(this, question.id)}
                          />
                          {/* <a
                            className={styles.del_icon}
                            onClick={e => {
                              this.deleteQuestion(e, question);
                            }}
                          >
                            <i className="iconfont">&#xe618;</i>
                          </a> */}
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
              {/* <FormItem {...formItemLayout} label="分类1">
                {getFieldDecorator('sortType', {
                  rules: [
                    {
                      required: true,
                      message: '请选中标准问题分类',
                    },
                  ],
                  initialValue: curQuestionInfo.sortType || '',
                })(
                  <CommonSelect
                    placeholder="请选择"
                    optionData={{
                      optionName: 'paramName',
                      optionId: 'id',
                      datas: knowledgeType || [],
                    }}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="地区">
                {getFieldDecorator('area', {
                })(
                  <CommonTreeSelect
                    onChange={this.showArea}
                    treeCheckStrictly
                    defaultVal={area}
                    // value={this.showOrgan.organList}
                    treeCheckable="true"
                    loadCallBack={this.onLoadData}
                    treeData={curUserAreaList}
                    nofilter="true"
                    type={{ value: 'regionId', name: 'regionName' }}
                    placeholder="请选择"
                    ref={ele => {
                        this.treeRef = ele;
                      }}
                  />
                )}
              </FormItem> */}
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
                {getFieldDecorator('public', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '时效',
                  //   },
                  // ],
                })(
                  <div>
                    {/* //   <Radio.Group
                  //     onChange={e => {
                  //       this.timeRadioChange(e);
                  //     }}
                  //     defaultValue={curQuestionInfo.id && !curQuestionInfo.begintime ==='' ? 0 : 1}
                  //   >
                  //     <Radio value={0}>永久</Radio>
                  //     <Radio value={1}>时限</Radio>
                  //   </Radio.Group> */}

                    <RangePicker
                      format="YYYY-MM-DD"
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
                  </div>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="核心词">
                {getFieldDecorator('keyword', {
                  initialValue: toContentState(curQuestionInfo.keyword || ''),
                })(
                  <Mention
                    style={{ width: '100%' }}
                    onChange={this.onKeywordChange}
                    placeholder="请输入核心词"
                    prefix={curKeyWord}
                    onBlur={this.onKeywordBlur}
                    // onSearchChange={this.onSearchChange}
                    suggestions={keyWordSugList}
                    // onSelect={onSelect}
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} hasFeedback label="同义词">
                {getFieldDecorator('sameword', {
                  rules: [
                    {
                      message: '',
                    },
                  ],
                })(<EditableTagGroup {...editProps} onRef={this.onRef} />)}
              </FormItem>
              <div style={{ marginLeft: 146 }}>
                <Upload {...props} fileList={uploadFileList}>
                  <Button type="primary">
                    <Icon type="upload" /> 附件上传
                  </Button>
                </Upload>
              </div>
            </Form>
          </Card>
          {relQuestionModalVisible && <RelQuestionModal {...relQuestionModalProps} />}
          {relKnowledgeModalVisible && <RelKnowledgeModal {...relKnowledgeModalProps} />}
        </Fragment>
      </Modal>
    );
  }
}
