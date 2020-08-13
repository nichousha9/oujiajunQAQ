/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import {
  Card,
  Button,
  Input,
  Row,
  Col,
  Icon,
  Form,
  Radio,
  DatePicker,
  Select,
  Menu,
  Dropdown,
  List,
  Pagination,
  Badge,
  message,
  Popconfirm,
  Modal,
  Tooltip,
  Table,
  Divider,
} from 'antd';
import { router } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont';
import ApproveTable from './ApproveTable';
import UserChoose from './components/UserChoose';
import ActivityModel from './ActivityModel';
import SelectactivityConfigModel from './SelectactivityConfigModel';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

const status = {
  Editing: { type: 'processing', text: '编辑中' }, // 编辑中
  Running: { type: 'success', text: '运行' }, // 运行
  Suspended: { type: 'warning', text: '已暂停' }, // 暂停
  Termination: { type: 'error', text: '终止' }, // 终止
  Finished: { type: 'default', text: '已结束' },
  Published: { type: 'success', text: '已发布' }, // 已发布
  ToPublished: { type: 'warning', text: '待发布' }, // 待发布
  Approvaling: { type: 'warning', text: '审核中' }, // 审核中
  // Deleted: 'default', // 已失效
  Publishing: { type: 'success', text: '发布中' }, // 发布中
  'Audit failed': { type: 'error', text: '审核不通过' }, // 审核不通过
};

// Approvaling  审核中
// Editing  编辑中
// Published  已发布
// Running  执行中
// Suspended  已暂停
// Finished  已完成（表示正常结束）

// Deleted  已删除

