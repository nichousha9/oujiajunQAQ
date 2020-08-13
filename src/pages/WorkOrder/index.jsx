/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Select, Input, DatePicker, Tooltip, Modal } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import Ellipsis from '@/components/Ellipsis';
import CommonFilter from '@/components/CommonFilter';
import WorkOrderModel from './WorkOrderModel';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ workOrder, common, loading }) => ({
  workOrder,
  contactStatus: common.attrSpecCodeList.CONTACT_STATUS_CD,
  loading: loading.effects['workOrder/qryContactList'],
}))
@Form.create()
class WorkOrder extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'workOrder.extName' }), // '活动名称',
      dataIndex: 'extName',
      key: 'extName',
      ellipsis: true,
    },
    {
      title: formatMessage({ id: 'workOrder.custType' }), // ''客户类型',
      dataIndex: 'custType',
      key: 'custType',
    },
    // {
    //   title: formatMessage({ id: 'workOrder.custName' }), // ''集团名称',
    //   dataIndex: 'custName',
    //   key: 'custName',
    //   width: 170,
    //   ellipsis: true,
    // },
    // {
    //   title: formatMessage({ id: 'workOrder.memName' }), // ''成员名称',
    //   dataIndex: 'memName',
    //   key: 'memName',
    // },
    {
      title: '对象名称',
      dataIndex: 'objName',
      key: 'objName',
      ellipsis: true,
    },
    {
      title: '活动分类', // ''活动类别',
      dataIndex: 'camType',
      key: 'camType',
      render: (text, record) => {
        const { camTypes } = this.state;
        const camTypeName = camTypes.filter(item => item.busiCode === record.camType);
        return <span>{camTypeName.length === 0 ? text : camTypeName[0].busiName}</span>;
      },
    },
    {
      title: formatMessage({ id: 'workOrder.createDate' }), // ''派发时间',
      dataIndex: 'createDate',
      key: 'createDate',
      ellipsis: true,
      width: 150,
    },
    {
      title: '当前处理人', // ''所属客户经理',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: formatMessage({ id: 'workOrder.planEndDate' }), // ''到期时间',
      dataIndex: 'planEndDate',
      key: 'planEndDate',
      ellipsis: true,
      width: 150,
    },
    {
      title: formatMessage({ id: 'workOrder.workOrderStatus' }), // ''工单状态',
      dataIndex: 'statusCd',
      key: 'statusCd',
    },
    {
      title: formatMessage({ id: 'common.table.action' }), // '操作',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              this.goDetailPage(record);
            }}
          >
            {formatMessage({ id: 'common.table.action.detail' })}
          </a>
        );
      },
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
      visible: false,
      selectedRows: {},
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
    this.getSpecCode();
    this.qryCamType();
  }

  goDetailPage = record => {
    const { form, dispatch } = this.props;
    const formValue = form.getFieldsValue();
    const { data, pageNum, pageSize, pageInfo, camTypes } = this.state;
    const { subsId, campaignId } = record;

    router.push({
      pathname: '/workOrder/detail',
      query: {
        orderId: record.orderId,
        type: 'workOrder',
      },
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
      type: 'workOrder/qryContactList',
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
    const { selectedRows } = this.state;
    let result = {};
    validateFields((err, values) => {
      if (!err) {
        const { createDate, endDate, statusCd, campType, extName } = values;
        const createDateStart =
          createDate && createDate[0] && createDate[0].format('YYYY-MM-DD 00:00:00');
        const createDateEnd =
          createDate && createDate[1] && createDate[1].format('YYYY-MM-DD 23:59:59');
        const endDateStart = endDate && endDate[0] && endDate[0].format('YYYY-MM-DD 00:00:00');
        const endDateEnd = endDate && endDate[1] && endDate[1].format('YYYY-MM-DD 23:59:59');
        result = {
          statusCd,
          createDateStart,
          createDateEnd,
          endDateStart,
          endDateEnd,
          campType,
          extName,
        };
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
  qryRegions = () => {
    const { dispatch, userorgInfo } = this.props;
    dispatch({
      type: 'workOrder/qryAllLan',
      payload: {
        commonRegionId: userorgInfo.regionId,
      },
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          orgTree: data.map(v => ({ ...v, isLeaf: false })),
        });
      },
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = selectedRows => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ extName: selectedRows.extName });
    this.setState({
      visible: false,
      selectedRows,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { loading, form, contactStatus } = this.props;
    const { getFieldDecorator } = form;
    const { data, pageInfo, camTypes, orgTree, visible } = this.state;

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

    const showWOrk = {
      columns,
      visible,
      showModal: this.showModal,
      handleOk: this.handleOk,
      handleCancel: this.handleCancel,
    };

    return (
      <Fragment>
        <Card
          size="small"
          title={formatMessage({ id: 'workOrder.workOrderInfo', defaultMessage: '工单信息' })}
          className={styles.listWrapper}
        >
          <CommonFilter handleSubmit={this.handleSubmit} handleReset={this.resetForm}>
            <Form.Item
              label={formatMessage({ id: 'workOrder.extName', defaultMessage: '活动名称' })}
            >
              {getFieldDecorator('extName', {
                rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
              })(
                <Input
                  maxLength={21}
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  onClick={this.showModal}
                />,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'workOrder.createDate', defaultMessage: '派发时间' })}
            >
              {getFieldDecorator('createDate', {})(<RangePicker size="small" />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'workOrder.workOrderStatus', defaultMessage: '工单状态' })}
            >
              {getFieldDecorator('statusCd', {})(
                <Select
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.select' })}
                  allowClear
                >
                  {contactStatus &&
                    contactStatus.map(item => (
                      <Option key={item.attrValueCode} value={item.attrValueCode}>
                        {item.attrValueName}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="活动分类">
              {getFieldDecorator('campType', {})(
                <Select
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.select' })}
                  allowClear
                >
                  {camTypes &&
                    camTypes.map(item => (
                      <Option key={item.busiCode} value={item.busiCode}>
                        {item.busiName}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage({ id: 'workOrder.planEndDate', defaultMessage: '到期时间' })}
            >
              {getFieldDecorator('endDate', {})(<RangePicker size="small" />)}
            </Form.Item>

            {/* <Form.Item label={<Tooltip title="派发范围">派发范围</Tooltip>}>
              {getFieldDecorator('distributeRange', {
                // initialValue: distributeRange,
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择派发范围">
                  {orgTree &&
                    orgTree.map(item => {
                      return (
                        <Option key={item.commonRegionId} value={item.commonRegionId}>
                          {item.regionName}
                        </Option>
                      );
                    })}
                </Select>,
              )}
            </Form.Item> */}
          </CommonFilter>
          <Table
            dataSource={data}
            columns={columns}
            pagination={pagination}
            loading={loading}
            onChange={this.onChange}
            className="mt16"
          />
        </Card>

        {/* <Modal
          title="活动名称选择"
          visible={visible}
          width="75%"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Table
            rowKey="contactId"
            dataSource={data}
            columns={columns}
            pagination={pagination}
            loading={loading}
            onChange={this.onChange}
            className="mt16"
          />
        </Modal> */}

        {visible && <WorkOrderModel {...showWOrk} />}
      </Fragment>
    );
  }
}

export default WorkOrder;
