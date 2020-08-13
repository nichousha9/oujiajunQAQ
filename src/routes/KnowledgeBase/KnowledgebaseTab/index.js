/* eslint-disable react/no-unused-state */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable import/first */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, message, Modal } from 'antd';
import StandardTable from '../../../components/StandardTable';
import MutilImPortModal from '../MutilImPortModal';
import CommonKnowledgeTree from '../../../components/CommonKnowledgeTree';
import ImportResModal from '../../../components/ImportResModal';
import CommonSwitch from '../../../components/CommonSwitch';
import CommonShowEditor from '../../../components/CommonShowEditor';
import ActionButtonList from '../ActionButtonList';
import AddKonwledgeModal from './addKonwledgeModal';
import { getResMsg } from '../../../utils/codeTransfer';
import moment from 'moment';
import { getSetAbleValueByIsenable, getBoolStatus, getClientHeight } from '../../../utils/utils';
import AddEditModal from './AddEditModal';
import AddQuestionModel from '../AddQuestionModel';

const { confirm } = Modal;

const importQuesionColumns = [
  {
    title: '问题',
    dataIndex: 'question',
  },
  {
    title: '原因',
    dataIndex: 'cause',
    render: (data) => getResMsg(data),
  },
];
const importKnowlwdgeColumns = [
  {
    title: '知识点',
    dataIndex: 'knowledge',
  },
  {
    title: '原因',
    dataIndex: 'cause',
    render: (data) => getResMsg(data),
  },
];
@connect((props) => {
  const { loading, knowledgeTab } = props;
  return {
    knowledgeTab,
    loading: loading.models.knowledgeTab,
  };
})
export default class KnowledgebaseTab extends React.Component {
  state = {
    tabType: 'question', // 默认显示的表示问题表,
    addKonwledgeModalVisible: false, // 添加知识点的Modal,
    mutilImPortModalVisibal: false, // 批量导入的Modal,
    standardQuesList: [], // 标准问题列表；
    knowledgeList: [], // 知识点的列表；
    importResModalVisible: false, // 导入结果的Modal
    importResData: {}, // 导入结果的数据
    editKnowledge: {}, // 当前修改的知识点，
    editItem: {},
    editId: '',
    editModalVisible: false,
    addQuestionVisible: false,
    addQuestionsQuery: {},
  };
  componentDidMount() {
    const treeInfor = JSON.parse(localStorage.getItem('treeInfor')) || {};
    const { from } = this.props;
    this.loadPage(from === 'addQuestion' ? treeInfor.selectedCate : '');
  }
  // 新增
  onNewItem = () => {
    const { tabType } = this.state;
    if (tabType === 'question') {
      this.addQuestion();
    } else {
      return this.addKonwledge();
    }
  };

  // 清空知识库
  onEmpty = () => {
    const { dispatch } = this.props;
    const { selectedCate } = this.treeRef;
    dispatch({
      type: 'knowledgeTab/deleteAll',
      payload: { catecode: selectedCate },
      callback: () => {
        // 重新获取当前知识库的问题列表
        this.loadTabList();
      },
    });
  };

