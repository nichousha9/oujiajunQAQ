/* eslint-disable no-unused-expressions */
/* eslint-disable no-script-url */
/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'dva';
import shortId from 'shortid';
import {
  message,
  Modal,
  Spin,
  Icon,
  Button,
  Select,
  Input,
  Checkbox,
  Table,
  Tag,
  Tabs,
  Divider,
  Pagination,
  Switch,
  Popconfirm,
} from 'antd';
import classnames from 'classnames';
import styles from './index.less';
import AddSceneIntention from './AddSceneIntention';
import ConfigSceneIntention from './ConfigSceneIntention';
import RecoveryConfiguration from './RecoveryConfiguration';
import { deleteIntentionInfo } from '../../../../services/sceneApiList';
import { getResMsg } from '../../../../utils/codeTransfer';

const { TabPane } = Tabs;
const { Search } = Input;

@connect((props) => {
  const { loading, sceneIntention } = props;
  return {
    sceneIntention,
    loading: loading.models.sceneIntention,
  };
})
export default class SceneIntentionSample extends React.Component {
  state = {
    selectItem: {},
    intentionList: [],
    dialogSampleList: [],
    alterVisible: true,
    configVisible: false,
    SpecNoun: [],
    termList: [],
    termSearch: '',
    termVisible: false,
    curTermName: '',
    curTermRecord: {},
    total: '',
    page: 1,
    curPageLen: 0,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'lexiconManagement/getPageList',
      payload: {
        sceneId: this.props.sceneId,
        isGeneral: true,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        this.setState({
          SpecNoun: res.data.list,
        });
      }
    });

    this.getByIntenId();
  }
  componentDidMount() {
    this.loadTabList();
    this.loadOperaterList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      sceneIntention: { sceneIntentionList: intentionList },
    } = nextProps;
    if (JSON.stringify(intentionList) !== JSON.stringify(this.state.intentionList)) {
      this.setState({ intentionList });
    }
  }

  onRef = (ref) => {
    this.child = ref;
  };

  setSelectIntention(selectItem) {
    if (selectItem) {
      this.setState({ selectItem });
      this.setState({ alterVisible: true, configVisible: true });
      // 切换选中状态时,重新获取对话样本,快速回复列表,词槽列表
      const { dispatch, sceneId } = this.props;
      const { id, code } = selectItem;
      const { page } = this.state;

      this.selectAllList(id, page);

      dispatch({
        type: 'sceneIntention/fetchIntentionDialogSampleList',
        payload: {
          sceneid: sceneId,
          intent: code,
          intentId: id,
          p: 1,
          ps: 100,
        },
      });

      this.getByIntenId(id);

      dispatch({
        type: 'sceneIntention/fetchIntentionSlotList',
        payload: {
          sceneid: sceneId,
          intent: code,
          intentid: id,
        },
      });
    } else {
      this.setState({ selectItem: {} });
      this.setState({ alterVisible: true, configVisible: false });
    }
  }

  getByIntenId = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneIntention/getByIntentId',
      payload: {
        intentId: id,
      },
    }).then((res) => {
      const list = res.data.list.map((item) => ({
        key: shortId.generate(),
        name: item.name,
        labelNameList: item.labelNameList,
        lifeCycle: item.lifeCycle || '',
        describes: item.describes || '',
        isRequired: item.isRequired,
        pnounId: item.pnounId || '',
      }));
      this.setState({
        dialogSampleList: list,
      });
    });
  };

  handleGetSlotList = () => {
    const {
      selectItem: { code, id },
    } = this.state;
    const { dispatch, sceneId } = this.props;

    this.getByIntenId(id);
    dispatch({
      type: 'sceneIntention/fetchIntentionSlotList',
      payload: {
        sceneid: sceneId,
        intent: code,
        intentid: id,
      },
    });
  };
  loadTabList(page, pageSize) {
    const { dispatch, sceneId: sceneid } = this.props;
    dispatch({
      type: 'sceneIntention/fetchSceneIntentionList',
      payload: {
        sceneId: sceneid,
        p: page || 0,
        ps: pageSize || 10,
      },
    });
  }

  loadOperaterList() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneIntention/fetchIntentionOperaterList',
    });
  }

  closeAlterOrConfig() {
    this.setState({ alterVisible: false, configVisible: false });
  }

  deleteIntention(e, obj) {
    const { id } = obj;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteIntentionInfo({ id }).then((res) => {
          if (res.status === 'OK') {
            message.success('删除成功');
            that.setState({ alterVisible: true, configVisible: true });
            // e.stopPropagation();
            that.loadTabList();
          } else {
            message.error('删除失败！');
          }
        });
      },
    });
  }

  editIntention() {
    this.setState({ alterVisible: true, configVisible: true });
    // e.stopPropagation();
  }

  handleAddOk(obj, okCallBack) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneIntention/fetchSaveIntentionInfo',
      payload: obj,
    }).then((res) => {
      if (!res) return;
      if (res.status === 'FAIL') {
        message.info(res.data);
        return;
      }
      if (res.status === 'OK') {
        if (okCallBack) okCallBack();
        this.loadTabList();
        if (!obj.id) {
          this.setState({ alterVisible: true, configVisible: false });
        } else {
          this.setState({ alterVisible: true, configVisible: true });
        }
      } else {
        message.error(getResMsg(res.msg));
      }
    });
  }

  handleConfigOk(obj) {
    this.setState({ alterVisible: false, configVisible: false });
  }

  flag = false;

  click = (e) => {
    this.flag = false;

    const { dialogSampleList, selectItem } = this.state;
    if (dialogSampleList.length === 0 && selectItem.id) {
      message.error('至少添加一条词槽！');
      return;
    }

    let requiredCount = 0;

    this.state.dialogSampleList.forEach((element) => {
      if (element.pnounId.length === 0 && selectItem.id) {
        message.error('专有名词为必填选项！');
      }
      if (element.isRequired === 'Y' && selectItem.id) {
        requiredCount = Number(requiredCount) + 1;
        if (element.lifeCycle === '') {
          message.error('必填选项的生命周期必须大于0！');
          this.flag = true;
        }
        if (element.describes === '' && selectItem.id) {
          this.flag = true;
          message.error('必填选项的词槽描述不能为空！');
        }
      }
    });

    if (requiredCount === 0 && selectItem.id) {
      message.error('至少有一个词槽为必填选项！');
      this.flag = true;
    }

    if (this.flag) return;

    this.child.handleOk();

    // 保存对话样本
    // 判断是否需要保存对话样本

    const slot = JSON.stringify(
      this.state.dialogSampleList.map((item) => ({
        name: item.name,
        labelNameList: item.labelNameList,
        lifeCycle: item.lifeCycle || '',
        describes: item.describes || '',
        isRequired: item.isRequired,
        pnounId: item.pnounId || '',
      }))
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneIntention/updateIntentSlots',
      payload: {
        slot,
        intentId: this.state.selectItem.id,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        this.getByIntenId(this.state.selectItem.id);
      }
    });
  };

  handleChangeData(record, key, value) {
    if (key === 'lifeCycle') {
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
      if (!reg.test(value)) {
        message.error('生命周期只能输入数字！否则无法保存！');
        return;
      }
    }
    const { dialogSampleList } = this.state;
    const alterObj = dialogSampleList.filter((o) => o.key === record.key)[0];
    if (alterObj[key] !== value) {
      alterObj[key] = value;
      this.setState({ dialogSampleList });
    }
  }

  // 获取特征词
  selectAllList = (intentId, pageNum) => {
    const { dispatch, sceneId } = this.props;
    const { termSearch } = this.state;
    dispatch({
      type: 'sceneIntention/selectAllList',
      payload: {
        sceneId,
        intentId,
        pageNum,
        pageSize: 10,
        name: termSearch,
        status: '00A',
      },
    }).then((res) => {
      if (res.success) {
        this.setState({
          termList: res.data.list,
          total: res.data.total,
          curPageLen: res.data.list.length,
        });
      }
    });
  };

  // 修改特征词
  editTerm = (record) => {
    this.setState({
      curTermName: record.name,
      termVisible: true,
      curTermRecord: record,
    });
  };

  // 删除特征词
  deleteTerm = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneIntention/delFeatureNoun',
      payload: {
        ids: record.id,
      },
    }).then((res) => {
      if (res.success) {
        // 重新加载数据
        const { selectItem, page, curPageLen } = this.state;
        // 判断删除的该条是不是界面的最后一条
        if (curPageLen === 1 && page > 1) {
          this.selectAllList(selectItem.id, page - 1);
        } else {
          this.selectAllList(selectItem.id, page);
        }
      }
    });
  };

  // 改变特征词启用状态

  searchTerm = (e) => {
    this.setState(
      {
        termSearch: e,
      },
      () => {
        const { selectItem } = this.state;
        this.selectAllList(selectItem.id, 1);
      }
    );
  };

  changSelectItem = (item) => {
    this.setState({ selectItem: item });
  };
  // 新增特征词
  showAdd = () => {
    this.setState({
      termVisible: true,
      curTermName: '',
      curTermRecord: {},
    });
  };

  handleTermOk = () => {
    const { curTermRecord, curTermName, selectItem, page } = this.state;
    const { dispatch, sceneId } = this.props;
    if (curTermRecord.id) {
      // 编辑
      dispatch({
        type: 'sceneIntention/modFeatureNoun',
        payload: {
          ...curTermRecord,
          name: curTermName,
        },
      }).then((res) => {
        if (res.success) {
          this.setState({
            termVisible: false,
          });
          // 重新加载数据
          this.selectAllList(selectItem.id, page);
        }
      });
    } else {
      // 新增
      if (curTermName) {
        dispatch({
          type: 'sceneIntention/addFeatureNoun',
          payload: {
            isEnable: 1,
            name: curTermName,
            sceneId,
            intentId: selectItem.id,
          },
        }).then((res) => {
          if (res.success) {
            this.setState({
              termVisible: false,
            });
            // 重新加载数据
            this.selectAllList(selectItem.id, page);
          }
        });
      } else {
        message.info('请输入特征名词');
      }
    }
  };

  handleTermCancel = () => {
    this.setState({
      termVisible: false,
    });
  };

  termStatuChange = (record) => {
    const { isEnable } = record;
    const newisEnable = Number(isEnable) === 1 ? '0' : '1';
    const { dispatch } = this.props;
    dispatch({
      type: 'sceneIntention/enableFeatureNoun',
      payload: {
        ids: record.id,
        isEnable: newisEnable,
      },
    }).then((res) => {
      if (res.success) {
        // 重新加载数据
        const { selectItem, page } = this.state;
        this.selectAllList(selectItem.id, page);
      }
    });
  };

  termChange = (e) => {
    const val = e.target.value;
    this.setState({
      curTermName: val,
    });
  };

  changeTermPage = (e) => {
    const { selectItem } = this.state;
    this.setState({
      page: e,
    });
    this.selectAllList(selectItem.id, e);
  };

  render() {
    // const that = this;
    const { loading, sceneId } = this.props;
    const { intentionList, selectItem, alterVisible, configVisible, termList } = this.state;
    const addPros = {
      sceneId,
      intention: selectItem,
      changSelectItem: this.changSelectItem,
      loading,
      onOk: this.handleAddOk.bind(this),
      closeModal: this.closeAlterOrConfig.bind(this),
    };
    const configPros = {
      sceneId,
      intention: selectItem,
      loading,
      updateSlotList: this.handleGetSlotList,
      handleOk: this.handleConfigOk,
      closeModal: this.closeAlterOrConfig.bind(this),
      // getByIntenId:this.getByIntenId.bind(this),
    };
    const dialogColumns = [
      {
        title: '对应标签',
        dataIndex: 'labelNameList',
        render: (list) => {
          return (
            list &&
            list.map((item) => {
              return (
                <Tag key={item} style={{ marginTop: 10 }}>
                  {item}
                </Tag>
              );
            })
          );
        },
      },
      {
        title: '词槽名称',
        dataIndex: 'name',
      },
      {
        title: '词槽描述',
        dataIndex: 'describes',
        render: (text, record) => {
          return (
            <Input
              onChange={(e) => {
                this.handleChangeData(record, 'describes', e.target.value);
              }}
              placeholder="请输入词槽描述"
              defaultValue={text}
            />
          );
        },
      },

      {
        title: '专有名词',
        dataIndex: 'pnounId',
        key: '',
        render: (operator, record) => {
          return (
            <Select
              value={operator}
              onChange={(v) => {
                this.handleChangeData(record, 'pnounId', v);
              }}
            >
              {this.state.SpecNoun.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.sortName}
                  </Select.Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        title: '生命周期',
        dataIndex: 'lifeCycle',
        width: '100px',
        render: (text, record) => {
          return (
            <Input
              onChange={(e) => {
                this.handleChangeData(record, 'lifeCycle', e.target.value);
              }}
              placeholder="生命周期"
              defaultValue={text}
            />
          );
        },
      },

      {
        title: '是否必填',
        dataIndex: 'isRequired',
        render: (text, record) => {
          return (
            <Checkbox
              checked={text === 'Y'}
              onChange={(e) => {
                e.target.checked
                  ? this.handleChangeData(record, 'isRequired', 'Y')
                  : this.handleChangeData(record, 'isRequired', 'N');
              }}
            >
              是
            </Checkbox>
          );
        },
      },
    ];
    const termColums = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '是否启用',
        dataIndex: 'isEnable',
        key: 'isEnable',
        render: (text, record) => (
          <Switch
            checkedChildren="启动"
            unCheckedChildren="未启动"
            checked={Boolean(Number(text))}
            onChange={() => {
              this.termStatuChange(record);
            }}
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.editTerm(record);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除改条特征名词吗？"
              onConfirm={() => {
                this.deleteTerm(record);
              }}
              okText="确认"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div className={classnames(styles.sample, 'flexBox')}>
        <div style={{ width: 200, overflow: 'auto', height: 550 }}>
          <p
            className={!selectItem.id ? styles.active : ''}
            onClick={() => {
              this.setSelectIntention();
            }}
          >
            <span className={styles.span}>意图</span>
            <Icon type="plus-circle" className={styles.addIcon} />
          </p>

          <Spin spinning={loading}>
            {intentionList.map((item) => {
              return (
                <p
                  key={item.id}
                  className={classnames(item.id === selectItem.id ? styles.active : '')}
                >
                  <span
                    className={classnames('pointer', styles.span)}
                    onClick={() => {
                      this.setSelectIntention(item);
                    }}
                  >
                    {item.name}
                  </span>
                  {item.id === selectItem.id && (
                    <Icon
                      type="delete"
                      onClick={(e) => this.deleteIntention(e, item)}
                      className={styles.icon}
                    />
                  )}
                  {/* {item.id === selectItem.id && (
                    <Icon
                      type="edit"
                      onClick={e => this.editIntention(e, item)}
                      className={styles.icon}
                    />
                  )} */}
                </p>
              );
            })}
          </Spin>
        </div>
        <div className=" flex1 border-left">
          {alterVisible && (
            <div>
              <AddSceneIntention {...addPros} onRef={this.onRef} />
              {!configVisible && (
                <Button
                  onClick={this.click}
                  type="primary"
                  loading={loading}
                  style={{ margin: '10px auto 10px', display: 'block' }}
                >
                  保存
                </Button>
              )}
            </div>
          )}
          {configVisible && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="对话样本" key="1">
                <ConfigSceneIntention {...configPros} />
                <Table
                  loading={loading}
                  columns={dialogColumns}
                  dataSource={this.state.dialogSampleList}
                  pagination={false}
                  size="small"
                  style={{ width: '70%', margin: 'auto' }}
                />

                <Button
                  onClick={this.click}
                  type="primary"
                  loading={loading}
                  style={{ margin: '10px auto 10px', display: 'block' }}
                >
                  保存
                </Button>
                <div
                  style={{
                    width: '54%',
                    margin: '20px auto',
                    padding: '10px',
                    border: '1px solid #d28787',
                    color: '#d28787',
                    borderRadius: '4px',
                  }}
                >
                  【提示】满足以下三个条件才可以成功保存配置：1.至少有一条词槽
                  2.至少有一条词槽为必填 3.必填词槽的词槽描述和生命周期不能为空且大于0
                </div>
              </TabPane>
              <TabPane tab="特征名词" key="2">
                <div style={{ margin: '10px 10px' }}>
                  <Search
                    placeholder="请输入名词"
                    onSearch={this.searchTerm}
                    style={{ width: 200 }}
                  />
                  <Button
                    onClick={this.showAdd}
                    type="primary"
                    style={{ margin: '0 10', display: 'block', float: 'right', cursor: 'pointer' }}
                  >
                    新增
                  </Button>
                </div>
                <Table
                  rowKey="id"
                  loading={loading}
                  columns={termColums}
                  dataSource={termList}
                  pagination={false}
                />
                <div style={{ textAlign: 'right', margin: '20px 0' }}>
                  <Pagination
                    defaultCurrent={1}
                    total={this.state.total}
                    pageSize={10}
                    onChange={this.changeTermPage}
                  />
                </div>
              </TabPane>
              <TabPane tab="回复配置" key="3">
                <RecoveryConfiguration
                  intentId={this.state.selectItem.id}
                  key={this.state.selectItem.id}
                />
              </TabPane>
            </Tabs>
          )}
          <Modal
            title="特征名词"
            visible={this.state.termVisible}
            onOk={this.handleTermOk}
            onCancel={this.handleTermCancel}
          >
            特征名词：
            <Input
              placeholder="请输入……"
              onChange={this.termChange}
              value={this.state.curTermName}
              style={{ display: 'inlineBlock', width: 350, marginLeft: 10 }}
            />
          </Modal>
        </div>
      </div>
    );
  }
}
