/* eslint-disable no-console */
import { connect } from 'dva';
import React from 'react';
import {
  Tabs,
  Button,
  List,
  Modal,
  Pagination,
  Input,
  Upload,
  Icon,
  message,
  Progress,
  Table,
  Row,
  Col,
  Divider,
  Steps,
  Popconfirm,
  Tooltip,
} from 'antd';
import { upload, uploadRate } from '../../../services/modelTraining';

const { TabPane } = Tabs;
const { Search } = Input;
const { Step } = Steps;

@connect()
export default class ModelTraining extends React.Component {
  state = {
    visible: false,
    modelList: [],
    modelPageSize: 5,
    modelTotal: 0,
    curModelPage: 1,
    datasetPageSize: 5,
    datasetTotal: 0,
    curDatasetPage: 1,
    datasetList: [],
    selectedDataset: [],
    uploadProcess: 0,
    tabKey: '1',
    selectDatasetIs: [],
  };

  componentDidMount() {
    this.getModelList();
  }

  componentWillReceiveProps() {}

  // 获取模型列表
  getModelList = () => {
    const { dispatch, sceneId } = this.props;
    const { curModelPage, modelPageSize, tabKey } = this.state;

    // console.log('dispatch',dispatch)

    dispatch({
      type: 'modelTraining/getAllModel',
      payload: {
        sceneId,
        type: tabKey === '1' ? 0 : 1,
        p: curModelPage,
        ps: modelPageSize,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        console.log(res);
        this.setState({
          modelTotal: res.data.total,
        });
        this.dealModelData(res.data.list);
      }
    });
  };

  getUploadProcess = (id) => {
    uploadRate({
      fileId: id,
    }).then((res) => {
      this.setState({
        uploadProcess: res.data,
      });
      console.log(333333, res);
      if (res.data >= 100) {
        this.setState({
          uploadProcess: 100,
          curDatasetPage: 1,
        });
        this.selectDataset();
        clearInterval(this.timer);
        message.success('文件上传完成！');
      }
    });
  };

  beforeUpload = (file) => {
    const { sceneId } = this.props;
    const param = {
      file,
      sceneId,
    };
    console.log('file', file);
    upload(param).then((res) => {
      if (res.status === 'OK') {
        message.info('开始上传');
        this.setState({
          uploadProcess: 0,
        });
        this.timer = setInterval(() => {
          this.getUploadProcess(res.data);
        }, 3000);
      } else {
        message.warning('上传文件失败！');
      }
    });
    return false;
  };

  timer = '';

