import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;

@Form.create()
@connect(({ user }) => ({
  userInfo: user.userInfo,
}))
class FlowSetting extends Component {
  state = {
    name: '',
    description: '',
  };

  componentDidMount = () => {
    const { id, dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'activityFlow/qryFlowChartInfoById',
        payload: {
          ID: id,
        },
      }).then(res => {
        if (res.topCont && res.topCont.resultCode == 0) {
          const {
            svcCont: { data = {} },
          } = res;
          this.setState({
            name: data.name,
            description: data.description,
          });
        }
      });
    }
  };

  handleOk = e => {
    e.preventDefault();
    const {
      form,
      campaignId,
      id,
      cancel,
      dispatch,
      userInfo,
      activityTabs = [],
      setActivityTabs,
      changeTabs,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (id) {
          // 编辑
          dispatch({
            type: 'activityFlow/modFlowChart',
            payload: {
              ...fieldsValue,
              campaignId,
              cpgId: campaignId,
              creatorId: userInfo.userInfo.userId,
              id,
            },
          }).then(res => {
            if (res && res.topCont && res.topCont.resultCode == 0) {
              const arr = [];
              activityTabs.forEach(item => {
                if (item.id === id) {
                  arr.push({
                    ...item,
                    ...fieldsValue,
                  });
                }
              });
              setActivityTabs(arr);
              message.success('操作成功');
              cancel();
            }
          });
        } else {
          // 新增
          dispatch({
            type: 'activityFlow/addFlowChart',
            payload: {
              ...fieldsValue,
              campaignId,
              cpgId: campaignId,
              creatorId: userInfo.userInfo.userId,
            },
          }).then(res => {
            if (res && res.topCont && res.topCont.resultCode == 0) {
              const {
                svcCont: { data },
              } = res;
              setActivityTabs([...activityTabs, data]);
              changeTabs(data.id);
              message.success('操作成功');
              cancel();
            }
          });
        }
      }
    });
  };

  render() {
    const { name, description } = this.state;
    const {
      form: { getFieldDecorator },
      cancel,
    } = this.props;
    return (
      <Modal title="流程配置" visible onOk={this.handleOk} onCancel={cancel}>
        <Form {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
          <Form.Item label="流程名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入流程名称' }],
              initialValue: name,
            })(<Input placeholder="流程名称" />)}
          </Form.Item>

          <Form.Item label="流程描述">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: '请输入流程描述' }],
              initialValue: description,
            })(<TextArea placeholder="流程描述" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default FlowSetting;
