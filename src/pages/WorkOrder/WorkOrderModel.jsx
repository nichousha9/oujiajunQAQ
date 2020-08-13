/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Select, Input, DatePicker, Tooltip, Modal, Badge } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import Ellipsis from '@/components/Ellipsis';
import CommonFilter from '@/components/CommonFilter';
import styles from './index.less';

const status = {
  Editing: { type: 'processing', text: '编辑中' }, // 编辑中
  Running: { type: 'success', text: '运行' }, // 运行
  Suspended: { type: 'warning', text: '已暂停' }, // 暂停
  Termination: { type: 'error', text: '终止' }, // 终止
  Finished: { type: 'default', text: '已结束' },
  Published: { type: 'success', text: '已发布' }, // 已发布
  ToPublished: { type: 'warning', text: '待发布' }, // 待发布
  Approvaling: { type: 'warning', text: '审核中' }, // 审核中
  // Deleted: 'default', // 已失效
  Publishing: { type: 'success', text: '发布中' }, // 发布中
  'Audit failed': { type: 'error', text: '审核不通过' }, // 审核不通过
};

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ workOrder, common, loading }) => ({
  workOrder,
  contactStatus: common.attrSpecCodeList.CONTACT_STATUS_CD,
  loading: loading.effects['workOrder/qryCampaignPage'],
}))
@Form.create()
class WorkOrderModel extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'workOrder.extName' }), // '活动名称',
      dataIndex: 'extName',
      key: 'extName',
      ellipsis: true,
    },
    {
      title: '活动编码',
      dataIndex: 'extCode',
      key: 'extCode',
    },
    {
      title: '活动说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'campaignState',
      key: 'campaignState',
      render: text => {
        return <Badge status={status[text].type || ''} text={status[text].text || ''} />;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
      ellipsis: true,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 列表
      pageNum: 1,
      pageSize: 10,
      pageInfo: {}, // 后端的返回
      camTypes: [], // 活动类型
      orgTree: [], // 区域树
      selectedRowKeys: [], // 选中
      selectedRows: [],
    };
  }

  componentDidMount() {
    const { form, workOrder, dispatch } = this.props;
    const { formValue, historyState, ...rest } = workOrder;
    if (historyState && historyState === 'workOrder') {
      this.setState({
        ...rest,
      });
      form.setFieldsValue(formValue);
      // 重置historyState
      dispatch({
        type: 'workOrder/save',
        payload: {
          historyState: '',
        },
      });
    } else {
      this.fetchList();
    }
    this.fetchList();
    this.getSpecCode();
    this.qryCamType();
  }

  goDetailPage = record => {
    const { form, dispatch } = this.props;
    const formValue = form.getFieldsValue();
    const { data, pageNum, pageSize, pageInfo } = this.state;
    const { subsId, custType, campaignId } = record;

    router.push({
      pathname: '/workOrder/detail',
      query: {
        subsId,
        custType,
        campaignId,
        record,
      },
      type: 'workOrder',
    });
    dispatch({
      type: 'workOrder/save',
      payload: {
        formValue,
        data,
        pageNum,
        pageSize,
        pageInfo,
        historyState: 'workOrder',
      },
    });
  };

  // 获取工单状态
  getSpecCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'CONTACT_STATUS_CD',
      },
    });
  };

  // 获取数据
  fetchList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const otherPamams = this.getForm();
    dispatch({
      type: 'workOrder/qryCampaignPage',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
        ...otherPamams,
      },
      success: svcCont => {
        const { data, pageInfo } = svcCont;
        this.setState({
          data,
          pageInfo: {
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
          },
        });
      },
    });
  };

  // 活动类型
  qryCamType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'workOrder/qryCamBusiTypeTree',
      payload: {},
      success: svcCont => {
        const { data } = svcCont;
        const newTree = [];
        data.map(item => newTree.push(...item.childTypes));
        this.setState({
          camTypes: newTree,
        });
      },
    });
  };

  getForm = () => {
    const { form } = this.props;
    const { validateFields } = form;
    let result = {};
    validateFields((err, values) => {
      if (!err) {
        const { createDate, endDate } = values;
        const createDateStart = createDate && createDate[0] && createDate[0].format('YYYY-MM-DD');
        const createDateEnd = createDate && createDate[1] && createDate[1].format('YYYY-MM-DD');
        const endDateStart = endDate && endDate[0] && endDate[0].format('YYYY-MM-DD');
        const endDateEnd = endDate && endDate[1] && endDate[1].format('YYYY-MM-DD');
        result = { ...values, createDateStart, createDateEnd, endDateStart, endDateEnd };
        delete result.createDate;
        delete result.endDate;
      }
    });
    return result;
  };

  // 搜索
  handleSubmit = () => {
    this.setState({ pageNum: 1 }, this.fetchList);
  };

  // 重置
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchList();
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.fetchList,
    );
  };

  // 查询区域
  // qryRegions = () => {
  //   const { dispatch, userorgInfo } = this.props;
  //   dispatch({
  //     type: 'workOrder/qryAllLan',
  //     payload: {
  //       commonRegionId: userorgInfo.regionId,
  //     },
  //     success: svcCont => {
  //       const { data } = svcCont;
  //       this.setState({
  //         orgTree: data.map(v => ({ ...v, isLeaf: false })),
  //       });
  //     },
  //   });
  // };

  handleWorkOk = e => {
    const { selectedRows } = this.state;
    const { handleOk } = this.props;
    handleOk(selectedRows[0]);
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  render() {
    const { loading, form, contactStatus, visible, handleCancel } = this.props;
    const { getFieldDecorator } = form;
    const { data, pageInfo, camTypes, orgTree, selectedRowKeys } = this.state;

    const rowSelection = {
      type: 'radio',

      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const columns = this.columns.map(col => {
      if (!col.ellipsis) {
        return col;
      }
      return {
        ...col,
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      };
    });

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Modal
        title="活动名称选择"
        visible={visible}
        width="75%"
        onOk={this.handleWorkOk}
        onCancel={handleCancel}
      >
        <CommonFilter handleSubmit={this.handleSubmit} handleReset={this.resetForm}>
          <Form.Item label={formatMessage({ id: 'workOrder.extName', defaultMessage: '活动名称' })}>
            {getFieldDecorator('extName', {})(
              <Input
                size="small"
                placeholder={formatMessage({ id: 'common.form.input' })}
                onClick={this.showModal}
              />,
            )}
          </Form.Item>
        </CommonFilter>

        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          pagination={pagination}
          loading={loading}
          onChange={this.onChange}
          className="mt16"
          rowSelection={rowSelection}
        />
      </Modal>
    );
  }
}

export default WorkOrderModel;
