/* eslint-disable no-console */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Divider, message, Form, Input, Select } from 'antd';
import Link from 'umi/link';
import CommonFilter from '@/components/CommonFilter';
import Ellipsis from '@/components/Ellipsis';
const { Option } = Select;
@connect(({ activityConfigModel, loading }) => ({
  activityConfigModel,
  loading: loading.effects['activityConfigModel/qryCamTempList'],
}))
@Form.create()
class ActivityConfigModel extends React.Component {
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
    {
      title: '模板状态',
      dataIndex: 'campaignState',
      key: 'campaignState',
      render: text => {
        return <span>{text === '00A' ? '启用' : '停用'}</span>;
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            {record.campaignState === '00X' ? (
              <a onClick={() => this.updataActivityState(record.id, '00A')}>启用</a>
            ) : (
              <a onClick={() => this.updataActivityState(record.id, '00X')}>停用</a>
            )}
            <Divider type="vertical" />

            <Link
              to={`/activityConfigManage/activityFlow?id=${record.id}&isTemp=Y&tempState=00A&tempType=edit`}
            >
              编辑
            </Link>
            <Divider type="vertical" />
            <a onClick={() => this.updataActivityState(record.id, 'Deleted')}>删除</a>
            <Divider type="vertical" />
            <Link
              to={`/activityConfigManage/activityFlow?id=${record.id}&isTemp=Y&tempState=00X&tempType=edit`}
            >
              详情
            </Link>
          </div>
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
      camTypes: [],
    };
  }

  componentDidMount() {
    this.fetchList();
    this.qryCamType();
  }

  // 获取数据
  fetchList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    const otherPamams = this.getForm();
    dispatch({
      type: 'activityConfigModel/qryCamTempList',
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
      type: 'activityConfigModel/qryCamBusiTypeTree',
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

  updataActivityState = (id, activityState) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityConfigModel/updateCampaignState',
      payload: {
        id,
        campaignState: activityState,
      },
      callback: res => {
        if (res && res.topCont && res.topCont.resultCode === 0) {
          message.success(res.topCont.remark);
          this.fetchList();
        } else {
          message.error(res.topCont.remark);
        }
      },
    });
  };

  render() {
    const { loading, form } = this.props;

    const { data, pageInfo, camTypes } = this.state;
    const { getFieldDecorator } = form;
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
      <Fragment>
        <Card size="small" title="活动配置模板管理">
          <CommonFilter handleSubmit={this.handleSubmit} handleReset={this.resetForm}>
            <Form.Item label="模板名称">
              {getFieldDecorator('tempName', {
                rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
              })(
                <Input size="small" placeholder="请输入" onClick={this.showModal} maxLength={21} />,
              )}
            </Form.Item>
            <Form.Item label="模板分类">
              {getFieldDecorator('busiType', {})(
                <Select size="small" placeholder="请选择" allowClear>
                  {camTypes &&
                    camTypes.map(item => (
                      <Option key={item.busiCode} value={item.busiCode}>
                        {item.busiName}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="模板状态">
              {getFieldDecorator('campaignState', {})(
                <Select size="small" placeholder="请选择" allowClear>
                  <Option key="00A" value="00A">
                    启用
                  </Option>
                  <Option key="00X" value="00X">
                    停用
                  </Option>
                </Select>,
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
          />
        </Card>
      </Fragment>
    );
  }
}

export default ActivityConfigModel;