  // 查询
  onSearch = () => {
    this.loadTabList();
  };
  onSetAble = (ablevalue, record) => {
    const { selectedRowKeys } = this.tableRef.state;
    let ids = selectedRowKeys;
    if (selectedRowKeys.length === 0) {
      ids = record ? record.id : this.doSelect();
    }

    // const ids = record ? record.id : this.doSelect();

    ablevalue = ablevalue || getSetAbleValueByIsenable(record.isenable);
    if (!ids) return;
    const { tabType } = this.state;
    const { dispatch } = this.props;
    const onSetAbleType =
      tabType === 'question'
        ? 'knowledgeTab/fetchStandardQuesSetAble'
        : 'knowledgeTab/fetchKnowledgeSetAble';
    dispatch({
      type: onSetAbleType,
      payload: { ids, ablevalue },
    }).then(() => {
      this.loadTabList();
    });
  };
  onDelete = () => {
    const { selectedRowKeys } = this.tableRef.state;
    if (selectedRowKeys.length === 0) {
      message.error('请选择需要删除的标准问题');
      return;
    }
    const that = this;
    // const ids = recode && recode.id ? recode.id : this.doSelect();
    if (!selectedRowKeys) return;
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.handleDelete(selectedRowKeys);
      },
    });
  };
  syncData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeTab/kdbUpdate',
      payload: {},
    }).then((res) => {
      if (res && res.status === 'OK') {
        // message.success("同步数据成功！");
        confirm({
          title: '成功',
          content: '同步数据成功',
        });
      } else {
        // message.error("同步数据失败！");
        confirm({
          title: '失败',
          content: '同步数据失败',
        });
      }
    });
  };
  doSelect = () => {
    const {
      state: { selectedRowKeys },
    } = this.tableRef;
    if (!selectedRowKeys.length) {
      message.error('请选择要操作的数据');
      return false;
    }
    return selectedRowKeys.join(',');
  };
  // 删除
  handleDelete = (ids) => {
    const { tabType } = this.state;
    const { dispatch } = this.props;
    const deleteType =
      tabType === 'question'
        ? 'knowledgeTab/fetchStandardQuesDelete'
        : 'knowledgeTab/fetchKnowledgeDelete';
    dispatch({
      type: deleteType,
      payload: { ids },
    }).then(() => {
      this.loadTabList();
    });
  };

  loadPage = (cate) => {
    const { dispatch, kdbid } = this.props;
    dispatch({
      type: 'knowledgeTab/fetchGetCateAllList',
      payload: { kdbid },
    }).then(() => {
      const {
        knowledgeTab: { defaultSelectCate = {} },
      } = this.props;
      let code;
      if (defaultSelectCate) {
        code = defaultSelectCate.code;
      }
      // 默认 拿的标准问题的List
      dispatch({
        type: this.loadTabTypeList(),
        payload: {
          kdbid,
          catecode: cate || code,
        },
      });
    });
  };
  loadTabList = (page) => {
    // 默认 拿的标准问题的List
    if (this.actionRef) {
      const {
        kdbid,
        dispatch,
        knowledgeTab: { defaultSelectCate },
      } = this.props;
      const { tabType } = this.state;
      const { pagination = {} } = this.tableRef || {};
      const { searchValue } = this.actionRef;
      const like = tabType === 'question' ? 'queslike' : 'knowllike';
      let code;
      if (defaultSelectCate) {
        code = defaultSelectCate.code;
      }
      const obj = {
        kdbid,
        p: page || 0,
        ps: pagination.pageSize || 10,
        catecode: this.treeRef.selectedNode ? this.treeRef.selectedNode.dataRef.code : code, // 拿到当前树的
      };
      obj[like] = searchValue || '';
      dispatch({
        type: this.loadTabTypeList(),
        payload: { ...obj },
      });
    }
  };
  // 根据参数不同，列表显示
  loadTabTypeList = () => {
    const { tabType } = this.state;
    if (tabType === 'knowledge') {
      return 'knowledgeTab/fetchKnowledgeList';
    } else if (tabType === 'question') {
      return 'knowledgeTab/fetchStandardQuesList';
    }
  };
  mutilImPortModal = () => {
    this.setState({
      mutilImPortModalVisibal: true,
    });
  };
  mutilImPortOk = (resData) => {
    if (resData && resData.failList) {
      // 查看失败
      this.setState({ importResModalVisible: true, importResData: resData });
    } else {
      // 直接关闭Modal,刷新页面列表
      this.closeModal();
      this.loadTabList();
    }
  };
  closeModal = () => {
    this.setState({
      mutilImPortModalVisibal: false,
      addKonwledgeModalVisible: false,
      importResModalVisible: false,
      editKnowledge: {},
    });
  };
  /* 添加题目 */
  addQuestion = (data = {}) => {
    const { kdbid } = this.props;
    const { expandedKeys, selectedKeys } = this.treeRef.state || {};
    const { selectedCate, selectedCateId } = this.treeRef;
    localStorage.setItem(
      'treeInfor',
      JSON.stringify({ selectedCateId, expandedKeys, selectedKeys, selectedCate })
    );
    this.setState({
      addQuestionVisible: true,
      addQuestionsQuery: {
        kdbid,
        questionId: data.id,
      },
    });
  };

  updateTree = (treeData) => {
    const { dispatch } = this.props;
    dispatch({ type: 'knowledgeTab/saveCateList', payload: treeData });
  };
  // 问题知识点切换事件
  radioChange = (e) => {
    // 根据当前的radio的值切换表格
    this.setState(
      {
        tabType: e.target.value,
      },
      () => {
        this.loadTabList();
      }
    );
  };
  // 添加新的知识点
  addKonwledge = (record) => {
    this.setState({
      addKonwledgeModalVisible: true,
      editKnowledge: record,
    });
  };
  addKonwledgeOk = (data, modalBack) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeTab/fetchKnowledgeSave',
      payload: data,
    }).then(() => {
      this.loadTabList();
      modalBack();
      this.closeModal();
    });
  };
  tableChangePage = (pageInfo) => {
    this.loadTabList(pageInfo.current);
  };
  // 打开添加，或者的Modal
  handleAddEditTreeNode = (node, isAdd) => {
    const { kdbid } = this.props;
    if (isAdd) {
      this.setState({
        editItem: {
          pcateid: node.id || '0',
          cate: '',
          kdbid,
          orgScopeInfo: node.orgScopeInfo || {},
          orgScope: node.orgScope || '',
          organs: node.organs || [],
        },
        editId: '',
        editModalVisible: true,
      });
    } else {
      this.setState({
        editItem: {
          orgScopeInfo: node.orgScopeInfo || {},
          orgScope: node.orgScope || '',
          pcateid: node.parentid,
          cate: node.cate,
          organs: node.organs || [],
          code: node.code,
          kdbid,
        },
        editId: node.id,
        editModalVisible: true,
      });
    
    }
  };
  doUpdate = () => {
    this.loadPage();
  };
  closeEditorModal = () => {
    this.setState({ editItem: {}, editId: '', editModalVisible: false, addQuestionVisible: false });
  };
  treeRef = {}; // 知识库树的问题
  tableRef = {}; // 子元素table
  actionRef = {}; // 操作栏的信息
  render() {
    const {
      kdbid,
      loading,
      knowledgeTab: { standardQuesList, knowledgeList, cateAllList },
    } = this.props;
    const {
      addQuestionsQuery,
      addQuestionVisible,
      editKnowledge,
      importResData,
      importResModalVisible,
      mutilImPortModalVisibal,
      addKonwledgeModalVisible,
      tabType,
      editModalVisible,
      editId = '',
      editItem = {},
    } = this.state;
    const columns = [
      {
        title: '问题',
        dataIndex: 'question',
        render: (data) => {
          return <CommonShowEditor data={data} />;
        },
      },
      {
        title: '答案',
        dataIndex: 'content',
        render: (data) => {
          return <CommonShowEditor data={data} />;
        },
      },
      {
        title: '修改时间',
        dataIndex: 'updatetime',
        width: 160,
        render: (val) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'isenable',
        render: (val, record) => {
          return (
            <CommonSwitch
              onSwitch={() => {
                this.onSetAble(null, record);
              }}
              unCheckedChildren="停用"
              isSwitch={getBoolStatus(val)}
            />
          );
        },
      },
      {
        title: '操作',
        render: (record) => {
          return (
            <a
              onClick={() => {
                this.addQuestion(record);
              }}
            >
              修改
            </a>
          );
        },
      },
    ];
    const knowledgeColumns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: 120,
        render: (data) => {
          return <CommonShowEditor data={data} />;
        },
      },
      {
        title: '修改时间',
        dataIndex: 'updatetime',
        width: 160,
        render: (val) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'isenable',
        render: (val, record) => {
          return (
            <CommonSwitch
              onSwitch={() => {
                this.onSetAble(null, record);
              }}
              unCheckedChildren="停用"
              isSwitch={getBoolStatus(val)}
            />
          );
        },
      },
      {
        title: '操作',
        render: (record) => {
          return (
            <a
              onClick={() => {
                this.addKonwledge(record);
              }}
            >
              修改
            </a>
          );
        },
      },
    ];
    const mutilImPortModalProps = {
      loading,
      visible: mutilImPortModalVisibal,
      onOk: this.mutilImPortOk,
      closeModal: this.closeModal,
      importtype: tabType === 'question' ? 'kdb_standard_ques_import' : 'kdb_knowl_import',
      importProps: {
        catecode:
          (this.treeRef && this.treeRef.selectedNode && this.treeRef.selectedNode.dataRef.code) ||
          (cateAllList && cateAllList[0] && cateAllList[0].code) ||
          '', // 树选中的cate,
        catecodeid:
          (this.treeRef && this.treeRef.selectedNode && this.treeRef.selectedNode.dataRef.id) ||
          (cateAllList && cateAllList[0] && cateAllList[0].id) ||
          '', // 树选中的cate,
        kdbid,
        importtype: tabType === 'question' ? 'kdb_standard_ques_import' : 'kdb_knowl_import',
      },
    };
    const addKonwledgeModalProps = {
      visible: addKonwledgeModalVisible,
      treeData: cateAllList,
      onOk: this.addKonwledgeOk,
      curData: editKnowledge || {},
      closeModal: this.closeModal,
      kdbid,
    };
    const clientHeight = getClientHeight() - 190;
    const commonKnowledgeTreeProps = {
      addEditTreeNode: this.handleAddEditTreeNode,
      editFlag: true,
      updateTree: this.updateTree,
      scrollY: clientHeight,
      treeData: cateAllList,
      kdbid,
      onSelectCallBack: this.loadTabList,
    };
    const importResModalProps = {
      visible: importResModalVisible,
      importResData,
      closeModal: this.closeModal,
      onOk: this.mutilImPortOk,
      columns: tabType === 'question' ? importQuesionColumns : importKnowlwdgeColumns,
    };
    // 当前的表格通过tabType 判断显示具体的数据和
    const tabProps = {
      loading,
      checkable: true,
      rowKey: (record) => record.id,
      selectedRows: [],
      onChange: this.tableChangePage,
      columns: tabType === 'question' ? columns : knowledgeColumns,
      data: tabType === 'question' ? standardQuesList : knowledgeList,
    };
    const actionProps = {
      loading,
      onSearch: this.onSearch,
      onDelete: this.onDelete,
      onSetAble: this.onSetAble,
      onImport: this.mutilImPortModal,
      onNewItem: this.onNewItem,
      syncData: this.syncData,
      onEmpty: this.onEmpty,
    };
    const modalProps = {
      onOk: this.doUpdate,
      handleOKCallBack: this.doUpdate,
      visible: editModalVisible,
      editId,
      editItem,
      closeModal: this.closeEditorModal,
    };
    const addQuestionProps = {
      visible: addQuestionVisible,
      query: addQuestionsQuery,
      onOk: this.loadTabList,
      closeAddQuesModal: this.closeEditorModal,
    };
    return (
      <div className="flexBox" style={{ height: '0%' }}>
        <div style={{ width: '250px' }}>
          <CommonKnowledgeTree
            {...commonKnowledgeTreeProps}
            ref={(ele) => {
              this.treeRef = ele;
            }}
          />
        </div>
        <div
          className="flex1"
          style={{ borderLeft: '1px solid rgba(0,21,41,0.12)', paddingLeft: 20 }}
        >
          <div style={{ marginBottom: 20 }}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                知识列表
                {/* <RadioGroup defaultValue={tabType} onChange={this.radioChange}>
                  <RadioButton value="question">问题</RadioButton>
                  <RadioButton value="knowledge">知识点</RadioButton>
                </RadioGroup> */}
              </Col>
              <Col md={17} sm={24} style={{ paddingRight: 0, paddingLeft: 10 }}>
                <ActionButtonList
                  ref={(ele) => {
                    this.actionRef = ele;
                  }}
                  {...actionProps}
                />
              </Col>
            </Row>
          </div>
          <StandardTable
            ref={(ele) => {
              this.tableRef = ele;
            }}
            {...tabProps}
          />
        </div>
        {mutilImPortModalVisibal && <MutilImPortModal {...mutilImPortModalProps} />}
        {addKonwledgeModalVisible && <AddKonwledgeModal {...addKonwledgeModalProps} />}
        {importResModalVisible && <ImportResModal {...importResModalProps} />}
        {editModalVisible && <AddEditModal {...modalProps} />}
        {addQuestionVisible && <AddQuestionModel {...addQuestionProps} />}
      </div>
    );
  }
}