  // 处理返回的数据
  dealModelData = (data) => {
    const arr = data.map((item) => (
      <div style={{ width: '100%' }}>
        <Row>
          <Col span={20}>
            <Row>
              <Col span={6}>版本：{item.name}</Col>
              <Col span={4}>
                状态：{' '}
                {item.modelStatus === 0 ? (
                  <span style={{ color: '#FA2646' }}>训练失败</span>
                ) : item.modelStatus === 1 ? (
                  <span style={{ color: '#6C91FE' }}>训练中</span>
                ) : item.modelStatus === 2 ? (
                  <span style={{ color: '#179D5D' }}>训练完成</span>
                ) : item.modelStatus === 3 ? (
                  <span style={{ color: '#D84B40' }}>训练停止</span>
                ) : item.modelStatus === 4 ? (
                  <span style={{ color: '#2E825F' }}>发布</span>
                ) : item.modelStatus === 5 ? (
                  <span style={{ color: '#FE9FA1' }}>下线</span>
                ) : (
                  '未知'
                )}
              </Col>
              <Col span={7}>创建时间：{item.gmtCreate}</Col>
              <Col span={7}>状态更新时间：{item.gmtModified}</Col>
            </Row>
            <div style={{ marginTop: 20 }}>
              {item.modelStatus === 0 || item.modelStatus === 1 ? (
                <Row>
                  <Col span={2}>训练进度：</Col>
                  <Col span={22}>
                    <Steps
                      current={parseInt(String(item.trainCode).substr(0, 1), 10) - 1}
                      size="small"
                      status={!item.modelStatus ? 'error' : ''}
                    >
                      <Step
                        title={
                          <Tooltip
                            title={
                              parseInt(String(item.trainCode).substr(0, 1), 10) - 1 === 0 &&
                              !item.modelStatus
                                ? item.trainMessage
                                : false
                            }
                          >
                            开始
                          </Tooltip>
                        }
                      />
                      <Step
                        title={
                          <Tooltip
                            title={
                              parseInt(String(item.trainCode).substr(0, 1), 10) - 1 === 1 &&
                              !item.modelStatus
                                ? item.trainMessage
                                : false
                            }
                          >
                            准备数据
                          </Tooltip>
                        }
                      />
                      <Step
                        title={
                          <Tooltip
                            title={
                              parseInt(String(item.trainCode).substr(0, 1), 10) - 1 === 2 &&
                              !item.modelStatus
                                ? item.trainMessage
                                : false
                            }
                          >
                            训练中
                          </Tooltip>
                        }
                      />
                      <Step
                        title={
                          <Tooltip
                            title={
                              parseInt(String(item.trainCode).substr(0, 1), 10) - 1 === 3 &&
                              !item.modelStatus
                                ? item.trainMessage
                                : false
                            }
                          >
                            训练完成
                          </Tooltip>
                        }
                      />
                    </Steps>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col span={8}>模型效果：{item.f1Score ? item.f1Score : '未知'}</Col>
                  <Col span={8}>
                    精确率： {item.precisionRate ? `${item.precisionRate}` : '未知'}
                  </Col>
                  <Col span={8}>召回率:{item.recallRate ? `${item.recallRate}` : '未知'}</Col>
                </Row>
              )}
            </div>
          </Col>
          <Col span={4} style={{ paddingTop: 20, textAlign: 'center' }}>
            {item.modelStatus === 1 ? (
              <a
                style={{ color: '#FE5577' }}
                onClick={() => this.stopModelTraining({ modelId: item.id })}
              >
                停止训练
              </a>
            ) : item.modelStatus === 2 ? (
              <a
                style={{ color: '#2E825F' }}
                onClick={() => this.modelLine({ modelId: item.id, modelStatus: 'inService' })}
              >
                发布
              </a>
            ) : item.modelStatus === 4 ? (
              <a
                style={{ color: '#FE9FA1' }}
                onClick={() => this.modelLine({ modelId: item.id, modelStatus: 'outofService' })}
              >
                下线
              </a>
            ) : item.modelStatus === 5 ? (
              <a
                style={{ color: '#2E825F' }}
                onClick={() => this.modelLine({ modelId: item.id, modelStatus: 'inService' })}
              >
                发布
              </a>
            ) : (
              ''
            )}
            {item.modelStatus !== 0 && item.modelStatus !== 3 ? <Divider type="vertical" /> : ''}
            <Popconfirm
              title="确认删除吗?"
              okText="确认"
              cancelText="取消"
              onConfirm={() => this.deleteModel({ id: item.id })}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Col>
        </Row>
      </div>
    ));
    this.setState({
      modelList: arr,
    });
  };

