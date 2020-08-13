import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({ sceneDialogSetting, dataDic }) => ({ sceneDialogSetting, dataDic }))
@Form.create()
export default class SettingReplayModal extends React.PureComponent {
  state = {
    editItem: this.props.editItem,
  };
  componentDidMount() {
    const { dispatch, editItem, sceneId } = this.props;
    if (!!editItem.isSet && !!editItem.id) {
      dispatch({
        type: 'sceneDialogSetting/fetchReplyDetail',
        payload: { charId: editItem.id, sceneId },
      }).then((res) => {
        const { sceneChat = {}, sceneAnswer = {} } = res;
        if (sceneChat.id === editItem.id) {
          this.setState({
            editItem: {
              ...editItem,
              replyId: sceneAnswer.id,
              name: sceneChat.name,
              reply: sceneAnswer.reply,
            },
          });
        }
      });
    }
  }

  // 显示提示语的函数
  handleShow = (res) => {
    const { closeModal } = this.props;
    if (res && res.status === 'OK') {
      closeModal();
      message.success('操作成功');
    }
  };

  handleOK = () => {
    const {
      onHandleOk,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { sceneId } = this.props;
      const { editItem = {} } = this.state;
      const obj = {
        charName: values.name,
        sceneId,
        type: 1,
        reply: values.reply,
      };
      let patch = 'sceneDialogSetting/fetchReplySetting';
      if (editItem.isSet) {
        obj.charId = editItem.id;
        obj.id = editItem.replyId;
        patch = 'sceneDialogSetting/updateReplySetting';
      }

      if (onHandleOk) onHandleOk(obj, this.handleShow, patch);
    });
  };

  render() {
    const {
      visible,
      closeModal,
      form: { getFieldDecorator },
    } = this.props;
    const { editItem = {} } = this.state;
    return (
      <Modal
        width="700px"
        visible={visible}
        onCancel={closeModal}
        onOk={this.handleOK}
        title={editItem.name ? '修改回复节点设置' : '新增回复节点'}
      >
        <Form>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  message: '请输入名称！',
                  required: true,
                },
              ],
              initialValue: editItem.name || '',
            })(<Input placeholder="名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="回复内容">
            {getFieldDecorator('reply', {
              rules: [
                {
                  message: '请输入回复内容！',
                  required: true,
                },
              ],
              initialValue: editItem.reply || '',
            })(<TextArea rows={4} placeholder="请输入回复内容" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
