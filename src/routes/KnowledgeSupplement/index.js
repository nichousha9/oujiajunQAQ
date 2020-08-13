/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Table, message, Tabs, Button, Popover, Upload, Progress, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import DetailModal from './detailModal';
import AddModal from './addModal';
import FileModal from './fileModal';

const { TabPane } = Tabs;

@connect(({ knowledgeSupplement }) => ({
  knowledgeSupplement,
}))
export default class Knowledgebase extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    pageNum2: 1,
    pageSize2: 10,
    pageNum3: 1,
    pageSize3: 10,
    pageNum4: 1,
    pageSize4: 10,
    detailVisible: false,
    selectedRows1: [],
    selectedRowKeys1: [],
    selectedRows2: [],
    selectedRowKeys2: [],
    addQuestionVisible: false,
    batchId: '',
    uploadFileList: [],
    detailType: '',
    uploadLoading: false,
    uploadProcess: 0,
    addFile: false,
  };
  componentDidMount() {
    this.qrySiKdbInsertErrorSingleList();
  }

  onPageChange = (pageNum, pageSize) => {
    this.setState({ pageNum, pageSize }, () => {
      this.qrySiKdbInsertErrorSingleList();
    });
  };

  onPageChange2 = (pageNum, pageSize) => {
    this.setState(
      { pageNum3: pageNum, pageSize3: pageSize, selectedRows2: [], selectedRowKeys2: [] },
      () => {
        this.qryInsertErrorBatchByFileList();
      }
    );
  };

  onPageChange3 = (pageNum, pageSize) => {
    this.setState(
      { pageNum2: pageNum, pageSize2: pageSize, selectedRows1: [], selectedRowKeys1: [] },
      () => {
        this.qryInsertErrorByInterfaceList();
      }
    );
  };

  onPageChange4 = (pageNum, pageSize) => {
    this.setState({ pageNum4: pageNum, pageSize4: pageSize }, () => {
      this.qryInsertErrorBatchByWordList();
    });
  };

  onReImport = (batchId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeSupplement/reimport',
      payload: {
        batchId,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.info('重新导入成功');
      }
    });
  };

  onReImportBatch = (batchId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeSupplement/reimportBatch',
      payload: {
        // count: 8,
        batchId,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.info('重新导入成功');
        this.qryInsertErrorBatchByFileList();
      }
    });
  };

  batchReImport1 = () => {
    const { selectedRowKeys1 } = this.state;
    const { dispatch } = this.props;
    // const ids = [];

    if (!selectedRowKeys1 || selectedRowKeys1.length === 0) {
      message.info('请勾选');
      return;
    }

    dispatch({
      type: 'knowledgeSupplement/reimportBatch',
      payload: {
        batchIds: selectedRowKeys1,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.info('重新导入成功');
        this.qryInsertErrorBatchByFileList();
      }
    });
  };

  savaFileInfo = ({ file, fileList }) => {
    const { dispatch, location } = this.props;
    const params = location.query;
    this.setState(
      {
        uploadFileList: fileList,
      },
      () => {
        const { uploadFileList } = this.state;
        if (uploadFileList.length === 0) {
          this.setState({
            uploadLoading: false,
          });
        }
      }
    );
    if (file.status !== 'uploading') {
      const attachmentids = [];
      this.setState({
        uploadProcess: 100,
      });
      for (let i = 0; i < fileList.length; i += 1) {
        attachmentids.push(fileList[i].response.data.id);
      }

      dispatch({
        type: 'knowledgeGallery/upload',
        payload: {
          kdbid: params ? params.id : window.kdbid,
          attachmentids,
          importtype: 'kdb_standard_ques_import',
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          this.qryInsertErrorBatchByFileList();
        }
      });
    }
  };

  beforeUpload = () => {
    this.setState({
      uploadLoading: true,
      uploadProcess: 0,
    });
  };

  batchReImport2 = () => {
    const { selectedRowKeys2 } = this.state;
    const { dispatch } = this.props;

    if (!selectedRowKeys2 || selectedRowKeys2.length === 0) {
      message.info('请勾选');
      return;
    }

    dispatch({
      type: 'knowledgeSupplement/reimportBatch',
      payload: {
        // count: 8,
        batchIds: selectedRowKeys2,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.info('重新导入成功');
        this.qryInsertErrorByInterfaceList();
      }
    });
  };

  reImport = (ids) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeSupplement/reimport',
      payload: {
        ids: [ids],
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.info('重新导入成功');
        this.qrySiKdbInsertErrorSingleList();
      }
    });
  };

  qrySiKdbInsertErrorSingleList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'knowledgeSupplement/qrySiKdbInsertErrorSingleList',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
  };

  qryInsertErrorByInterfaceList = () => {
    const { dispatch } = this.props;
    const { pageNum2, pageSize2 } = this.state;
    dispatch({
      type: 'knowledgeSupplement/qryInsertErrorByInterfaceList',
      payload: {
        pageInfo: {
          pageNum: pageNum2,
          pageSize: pageSize2,
        },
      },
    });
  };

  qryInsertErrorBatchByFileList = () => {
    const { dispatch } = this.props;
    const { pageNum3, pageSize3 } = this.state;
    dispatch({
      type: 'knowledgeSupplement/qryInsertErrorBatchByFileList',
      payload: {
        pageInfo: {
          pageNum: pageNum3,
          pageSize: pageSize3,
        },
      },
    });
  };

  qryInsertErrorBatchByWordList = () => {
    const { dispatch } = this.props;
    const { pageNum4, pageSize4 } = this.state;
    dispatch({
      type: 'knowledgeSupplement/qryInsertErrorBatchByWordList',
      payload: {
        pageInfo: {
          pageNum: pageNum4,
          pageSize: pageSize4,
        },
      },
    });
  };

  closeEditorModal = () => {
    this.setState({ addQuestionVisible: false });
    this.qryInsertErrorBatchByFileList();
  };

  closeFileModal = () => {
    this.setState({ addFile: false });
    this.qryInsertErrorBatchByWordList();
  };

  queryList = (batchId, detailVisible, detailType) => {
    this.setState({ batchId, detailVisible, detailType });
    const { dispatch } = this.props;
    if (detailType === 2) {
      dispatch({
        type: 'knowledgeSupplement/qryInsertErrorByFileList',
        payload: {
          batchId,
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
        },
      });
    }
    if (detailType === 3) {
      dispatch({
        type: 'knowledgeSupplement/qryInsertErrorByInterfaceList2',
        payload: {
          batchId,
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
        },
      });
    }
  };

  updatakeys = (key) => {
    if (key === '1') {
      this.qrySiKdbInsertErrorSingleList();
    } else if (key === '2') {
      this.qryInsertErrorBatchByFileList();
    } else if (key === '3') {
      this.qryInsertErrorByInterfaceList();
    } else if (key === '4') {
      this.qryInsertErrorBatchByWordList();
    }
  };

  render() {
    const columns1 = [
      {
        title: '知识名称',
        dataIndex: 'question',
        width: 680,
        render: (text) => (
          <Popover content={text}>
            <span
              style={{
                width: '680px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {text}
            </span>
          </Popover>
        ),
      },
      {
        title: '导入知识库',
        dataIndex: 'kdbName',
      },
      {
        title: '开始时间',
        dataIndex: 'createTime',
        sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      },

      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          let errorText = '';
          if (record.state === '003') {
            errorText = (
              <span
                style={{
                  color: 'rgba(205, 210, 202)',
                }}
              >
                重新导入
              </span>
            );
          } else {
            errorText = (
              <span>
                <a onClick={() => this.reImport(record.errorId)}>重新导入</a>
              </span>
            );
          }
          return errorText;
        },
      },
    ];

    const columns2 = [
      {
        title: '文件ID',
        dataIndex: 'batchId',
        width: 100,
      },
      {
        title: '文件名',
        dataIndex: 'batchName',
        width: 120,
      },
      {
        title: '导入知识库',
        dataIndex: 'kdbName',
      },
      {
        title: '导入状态',
        dataIndex: 'state',
        render: (text, record) => {
          if (record.errorNumber === 0) {
            return (
              <div>
                <Icon
                  type={text === '000' ? 'exclamation-circle' : 'check-circle'}
                  style={{ marginRight: 5, color: text === '000' ? 'red' : '#58bc58' }}
                />
                <span>{text === '000' ? '进行中' : '已完成'}</span>
              </div>
            );
          } else {
            return (
              <div>
                <Icon type="exclamation-circle" style={{ marginRight: 5, color: 'orange' }} />
                <span>异常</span>
              </div>
            );
          }
        },
      },
      {
        title: '总计知识',
        dataIndex: 'total',
      },
      {
        title: '已导入知识',
        dataIndex: 'successNumber',
      },
      {
        title: '异常条数',
        dataIndex: 'errorNumber',
        render: (text, record) =>
          text === 0 ? (
            <span>{text}</span>
          ) : (
            <a onClick={() => this.queryList(record.batchId, true, 2)}>{text}</a>
          ),
      },
      {
        title: '开始时间',
        dataIndex: 'createTime',
        sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime),
      },

      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          let errorText = '';
          if (record.errorNumber === 0) {
            errorText = (
              <span
                style={{
                  color: 'rgba(205, 210, 202)',
                }}
              >
                重新导入
              </span>
            );
          } else {
            errorText = (
              <span>
                <a onClick={() => this.onReImportBatch(record.batchId)}>重新导入</a>
              </span>
            );
          }
          return errorText;
        },
      },
    ];

    const columns3 = [
      {
        title: '批次ID',
        dataIndex: 'batchId',
        width: 100,
      },
      {
        title: '批次名称',
        dataIndex: 'batchName',
        width: 120,
      },
      {
        title: '导入知识库',
        dataIndex: 'kdbName',
      },
      {
        title: '导入状态',
        dataIndex: 'state',
        render: (text, record) => {
          if (record.errorNumber === 0) {
            return (
              <div>
                <Icon
                  type={text === '000' ? 'exclamation-circle' : 'check-circle'}
                  style={{ marginRight: 5, color: text === '000' ? 'red' : '#58bc58' }}
                />
                <span>{text === '000' ? '进行中' : '已完成'}</span>
              </div>
            );
          } else {
            return (
              <div>
                <Icon type="exclamation-circle" style={{ marginRight: 5, color: 'orange' }} />
                <span>异常</span>
              </div>
            );
          }
        },
      },
      {
        title: '总计知识',
        dataIndex: 'total',
      },
      {
        title: '已导入知识',
        dataIndex: 'successNumber',
      },
      {
        title: '异常条数',
        dataIndex: 'errorNumber',
        render: (text, record) =>
          text === 0 ? (
            <span>{text}</span>
          ) : (
            <a onClick={() => this.queryList(record.batchId, true, 3)}>{text}</a>
          ),
      },
      {
        title: '开始时间',
        dataIndex: 'createTime',
        sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime),
      },

      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          let errorText = '';
          if (record.errorNumber === 0) {
            errorText = (
              <span
                style={{
                  color: 'rgba(205, 210, 202)',
                }}
              >
                重新导入
              </span>
            );
          } else {
            errorText = (
              <span>
                <a onClick={() => this.onReImportBatch(record.batchId)}>重新导入</a>
              </span>
            );
          }
          return errorText;
        },
      },
    ];

    const columns4 = [
      {
        title: '文件名',
        dataIndex: 'batchName',
      },
      {
        title: '导入知识库',
        dataIndex: 'kdbName',
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
      },
      {
        title: '导入状态',
        dataIndex: 'state',
        render: (text) => {
          return text === '000' ? <span>进行中</span> : <span>已完成</span>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          let errorText = '';
          if (record.errorNumber === 0) {
            errorText = (
              <span
                style={{
                  color: 'rgba(205, 210, 202)',
                }}
              >
                重新导入
              </span>
            );
          } else {
            errorText = (
              <span>
                <a onClick={() => this.onReImportBatch(record.batchId)}>重新导入</a>
              </span>
            );
          }
          return errorText;
        },
      },
    ];

    const { knowledgeSupplement } = this.props;

    const {
      singleList = {},
      interfaceList = {},
      fileList = {},
      fileList3 = {},
    } = knowledgeSupplement;
    const {
      selectedRowKeys1,
      selectedRowKeys2,
      detailVisible,
      addQuestionVisible,
      batchId,
      detailType,
      uploadFileList,
      uploadLoading,
      uploadProcess,
      addFile,
    } = this.state;

    const paginationInfo1 = {
      pageSize: singleList.pageSize || 5,
      total: singleList.total || 0,
      onChange: this.onPageChange,
    };

    const paginationInfo2 = {
      pageSize: fileList.pageSize || 5,
      total: fileList.total || 0,
      onChange: this.onPageChange2,
    };

    const paginationInfo3 = {
      pageSize: interfaceList.pageSize || 5,
      total: interfaceList.total || 0,
      onChange: this.onPageChange3,
    };

    const paginationInfo4 = {
      pageSize: fileList3.pageSize || 5,
      total: fileList3.total || 0,
      onChange: this.onPageChange4,
    };

    const rowSelection1 = {
      onChange: (changeSelectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows1: selectedRows,
          selectedRowKeys1: changeSelectedRowKeys,
        });
      },
      selectedRowKeys1,
    };

    const rowSelection2 = {
      onChange: (changeSelectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows2: selectedRows,
          selectedRowKeys2: changeSelectedRowKeys,
        });
      },
      selectedRowKeys2,
    };

    const addQuestionProps = {
      visible: addQuestionVisible,
      closeAddQuesModal: this.closeEditorModal,
    };

    const params = location.query;
    const props = {
      name: 'file',
      withCredentials: true,
      action: `${global.req_url}/smartim/system/attachment/upload`,
      data: {
        kdbid: params ? params.id : '',
        catecode: '003',
        catecodeid: 62,
        importtype: 'kdb_standard_ques_import',
      },
      onChange: this.savaFileInfo,
      beforeUpload: this.beforeUpload,
    };
    return (
      <div className={styles.selfAdapt}>
        <Tabs defaultActiveKey="1" onChange={this.updatakeys}>
          <TabPane tab="单条" key="1">
            <div>
              <div className={styles.headlayout}>
                <div>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.setState({ addQuestionVisible: true });
                    }}
                  >
                    新增
                  </Button>
                  <Button
                    style={{ margin: '0px 10px' }}
                    onClick={() => this.qrySiKdbInsertErrorSingleList()}
                    icon="redo"
                    type="primary"
                  >
                    刷新
                  </Button>
                </div>
              </div>
              <Table
                style={{ marginTop: '16px' }}
                rowKey="errorId"
                columns={columns1}
                dataSource={singleList.list}
                pagination={paginationInfo1}
              />
            </div>
          </TabPane>
          <TabPane tab="批量" key="2">
            <div>
              <div className={styles.headlayout}>
                <div className={styles.buttongroup}>
                  <a
                    href={`${global.req_url}/smartim/knowledge/file/templet?importtype=kdb_standard_ques_import`}
                  >
                    <Button style={{ marginLeft: '8px' }}>下载模版</Button>
                  </a>
                  <Upload
                    style={{ marginBottom: '2px', lineHeight: 1, width: 100 }}
                    {...props}
                    fileList={uploadFileList}
                  >
                    <Button style={{ marginLeft: '8px' }}>批量导入 </Button>
                  </Upload>

                  <Button style={{ marginLeft: '8px' }} onClick={() => this.batchReImport1()}>
                    批量重新导入
                  </Button>
                  <Button
                    style={{ margin: '0px 10px' }}
                    onClick={() => this.qryInsertErrorBatchByFileList()}
                    icon="redo"
                    type="primary"
                  >
                    刷新
                  </Button>
                </div>
              </div>
              <div>
                {uploadLoading ? (
                  <div style={{ width: '100%' }}>
                    <span style={{ padding: 20 }}>目前进度：</span>
                    <div style={{ width: 140, display: 'inline-block' }}>
                      <Progress size="small" percent={uploadProcess} />
                    </div>
                  </div>
                ) : null}
              </div>
              <Table
                rowKey="batchId"
                style={{ marginTop: '16px' }}
                columns={columns2}
                dataSource={fileList.list}
                pagination={paginationInfo2}
                rowSelection={rowSelection1}
              />
            </div>
          </TabPane>
          <TabPane tab="接口" key="3">
            <div>
              <div className={styles.headlayout}>
                <div style={{ display: 'flex' }}>
                  <Button style={{ marginLeft: '8px' }} onClick={() => this.batchReImport2()}>
                    批量重新导入
                  </Button>
                  <Button
                    style={{ margin: '0px 10px' }}
                    onClick={() => this.qryInsertErrorByInterfaceList()}
                    icon="redo"
                    type="primary"
                  >
                    刷新
                  </Button>
                </div>
              </div>
              <Table
                rowKey="batchId"
                style={{ marginTop: '16px' }}
                columns={columns3}
                dataSource={interfaceList.list}
                pagination={paginationInfo3}
                rowSelection={rowSelection2}
              />
            </div>
          </TabPane>

          <TabPane tab="文档" key="4">
            <div>
              <div style={{ justifyContent: 'flex-end' }} className={styles.headlayout}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    style={{ marginLeft: '8px' }}
                    onClick={() => {
                      this.setState({ addFile: true });
                    }}
                  >
                    上传文件
                  </Button>
                  {/* <a
                    href={`${global.req_url}/smartim/knowledge/file/templet?importtype=kdb_standard_ques_import`}
                  >
                    <Button style={{ marginLeft: '8px' }}>下载模版</Button>
                  </a> */}
                  <Button
                    style={{ margin: '0px 10px' }}
                    onClick={() => this.qryInsertErrorBatchByWordList()}
                    icon="redo"
                    type="primary"
                  >
                    刷新
                  </Button>
                </div>
              </div>
              <Table
                rowKey="batchId"
                style={{ marginTop: '16px' }}
                columns={columns4}
                dataSource={fileList3.list}
                pagination={paginationInfo4}
              />
            </div>
          </TabPane>
        </Tabs>
        <DetailModal
          visible={detailVisible}
          batchId={batchId}
          detailType={detailType}
          changeVisible={(poVisible) => this.setState({ detailVisible: poVisible })}
        />
        {addQuestionVisible && <AddModal {...addQuestionProps} />}
        {addFile && <FileModal visible={addFile} closeAddQuesModal={this.closeFileModal} />}
      </div>
    );
  }
}
