import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Button } from 'antd';
import ModalEventTable from './ModalEventTable';

const mapStateToProps = ({ eventManageComm, configDetail, loading }) => ({
  // eventDetails: configDetail.eventDetails,
  itemDetail: eventManageComm.itemDetail,
  eventSrcSelectedRowKeys: configDetail.eventSrcSelectedRowKeys,
  submitLoading: loading.effects['configDetail/handleInsertEventSrc'],
});

function InputSrcModal(props) {
  const { itemDetail = {}, eventSrcSelectedRowKeys = [], submitLoading, dispatch } = props;

  // 处理输入属性详情表单显示形式
  function handleShowEventModal(type) {
    dispatch({
      type: 'configDetail/handleShowEventModal',
      payload: type,
    });
  }

  // 处理保存，新增事件
  async function handleInsertEventSrc() {
    if (eventSrcSelectedRowKeys.length === 0) return;

    const defaultParams = {
      data: [],
    };
    eventSrcSelectedRowKeys.forEach(item => {
      defaultParams.data.push({ eventId: itemDetail.id, inputId: item });
    });

    await dispatch({
      type: 'configDetail/handleInsertEventSrc',
      payload: defaultParams,
    });
    dispatch({
      // 强制更新列表
      type: 'configDetail/forceGetInputSrcList',
    });
  }

  return (
    <Modal
      visible
      width="844px"
      title="事件"
      onCancel={() => {
        handleShowEventModal(false);
      }}
      footer={
        <Fragment>
          <Button
            loading={submitLoading}
            size="small"
            type="primary"
            onClick={handleInsertEventSrc}
          >
            保存
          </Button>
          <Button size="small" type="default" onClick={() => handleShowEventModal(false)}>
            取消
          </Button>
        </Fragment>
      }
    >
      <ModalEventTable />
    </Modal>
  );
}

export default connect(mapStateToProps)(InputSrcModal);