  tabChange = (e) => {
    if (e === '1') {
      this.setState(
        {
          tabKey: '1',
        },
        () => {
          this.getModelList();
        }
      );
    } else {
      this.setState(
        {
          tabKey: '2',
        },
        () => {
          this.getModelList();
        }
      );
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.selectDataset();
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
    const { sceneId } = this.props;
    const { tabKey } = this.state;
    const type = tabKey === '1' ? 0 : 1;
    this.modelTraining({ sceneId, modelType: type });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  changeDatasetList = (e) => {
    this.setState(
      {
        curDatasetPage: e,
      },
      () => {
        this.selectDataset();
      }
    );
  };

  changeModelList = (e) => {
    this.setState(
      {
        curModelPage: e,
      },
      () => {
        this.getModelList();
      }
    );
  };

  // 模型删除
  deleteModel = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelTraining/deleteModel',
      payload: param,
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.getModelList();
      }
    });
  };

  // 模型训练
  modelTraining = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelTraining/trainModel',
      payload: param,
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.getModelList();
        message.info('开始训练！');
      } else {
        message.error(res.data);
      }
    });
  };

  // 模型上下线
  modelLine = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelTraining/line',
      payload: param,
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.getModelList();
      } else {
        message.info(res.data);
      }
    });
  };

  // 模型停止训练
  stopModelTraining = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelTraining/stop',
      payload: param,
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.getModelList();
      }
    });
  };

  // 上传数据集

  uploadDataset = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelTraining/upload',
      payload: {},
    }).then((res) => {
      if (res && res.status === 'OK') {
        console.log(res);
      }
    });
  };

  // 上传数据集进度

  uploadDatasetProgress = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'modelTraining/uploadRate',
      payload: {},
    }).then((res) => {
      if (res && res.status === 'OK') {
        console.log(res);
      }
    });
  };

  // 查询数据集

  selectDataset = () => {
    const { dispatch, sceneId } = this.props;
    const { datasetPageSize, curDatasetPage, tabKey } = this.state;
    dispatch({
      type: 'modelTraining/getAllDataSet',
      payload: {
        sceneId,
        type: tabKey === '1' ? 0 : 1,
        ps: datasetPageSize,
        p: curDatasetPage,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          datasetTotal: res.data.total || '',
          datasetList: res.data.list || '',
        });
      }
    });
  };

  // 删除数据集

  deleteDataset = (param) => {
    const { dispatch } = this.props;
    // console.log(param);return;
    dispatch({
      type: 'modelTraining/deleteById',
      payload: param,
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.selectDataset();
      }
    });
  };

  // 批量删除数据集

  batchDeleteDataset = () => {
    const { selectDatasetIs } = this.state;
    const param = { ids: selectDatasetIs };
    const { dispatch } = this.props;
    // console.log(param);return;
    dispatch({
      type: 'modelTraining/deleteByIds',
      payload: param,
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.selectDataset();
        // 清空选中状态
        this.setState({
          selectedDataset: [],
        });
      }
    });
  };

  // 一键删除数据集
  deleteAllDataset = () => {
    const { dispatch, sceneId } = this.props;
    dispatch({
      type: 'modelTraining/deleteByScene',
      payload: {
        sceneId,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        // 更新当前数据
        this.selectDataset();
      }
    });
  };

  selectedDatasetList = (e, rows) => {
    const arr = rows.map((item) => item.id);
    this.setState({
      selectedDataset: e,
      selectDatasetIs: arr,
    });
  };

  render() {
    const columns1 = [
      {
        title: '语句',
        dataIndex: 'example',
        width: 100,
      },
      {
        title: '标注结果',
        dataIndex: 'slots',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        width: 160,
      },
      {
        title: '数据类型',
        dataIndex: 'type',
        width: 160,
        render: (text) => (
          <div>
            {text === 0 ? '意图识别' : text === 1 ? '实体识别' : text === 2 ? '意图 | 实体' : ''}
          </div>
        ),
      },
      {
        title: '意图编码',
        dataIndex: 'intentCode',
        width: 160,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Popconfirm
            title="确认删除该条名词吗?"
            okText="确认"
            cancelText="取消"
            onConfirm={() => this.deleteDataset({ id: record.id })}
          >
            <a href="">删除</a>
          </Popconfirm>
        ),
      },
    ];
    const { selectedDataset } = this.state;
    const datasetRowSelection = {
      selectedRowKeys: selectedDataset,
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedDatasetList(selectedRowKeys, selectedRows);
      },
    };
    const {
      modelList,
      modelTotal,
      modelPageSize,
      datasetTotal,
      datasetPageSize,
      datasetList,
      uploadProcess,
    } = this.state;
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
          <TabPane tab="意图识别" key="1">
            &nbsp;
          </TabPane>
          <TabPane tab="实体识别挖槽" key="2">
            &nbsp;
          </TabPane>
        </Tabs>
        <div>
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.showModal}>
              发起训练
            </Button>
          </div>
        </div>
        <div style={{ marginTop: 20, marginBottom: 40 }}>
          <List
            bordered
            dataSource={modelList}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Pagination
              defaultCurrent={1}
              total={modelTotal}
              pageSize={modelPageSize}
              onChange={this.changeModelList}
            />
          </div>
        </div>
        <Modal
          title="发起训练"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          maskClosable={false}
          width={1000}
        >
          <div style={{ display: 'none' }}>
            模糊搜索：
            <Search
              placeholder="请输入关键字"
              onSearch={(value) => console.log(value)}
              style={{ width: 200 }}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ float: 'left', width: 70, textAlign: 'right' }}>导入：</div>
            <div style={{ float: 'left' }}>
              <Upload accept=".xls,.xlsx" showUploadList={false} beforeUpload={this.beforeUpload}>
                <Button>
                  <Icon type="upload" />
                  上传附件
                </Button>
              </Upload>
            </div>
            <div style={{ width: 300, display: 'inline-block', marginLeft: 20 }}>
              <Progress percent={uploadProcess} style={{ width: 300, display: 'inline-block' }} />
            </div>
            <a
              href={`${global.req_url}/smartim/knowledge/file/templet?importtype=file_model_data_set_import`}
              style={{ float: 'right', marginRight: '10px' }}
              download="模板"
            >
              模板下载
            </a>
          </div>
          <div style={{ marginTop: 30, marginLeft: 68 }}>
            <Button onClick={this.batchDeleteDataset}>批量删除</Button>
            <Button style={{ marginLeft: 20 }} onClick={this.deleteAllDataset}>
              一键删除所有
            </Button>
          </div>
          <div style={{ marginTop: 30 }}>
            <Table
              rowKey="id"
              rowSelection={datasetRowSelection}
              columns={columns1}
              style={{ marginTop: 20 }}
              dataSource={datasetList}
              pagination={false}
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Pagination
              defaultCurrent={1}
              total={Number(datasetTotal)}
              pageSize={Number(datasetPageSize)}
              onChange={this.changeDatasetList}
            />
          </div>
        </Modal>
      </div>
    );
  }
}
