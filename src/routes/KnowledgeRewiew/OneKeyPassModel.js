import React, { Component } from 'react';
import { message, Modal } from 'antd';
import { connect } from 'dva';

@connect(({ knowledgeGallery, loading }) => ({
  knowledgeGallery,
  loading: loading.models.knowledgeGallery,
}))
export default class OneKeyPassModel extends Component {
  componentDidMount() {
    this.getQueList();
  }

  getQueList = () => {
    const { dispatch, oneKeyObj } = this.props;
    dispatch({
      type: 'knowledgeGallery/qryInfluenceCount',
      payload: {
        status: '00L',
        ...oneKeyObj,
      },
    });
  };

  handleOk = () => {
    const { dispatch, onCancel, oneKeyObj } = this.props;
    dispatch({
      type: 'knowledgeGallery/passQuestionsAll',
      payload: {
        status: '00L',
        ...oneKeyObj,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('一键审核成功');
      } else {
        message.error('一键审核失败');
      }
      onCancel();
    });
  };

  render() {
    const {
      visible,
      onCancel,
      knowledgeGallery: { influenceCount = 0 },
    } = this.props;

    return (
      <Modal
        title="请选择是否一键审核通过"
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        centered
      >
        <p>一键审核所影响的知识点为{influenceCount}条</p>
      </Modal>
    );
  }
}
