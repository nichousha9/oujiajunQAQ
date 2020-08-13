import { Form, Input, Button, Radio, Cascader } from 'antd';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
import CustomSelect from '@/components/CustomSelect';
import UserChoose from './UserChoose';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};

@connect(({ common, loading }) => ({
  flowchartDealUnits: common.attrSpecCodeList.FLOWCHART_DEAL_UNIT,
  loading:
    loading.effects['approveDetail/addApprovalFlowchart'] ||
    loading.effects['approveDetail/modApprovalFlowchart'],
}))
class DetailForm extends React.Component {
  state = {
    info: {}, // 属性数据
    orgTree: [], // 组织数据
    userChooseModal: false, // 选择审批人弹窗
    choosedApprovalUser: [], // 已选审核人
  };

  componentDidMount() {
    this.qryAttrValueByCode();
    this.qryZqythOrganization();
    this.fetchDetail();
  }

  componentDidUpdate(prevProps) {
    const { currentNode, form } = this.props;
    if (currentNode !== prevProps.currentNode) {
      form.resetFields();
      this.fetchDetail();
    }
  }

  // 适用类型
  qryAttrValueByCode = () => {
    const { dispatch, flowchartDealUnits } = this.props;

    if (!flowchartDealUnits || flowchartDealUnits.length === 0) {
      dispatch({
        type: 'common/qryAttrValueByCode',
        payload: {
          attrSpecCode: 'FLOWCHART_DEAL_UNIT',
        },
      });
    }
  };

  // 查询详情
  fetchDetail = () => {
    const { dispatch, currentNode } = this.props;
    let dispatchType = '';
    // 连接线
    if (currentNode.type === 'connect') {
      dispatchType = 'approveDetail/qryApprovalLine';
    } else {
      dispatchType = 'approveDetail/qryApprovalProcess';
    }
    if (dispatchType && currentNode.processId) {
      dispatch({
        type: dispatchType,
        payload: {
          id: currentNode.processId,
        },
        success: svcCont => {
          const { data = {} } = svcCont;
          const { approvalAccounts = [] } = data;
          this.setState({
            info: data,
            choosedApprovalUser: approvalAccounts.map(item => ({
              mid: `${item.orgId}${item.sysRoleId}${item.sysUserId}`,
              ...item,
            })),
          });
        },
      });
    } else {
      this.clearInfo();
    }
  };

