import React from 'react';
import { connect } from 'dva';
import { Row, Col, message, Modal, Tooltip, Input, Button } from 'antd';
import StandardTable from '../../../components/StandardTable';
import CommonButton from '../../../components/CommonButton';
import AddSceneModal from '../AddSceneModal';
import { commonSubString, getSetAbleValueByIsenable } from '../../../utils/utils';
import styles from './index.less';
import { botsceneTrain } from '../../../services/sceneApiList';
import RobotChat from '../RobotChat';

const { Search } = Input;
@connect((props) => {
  const { loading, sceneList } = props;
  return {
    sceneList,
    loading: loading.models.sceneList,
  };
})
export default class SceneList extends React.Component {
  state = {
    editSceneId: '', // 当前Modal修改的id
    addModalVisible: false, // 新增
    editData: {}, // 当前修改的modal
    searchName: '', // 场景名称
    sceneTraining: false,
    testChatVisible: false,
  };

  componentDidMount() {
    this.loadTabList();
  }
  // 进入场景详情
  onRowClick = (id) => {
    const { changeDisplay } = this.props;
    if (changeDisplay) changeDisplay(id);
  };

  onRef = (ref) => {
    this.child = ref;
  };

  // 启用/停用
  setAble = (record = {}) => {
    if (!record.id) return;

    const { dispatch } = this.props;
    dispatch({
      type: 'sceneList/fetchSetAbleScene',
      payload: {
        id: record.id,
        ablevalue: getSetAbleValueByIsenable(record.isEnable),
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('操作成功');
        this.loadTabList();
        return;
      }
      message.error('操作成功');
    });
  };

