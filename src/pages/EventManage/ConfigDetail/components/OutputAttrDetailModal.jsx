import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import OutputAttrDetail from './OutputAttrDetail';

const mapStateToProps = ({ eventManageComm, configDetail, loading }) => ({
  // eventDetails: configDetail.eventDetails,
  itemDetail: eventManageComm.itemDetail,
  eventSrcSelectedRowKeys: configDetail.eventSrcSelectedRowKeys,
  submitLoading: loading.effects['configDetail/handleInsertEventSrc'],
});

function OutputAttrDetailModal(props) {
  const { dispatch } = props;

  // 处理输出属性详情表单显示形式
  function handleShowOutputAtrrForm(type) {
    dispatch({
      type: 'configDetail/handleShowOutputAtrrForm',
      payload: type,
    });
  }

  return (
    <Modal
      visible
      width="844px"
      title="输出属性"
      footer={null}
      onCancel={() => {
        handleShowOutputAtrrForm(false);
      }}
    >
      <OutputAttrDetail />
    </Modal>
  );
}

export default connect(mapStateToProps)(OutputAttrDetailModal);
