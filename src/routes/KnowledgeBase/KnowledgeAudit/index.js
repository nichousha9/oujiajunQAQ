/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { Form, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import CommonFilter from '../../../components/CommonFilter';
import StandardTable from '../../../components/StandardTable';
import CommonShowEditor from '../../../components/CommonShowEditor';
import CommonSearch from '../../../components/CommonSearch';
import SearchAutoComplete from '../../../components/SearchAutoComplete';
import { formatDatetime, emptyAttr, getClientHeight } from '../../../utils/utils';
import { knowCollectStatus } from '../../../utils/resource';
import CommonSelect from '../../../components/CommonSelect';
import CommonTreeSelect from '../../../components/CommonTreeSelect';
import KnowCollAuditResultModal from '../../../components/KnowCollAuditResult';
import AuditModal from './AuditModal';
import { getUserBelowOrgan } from '../../../services/kdbPickup';
import { getCurUserArea } from '../../../services/systemSum';
import CommonKnowledgeTree from '../../../components/CommonKnowledgeTree';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
@connect(({ loading, knowPickUpSaveAudite, dataDic, knowledgeTab }) => {
  return {
    knowledgeTab,
    knowPickUpSaveAudite,
    dataDic: dataDic.dataDic || {},
    loading: loading.models.knowPickUpSaveAudite,
  };
})
export default class KnowledgeAudit extends React.PureComponent {
  state = {
    editModalVisible: false, // 修改Modal显示
    resultModalVisible: false, // 修改Modal显示
    editItem: {}, // 当前修改的Item
    area: '',
  };
  componentDidMount() {
    const { dispatch, dataDic: { knowledgeType = [],curUserAreaListcommon_region_type_kdbPickup: curUserAreaList = [] }, kdbid } = this.props;
    if (!knowledgeType.length) {
      dispatch({ type: 'dataDic/fetchGetKnowledgeType' });
    }
    if (!curUserAreaList.length) {
      dispatch({
        type: 'dataDic/fetchGetCurUserAreaList',
        payload: {
          type: 'common_region_type_kdbPickup',
          parentId: 0,
        },
      });
    }
    dispatch({
      type: 'knowledgeTab/fetchGetCateAllList',
      payload: { kdbid },
    }).then(() => {
      const { knowledgeTab: { defaultSelectCate = {} } } = this.props;
      let code;
      if (defaultSelectCate) {
        code = defaultSelectCate.code;
      }
      // 默认 拿的标准问题的List
      dispatch({
        type: 'knowPickUpSaveAudite/fetchGetKnowPickUpHisList',
        payload: {
          p: 1,
          ps: 10,
          type: 'auditing_list',
          catecode: code,
        },
      });
    });
    // this.loadPage();
  }
  onLoadData = treeNodeProps =>
    new Promise(resolve => {
      getCurUserArea({ parentId: treeNodeProps.regionId }).then(res => {
        resolve(res.data);
      });
  });
  // 选择地区切换
  areaChange = (value) => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({area: value})
    this.setState({area: value})
  }
  loadPage = (searh = {}, page = 0) => {
    const { dispatch } = this.props;
    let code;
      const { knowledgeTab: { defaultSelectCate = {} } } = this.props;
    if (defaultSelectCate) {
      code = defaultSelectCate.code;
    }
    const newSearch = {
      ...emptyAttr(searh || {}),
      begintime: this.begintime || '',
      endtime: this.begintime || '',
      catecode: this.treeRef.selectedNode ? this.treeRef.selectedNode.dataRef.code : code, // 拿到当前树的
    };
    dispatch({
      type: 'knowPickUpSaveAudite/fetchGetKnowPickUpHisList',
      payload: {
        p: page,
        ps: 10,
        type: 'auditing_list',
        ...newSearch,
      },
    });
  };
  // 查询
  handleSubmit = (page = 0, ps = 10) => {
    const { form: { getFieldsValue } } = this.props;
    const fields = getFieldsValue();
    this.loadPage(fields, page, ps);
  };
  // 重置
  handleReset = () => {
    const { form: { getFieldsValue, resetFields } } = this.props;
    resetFields();
    const fields = getFieldsValue();
    this.setState({ searchValue: '', area: '' });
    this.timeChange();
    this.loadPage(fields);
  };
  // 表格改变查询的参数
  tableOnChange = pageInfor => {
    const { current, pageSize } = pageInfor;
    this.handleSubmit(current, pageSize);
  };
  // 时间空间
  timeChange = e => {
    if (e && e.length) {
      this.begintime = moment(new Date(e[0]._d)).format('YYYY-MM-DD HH:mm:ss');
      this.endtime = moment(new Date(e[1]._d)).format('YYYY-MM-DD HH:mm:ss');
    } else {
      this.begintime = '';
      this.endtime = '';
    }
  };
  // 显示编辑的Modal
  showEditModal = record => {
    if (record.status === 'pick_up_unaccept' || record.status === 'pick_up_accept') {
      this.setState({ resultModalVisible: true, editItem: record || {} });
      return;
    }
    this.setState({ editModalVisible: true, editItem: record || {} });
  };
  // 关闭Modal
  closeModal = () => {
    this.setState({ editModalVisible: false, resultModalVisible: false, editItem: {} });
    this.loadPage();
  };
  render() {
    const {
      kdbid,
      selectedRows,
      loading,
      form: { getFieldDecorator,setFieldsValue },
      dataDic: { knowledgeType = [],curUserAreaListcommon_region_type_kdbPickup: curUserAreaList = [] },
      knowPickUpSaveAudite: { knowPickUpHisList },
      knowledgeTab: { defaultSelectCate,cateAllList },
    } = this.props;
    const {area} = this.state
    const columns = [
      {
        title: '问题',
        dataIndex: 'question',
        render: data => {
          return <CommonShowEditor data={data} />;
        },
      },
      {
        title: '分类',
        width: 100,
        dataIndex: 'sortName',
      },
      {
        title: '提交人',
        width: 100,
        dataIndex: 'submitterName',
        // render: (val = {}) => (val || {}).nickname || '',
      },
      {
        title: '提交时间',
        dataIndex: 'submitTime',
        width: 150,
        render: val => formatDatetime(val),
      },
      {
        title: '操作',
        width: 60,
        render: record => {
          const that = this;
          return (
            <a
              onClick={() => {
                that.showEditModal(record);
              }}
            >
              审核
            </a>
          );
        },
      },
    ];
    const { editModalVisible = false, editItem = {}, resultModalVisible = false } = this.state;
    const editModalProps = {
      visible: editModalVisible,
      editItem,
      onCancel: this.closeModal,
    };
    const resultModalProps = {
      visible: resultModalVisible,
      editItem,
      onCancel: this.closeModal,
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
    return (
      <div className="flexBox" style={{ height: '0%' }}>
        <div style={{ width: '250px' }}>
          {defaultSelectCate &&
            defaultSelectCate.id && (
              <CommonKnowledgeTree
                {...commonKnowledgeTreeProps}
                ref={ele => {
                  this.treeRef = ele;
                }}
              />
            )}
        </div>
        <div
          className="flex1"
          style={{ borderLeft: '1px solid rgba(0,21,41,0.12)', paddingLeft: 20 }}
        >
          <div>
            <CommonFilter
              handleSubmit={() => {
                this.handleSubmit();
              }}
              handleReset={this.handleReset}
              noExpandFlag="true"
            >
              <FormItem label="问题查询" {...formItemLayout}>
                {getFieldDecorator('question')(
                  <CommonSearch
                    noWidth
                    isForce
                    searchValue={this.state.searchValue}
                    onChange={value => {
                      this.setState({ searchValue: value });
                      setFieldsValue({question: value})
                    }}
                    doSearch={() => {
                      this.handleSubmit();
                    }}
                  />
                )}
              </FormItem>
              <FormItem label="发布类型" {...formItemLayout}>
                {getFieldDecorator('sortId')(<CommonSelect 
                  onChange={value => {
                    setFieldsValue({sortId: value})
                  }}
                  optionData={{
                    optionName: 'paramName',
                    optionId: 'id',
                    datas:knowledgeType,
                  }} 
                />)}
              </FormItem>
              <FormItem label="发布地区" {...formItemLayout}>
                {getFieldDecorator('area')(
                  <CommonTreeSelect
                    onChange={this.areaChange}
                    treeCheckStrictly
                    // value={this.showOrgan.organList}
                    // treeCheckable="true"
                    defaultVal={area}
                    loadCallBack={this.onLoadData}
                    treeData={curUserAreaList}
                    nofilter="true"
                    type={{ value: 'regionId', name: 'regionName' }}
                    placeholder="请选择"
                    ref={ele => {
                        this.treeRef = ele;
                      }}
                  />
                  // <CommonModalArea
                  //   checkable={false}
                  //   onChange={(_, checkedKeys, checkedNodeInfo) => {
                  //     this.setState({ checkedKeys, checkedNodeInfo });
                  //   }}
                  //   checkedKeysProps={this.state.checkedKeys || []}
                  //   checkedNodeInfoProps={this.state.checkedNodeInfo || []}
                  //   isForce
                  //   noWidth
                  // />
                )}
              </FormItem>
              <FormItem label="发布时间" {...formItemLayout}>
                {getFieldDecorator('time')(
                  <RangePicker
                    format="YYYY/MM/DD"
                    onChange={e => {
                      this.timeChange(e);
                    }}
                    hasFeedback
                    placeholder={['开始日期', '结束日期']}
                  />
                )}
              </FormItem>
              <FormItem label="审核状态" {...formItemLayout}>
                {getFieldDecorator('status')(
                  <CommonSelect optionData={{ datas: knowCollectStatus }} />
                )}
              </FormItem>
              <FormItem label="提交人" {...formItemLayout}>
                {getFieldDecorator('submitter')(
                  <SearchAutoComplete searchFn={getUserBelowOrgan} searchName="nicknameLike" />
                )}
              </FormItem>
            </CommonFilter>
            <StandardTable
              noSelect
              loading={loading}
              onChange={this.tableOnChange}
              rowKey={record => record.id}
              ref={ele => {
                this.tableRef = ele;
              }}
              selectedRows={selectedRows}
              data={knowPickUpHisList}
              columns={columns}
            />
            {editModalVisible && <AuditModal {...editModalProps} />}
            {resultModalVisible && <KnowCollAuditResultModal {...resultModalProps} />}
          </div>
        </div>
      </div>
    );
  }
}
