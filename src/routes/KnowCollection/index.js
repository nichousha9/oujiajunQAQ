/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { Form, Icon, DatePicker, message } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import moment from 'moment';
import CommonFilter from '../../components/CommonFilter';
import StandardTable from '../../components/StandardTable';
import CommonShowEditor from '../../components/CommonShowEditor';
import { formatDatetime, emptyAttr } from '../../utils/utils';
import { getUserBelowOrgan } from '../../services/kdbPickup';
import { getCurUserArea } from '../../services/systemSum';
import { knowCollectStatus, knowCollectStatusClass } from '../../utils/resource';
import CommonSelect from '../../components/CommonSelect';
import CommonTreeSelect from '../../components/CommonTreeSelect';
// import CommonModalArea from "../../components/CommonModalArea";
import CommonSearch from '../../components/CommonSearch';
import KnowledgeCollection from '../Agent/KnowledgeCollection';
import SearchAutoComplete from '../../components/SearchAutoComplete';
import KnowCollAuditResultModal from '../../components/KnowCollAuditResult';

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
@connect(({ loading, knowPickUpSaveAudite, dataDic }) => {
  return {
    knowPickUpSaveAudite,
    dataDic: dataDic.dataDic || {},
    loading: loading.models.knowPickUpSaveAudite,
  };
})
export default class KnowCollectionList extends React.PureComponent {
  state = {
    editModalVisible: false, // 修改Modal显示
    resultModalVisible: false, // 审核结果的Modal
    editItem: {}, // 当前修改的Item
    area: '', // 选择的地区
  };
  componentDidMount() {
    const {
      dispatch,
      dataDic: {
        knowledgeType = [],
        curUserAreaListcommon_region_type_kdbPickup: curUserAreaList = [],
      },
    } = this.props;
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
    this.loadPage();
  }
  onLoadData = (treeNodeProps) =>
    new Promise((resolve) => {
      getCurUserArea({ parentId: treeNodeProps.regionId }).then((res) => {
        resolve(res.data);
      });
    });
  // 地区选择变化
  areaSelectChange = (value) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ area: value });
    this.setState({ area: value });
  };
  loadPage = (searh = {}, page = 0) => {
    const { dispatch } = this.props;
    const newSearch = {
      ...emptyAttr(searh),
      begintime: this.begintime || '',
      endtime: this.endtime || '',
    };
    dispatch({
      type: 'knowPickUpSaveAudite/fetchGetKnowPickUpHisList',
      payload: {
        p: page,
        ps: 10,
        type: 'history_list',
        ...newSearch,
      },
    });
  };

  // 查询
  handleSubmit = (page = 0, ps = 10) => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const fields = getFieldsValue();
    this.loadPage(fields, page, ps);
  };
  // 重置
  handleReset = () => {
    const {
      form: { getFieldsValue, resetFields },
    } = this.props;
    resetFields();
    this.timeChange();
    this.setState({ searchValue: '', area: '', checkedNodeInfo: [] });
    const fields = getFieldsValue();
    this.loadPage(fields);
  };
  // 表格改变查询的参数
  tableOnChange = (pageInfor) => {
    const { current, pageSize } = pageInfor;
    this.handleSubmit(current, pageSize);
  };
  // 时间空间
  timeChange = (e) => {
    if (e && e.length) {
      this.begintime = moment(new Date(e[0]._d)).format('YYYY-MM-DD HH:mm:ss');
      this.endtime = moment(new Date(e[1]._d)).format('YYYY-MM-DD HH:mm:ss');
    } else {
      this.begintime = '';
      this.endtime = '';
    }
  };
  // 撤回
  handleRecall = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowPickUpSaveAudite/fetchCancelAudite',
      payload: {
        pickupId: record.id,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('撤回成功');
        this.loadPage();
      }
    });
  };
  // 显示编辑的Modal
  showEditModal = (record) => {
    if (record.status === 'pick_up_unaccept' || record.status === 'pick_up_accept') {
      this.setState({ resultModalVisible: true, editItem: record || {} });
      return;
    }
    this.setState({ editModalVisible: true, editItem: record || {} });
  };
  // 关闭Modal
  closeModal = () => {
    this.loadPage();
    this.setState({ editModalVisible: false, resultModalVisible: false, editItem: {} });
  };
  render() {
    const {
      selectedRows,
      loading,
      form: { getFieldDecorator },
      dataDic: {
        knowledgeType = [],
        curUserAreaListcommon_region_type_kdbPickup: curUserAreaList = [],
      },
      knowPickUpSaveAudite: { knowPickUpHisList },
    } = this.props;
    const { area } = this.state;
    const columns = [
      {
        title: '问题',
        dataIndex: 'question',
        render: (data) => {
          return <CommonShowEditor data={data} />;
        },
      },
      {
        title: '分类',
        dataIndex: 'sortName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (val) => {
          const arr = knowCollectStatusClass[val] || [];
          return (
            <span>
              <Icon className={classnames(arr[1] || '', 'margin-right-5')} />
              {arr[0]}
            </span>
          );
        },
      },
      {
        title: '提交人',
        width: 100,
        dataIndex: 'submitterName',
      },
      {
        title: '审核人',
        width: 100,
        dataIndex: 'updaterName',
        // render: (val = {}) => ((val ||{}).auditorUser || {}).nickname ||'_',
      },
      {
        title: '提交时间',
        dataIndex: 'submitTime',
        width: 150,
        render: (val = '') => formatDatetime(val),
      },
      {
        title: '操作',
        width: 60,
        render: (record) => {
          const that = this;
          if (record.status === 'pick_up_auditing') {
            return (
              <a
                onClick={() => {
                  that.handleRecall(record);
                }}
              >
                撤回
              </a>
            );
          }
          return (
            <a
              onClick={() => {
                that.showEditModal(record);
              }}
            >
              {record.status === 'pick_up_draft' ? '编辑' : '查看'}
            </a>
          );
        },
      },
    ];
    const { editModalVisible = false, editItem = {}, resultModalVisible } = this.state;
    const editModalProps = {
      visible: editModalVisible,
      curUserAreaList,
      editItem,
      onCancel: this.closeModal,
    };
    const resultModalProps = {
      visible: resultModalVisible,
      editItem,
      onCancel: this.closeModal,
    };
    return (
      <div className="selfAdapt">
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
                onChange={(value) => {
                  this.setState({ searchValue: value });
                }}
                doSearch={() => {
                  this.handleSubmit();
                }}
              />
            )}
          </FormItem>
          <FormItem label="发布类型" {...formItemLayout}>
            {getFieldDecorator('sortId')(
              <CommonSelect
                optionData={{
                  optionName: 'paramName',
                  optionId: 'id',
                  datas: knowledgeType,
                }}
              />
            )}
          </FormItem>
          <FormItem label="发布地区" {...formItemLayout}>
            {getFieldDecorator('area')(
              <CommonTreeSelect
                style={{ width: '100%' }}
                onChange={this.areaSelectChange}
                treeCheckStrictly
                // value={area}
                defaultVal={area}
                // treeCheckable="true"
                loadCallBack={this.onLoadData}
                treeData={curUserAreaList}
                nofilter="true"
                type={{ name: 'regionName', value: 'regionId' }}
                placeholder="请选择地区"
                ref={(ele) => {
                  this.treeRef = ele;
                }}
              />
              // <CommonModalArea
              //   checkable={false}
              //   onChange={(_,checkedKeys,checkedNodeInfo)=>{this.setState({checkedKeys,checkedNodeInfo})}}
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
                onChange={(e) => {
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
          cutHeight={320}
          loading={loading}
          onChange={this.tableOnChange}
          rowKey={(record) => record.id}
          ref={(ele) => {
            this.tableRef = ele;
          }}
          selectedRows={selectedRows}
          data={knowPickUpHisList}
          columns={columns}
        />
        {editModalVisible && <KnowledgeCollection {...editModalProps} />}
        {resultModalVisible && <KnowCollAuditResultModal {...resultModalProps} />}
      </div>
    );
  }
}