  // 组织数据
  qryZqythOrganization = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveDetail/qryZqythOrganization',
      payload: {},
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          orgTree: data,
        });
      },
    });
  };

  clearInfo = () => {
    this.setState({
      info: {}, // 属性数据
      userChooseModal: false, // 选择审批人弹窗
      choosedApprovalUser: [], // 已选审核人
    });
  };

  // 选择审核人
  addApprovalUser = () => {
    this.setState({ userChooseModal: true });
  };

  // 取消选择审核人弹窗
  hideUserChooseModal = () => {
    this.setState({ userChooseModal: false });
  };

  // 选择审核人成功
  chooseUser = selecteds => {
    this.setState({
      choosedApprovalUser: selecteds,
      userChooseModal: false,
    });
  };

  // 删除已选审核人
  onClose = id => {
    const { disabled } = this.props;
    // 判断是否为查看不可编辑状态，是则阻止删除审批人的操作
    if (disabled) return;
    const { choosedApprovalUser } = this.state;
    const newArr = choosedApprovalUser.filter(item => item.mid != id);
    this.setState({ choosedApprovalUser: newArr });
  };

  // 节点属性编辑dom
  renderNodeDetail = () => {
    const { form, disabled } = this.props;
    const { getFieldDecorator } = form;
    const { info, choosedApprovalUser } = this.state;

    const customSelectProps = {
      size: 'small',
      mode: 'tags',
      dataSource: choosedApprovalUser.map(item => {
        return {
          label: item.staffName,
          value: item.mid,
        };
      }),
      onClose: this.onClose,
      otherNode: disabled ? null : <a onClick={this.addApprovalUser}>添加</a>,
    };
    return (
      <Fragment>
        {/* 环节名称 */}
        <Form.Item
          label={formatMessage({ id: 'approve.detail.nodeName', defaultMessage: '环节名称' })}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.input' }) }],
            initialValue: info.name,
          })(
            <Input
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
              disabled={disabled}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'approve.detail.nodeCode', defaultMessage: '环节编码' })}
        >
          {getFieldDecorator('code', {
            initialValue: info.code,
          })(
            <Input
              size="small"
              placeholder={formatMessage({ id: 'approve.detail.systemAuto' })}
              disabled
            />,
          )}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'approve.detail.nodeDetail', defaultMessage: '环节详情' })}
        >
          {getFieldDecorator('processInfo', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.input' }) }],
            initialValue: info.processInfo,
          })(
            <Input
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
              disabled={disabled}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'approve.detail.approvalAccount', defaultMessage: '审批人' })}
        >
          {getFieldDecorator('approvalAccounts', {
            initialValue: choosedApprovalUser,
            rules: [{ required: true, message: formatMessage({ id: 'common.form.select' }) }],
          })(<CustomSelect {...customSelectProps} readOnly={disabled} />)}
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'approve.detail.collaborativeType',
            defaultMessage: '协同类型',
          })}
        >
          {getFieldDecorator('collaborativeType', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.input' }) }],
            initialValue: info.collaborativeType,
          })(
            <Radio.Group disabled={disabled}>
              <Radio value="1000">
                {formatMessage({
                  id: 'approve.detail.collaborativeType.exclusion',
                  defaultMessage: '互斥',
                })}
              </Radio>
              <Radio value="2000">
                {formatMessage({
                  id: 'approve.detail.collaborativeType.synergy',
                  defaultMessage: '协同',
                })}
              </Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        {/* <Form.Item
          label={formatMessage({ id: 'approve.detail.duration', defaultMessage: '处理时长' })}
        >
          <Row gutter={8}>
            <Col span={10}>
              {getFieldDecorator('duration', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.input' }) }],
                initialValue: info.duration,
              })(
                <InputNumber
                  min={0}
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  disabled={disabled}
                />,
              )}
            </Col>
            <Col span={14}>
              {getFieldDecorator('dealUnit', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.select' }) }],
                initialValue: info.dealUnit,
              })(
                <Select size="small" disabled={disabled}>
                  {flowchartDealUnits &&
                    flowchartDealUnits.map(item => (
                      <Select.Option
                        key={item.attrValueCode}
                        value={item.attrValueCode}
                        disabled={disabled}
                      >
                        {item.attrValueName}
                      </Select.Option>
                    ))}
                </Select>,
              )}
            </Col>
          </Row>
        </Form.Item> */}
        <Form.Item
          label={formatMessage({ id: 'approve.detail.dealInfo', defaultMessage: '处理详情' })}
        >
          {getFieldDecorator('dealInfo', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.input' }) }],
            initialValue: info.dealInfo,
          })(
            <Input
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
              disabled={disabled}
            />,
          )}
        </Form.Item>
      </Fragment>
    );
  };

  // 处理初始机构
  getInitialOrganization = (data, fresult = []) => {
    let result = [...fresult];
    if (data.id) {
      result.push(data.id);
    }
    if (data.organization) {
      result = this.getInitialOrganization(data.organization, result);
    }
    return result;
  };

  // 申请节点属性编辑dom
  renderApplyNodeDetail = () => {
    const { form, disabled } = this.props;
    const { getFieldDecorator } = form;
    const { orgTree, info } = this.state;
    const organization = info.organization ? this.getInitialOrganization(info.organization) : [];
    return (
      <Fragment>
        <Form.Item
          label={formatMessage({ id: 'approve.detail.applyName', defaultMessage: '申请名称' })}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.input' }) }],
            initialValue: info.name,
          })(
            <Input
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
              disabled={disabled}
            />,
          )}
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'approve.detail.nodeCode', defaultMessage: '环节编码' })}
        >
          {getFieldDecorator('code', {
            initialValue: info.code,
          })(
            <Input
              size="small"
              placeholder={formatMessage({ id: 'approve.detail.systemAuto' })}
              disabled
            />,
          )}
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'approve.detail.activityOrg',
            defaultMessage: '活动适用组织',
          })}
        >
          {getFieldDecorator('orgId', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.input' }) }],
            initialValue: organization,
          })(
            <Cascader
              disabled={disabled}
              size="small"
              options={orgTree}
              fieldNames={{ label: 'orgName', value: 'orgId', children: 'children' }}
            />,
          )}
        </Form.Item>
      </Fragment>
    );
  };

  // 连接属性编辑
  renderConnectDetail = () => {
    const { form } = this.props;
    const { getFieldDecorator, disabled } = form;
    const { info } = this.state;
    return (
      <Form.Item
        label={formatMessage({ id: 'approve.detail.routeAttribute', defaultMessage: '路由属性' })}
      >
        {getFieldDecorator('routeAttribute', {
          initialValue: info.routeAttribute,
        })(
          <Radio.Group disabled={disabled}>
            <Radio value="Y">{formatMessage({ id: 'common.text.yes' })}</Radio>
            <Radio value="N">{formatMessage({ id: 'common.text.no' })}</Radio>
          </Radio.Group>,
        )}
      </Form.Item>
    );
  };

  // 取消
  cancel = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 保存
  handleSubmit = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, dispatch, flowchartId, currentNode, modifyNodeList } = this.props;
    const { choosedApprovalUser } = this.state;
    const { type } = currentNode;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { name } = values;
      const myValues = {
        id: currentNode.processId,
        flowchartId,
        approvalType: currentNode.type,
        ...values,
      };
      if (type === 'processEvent') {
        myValues.approvalAccounts = choosedApprovalUser.map(item => ({
          orgId: item.orgId,
          sysRoleId: item.sysRoleId,
          sysUserId: item.sysUserId,
        }));
      } else {
        myValues.orgId =
          values.orgId && values.orgId.length && values.orgId[values.orgId.length - 1];
      }
      dispatch({
        type: currentNode.processId
          ? 'approveDetail/modApprovalProcess'
          : 'approveDetail/addApprovalProcess',
        payload: myValues,
        success: svcCont => {
          const { data } = svcCont;
          const { id: processId } = data;
          // 更新节点名称
          modifyNodeList({
            ...currentNode,
            name,
            processId,
          });
        },
      });
    });
  };

  // 连线保存
  handleSubmitConnect = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const { form, dispatch, flowchartId, currentNode, modifyConnect, getConnectFT } = this.props;
    const { node } = currentNode;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { routeAttribute } = values;
      const { fromCompId, toCompId } = getConnectFT(node);
      dispatch({
        type: currentNode.processId
          ? 'approveDetail/modApprovalLine'
          : 'approveDetail/addApprovalLine',
        payload: {
          id: currentNode.processId,
          flowchartId,
          fromId: fromCompId,
          toId: toCompId,
          routeAttribute,
        },
        success: svcCont => {
          const { data } = svcCont;
          const { id } = data;
          modifyConnect(routeAttribute, id);
        },
      });
    });
  };

  render() {
    const { currentNode, disabled, loading } = this.props;
    const { type } = currentNode;
    const { userChooseModal, choosedApprovalUser } = this.state;

    if (type || type === 'processEvent' || type === 'applyEvent' || type === 'connect') {
      return (
        <>
          <Form {...formItemLayout} className="more-small-form">
            {type === 'processEvent' && this.renderNodeDetail()}
            {type === 'applyEvent' && this.renderApplyNodeDetail()}
            {type === 'connect' && this.renderConnectDetail()}
            <div className={styles.detailFormFoot}>
              {!disabled && (
                <Button
                  type="primary"
                  size="small"
                  ghost
                  className="mr16"
                  loading={loading}
                  onClick={type === 'connect' ? this.handleSubmitConnect : this.handleSubmit}
                >
                  {formatMessage({ id: 'common.btn.save' })}
                </Button>
              )}
              <Button size="small" onClick={this.cancel}>
                {formatMessage({ id: 'common.btn.cancel' })}
              </Button>
            </div>
          </Form>
          {userChooseModal && (
            <UserChoose
              selectedRows={choosedApprovalUser}
              onOk={this.chooseUser}
              onCancel={this.hideUserChooseModal}
            />
          )}
        </>
      );
    }
    return null;
  }
}

export default Form.create()(DetailForm);
