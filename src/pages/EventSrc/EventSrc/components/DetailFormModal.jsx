import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import DetailForm from '../../components/DetailForm';

const mapStateToProps = ({ eventSrcComm }) => ({
  isShowDetailForm: eventSrcComm.isShowDetailForm,
});

function DetailFormModal(props) {
  const { isShowDetailForm, dispatch } = props;

  // 详情表单显示类型
  const formType = {
    add: {
      modalTitle: '新建事件',
    },
    edit: {
      modalTitle: '编辑事件',
    },
  };

  // 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly / null)
  function showDetailForm(type = 'readonly', item = {}) {
    dispatch({
      type: 'eventSrcComm/showDetailForm',
      payload: {
        type,
        item,
      },
    });
  }

  // 关闭 Modal
  function handleCancel() {
    showDetailForm();
  }

  return (
    <Modal
      title={formType[isShowDetailForm].modalTitle}
      width="844px"
      visible={isShowDetailForm}
      onCancel={handleCancel}
      footer={null}
    >
      <DetailForm />
    </Modal>
  );
}

export default connect(mapStateToProps)(DetailFormModal);
