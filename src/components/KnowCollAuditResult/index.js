import React from 'react';
import { Modal,Button } from 'antd';
import {formatDatetime} from "../../utils/utils";
import {knowCollectStatusClass} from "../../utils/resource";
import styles from './index.less';

const KnowCollAuditResultModal = ({editItem={}, onCancel, visible})=>{
  const { subUser ={},status,auditeInfo={}} = editItem;
  const arr = knowCollectStatusClass[status] || [];
  const { auditorUser = {} } = auditeInfo;
  return (
    <Modal
      width="700px"
      maskClosable={false}
      title="审核结果"
      onCancel={onCancel}
      footer={[ <Button type="primary" onClick={()=>{if(onCancel) onCancel()}}>确定</Button>]}
      visible={visible}
    >
      <div className={styles.resultContent}>
        <div><div span="4">问题：</div><div dangerouslySetInnerHTML={{__html: editItem.question}} /></div>
        <div><div span="4">提交人：</div><div>{(subUser || {}).nickname || '_'}</div></div>
        <div><div span="4">审核人：</div><div>{(auditorUser || {}).nickname || '_'}</div></div>
        <div><div span="4">审核时间：</div><div>{formatDatetime(auditeInfo.auditeTime)}</div></div>
        <div><div span="4">审核结果：</div><div>{arr[0]}</div></div>
        <div><div span="4">审核意见：</div><div>{(auditeInfo||{}).comment}</div></div>
        <div><div span="4">答案：</div><div dangerouslySetInnerHTML={{__html: editItem.content}} /></div>
      </div>
    </Modal>)
}
export default KnowCollAuditResultModal;