  loadTabList = (page) => {
    const { dispatch } = this.props;
    const { pagination = {} } = this.tableRef || {};
    dispatch({
      type: 'sceneList/fetchSceneList',
      payload: {
        status: '1',
        p: page || 1,
        ps: pagination.pageSize || 10,
        name: this.state.searchName,
      },
    });
  };
  showAddSceneModal = (record) => {
    this.setState({
      editSceneId: (record && record.id) || '',
      addModalVisible: true,
    });
  };
  // 添加场景成功回调
  addOnOk = (obj, okCallBack) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneList/fetchSaveScene',
      payload: obj,
    }).then(() => {
      if (okCallBack) okCallBack();
      this.loadTabList();
      this.closeModal();
    });
  };
  closeModal = () => {
    this.setState({
      addModalVisible: false,
      editData: {},
    });
  };
  // 处理选中的数据
  doSelect = () => {
    const {
      state: { selectedRowKeys },
    } = this.tableRef;
    if (!selectedRowKeys.length) {
      message.error('请选择要操作的数据');
      return false;
    }
    return selectedRowKeys.join(',');
  };
  // 修改
  sceneEdit = (recode) => {
    this.setState({ editData: recode, addModalVisible: true });
  };
  // 删除
  sceneDelete = (recode) => {
    const ids = recode && recode.id ? recode.id : this.doSelect();
    if (!ids) return;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const { dispatch } = that.props;
        dispatch({
          type: 'sceneList/fetchDeleteScene',
          payload: { id: ids },
        }).then((res) => {
          if (res && res.status === 'OK') {
            message.success('删除成功');
            that.loadTabList();
            return;
          }
          message.error('删除失败');
        });
      },
    });
    event.stopPropagation();
  };

  // 表格翻页
  tableOnChange = (pagination, filters, sorter) => {
    if (JSON.stringify(sorter) === '{}') {
      this.loadTabList(pagination.current || 0);
    } else {
      // filter数据,需处理分页数据
    }
  };
  handleReloadBotScene = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneList/fetchReloadBotScene',
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('发布成功');
        this.loadTabList();
        return;
      }
      message.error('发布失败');
    });
  };

  searchScene = (value) => {
    this.setState(
      {
        searchName: value,
      },
      () => {
        this.loadTabList();
      }
    );
  };
  tableRef; // 存放表的数据

  // 场景训练
  handleBotsceneTrain = () => {
    // const { sceneId } = this.props;
    // sceneid:sceneId

    this.setState({
      sceneTraining: true,
    });
    botsceneTrain({}).then((res) => {
      if (res && res.status === 'OK') {
        // message.success("同步数据成功！");
        Modal.success({
          title: '成功',
          content: '同步数据成功',
        });
      } else {
        // message.error("同步数据失败！");
        Modal.error({
          title: '失败',
          content: '同步数据失败',
        });
      }
      this.setState({
        sceneTraining: false,
      });
    });
  };

  showTestModal = () => {
    this.setState({
      testChatVisible: true,
    });
  };

  handleTestChatOk = () => {
    this.setState({
      testChatVisible: false,
    });
  };

  handleTestChatCancel = () => {
    this.setState({
      testChatVisible: false,
    });
    this.child.cleanSelected();
  };

  render() {
    const {
      selectedRows,
      loading,
      sceneList: { sceneList },
    } = this.props;
    const { editSceneId, addModalVisible, editData, sceneTraining, testChatVisible } = this.state;
    const columns = [
      {
        title: '场景ID',
        width: 80,
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '场景名称',
        width: 80,
        dataIndex: 'name',
        render: (data, record) => {
          // 点击进入场景详情
          return (
            <a
              onClick={() => {
                this.onRowClick(record.id);
              }}
            >
              {data || '-'}
            </a>
          );
        },
      },
      {
        title: '场景描述',
        width: 200,
        dataIndex: 'info',
        render: (words) => {
          if (words && words.length > 15) {
            return (
              <Tooltip placement="topLeft" title={words} arrowPointAtCenter>
                {commonSubString(words)}
              </Tooltip>
            );
          }
          return words;
        },
      },
      {
        title: '状态',
        dataIndex: 'isEnable',
        width: 60,
        render: (val) => {
          return (
            <span>
              <span
                className={styles.span}
                style={{ backgroundColor: val === '1' ? '#52C41B' : 'rgba(0,0,0,.25)' }}
              />
              <span>{val === '1' ? '已启用' : '已停用'}</span>
            </span>
          );
        },
        filters: [
          {
            text: '已启用',
            value: '1',
          },
          {
            text: '已停用',
            value: '0',
          },
        ],
        onFilter: (value, record) => record.isEnable.includes(value),
        // {
        //   return record.status === value;
        // },
      },
      {
        title: '操作',
        width: 110,
        render: (record) => {
          const that = this;
          return (
            <div>
              <a
                onClick={() => {
                  that.setAble(record);
                }}
              >
                {' '}
                {record.isEnable === '1' ? '停用' : '启用'}
              </a>
              <span style={{ display: 'inline-block', margin: '0 5px' }}>|</span>
              <a
                onClick={() => {
                  that.sceneEdit(record);
                }}
              >
                修改
              </a>
              <span style={{ display: 'inline-block', margin: '0 5px' }}>|</span>
              <a
                onClick={() => {
                  that.sceneDelete(record);
                }}
              >
                删除
              </a>
            </div>
          );
        },
      },
    ];
    const addSceneModalProps = {
      id: editSceneId,
      closeModal: this.closeModal,
      onOk: this.addOnOk,
      editData,
      visible: addModalVisible,
      loading,
    };

    return (
      <div className="selfAdapt">
        <Row>
          <Col sm={24} xs={24}>
            <div style={{ marginBottom: 20 }}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                  <div style={{ marginTop: 6, marginLeft: 6 }}> 场景列表</div>
                </Col>
                <Col md={17} sm={24} style={{ paddingRight: 0, paddingLeft: 10 }}>
                  <div style={{ display: 'inline-flex', float: 'right' }}>
                    {/* <CommonButton loading={loading} style={{marginLeft: 4}} onClick={this.sceneDelete}>
                      删除
                    </CommonButton> */}
                    <Search
                      placeholder="请输入场景名称"
                      onSearch={(value) => this.searchScene(value)}
                      style={{ width: 200 }}
                    />
                    <CommonButton
                      loading={loading}
                      type="primary"
                      onClick={this.showAddSceneModal}
                      htmlType="submit"
                      style={{ marginLeft: 4 }}
                    >
                      新增
                    </CommonButton>
                    <Button
                      style={{ marginLeft: 4 }}
                      onClick={this.handleBotsceneTrain}
                      type="primary"
                      disabled={sceneTraining}
                    >
                      同步数据
                    </Button>
                    <Button style={{ marginLeft: 4 }} onClick={this.showTestModal} type="primary">
                      测试
                    </Button>
                    {/* <CommonButton
                      loading={loading}
                      type="primary"
                      onClick={this.handleReloadBotScene}
                      style={{marginLeft: 4}}
                    >
                      发布
                    </CommonButton> */}
                  </div>
                </Col>
              </Row>
            </div>
            <StandardTable
              cutHeight={80}
              loading={loading}
              onChange={this.tableOnChange}
              rowKey={(record) => record.id}
              ref={(ele) => {
                this.tableRef = ele;
              }}
              selectedRows={selectedRows}
              data={sceneList}
              columns={columns}
            />
            {addModalVisible && <AddSceneModal {...addSceneModalProps} />}
          </Col>
          <Modal
            title="测试"
            visible={testChatVisible}
            onOk={this.handleTestChatOk}
            onCancel={this.handleTestChatCancel}
            width={800}
            style={{ height: 400 }}
          >
            <RobotChat sceneList={sceneList} onRef={this.onRef} />
          </Modal>
        </Row>
      </div>
    );
  }
}
