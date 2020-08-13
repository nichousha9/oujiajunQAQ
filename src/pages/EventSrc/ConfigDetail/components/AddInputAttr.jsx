import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import InputAttrDetail from './InputAttrDetail';

const mapStateToProps = ({ srcConfigDetail }) => ({
  isShowInputAttrForm: srcConfigDetail.isShowInputAttrForm,
});

function AddInputAttr(props) {
  const { dispatch } = props;

  // 处理输入属性详情表单显示形式
  function handleShowInputAtrrForm(type) {
    dispatch({
      type: 'srcConfigDetail/handleShowInputAtrrForm',
      payload: type,
    });
  }

  return (
    <Modal
      visible
      width="844px"
      title="新增输入属性"
      onCancel={() => {
        handleShowInputAtrrForm(null);
      }}
      footer={null}
    >
      <InputAttrDetail />
    </Modal>
  );
}

export default connect(mapStateToProps)(AddInputAttr);
