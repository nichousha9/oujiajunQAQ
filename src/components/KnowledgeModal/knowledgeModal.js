/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Form,
  Input,
  DatePicker,
  Card,
  Icon,
  message,
  Modal,
  Tag,
  Tooltip,
  Button,
  AutoComplete,
  Upload,
} from 'antd';
import CommonEditor from '../CommonEditor';

import RelQuestionModal from '../../routes/KnowledgeBase/RelQuestionModal';
import RelKnowledgeModal from '../../routes/KnowledgeBase/RelKnowledgeModal';
import { getMonmentByms } from '../../utils/utils';
import styles from '../../routes/KnowledgeBase/Knowledgebase.less';
// import CommonModalArea from '../../components/CommonModalArea'
import { getCurUserArea } from '../../services/systemSum';
import { getAddKeywordList } from '../../services/knowledgeGallery';

const { TextArea } = Input;

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
@connect(({ knowledgeGallery, addStandardQuestion, loading, dataDic }) => {
  return {
    knowledgeGallery,
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
    dataSource: [],

    area: [],
    showTime: true, // 时间范围是否出现
    endtime: moment('2030-12-31'),
    keyword: '',
    begintime: moment(),
    question: '',
    kdbid: '',
    relQuestionModalVisible: false,
    relKnowledgeModalVisible: false,
    questionItemList: [],
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
    tags: [],
    Labettags: [],
    inputVisible: false,
    LabetTab: false,
    LabetTabInputValue: '',
    inputValue: '',
    id: '',
    content: '',
    save: false,
    submitLoading: false,
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
    const { query } = nextProps;
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return;
    }
    if (query) {
      const arr =
        query.fileList &&
        query.fileList.map((item) => ({
          uid: item.fileid,
          name: item.filename,
          status: 'done',
          url: `${global.req_url}${item.filepath}?attname=${item.filename}`,
        }));
      if (
        JSON.stringify(query.questionItemList) !== JSON.stringify(this.state.questionItemList) ||
        JSON.stringify(query.knowledgeList) !== JSON.stringify(this.state.knowledgeList) ||
        JSON.stringify(query.standardQuesList) !== JSON.stringify(this.state.standardQuesList) ||
        JSON.stringify(query.relQuestionList) !== JSON.stringify(this.state.relQuestionList) ||
        JSON.stringify(query.relKnowledgeList) !== JSON.stringify(this.state.relKnowledgeList) ||
        JSON.stringify(query.curQuestionInfo) !== JSON.stringify(this.state.curQuestionInfo)
      ) {
        let tagArr = [];
        if (query.synonym) {
          tagArr = query.synonym.split('|');
        }

        let LabettagArr = [];
        if (query.label) {
          LabettagArr = query.label.split('|');
        }

        this.setState({
          question: query.question || '',
          content: query.content || '',
          questionItemList: query.questionItemList || [],
          standardQuesList: query.standardQuesList || [],
          relQuestionList: query.relQuestionList || [],
          relKnowledgeList: query.relKnowledgeList || [],
          knowledgeList: query.knowledgeList || [],
          keyword: query.keyword || '',
          curQuestionInfo: query.curQuestionInfo,
          begintime: query.begintime || moment(),
          endtime: query.endtime || moment('2030-12-31'),
          id: query.id || '',
          // checkedNodeInfoProps: checkedNodeInfo,
          uploadFileList: arr,
          tags: tagArr,
          Labettags: LabettagArr,
          kdbid: query.kdbid || nextProps.kdbId,
          save: false,
        });
      }
    }
  }

  onSelect = (keyword) => {
    if (keyword) {
      this.setState({ keyword });
    }
  };

  handleKeyPress = (ev) => {
    this.setState({ keyword: ev.target.value || undefined });
  };

  onSubmit = () => {
    const {
      form: { getFieldsValue, validateFields },
    } = this.props;
    const { begintime, endtime, uploadFile, kdbid } = this.state;
    if (begintime === '' || endtime === '') {
      message.info('请输入时效');
      return;
    }
    validateFields((errors, values) => {
      if (errors) return;
      const temp = getFieldsValue();
      if (temp.public === undefined) {
        temp.public = 1;
      }
      const { dispatch, closeAddQuesModal, kdbId } = this.props;
      // 获取
      // eslint-disable-next-line no-shadow
      const { tags, id, content, questionItemList, Labettags } = this.state;

      let synonym = '';
      for (let i = 0; i < tags.length; i += 1) {
        if (i === 0) {
          synonym += tags[i];
        } else {
          synonym += `|${tags[i]}`;
        }
      }

      let label = '';
      for (let i = 0; i < Labettags.length; i += 1) {
        if (i === 0) {
          label += Labettags[i];
        } else {
          label += `|${Labettags[i]}`;
        }
      }

      // const info = JSON.parse(localStorage.getItem('treeInfor')) || {};

      const obj = {
        question: values.question,
        content,
        keyword: values.keyword,
        kdbid: kdbid || kdbId,
        attachmentids: uploadFile,
        begintime: moment(begintime).format('YYYY-MM-DD hh:mm:ss'),
        endtime: moment(endtime).format('YYYY-MM-DD hh:mm:ss'),
        synonym,
        label,
        quesitemids: questionItemList
          .filter((val) => val.id)
          .map((data) => data.id)
          .join(','),
      };
      if (id) {
        obj.id = id;
      }
      this.setState({ submitLoading: true });
      dispatch({
        type: id ? 'knowledgeGallery/updateQues' : 'knowledgeGallery/saveQuetions',
        payload: obj,
      })
        .then(() => {
          // this.backToKnowledge();
          message.success('保存成功');
          closeAddQuesModal();
          this.setState({ submitLoading: false });
        })
        .catch(() => {
          this.setState({ submitLoading: false });
        });
    });
  };

  // eslint-disable-next-line no-return-assign,react/sort-comp
  saveInputRef = (input) => (this.input = input);

  loadRelQuestionList = (page, pagination = {}) => {
    const { relQuestionList } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/fetchStandardQuesList',
      payload: {
        exceptids: this.handleExceptIds(relQuestionList),
        p: page || 0,
        ps: pagination.pageSize || 10,
      },
    });
  };
  loadRelKnowledgeList = (page, pagination = {}) => {
    const { relKnowledgeList } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/fetchKnowledgeList',
      payload: {
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

  deleteQuestion = (e, question) => {
    e.preventDefault();
    const { questionItemList } = this.state;
    const qList = questionItemList;
    for (let i = 0; i < qList.length; i += 1) {
      if (question.id === qList[i].id) {
        qList.splice(i, 1);
      }
    }

    this.setState({ questionItemList: qList });
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'addStandardQuestion/deleteQuestionList',
    //   payload: question.id,
    // });
  };

  editorChange = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ content: value });
    this.setState({ content: value });
  };

  timeChange = (e) => {
    if (e.length >= 2) {
      this.begintime =
        // eslint-disable-next-line no-underscore-dangle
        `${moment(new Date(e[0]._d === undefined ? '' : e[0]._d)).format('YYYY-MM-DD HH:mm:ss')}.0`;
      this.endtime =
        // eslint-disable-next-line no-underscore-dangle
        `${moment(new Date(e[1]._d === undefined ? '' : e[1]._d)).format('YYYY-MM-DD HH:mm:ss')}.0`;
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

  backToKnowledge = () => {
    const { dispatch, onOk } = this.props;
    dispatch({
      type: 'addStandardQuestion/clearState',
    });
    onOk();
    dispatch(routerRedux.push({ pathname: '/knowledgebase/info', query: { from: 'addQuestion' } }));
  };

  closeModal = () => {
    this.setState({
      relQuestionModalVisible: false,
      relKnowledgeModalVisible: false,
    });
  };
  saveQuestion = (e) => {
    if (!e.target.value) {
      message.error('请输入相关问题的内容');
      return;
    }
    const { dispatch, kdbId } = this.props;
    const { kdbid } = this.state;
    dispatch({
      type: 'knowledgeGallery/saveSameQuertion',
      payload: {
        kdbid: kdbid || kdbId,
        question: e.target.value,
      },
    }).then((res) => {
      const { questionItemList } = this.state;

      if (res.status === 'OK') {
        // message.success('添加成功');
        questionItemList.push(res.data);
        this.setState({ save: true, questionItemList: questionItemList.filter((val) => val.id) });
      }
    });
  };
  addNewQuestion = (e) => {
    e.preventDefault();
    const { questionItemList } = this.state;
    if (questionItemList.length > 0) {
      const isEmptyQuestion = questionItemList.some((question) => {
        return !question.id;
      });

      if (isEmptyQuestion) {
        message.error('当前存在未保存成功的相似问题');
        return;
      }
    }
    const list = questionItemList.concat({});
    this.setState({ questionItemList: list });
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

  handleSearch = (value) => {
    getAddKeywordList({
      searchKeyword: value,
    }).then((res) => {
      if (res.status === 'OK' && res.data) {
        this.setState({ dataSource: res.data.slice(0, 40).filter((val) => !!val) });
      }
    });
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleLabetInputChange = (e) => {
    this.setState({ LabetTabInputValue: e.target.value });
  };

  handleLabetInputConfirm = () => {
    const { LabetTabInputValue } = this.state;
    let { Labettags } = this.state;

    const { dispatch } = this.props;

    dispatch({
      type: 'knowledgeGallery/checkSame',
      payload: {
        keyword: LabetTabInputValue,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        if (LabetTabInputValue && Labettags.indexOf(LabetTabInputValue) === -1) {
          Labettags = [...Labettags, LabetTabInputValue];
        }
        this.setState({
          Labettags,
          LabetTab: false,
          LabetTabInputValue: '',
        });
      } else {
        message.info('标签重复');
      }
    });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;

    const { dispatch } = this.props;

    dispatch({
      type: 'knowledgeGallery/checkSame',
      payload: {
        keyword: inputValue,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
        }
        this.setState({
          tags,
          inputVisible: false,
          inputValue: '',
        });
      } else {
        message.info('同义词重复');
      }
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };
  ShowLabetInput = () => {
    this.setState({ LabetTab: true }, () => this.input.focus());
  };

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    this.setState({ tags });
  };

  handleLabetClose = (removedTag) => {
    const Labettags = this.state.Labettags.filter((tag) => tag !== removedTag);
    this.setState({ Labettags });
  };

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
            const { data = {}, status } = item.response;
            if (status === 'FAIL') {
              message.info('上传失败');
              return;
            }
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

  formatValidator = (rule, value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/checkKey',
      payload: {
        keyword: value,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        if (res.data) {
          callback();
        } else {
          callback('核心词重复');
        }
      } else {
        callback('校验失败');
      }
    });
  };

  render() {
    const { closeAddQuesModal, visible } = this.props;
    const {
      questionItemList,
      relQuestionList,
      relQuestionModalVisible,
      knowledgeList,
      standardQuesList,
      submitLoading,
      relKnowledgeModalVisible,
      tags,
      inputVisible,
      inputValue,
      dataSource,
      Labettags,
      LabetTab,
      LabetTabInputValue,
      kdbid,
      curQuestionInfo,
      uploadFileList,
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
      fileList:
        curQuestionInfo &&
        curQuestionInfo.fileList &&
        curQuestionInfo.fileList.map((item) => ({
          uid: item.id,
          name: item.filename,
          status: 'done',
          url: `${global.req_url}${item.filepath}?attname=${item.filename}`,
        })),
    };

    return (
      <Modal
        width="800px"
        title="知识收录"
        visible={visible}
        onCancel={closeAddQuesModal}
        footer={[
          <Button key="back" onClick={closeAddQuesModal}>
            关闭
          </Button>,
          <Button key="submit" type="primary" loading={submitLoading} onClick={this.onSubmit}>
            保存
          </Button>,
        ]}
        onOk={this.onSubmit}
      >
        <Fragment>
          <Card bordered={false}>
            <Form>
              <Form.Item {...formItemLayout} hasFeedback label="问题" required>
                {getFieldDecorator('question', {
                  rules: [
                    {
                      required: true,
                      message: '请输入问题',
                    },
                  ],
                  initialValue: this.state.question || '',
                })(<TextArea placeholder="请输入" />)}
              </Form.Item>
              <div className={styles.divFormItem}>
                <div className={styles.divlabel}>相似问题: </div>
                <div className={styles.divFormContent}>
                  {questionItemList &&
                    questionItemList.length > 0 &&
                    questionItemList.map((question, index) => {
                      if (!question.id) {
                        return (
                          <Input
                            // eslint-disable-next-line react/no-array-index-key
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
                      setTimeout(() => {
                        this.addNewQuestion(e);
                      }, 500);
                    }}
                  >
                    <Icon type="plus-circle-o" style={{ paddingRight: 4 }} />
                    添加相似问题
                  </a>
                </div>
              </div>
              <Form.Item {...formItemLayout} hasFeedback label="标准答案" required>
                {getFieldDecorator('content', {
                  rules: [
                    {
                      required: true,
                      message: '标准答案',
                    },
                  ],
                  initialValue: this.state.content || '',
                })(
                  <CommonEditor
                    echoValue={this.state.content}
                    onChangeCallBack={this.editorChange}
                  />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="时效" required>
                {getFieldDecorator('public', {
                  rules: [
                    {
                      required: true,
                      message: '请输入时效',
                    },
                  ],
                  initialValue:
                    [getMonmentByms(this.state.begintime), getMonmentByms('2030-12-31')] || [],
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
                      value={[getMonmentByms(this.state.begintime), getMonmentByms('2030-12-31')]}
                      onChange={(e) => {
                        this.timeChange(e);
                      }}
                      hasFeedback
                      placeholder={['开始日期', '结束日期']}
                    />
                  </div>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} hasFeedback label="核心词">
                {getFieldDecorator('keyword', {
                  rules: [
                    // {
                    //   required: true,
                    //   message: '请输入核心词',
                    // },
                    {
                      validator: (rule, value, callback) => {
                        this.formatValidator(rule, value, callback);
                      },
                    },
                  ],
                  initialValue: this.state.keyword || '',
                })(
                  // <Input
                  //   placeholder="请输入核心词2"
                  //   // value={coreWordInput}
                  //   // onPressEnter={this.handleBtnClick}
                  //   // onChange={this.onChangeCoreWord}
                  //   // ref={node => this.coreWordInputs = node}
                  // />
                  <AutoComplete
                    dataSource={dataSource}
                    style={{ width: 200 }}
                    placeholder="2"
                    onSearch={this.handleSearch}
                    onSelect={this.onSelect}
                  >
                    <Input placeholder="请输入核心词" onKeyPress={this.handleKeyPress} />
                  </AutoComplete>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} hasFeedback label="同义词">
                <div>
                  {tags.map((tag) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </Tag>
                    );
                    return isLongTag ? (
                      <Tooltip title={tag} key={tag}>
                        {tagElem}
                      </Tooltip>
                    ) : (
                      tagElem
                    );
                  })}
                  {inputVisible && (
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={inputValue}
                      onChange={this.handleInputChange}
                      onBlur={this.handleInputConfirm}
                      onPressEnter={this.handleInputConfirm}
                    />
                  )}
                  {!inputVisible && (
                    <Tag
                      onClick={this.showInput}
                      style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                      <Icon type="plus" /> 添加
                    </Tag>
                  )}
                </div>
              </Form.Item>
              <Form.Item {...formItemLayout} hasFeedback label="标签">
                <div>
                  {Labettags.map((tag) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag key={tag} closable onClose={() => this.handleLabetClose(tag)}>
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </Tag>
                    );
                    return isLongTag ? (
                      <Tooltip title={tag} key={tag}>
                        {tagElem}
                      </Tooltip>
                    ) : (
                      tagElem
                    );
                  })}
                  {LabetTab && (
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={LabetTabInputValue}
                      onChange={this.handleLabetInputChange}
                      onBlur={this.handleLabetInputConfirm}
                      onPressEnter={this.handleLabetInputConfirm}
                    />
                  )}
                  {!LabetTab && (
                    <Tag
                      onClick={this.ShowLabetInput}
                      style={{ background: '#fff', borderStyle: 'dashed' }}
                    >
                      <Icon type="plus" /> 添加
                    </Tag>
                  )}
                </div>
              </Form.Item>

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
