/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Select, Input, DatePicker, Tooltip, Modal } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import Ellipsis from '@/components/Ellipsis';
import CommonFilter from '@/components/CommonFilter';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ marketingActivityList, loading }) => ({
  marketingActivityList,

  loading: loading.effects['marketingActivityList/qryCamTempList'],
}))
@Form.create()
class SelectactivityConfigModel extends React.Component {
  columns = [
    {
      title: '模板名称',
      dataIndex: 'tempName',
      key: 'tempName',
    },
    {
      title: '模板类别',
      dataIndex: 'busiName',
      key: 'busiName',
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
    this.fetchList();
  }

  // 获取数据
  fetchList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const otherPamams = this.getForm();
    dispatch({
      type: 'marketingActivityList/qryCamTempList',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
        ...otherPamams,
        campaignState: '00A',
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

  getForm = () => {
    const { form } = this.props;
    const { validateFields } = form;
    let result = {};
    validateFields((err, values) => {
      if (!err) {
        const { tempName, busiType, campaignState } = values;
        result = {
          tempName,
          busiType,
          campaignState,
        };
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
        title="通过模板配置活动"
        visible={visible}
        width="50%"
        onOk={this.handleWorkOk}
        onCancel={handleCancel}
      >
        <CommonFilter span={12} handleSubmit={this.handleSubmit} handleReset={this.resetForm}>
          <Form.Item label="模板名称" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            {getFieldDecorator('tempName', {})(
              <Input size="small" placeholder="请输入模板名称" style={{ marginLeft: 15 }} />,
            )}
          </Form.Item>
        </CommonFilter>

        <Table
          rowKey="contactId"
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

export default SelectactivityConfigModel;
