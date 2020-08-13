import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, InputNumber, Select, message, Input, Button } from 'antd';
import { connect } from 'dva';
import RecoListModal from './RecoListModal';
import Iconfont from '@/components/Iconfont/index';
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ rulesManage }) => ({
  showChildRuleModal: rulesManage.showChildRuleModal,
  visitedListItem: rulesManage.visitedListItem,
  currentPage: rulesManage.currentPage,
  currentPageSize: rulesManage.currentPageSize,
  childRuleListCurPage: rulesManage.childRuleListCurPage,
  childRuleListCurPageSize: rulesManage.childRuleListCurPageSize,
  visitedChildListItem: rulesManage.visitedChildListItem,
  childOperaType: rulesManage.childOperaType,
  visitedListItemId: rulesManage.visitedListItemId,
  showRecoList: rulesManage.showRecoList,
  recoListItem: rulesManage.recoListItem,
}))
class NewChildRuleModal extends Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    const { form, childOperaType, visitedChildListItem } = this.props;
    // 初始化表单状态
    form.setFieldsValue({
      childTitle: childOperaType === 'add' ? '' : visitedChildListItem.rulesName,
      rcmdNum: childOperaType === 'add' ? '' : visitedChildListItem.rcmdNum,
      isDefault: childOperaType === 'add' ? '00' : visitedChildListItem.isDefault,
    });
  }

  // 处理子规则弹窗
  handleChildRuleGroups = () => {
    const { childOperaType } = this.props;
    if (childOperaType === 'add') {
      this.newChildRuleGroups();
    } else if (childOperaType === 'edit') {
      this.editChildRuleGroup();
    }
  };

  // 获取表单填写数据
  getFormData = () => {
    const {
      form: { getFieldValue },
      childOperaType,
      visitedChildListItem,
      visitedListItemId,
      recoListItem,
    } = this.props;
    const params = {
      groupId: visitedListItemId.toString(),
      rulesId: recoListItem.rulesId,
      rcmdNum: getFieldValue('rcmdNum').toString(),
      isDefault: getFieldValue('isDefault'),
      // defaultNum: getFieldValue('defaultNum').toString(),
    };
    if (childOperaType === 'edit') {
      params.relId = visitedChildListItem.relId;
    }
    return params;
  };

  // 编辑子规则
  editChildRuleGroup = async () => {
    const {
      dispatch,
      getChildRuleSource,
      childRuleListCurPage,
      childRuleListCurPageSize,
      form,
    } = this.props;
    form.validateFields(async err => {
      if (!err) {
        const params = await this.getFormData();
        await dispatch({
          type: 'rulesManage/updateChildRuleList',
          payload: params,
        });
        // 重新获取子规则数据
        await getChildRuleSource(childRuleListCurPage, childRuleListCurPageSize);
        // 关闭弹窗
        this.hiddenChildRuleGroups();
      }
    });
  };

  // 新增子规则
  newChildRuleGroups = async () => {
    const { dispatch, getChildRuleSource, childRuleListCurPageSize, form } = this.props;
    form.validateFields(async err => {
      if (!err) {
        this.setState({ loading: true });
        const params = this.getFormData();
        await dispatch({
          type: 'rulesManage/addMccRulesGroupRel',
          payload: params,
        });
        // 重新获取子规则数据
        getChildRuleSource(1, childRuleListCurPageSize);
        dispatch({
          type: 'rulesManage/changeChildRuleListCurPage',
          payload: 1,
        });
        this.setState({ loading: false });
        // 关闭弹窗
        this.hiddenChildRuleGroups();
      }
    });
  };

  // 隐藏子规则
  hiddenChildRuleGroups = () => {
    // const { dispatch, childOperaType } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/hideChildRuleModal',
    });
  };

  // 显示推荐规则列表
  showRecoList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/showRecoLists',
    });
  };

  // 推荐规则列表弹窗点击返回
  hiddenRecoList = () => {
    const { dispatch } = this.props;
    // 关闭弹窗
    dispatch({
      type: 'rulesManage/hiddenRecoLists',
    });
    // 把选择的数据清空
    dispatch({
      type: 'rulesManage/changeRecoListItem',
      payload: [],
    });
  };

  // 推荐规则列表弹窗点击选择按钮
  chooseRecoItem = async () => {
    const { form, recoListItem, dispatch } = this.props;
    const ifExit = await this.checkClickItemExit();
    if (ifExit) {
      // 已经存在当前选择项
      message.error('当前项已经存在，请重新选择');
    } else {
      // 更新表单规则名称
      form.setFieldsValue({
        childTitle: recoListItem.rulesName,
      });
      // 关闭弹窗
      dispatch({
        type: 'rulesManage/hiddenRecoLists',
      });
    }
  };

  // 检查当前项是否已经存在
  checkClickItemExit = async () => {
    // 获取子规则列表数据
    let result;
    const { dispatch, visitedListItemId, recoListItem, currentPage, currentPageSize } = this.props;
    // 进行数据获取(还没缓存)
    await dispatch({
      type: 'rulesManage/checkClickItemExit',
      payload: {
        groupId: visitedListItemId,
        pageInfo: {
          pageNum: currentPage,
          pageSize: currentPageSize,
        },
        rulesId: recoListItem.rulesId,
      },
    }).then(res => {
      if (res && res.svcCont && res.svcCont.data) {
        if (res.svcCont.data.length > 0) {
          result = true;
        } else {
          result = false;
        }
      }
    });
    return result;
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const {
      form: { getFieldDecorator },
      showChildRuleModal,
      visitedChildListItem,
      childOperaType,
    } = this.props;
    const { loading } = this.state;

    // 子规则组信息
    const childRuleModalInfo = {};
    if (childOperaType === 'add') {
      childRuleModalInfo.title = formatMessage(
        { id: 'rulesManage.rulesInfo.newChildRule' },
        '新增子规则',
      );
      childRuleModalInfo.readOnly = false;
    } else if (childOperaType === 'edit') {
      childRuleModalInfo.title = formatMessage(
        { id: 'rulesManage.rulesInfo.editChildRule' },
        '编辑子规则',
      );
      childRuleModalInfo.readOnly = false;
    } else {
      childRuleModalInfo.title = formatMessage(
        { id: 'rulesManage.rulesInfo.viewChildRule' },
        '查看子规则',
      );
      childRuleModalInfo.readOnly = true;
    }

    return (
      <React.Fragment>
        <Modal
          title={childRuleModalInfo.title}
          centered
          visible={showChildRuleModal}
          onCancel={this.hiddenChildRuleGroups}
          footer={[
            <Button
              size="small"
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleChildRuleGroups}
              disabled={childRuleModalInfo.readOnly}
            >
              {formatMessage({ id: 'rulesManage.rulesInfo.submit' }, '提交')}
            </Button>,
            <Button size="small" key="back" onClick={this.hiddenChildRuleGroups}>
              {formatMessage({ id: 'rulesManage.rulesInfo.back' }, '返回')}
            </Button>,
          ]}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'rulesManage.rulesInfo.recoRuleName' }, '推荐规则名称')}
            >
              {getFieldDecorator('childTitle', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'rulesManage.rulesInfo.chooseRecoName' },
                      '请选择推荐规则名称',
                    ),
                  },
                ],
              })(
                <Input
                  size="small"
                  readOnly
                  suffix={
                    !childRuleModalInfo.readOnly ? (
                      <Iconfont type="iconcopyx" onClick={this.showRecoList} />
                    ) : null
                  }
                  disabled={childRuleModalInfo.readOnly}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>{formatMessage({ id: 'rulesManage.rulesInfo.recoCount' }, '推荐个数')}</span>
              }
            >
              {getFieldDecorator('rcmdNum', {
                initialValue: childOperaType !== 'add' ? visitedChildListItem.rcmdNum : '',
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'rulesManage.rulesInfo.writeRecotNum' },
                      '请填写推荐个数',
                    ),
                  },
                ],
              })(
                <InputNumber
                  size="small"
                  min={0}
                  max={100}
                  step={1}
                  style={{ width: '100%' }}
                  disabled={childRuleModalInfo.readOnly}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={formatMessage({ id: 'rulesManage.rulesInfo.ifDefault' }, '是否默认')}
            >
              {getFieldDecorator('isDefault', {
                initialValue: childOperaType !== 'add' ? visitedChildListItem.isDefault : '00',
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'rulesManage.rulesInfo.chooseDefaultRule' },
                      '请选择默认规则',
                    ),
                  },
                ],
              })(
                <Select
                  size="small"
                  style={{ width: '100%' }}
                  disabled={childRuleModalInfo.readOnly}
                >
                  <Option value="01">
                    {formatMessage({ id: 'rulesManage.rulesInfo.Y' }, '是')}
                  </Option>
                  <Option value="00">
                    {formatMessage({ id: 'rulesManage.rulesInfo.N' }, '否')}
                  </Option>
                </Select>,
              )}
            </FormItem>
          </Form>
        </Modal>
        <RecoListModal chooseRecoItem={this.chooseRecoItem} hiddenRecoList={this.hiddenRecoList} />
      </React.Fragment>
    );
  }
}

export default NewChildRuleModal;
