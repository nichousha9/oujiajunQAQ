import React from 'react';
import { Modal, Button , Table } from 'antd';
import styles from './index.less'

export default class ImportResModal extends React.Component{
  render (){
    const { onOk,columns,visible,importResData: { addList = [], updateList= [], failList = []} } = this.props;
    return(
      <Modal
        visible={visible}
        title="批量导入"
        onOk={this.handleOk}
        onCancel={onOk}
        bodyStyle={{padding:0}}
        footer={[
          <Button key="submit" type="primary"  onClick={onOk}>
            关闭
          </Button>,
        ]}
      >
        <div className={styles.importResModal}>
          <div className={styles.title}>
            <div>成功：<span className={styles.ok}>{addList.length}</span>条</div>
            <div>失败：<span className={styles.fail}>{failList.length}</span>条</div>
            <div>更新：<span className={styles.update}>{updateList.length}</span>条</div>
          </div>
          <Table columns={columns} pagination={{pageSize: 5}}dataSource={failList} />
        </div>
      </Modal>
    )
  }
}
