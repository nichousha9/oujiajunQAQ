/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  Radio,
  Icon,
  Breadcrumb,
  message,
  Modal,
  Upload,
  Mention,
  AutoComplete,
  Tag,
  Tooltip,
  Select,
} from 'antd';
import CommonEditor from '../../components/CommonEditor';
import EditableTagGroup from '../../components/EditableTagGroup';
import CommonSelect from '../../components/CommonSelect';
import RelQuestionModal from '../KnowledgeBase/RelQuestionModal';
import RelKnowledgeModal from '../KnowledgeBase/RelKnowledgeModal';
import { getMonmentByms } from '../../utils/utils';
import styles from './Knowledgebase.less';
// import CommonModalArea from '../../components/CommonModalArea'
import CommonTreeSelect from '../../components/CommonTreeSelect';
import { getCurUserArea } from '../../services/systemSum';
import { getAddKeywordList } from '../../services/knowledgeGallery';

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
const { toString, toContentState } = Mention;
@connect(({ addStandardQuestion, loading, dataDic, knowledgeGallery }) => {
  return {
    addStandardQuestion,
    dataDic: (dataDic || {}).dataDic || {},
    loading: loading.effects['addStandardQuestion/getStandardQuesDetail'],
    knowledgeGallery,
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
    keyword: '',
    begintime: '',
    question: '',
    kdbId: '',
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
    dataSource: [],
    kdbid: undefined,
    keywordStatus: '',
    curKeyWord: '',
    keyWordSugList: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
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
    this.getKdbList();
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
        JSON.stringify(query.questionList) !== JSON.stringify(this.state.questionList) ||
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
          questionList: query.questionList || [],
          standardQuesList: query.standardQuesList || [],
          relQuestionList: query.relQuestionList || [],
          relKnowledgeList: query.relKnowledgeList || [],
          knowledgeList: query.knowledgeList || [],
          keyword: query.keyword || '',
          begintime: query.begintime || moment('2020-01-01'),
          endtime: query.endtime || moment('2030-01-01'),
          id: query.id || '',
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
    const {
      curQuestionInfo,
      area,
      begintime,
      endtime,
      uploadFile,
      keywordStatus,
      questionList,
    } = this.state;
    // if (begintime === '' || endtime === '') {
    //   message.info('请输入时效');
    //   return;
    // }
    // if(!area.length){
    //   message.info('请选中标准问题地区')
    //   return
    // }
    if (keywordStatus === 'error') {
      message.error('核心词输入有误！');
      return;
    }
    validateFields((errors, values) => {
      this.setState({ btnLoad: true });
      if (errors) return;
      const temp = getFieldsValue();
      if (temp.public === undefined) {
        temp.public = 1;
      }
      temp.area = area.map((v) => v.value).join(',');
      const { dispatch, closeAddQuesModal } = this.props;
      // 获取
      const {
        relQuestionList,
        relKnowledgeList,
        // synonyms,
        tags,
        Labettags,
      } = this.state;
      const relquesids = relQuestionList.map((question) => {
        return question.id;
      });
      const quesitemids = questionList
        .map((question) => {
          return question.id ? question.id : '';
        })
        .filter((v) => v)
        .join('|');
      // const relknowlids = relKnowledgeList.map(knowledge => {
      //   return knowledge.id;
      // });
      // const info = JSON.parse(localStorage.getItem('treeInfor')) || {};
      //   const obj = {
      //     ...temp,
      //     kdbid,
      //     catecodeid: info.selectedCateId,
      //     relquesids,
      //     quesitemids,
      //     relknowlids,
      //     begintime: this.begintime || '',
      //     endtime: this.endtime || '',
      //     attachmentids:uploadFile,
      //     synonym: synonyms,
      //     keyword:toString(temp.keyword),
      //   };

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

      const obj = {
        question: values.question,
        content: values.content,
        items: quesitemids,
        synonym,
        label,
        attachmentids: uploadFile,
        keyword: values.keyword,
        begintime: begintime === '' ? '2020-01-01 00:00:00.0' : begintime,
        endtime: endtime === '' ? '2030-01-01 00:00:00.0' : endtime,
        kdbId: values.kdbId,
      };
      console.log(obj);

      if (curQuestionInfo.id) {
        obj.id = curQuestionInfo.id;
      }
      dispatch({
        type: 'knowledgeSupplement/save',
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

  handleSearch = (value) => {
    getAddKeywordList({
      searchKeyword: value,
    }).then((res) => {
      if (res.status === 'OK' && res.data) {
        this.setState({ dataSource: res.data.slice(0, 40).filter((val) => !!val) });
      }
    });
  };

  getKdbList = (kdbName) => {
    const { dispatch } = this.props;
    dispatch({ type: 'knowledgeGallery/clearList' });

    dispatch({
      type: 'knowledgeGallery/fetchKdbList',
      payload: {
        kdbName,
      },
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
    const { questionList } = this.state;
    const qList = questionList;
    for (let i = 0; i < qList.length; i += 1) {
      if (question.id === qList[i].id) {
        qList.splice(i, 1);
      }
    }

    this.setState({ questionList: qList });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'addStandardQuestion/clearState',
    });
    // onOk();
    this.props.closeAddQuesModal();
    // dispatch(routerRedux.push({ pathname: '/knowledgebase/info', query: { from: 'addQuestion' } }));
  };

  closeModal = () => {
    this.setState({
      relQuestionModalVisible: false,
      relKnowledgeModalVisible: false,
    });
  };

  saveQuestion = (id, e) => {
    const { dispatch } = this.props;
    const { kdbid } = this.state;
    if (!e.target.value) {
      // message.error('请输入相关问题的内容');
      return;
    }
    if (!kdbid) {
      message.error('请选择知识库');
      return;
    }
    dispatch({
      type: 'knowledgeGallery/saveSameQuertion',
      payload: {
        kdbid,
        question: e.target.value,
      },
      callback: (res) => {
        const { questionList } = this.state;
        console.log(res);
        if (res.status === 'OK') {
          message.success('添加成功');
          questionList.push(res.data);
          this.setState({ save: true, questionList: questionList.filter((val) => val.id) });
        }
      },
    });
  };

  addNewQuestion = (e) => {
    // e.preventDefault();
    // const { questionList } = this.state;
    // const isEmptyQuestion = questionList.some(question => {
    //   return !question.id;
    // });
    // console.log(isEmptyQuestion);
    // if (isEmptyQuestion) {
    //   message.error('当前存在未保存成功的相似问题');
    //   return;
    // }
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'addStandardQuestion/addEmptyQuestion',
    // });
    e.preventDefault();
    const { questionList } = this.state;

    if (questionList.length > 0) {
      const isEmptyQuestion = questionList.some((question) => {
        return !question.id;
      });

      if (isEmptyQuestion) {
        message.error('当前存在未保存成功的相似问题');
        return;
      }
    }

    const list = questionList.concat({});

    this.setState({ questionList: list });
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

  // uploading = () => {};

  onKeywordBlur = (e) => {
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

  // onKeywordChange = e => {
  //   // /smartim/knowledge/standardQues/getKeywordList
  //   const { form, dispatch } = this.props;
  //   const value = toString(form.getFieldValue('keyword'));
  //   this.setState({
  //     curKeyWord: value,
  //   });
  //   if (!e) return;
  //   dispatch({
  //     type: 'addStandardQuestion/getKeywordList',
  //     payload: {
  //       searchKeyword: value,
  //     },
  //   }).then(res => {
  //     if (res && res.status === 'OK' && res.data) {
  //       this.setState({
  //         keyWordSugList: res.data,
  //       });
  //     }
  //   });
  // };

  setKdbID = (value) => {
    this.setState({ kdbid: value });
    this.handleClick();
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

  handleClick = () => {
    if (this.inputRef !== null) {
      this.inputRef.focus();
    }
  };

  render() {
    const {
      closeAddQuesModal,
      visible,
      knowledgeGallery: { kdbList },
    } = this.props;
    const kdbArr = kdbList.filter((item) => item.id !== 0);
    const {
      dataSource,
      questionList,
      relQuestionList,
      relQuestionModalVisible,
      knowledgeList,
      standardQuesList,
      submitLoading,
      relKnowledgeModalVisible,
      tags,
      inputVisible,
      inputValue,
      Labettags,
      LabetTab,
      LabetTabInputValue,
      keywordStatus,
      curQuestionInfo,
      curKeyWord,
      keyWordSugList,
      uploadFileList,
      begintime,
      endtime,
      kdbid,
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
    // const { kdbid='' } = this.query;
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
        curQuestionInfo.fileList &&
        curQuestionInfo.fileList.map((item) => ({
          uid: item.id,
          name: item.filename,
          status: 'done',
          url: `${global.req_url}${item.filepath}?attname=${item.filename}`,
        })),
    };

    const uploadkdb =
      kdbid === undefined ? (
        <Button type="primary" onClick={() => message.error('请先选择数据库')}>
          <Icon type="upload" /> 附件上传
        </Button>
      ) : (
        <Upload {...props} fileList={uploadFileList}>
          <Button type="primary">
            <Icon type="upload" /> 附件上传
          </Button>
        </Upload>
      );

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
              <FormItem {...formItemLayout} hasFeedback label="问题">
                {getFieldDecorator('question', {
                  rules: [
                    {
                      required: true,
                      message: '请输入问题',
                    },
                  ],
                  initialValue: this.state.question || '',
                })(<Input.TextArea placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="知识库" hasFeedback>
                {getFieldDecorator('kdbId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择知识库',
                    },
                  ],
                })(
                  <Select onChange={this.setKdbID}>
                    {kdbArr &&
                      kdbArr.map((item) => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </FormItem>
              <div className={styles.divFormItem}>
                <div className={styles.divlabel}>相似问题: </div>
                <div className={styles.divFormContent}>
                  {questionList &&
                    questionList.length > 0 &&
                    questionList.map((question, index) => {
                      if (!question.id) {
                        return (
                          <Input
                            ref={(input) => {
                              this.inputRef = input;
                            }}
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
                          <div
                            key={question.id}
                            className={styles.added_col}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div className={styles.textContent}>{question.question}</div>
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
              <FormItem {...formItemLayout} hasFeedback label="标准答案">
                {getFieldDecorator('content', {
                  rules: [
                    {
                      required: true,
                      message: '标准答案',
                    },
                  ],
                  initialValue: this.state.content || '',
                })(<CommonEditor onChangeCallBack={this.editorChange} />)}
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
                        begintime === '' ? getMonmentByms('2020-01-01') : getMonmentByms(begintime),
                        endtime === '' ? getMonmentByms('2030-01-01') : getMonmentByms(endtime),
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
              {/* <FormItem {...formItemLayout} label="核心词">
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
              </FormItem> */}
              <FormItem {...formItemLayout} hasFeedback label="核心词">
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
              </FormItem>
              <FormItem {...formItemLayout} hasFeedback label="同义词">
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
              </FormItem>
              <FormItem {...formItemLayout} hasFeedback label="标签">
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
              </FormItem>
              <div style={{ marginLeft: 146 }}>{uploadkdb}</div>
            </Form>
          </Card>
          {relQuestionModalVisible && <RelQuestionModal {...relQuestionModalProps} />}
          {relKnowledgeModalVisible && <RelKnowledgeModal {...relKnowledgeModalProps} />}
        </Fragment>
      </Modal>
    );
  }
}