@connect(({ user, marketingActivityList, loading }) => ({
  userInfo: user.userInfo && user.userInfo.userInfo,
  marketingActivityList,
  loading: loading.effects['marketingActivityLis/getMccFolderList'],
}))
@Form.create()
class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterShow: 'none',
      extName: '', // 活动名称，
      ApprovalProcessedList: [],
      stateType: [], // 状态编码
      CampaignList: [], // 活动列表
      curpage: 1, // 当前请求的是第几页 默认写1
      pageTatal: 0, // 页数总数 默认写 0
      formValues: {
        compainType: 1,
      },
      pageSize: 10, // 默认页面树为10
      surePublishVisible: false, // 确定发布是否需要审核弹窗显示
      curItem: {},
      approveTableVisible: false, // 是否展示审核模板选择弹窗
      userChooseModal: false,
      choosedApprovalUser: [],
      schemeId: '',
      activityVisible: false, // 转成模板
      activityItem: {}, // 活动详情
      activityConfigModelShow: false,
      recycleItem: {},
      rcycleVisible: false,
      addVisible: false,
    };
  }

  componentWillMount() {
    // this.qryApprovalProcessedList();
    this.qryAttrValueByCode();
    this.getCampaignList();
  }

  componentDidUpdate(nextProps) {
    const { nodeKey, nodePath } = this.props;
    if (nodeKey != nextProps.nodeKey || nodePath != nextProps.nodePath) {
      this.getCampaignList();
    }
  }

  qryApprovalProcessedList = () => {
    const { dispatch, userInfo } = this.props;
    dispatch({
      type: 'marketingActivityList/qryApprovalProcessedList',
      payload: {
        state: 'A',
        approverId: userInfo && userInfo.userId,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const listData = res.svcCont.data;
        const arr = ['-1'];
        listData.forEach(item => {
          arr.push(item.id);
        });
        this.setState({
          ApprovalProcessedList: arr,
        });
      }
    });
  };

  showAdvancedFilter = () => {
    const { advancedFilterShow } = this.state;
    if (advancedFilterShow === 'none') {
      this.setState({
        advancedFilterShow: 'block',
      });
    } else {
      this.setState({
        advancedFilterShow: 'none',
      });
    }
  };

  getSearchValue = e => {
    this.setState({
      extName: e.target.value,
    });
  };

  getCampaignList = () => {
    const { dispatch, nodeKey, nodePath, parentCode, userInfo } = this.props;
    // console.log(this.props);
    const { extName, curpage, pageSize, formValues, ApprovalProcessedList } = this.state;
    const { compainType } = formValues;
    // let obj = {};
    // if (compainType === 1) {
    //   // 我的活动
    //   obj = {
    //     busiType: nodeKey || 'MARKETING',
    //     // pathCode: nodePath || '-1',
    //   };
    // } else if (compainType === 2) {
    //   obj = {
    //     busiType: nodeKey || 'MARKETING',
    //     // pathCode: nodePath || '-1',
    //     appIdList: ApprovalProcessedList,
    //   };
    // } else {
    //   obj = {
    //     busiType: '',
    //     // pathCode: '',
    //   };
    // }
    dispatch({
      type: 'marketingActivityList/getCampaignList',
      payload: {
        // userId: userInfo && userInfo.userId,
        extName,
        ...formValues,
        // ...obj,
        ownerId: userInfo.userId,
        busiType: nodeKey,
        parentCode: parentCode || '-1',
        pageInfo: {
          pageNum: curpage,
          pageSize,
        },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          CampaignList: res.svcCont.data,
          pageTatal: res.svcCont.pageInfo.total,
        });
      }
    });
  };

  qryAttrValueByCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'CAMPAIGN_STATE_TYPE',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const arr1 = res.svcCont.data;
        const newarr = [];
        arr1.forEach(item => {
          newarr.push({
            name: item.attrValueName,
            campaignState: item.attrValueCode,
          });
        });
        this.setState({
          stateType: newarr,
        });
      }
    });
  };

  afterOperate = res => {
    if (res && res.topCont && res.topCont.resultCode === 0) {
      this.getCampaignList();
    } else {
      message.info((res && res.topCont && res.topCont.remark) || '操作失败');
    }
  };

  /**
   *终止活动
   *
   * @memberof ListItem
   */
  terminateCampaign = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/terminateCampaign',
      payload: {
        id: record.id,
      },
    }).then(this.afterOperate);
  };

  /**
   *
   *暂停活动接口
   * @memberof ListItem
   */
  suspendCampaign = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/suspendCampaign',
      payload: {
        id: record.id,
        campaignState: 'Suspended',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.getCampaignList();
        dispatch({
          type: 'marketingActivityList/shutdownJobByCamId',
          payload: {
            id: record.id,
          },
        });
      } else {
        message.info((res && res.topCont && res.topCont.remark) || '操作失败');
      }
    });
  };

  /**
   *
   *还原活动接口
   * @memberof ListItem
   */
  resumeCampaign = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/resumeCampaign',
      payload: {
        id: record.id,
        campaignState: 'Suspended',
      },
    }).then(this.afterOperate);
  };

  /**
   *
   *活动转为初始接口
   * @memberof ListItem
   */
  changeCampaignStateToEditing = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/changeCampaignStateToEditing',
      payload: {
        id: record.id,
        campaignState: 'Editing',
      },
    }).then(this.afterOperate);
  };

  /**
   *一键发布活动接口
   *
   * @memberof ListItem
   */
  toPubCamp = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/toPubCamp',
      payload: {
        id: record.id,
        campaignState: 'Published',
      },
    }).then(this.afterOperate);
  };

  /**
   *交接功能
   *
   * @memberof ListItem
   */

  // 打开弹出
  connectModel = record => {
    console.log(record);
    this.setState({
      schemeId: record.id,
      userChooseModal: true,
    });
  };

  // 取消弹出
  hideUserChooseModal = () => {
    this.setState({ userChooseModal: false });
  };

  // 选择审核人成功
  chooseUser = selecteds => {
    const { dispatch, userInfo } = this.props;
    const { schemeId } = this.state;

    dispatch({
      type: 'marketingActivityList/handoverCampaign',
      payload: {
        sysUserCode: userInfo.userCode,
        handoverId: selecteds.sysUserId,
        handoverCode: selecteds.sysUserCode,
        campaignId: schemeId,
      },
      success: res => {
        const {
          topCont: { remark },
        } = res;
        if (remark === '处理成功') {
          this.getCampaignList();
          this.hideUserChooseModal();
          message.success('交接成功');
        }
      },
    });
  };

  /**
   *活动发布不需要审核接口
   *
   * @memberof ListItem
   */
  publishCampaignWithoutApproval = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/publishCampaignWithoutApproval',
      payload: {
        id: record.id,
        campaignState: record.campaignState, // 活动状态
        isNeedApprove: 'N', // 示范需要审批
      },
    }).then(res => {
      this.setState({ surePublishVisible: false, curItem: {} });
      this.afterOperate(res);
    });
  };

  /**
   *
   *删除活动
   * @memberof ListItem
   */
  delCampaign = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/toPubCamp',
      payload: {
        id: record.id,
        campaignState: 'Deleted',
      },
    }).then(this.afterOperate);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const startDate = values.startDate && values.startDate.format('YYYY-MM-DD HH:mm:ss');
        const endDate = values.endDate && values.endDate.format('YYYY-MM-DD HH:mm:ss');
        this.setState(
          {
            formValues: { ...values, startDate, endDate },
          },
          () => {
            this.getCampaignList();
          },
        );
      }
    });
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ formValues: {}, curpage: 1 }, this.getCampaignList);
  };

  onPageChange = e => {
    this.setState(
      {
        curpage: e,
      },
      () => {
        this.getCampaignList();
      },
    );
  };

  onShowSizeChange = (cur, size) => {
    this.setState(
      {
        curpage: cur,
        pageSize: size,
      },
      () => {
        this.getCampaignList();
      },
    );
  };

  // 选择审核模版
  handleApprove = approveId => {
    const { curItem } = this.state;
    const { dispatch } = this.props;
    if (approveId.length) {
      dispatch({
        type: 'activityReview/insertApprovalRecord',
        payload: {
          approvalFlowchartId: parseInt(approveId[0], 10), // 流程（模版）id
          taskOrderId: parseInt(curItem.id, 10), // 活动id
        },
        success: () => {
          this.getCampaignList();
          this.setState({ approveTableVisible: false });
        },
      });
    } else {
      message.error('请选择一个模板!');
    }
  };

  // 选择不需要审核
  handleCancelApprove = e => {
    const { dispatch } = this.props;
    const { curItem } = this.state;
    if (e.target.nodeName !== 'BUTTON') {
      // 如果点击的不是按钮，那么直接关闭
      this.setState({
        surePublishVisible: false,
      });
      return;
    }
    dispatch({
      type: 'marketingActivityList/judgeCampaignFromSms',
      payload: {
        mccCampaignId: parseInt(curItem.id, 10),
      },
    }).then(({ svcCont }) => {
      const { data } = svcCont;
      // 判断是否需要审核，为1需要审核，0不需要审核
      if (data.count) {
        message.warning('该活动必须审核!');
        this.setState({
          surePublishVisible: false,
          approveTableVisible: true,
        });
      } else {
        this.publishCampaignWithoutApproval(curItem);
      }
    });
  };

  getMenu = item => {
    const state = item.campaignState;
    const suspendShow = state === 'Published'; // 发布状态可用
    const resumeShow = state === 'Suspended'; // 暂停
    // const terminaShow = state === 'Editing' || state === 'Published' || state == 'Suspended'; // 编辑、发布、暂停
    const changeCampaignShow = state === 'Suspended';
    const publishShow = state === 'Editing' || state === 'Approving';
    const toPublishShow = state === 'ToPublished'; // 待发表
    // const connectShow = state === 'Editing'; // 交接
    const activityModel = state !== 'Finished'; // 模板
    const recycleModel = state === 'Published'; // 完成
    return (
      <Menu className="drop-menu-style">
        {suspendShow && (
          <Menu.Item>
            <a onClick={this.suspendCampaign.bind(this, item)}>
              {formatMessage({
                id: 'activityConfigManage.marketingActivityList.suspend',
              })}
            </a>
          </Menu.Item>
        )}
        {/* {resumeShow && (
          <Menu.Item>
            <a onClick={this.resumeCampaign.bind(this, item)}>
              {formatMessage({
                id: 'activityConfigManage.marketingActivityList.resume',
              })}
            </a>
          </Menu.Item>
        )} */}
        {/* {terminaShow && (
          <Menu.Item>
            <a onClick={this.terminateCampaign.bind(this, item)}>
              {formatMessage({
                id: 'activityConfigManage.marketingActivityList.terminate',
              })}
            </a>
          </Menu.Item>
        )} */}
        {changeCampaignShow && (
          <Menu.Item>
            <a onClick={this.changeCampaignStateToEditing.bind(this, item)}>
              {formatMessage({
                id: 'activityConfigManage.marketingActivityList.resetState',
              })}
            </a>
          </Menu.Item>
        )}
        {publishShow && (
          <Menu.Item>
            <a
              onClick={() => {
                // this.setState({ surePublishVisible: true, curItem: item });
                this.toPubCamp(item);
              }}
            >
              {formatMessage({
                id: 'activityConfigManage.marketingActivityList.publish',
              })}
            </a>
          </Menu.Item>
        )}
        {toPublishShow && (
          <Menu.Item>
            <a onClick={this.toPubCamp.bind(this, item)}>
              {formatMessage({
                id: 'activityConfigManage.marketingActivityList.toPubCamp',
              })}
            </a>
          </Menu.Item>
        )}
        {activityModel && (
          <Menu.Item>
            <a onClick={this.showActivityModel.bind(this, item)}>转成模板</a>
          </Menu.Item>
        )}
        {recycleModel && (
          <Menu.Item>
            <a onClick={this.showRecycleModel.bind(this, item)}>回收</a>
          </Menu.Item>
        )}
        {/* {connectShow && (
          <Menu.Item>
            <a onClick={this.connectModel.bind(this, item)}>
              {formatMessage({
                id: 'activityConfigManage.marketingActivityList.connect',
              })}
            </a>
          </Menu.Item>
        )} */}
      </Menu>
    );
  };

  // 新增活动
  addActivity = () => {
    const { nodeKey, nodePath, folderName, parentCode } = this.props;

    if (parentCode === '-1') {
      message.warn('请选择二级目录');
    } else {
      this.setState({ addVisible: false });
      router.push({
        pathname: '/activityConfigManage/activityFlow',
        query: {
          fold: nodeKey,
          folderName,
          pathCode: nodePath,
          parentCode,
        },
      });
    }
  };

  // 转成模板
  showActivityModel = record => {
    this.setState({
      activityItem: record,
      activityVisible: true,
    });
  };

  showAddActivity = e => {
    this.setState({
      addVisible: true,
    });
  };

  showRecycleModel = record => {
    this.setState({
      recycleItem: record,
      rcycleVisible: true,
    });
  };

  handleOk = tempName => {
    const {
      activityItem: { ownerId, id },
    } = this.state;
    const { dispatch } = this.props;
    const timeObj = {
      tempName,
      ownerId,
      id,
      isTemp: 'Y',
    };
    dispatch({
      type: 'marketingActivityList/copyCampaignInfo',
      payload: timeObj,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success('模板生成成功');
        this.setState({
          activityVisible: false,
        });
      } else {
        message.error(res.topCont.remark);
      }
    });
  };

  handleRcycleOk = e => {
    const {
      recycleItem: { id },
    } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'marketingActivityList/updContactArchiveByCamId',
      payload: { campaignId: id },
      callback: res => {
        if (res && res.topCont && res.topCont.resultCode === 0) {
          message.success('回收成功');
          this.setState({
            rcycleVisible: false,
          });
        } else {
          message.error(res.topCont.remark);
        }
      },
    });
  };

  handleCancel = e => {
    this.setState({
      activityVisible: false,
    });
  };

  handleRcycleCancel = e => {
    this.setState({
      rcycleVisible: false,
    });
  };

  handleAddCancel = e => {
    this.setState({
      addVisible: false,
    });
  };

  activityConfigModelCancel = e => {
    this.setState({
      activityConfigModelShow: false,
    });
  };

  activityConfigModelShowOk = record => {
    router.push({
      pathname: '/activityConfigManage/activityFlow',
      query: {
        id: record.id,
        isTemp: 'Y',
        tempState: '00A',
        tempType: 'add',
      },
    });
  };

  render() {
    const { loading } = this.props;
    const {
      advancedFilterShow,
      stateType,
      CampaignList,
      curpage,
      pageTatal,
      pageSize,
      surePublishVisible,
      curItem,
      formValues,
      approveTableVisible,
      activityConfigModelShow,
      schemeId,
      userChooseModal,
      choosedApprovalUser,
      activityVisible,
      rcycleVisible,
      addVisible,
    } = this.state;
    const topRightDiv = (
      <div>
        {/* <Button
          type="primary"
          size="small"
          onClick={() => this.setState({ activityConfigModelShow: true })}
        >
          通过模板创建活动
        </Button> */}
        <Button
          type="primary"
          size="small"
          onClick={this.showAddActivity}
          style={{ marginLeft: 10 }}
        >
          新增
        </Button>
        <Search
          maxLength={21}
          size="small"
          placeholder={formatMessage({
            id: 'activityConfigManage.marketingActivityList.filterNameTip',
          })}
          onSearch={this.getCampaignList}
          onChange={value => this.getSearchValue(value)}
          className="filter-input"
        />
        <a className="dropdown-style" onClick={this.showAdvancedFilter}>
          {formatMessage({
            id: 'activityConfigManage.marketingActivityList.advancedFilter',
          })}
          {advancedFilterShow === 'none' ? <Icon type="down" /> : <Icon type="up" />}
        </a>
      </div>
    );
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const activityModelInfo = {
      visible: activityVisible,
      handleOk: this.handleOk,
      handleCancel: this.handleCancel,
    };

    const SelectactivityConfigModelInfo = {
      visible: activityConfigModelShow,
      handleOk: this.activityConfigModelShowOk,
      handleCancel: this.activityConfigModelCancel,
    };

    const columns = [
      {
        title: '活动名称',
        dataIndex: 'extName',
        key: 'extName',
        ellipsis: true,
        render: (text, record) => {
          return <Link to={`/activityConfigManage/activityFlow?id=${record.id}`}>{text}</Link>;
        },
      },
      {
        title: '活动编码',
        dataIndex: 'extCode',
        key: 'extCode',
      },
      {
        title: '活动说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: '登陆人',
        dataIndex: 'ownerId',
        key: 'ownerId',
        // ellipsis: true,
        render: text => {
          const { userInfo } = this.props;
          return <span>{text === userInfo.userId ? userInfo.userName : text}</span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'campaignState',
        key: 'campaignState',
        render: text => {
          return <Badge status={status[text].type || ''} text={status[text].text || ''} />;
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        key: 'endDate',
        ellipsis: true,
      },
      {
        title: '操作',
        dataIndex: 'campaignState',
        key: 'id',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              {text === 'Editing' ? (
                <Link to={`/activityConfigManage/activityFlow?id=${record.id}`}>
                  {formatMessage({
                    id: 'activityConfigManage.marketingActivityList.edit',
                  })}
                </Link>
              ) : (
                <span className="operate-disable">
                  {formatMessage({
                    id: 'activityConfigManage.marketingActivityList.edit',
                  })}
                </span>
              )}

              <Divider type="vertical" />

              {text === 'Editing' ? (
                <Popconfirm
                  title={formatMessage({
                    id: 'activityConfigManage.marketingActivityList.deleteTip',
                  })}
                  onConfirm={() => {
                    this.delCampaign(record);
                  }}
                  okText={formatMessage({
                    id: 'activityConfigManage.marketingActivityList.yes',
                  })}
                  cancelText={formatMessage({
                    id: 'activityConfigManage.marketingActivityList.cancel',
                  })}
                >
                  <a>
                    {formatMessage({
                      id: 'activityConfigManage.marketingActivityList.delete',
                    })}
                  </a>
                </Popconfirm>
              ) : (
                <span className="operate-disable">
                  {formatMessage({
                    id: 'activityConfigManage.marketingActivityList.delete',
                  })}
                </span>
              )}

              <Divider type="vertical" />

              {text === 'Finished' ||
              text === 'Termination' ||
              text === 'Approvaling' || // 判断是否为在审核状态
              text === 'Publishing' || // 判断是否为发布中状态
              text === 'Audit failed' ? ( // 判断是否为审核失败状态
                <span className="operate-disable">
                  {formatMessage({
                    id: 'activityConfigManage.marketingActivityList.more',
                  })}
                  <Icon type="down" />
                </span>
              ) : (
                <Dropdown overlay={this.getMenu(record)}>
                  <a>
                    {formatMessage({
                      id: 'activityConfigManage.marketingActivityList.more',
                    })}
                    <Icon type="down" />
                  </a>
                </Dropdown>
              )}
            </div>
          );
        },
      },
    ];

    return (
      <Fragment>
        <Modal
          visible={surePublishVisible}
          title={formatMessage({
            id: 'activityConfigManage.marketingActivityList.publish',
          })}
          onOk={() => {
            this.setState({
              surePublishVisible: false,
              approveTableVisible: true,
            });
          }}
          onCancel={this.handleCancelApprove}
          okText="是"
          cancelText="否"
        >
          <p>
            {formatMessage({
              id: 'activityConfigManage.marketingActivityList.publicTip',
            })}
            ?
          </p>
        </Modal>
        {approveTableVisible && (
          <ApproveTable
            onOk={this.handleApprove}
            onCancel={() => {
              this.setState({ approveTableVisible: false });
            }}
            activityId={curItem}
          />
        )}
        <Card title="活动列表" extra={topRightDiv} size="small" className="common-card">
          <div style={{ display: advancedFilterShow }} className="show-advanced-div">
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              onSubmit={this.handleSubmit}
              className="formStyle"
            >
              <Row className="row-bottom-line">
                {/* <Col span={2}>
                  <span>
                    {formatMessage({
                      id: 'activityConfigManage.marketingActivityList.otherFilter',
                    })}
                    :
                  </span>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={formatMessage({
                      id: 'activityConfigManage.marketingActivityList.compainType',
                    })}
                  >
                    {getFieldDecorator('compainType', {
                      initialValue: formValues.compainType,
                    })(
                      <Radio.Group>
                        <Radio value={1}>
                          {formatMessage({
                            id: 'activityConfigManage.marketingActivityList.compainType1',
                          })}
                        </Radio>
                        <Radio value={2}>
                          {formatMessage({
                            id: 'activityConfigManage.marketingActivityList.compainType2',
                          })}
                        </Radio>
                        <Radio value={3}>
                          {formatMessage({
                            id: 'activityConfigManage.marketingActivityList.compainType3',
                          })}
                        </Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </Col> */}
                <Col span={8}>
                  <Form.Item
                    label={formatMessage({
                      id: 'activityConfigManage.marketingActivityList.extCode',
                    })}
                  >
                    {getFieldDecorator('extCode', {
                      rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
                    })(
                      <Input
                        size="small"
                        maxLength={21}
                        placeholder={formatMessage({
                          id: 'activityConfigManage.marketingActivityList.inputTip',
                        })}
                      />,
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={formatMessage({
                      id: 'activityConfigManage.marketingActivityList.state',
                    })}
                  >
                    {getFieldDecorator('campaignState', {})(
                      <Select
                        style={{ width: '70%' }}
                        size="small"
                        placeholder={formatMessage({
                          id: 'activityConfigManage.marketingActivityList.selectTip',
                        })}
                      >
                        {stateType.map(item => (
                          <Option key={item.campaignState} value={item.campaignState}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <div style={{ marginTop: 6 }}>
                    <Button
                      style={{ float: 'right', marginLeft: '6px' }}
                      size="small"
                      onClick={this.resetForm}
                    >
                      {formatMessage({
                        id: 'activityConfigManage.marketingActivityList.reset',
                      })}
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="small"
                      style={{ float: 'right' }}
                    >
                      {formatMessage({
                        id: 'activityConfigManage.marketingActivityList.search',
                      })}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>

          <Table
            rowKey="id"
            dataSource={CampaignList}
            columns={columns}
            pagination={false}
            loading={loading}
            className="common-list"
          />

          {pageTatal > 0 && (
            <div className="pagination-style">
              <Pagination
                showQuickJumper
                showSizeChanger
                onShowSizeChange={this.onShowSizeChange}
                defaultCurrent={1}
                current={curpage}
                total={pageTatal}
                pageSize={pageSize}
                onChange={this.onPageChange}
              />
            </div>
          )}

          {userChooseModal && (
            <UserChoose
              schemeId={schemeId}
              selectedRows={choosedApprovalUser}
              onOk={this.chooseUser}
              onCancel={this.hideUserChooseModal}
            />
          )}
        </Card>

        {activityConfigModelShow && (
          <SelectactivityConfigModel {...SelectactivityConfigModelInfo} />
        )}

        {activityVisible && <ActivityModel {...activityModelInfo} />}

        {/* {rcycleVisible && <ActivityModel {...activityModelInfo} />} */}

        <Modal
          title="回收工单"
          centered
          visible={rcycleVisible}
          onOk={this.handleRcycleOk}
          onCancel={this.handleRcycleCancel}
        >
          <p>回收后已派发、未执行、已执行的工单将统一被回收归档，您确认回收？</p>
        </Modal>

        <Modal
          title="活动配置方案"
          centered
          visible={addVisible}
          onCancel={this.handleAddCancel}
          footer={null}
        >
          <Row gutter={24}>
            <Col span={12} className={styles.addActivity}>
              <Button
                type="primary"
                icon="file-add"
                onClick={this.addActivity}
                style={{ fontSize: 48, width: 100, height: 100 }}
              />
              <span className={styles.addText}>自定义活动配置</span>
              <span style={{ fontSize: 12 }}>（支持可视化操作自定义活动）</span>
            </Col>
            <Col span={12} className={styles.addActivity}>
              <Button
                type="primary"
                icon="folder-add"
                onClick={() => this.setState({ addVisible: false, activityConfigModelShow: true })}
                style={{ fontSize: 48, width: 100, height: 100 }}
              />
              <span className={styles.addText}>选择活动模板</span>
              <span style={{ fontSize: 12 }}>（支持引用活动模板进行编辑）</span>
            </Col>
          </Row>
        </Modal>
      </Fragment>
    );
  }
}

export default ListItem;
