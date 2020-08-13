import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 15 },
  },
};
@Form.create()
@connect(({ rulesManage }) => ({
  showRuleModal: rulesManage.showRuleModal,
  currentPage: rulesManage.currentPage,
  currentPageSize: rulesManage.currentPageSize,
  operaType: rulesManage.operaType,
  visitedListItem: rulesManage.visitedListItem,
}))
class NewRulesModal extends Component {
  state = {
    loading: false,
  };

  // 处理规则弹窗
  handleRuleGroups = () => {
    const { operaType } = this.props;
    // 新增弹窗操作
    if (operaType === 'add') {
      this.addNewRuleGroups();
    }
    // 编辑弹窗操作
    if (operaType === 'edit') {
      this.updateRuleList();
    }
    // 查看弹窗操作
    if (operaType === 'check') {
      this.closeRuleGroups();
    }
  };

  // 更新规则组
  updateRuleList = async () => {
    const {
      dispatch,
      form: { getFieldValue },
      visitedListItem,
      getRuleListSource,
      currentPage,
      currentPageSize,
    } = this.props;
    const params = {
      groupId: visitedListItem.groupId,
      groupName: getFieldValue('title'),
      groupDesc: getFieldValue('desc'),
    };
    // 更新规则组数据
    await dispatch({
      type: 'rulesManage/updateRuleList',
      payload: params,
    });
    // 重新获取规则组数据
    await getRuleListSource(currentPage, currentPageSize);
    // 关闭弹窗
    this.closeRuleGroups();
  };

  // 新增规则组
  addNewRuleGroups = () => {
    const { dispatch, currentPage, currentPageSize, form } = this.props;
    // 对表单进行校验，校验通过才发起请求添加规则组
    form.validateFields(async (err, fieldsValue) => {
      if (!err) {
        this.setState({ loading: true });
        // 添加新规则
        const params = {
          groupName: fieldsValue.title,
          groupDesc: fieldsValue.desc,
        };
        await dispatch({
          type: 'rulesManage/addMccRulesGroup',
          payload: params,
        });
        // 重新获取数据
        await dispatch({
          type: 'rulesManage/getRuleLists',
          payload: {
            groupName: '',
            state: '',
            pageInfo: {
              pageNum: currentPage,
              pageSize: currentPageSize,
            },
          },
        });
        // 取消按钮loading状态
        this.setState({ loading: false });
        // 隐藏弹窗
        this.closeRuleGroups();
      }
    });
  };

  // 关闭弹窗
  closeRuleGroups = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/hiddenNewRulesModal',
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      showRuleModal,
      operaType,
      visitedListItem,
    } = this.props;
    const { loading } = this.state;
    // 规则组信息
    const modalInfo = {};
    if (operaType === 'add') {
      modalInfo.title = formatMessage({ id: 'rulesManage.rulesInfo.newRules' }, '新增规则组');
      modalInfo.readOnly = false;
    } else if (operaType === 'edit') {
      modalInfo.title = formatMessage({ id: 'rulesManage.rulesInfo.editRules' }, '编辑规则组');
      modalInfo.readOnly = false;
    } else {
      modalInfo.title = formatMessage({ id: 'rulesManage.rulesInfo.viewRules' }, '查看规则组');
      modalInfo.readOnly = true;
    }
    return (
      <Modal
        title={modalInfo.title}
        centered
        visible={showRuleModal}
        onOk={this.handleRuleGroups}
        onCancel={this.closeRuleGroups}
        className={styles.ruleModalForm}
        footer={[
          <Button
            key="submit"
            type="primary"
            size="small"
            loading={loading}
            onClick={this.handleRuleGroups}
          >
            {formatMessage({ id: 'rulesManage.rulesInfo.submit' }, '提交')}
          </Button>,
          <Button key="back" size="small" onClick={this.closeRuleGroups}>
            {formatMessage({ id: 'rulesManage.rulesInfo.back' }, '返回')}
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'rulesManage.rulesInfo.rulesName' }, '规则组名称')}
          >
            {getFieldDecorator('title', {
              initialValue: operaType !== 'add' ? visitedListItem.groupName : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'rulesManage.rulesInfo.pleEnter' }, '请输入'),
                },
                {
                  max: 60,
                  message: '输入最大长度为60',
                },
              ],
            })(<Input size="small" disabled={modalInfo.readOnly} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={formatMessage({ id: 'rulesManage.rulesInfo.rulesDesc' }, '规则组描述')}
            className={styles.ruleModalTextArea}
          >
            {getFieldDecorator('desc', {
              initialValue: operaType !== 'add' ? visitedListItem.groupDesc : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'rulesManage.rulesInfo.pleEnter' }, '请输入'),
                },
                {
                  max: 60,
                  message: '输入最大长度为240',
                },
              ],
            })(
              <TextArea
                size="small"
                placeholder={formatMessage({ id: 'rulesManage.rulesInfo.pleEnter' }, '请输入')}
                rows={3}
                disabled={modalInfo.readOnly}
              />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default NewRulesModal;
