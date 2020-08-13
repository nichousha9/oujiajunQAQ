/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { withRouter } from 'dva/router';
import classnames from 'classnames';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import {
  Button,
  Form,
  Select,
  Row,
  Col,
  Input,
  Radio,
  Icon,
  DatePicker,
  InputNumber,
  TreeSelect,
  Modal,
  message,
  Tooltip,
} from 'antd';
import styles from './index.less';
import SearchTree from '@/components/SearchTree/index';
import CampaignModal from '@/pages/CampaignModal/index';
const { TreeNode } = TreeSelect;
const { Option } = Select;
const { TextArea } = Input;

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

@Form.create()
@connect(({ common, user, activityFlow }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
  ...activityFlow,
  userInfo: user.userInfo,
  userorgInfo: user.orgInfo && user.orgInfo.orgInfo,
}))
class ActivityDesc extends Component {
  constructor(props) {
    const {
      location: { query = {} },
      campaignId,
    } = props;
    super(props);
    this.fold = query.fold || ''; // 目录ID
    this.campaignState = 'Editing';
    this.state = {
      visible: false,
      id: query.id ? query.id : campaignId || '',
      isAutoCode: '1',
      ownerId: '',
      ownerName: '',
      // campaignBudget: '',
      // campaignCost: '',
      name: '',
      extName: undefined,
      tempName: undefined,
      extCode: undefined,
      busiType: query.busiType || '',
      priorityCode: undefined,
      startDate: undefined,
      endDate: undefined,
      // exclusionPeriod: '',
      isRunNotify: 'Y',
      description: '',
      campaignState: 'Editing',
      treeData: [],
      disabled: false,
      campaignVisible: false, // 活动互斥选择弹窗
      selectedCampaignList: [], // 互斥活动列表
      pathCode: query.pathCode || '', // 目录code
      exclusiveCampaignId: '',
      orgTree: [], // 区域树
      distributeRange: '',
      parentCode: '',
      isTemp: query.isTemp || 'N',
      tempState: query.tempState,
      tempType: query.tempType || 'add',
      nextLoding: false,
    };
  }

  componentDidMount = () => {
    // this.qryRegions();
    this.getSpecCode();
    const { id } = this.state;

    if (id) {
      this.getCampaignList(id);
    }
    // 获取目录树
    this.getTreeData();
  };

  // 获取活动详情
  getCampaignList = id => {
    const { dispatch } = this.props;
    const { tempState, tempType } = this.state;
    dispatch({
      type: 'activityFlow/getCampaignparticulars',
      payload: {
        id,
      },
      callback: res => {
        if (res && res.svcCont && res.svcCont.data) {
          const {
            svcCont: { data },
          } = res;
          const result = data;
          const {
            description,
            isRunNotify,
            // exclusionPeriod,
            endDate,
            startDate,
            busiType,
            isAutoCode,
            ownerId,

            //  campaignBudget,
            //  campaignCost,
            name,
            extName,
            extCode,
            ownerName,
            fold,
            priorityCode,
            campaignState,
            campaignExpNum,
            mccCampaignMutexList,
            folderCode,
            tempName,
          } = result;
          const { isAutoCode: autoCodeType } = this.state;
          this.fold = fold;
          if (tempState) {
            if (tempType === 'add') {
              this.campaignState = 'Editing';
              this.setState({ campaignState: 'Editing', extName: tempName });
            } else if (tempState === '00A') {
              this.campaignState = 'Editing';
            } else if (tempState === '00X') {
              this.campaignState = '';
            }
          } else {
            this.campaignState = campaignState || 'Editing';
            this.setState({ campaignState, extName });
          }

          this.setState({
            exclusiveCampaignId: result.id,
            disabled: this.campaignState !== 'Editing',
            description,
            isRunNotify,
            // exclusionPeriod,
            endDate: endDate === null ? '' : moment(endDate, 'YYYY-MM-DD HH:mm:ss'),
            startDate: startDate === null ? '' : moment(startDate, 'YYYY-MM-DD HH:mm:ss'),
            busiType,
            isAutoCode: isAutoCode || autoCodeType,
            ownerId,
            ownerName,
            // campaignBudget,
            // campaignCost,
            name,
            tempName,
            extCode,
            priorityCode,
            campaignExpNum,
            mccCampaignMutexList:
              (mccCampaignMutexList &&
                mccCampaignMutexList.map(item => item.campaignName).join(',')) ||
              '',
            selectedCampaignList:
              (mccCampaignMutexList &&
                mccCampaignMutexList.map(item => ({
                  ...item,
                  id: item.mutexCampaignId,
                  extName: item.campaignName,
                  extCode: item.campaignCode,
                  description: item.description,
                }))) ||
              [],
            pathCode: folderCode,
          });
        }
      },
    });
  };

  // 获取字典数值
  getSpecCode() {
    const { attrSpecCodeList, dispatch } = this.props;
    if (!attrSpecCodeList.CAMPAIGN_BUSI_TYPE) {
      dispatch({
        type: 'common/qryAttrValueByCode',
        payload: {
          attrSpecCode: 'CAMPAIGN_BUSI_TYPE',
        },
      });
    }
    if (!attrSpecCodeList.CAMPAIGN_PRIORITY_TYPE) {
      dispatch({
        type: 'common/qryAttrValueByCode',
        payload: {
          attrSpecCode: 'CAMPAIGN_PRIORITY_TYPE',
        },
      });
    }
  }

  validateCampaignCost = (rule, value, callback) => {
    const { form } = this.props;
    if (
      (value || value == 0) &&
      form.getFieldValue('campaignBudget') &&
      form.getFieldValue('campaignBudget') > value
    ) {
      callback('活动预算不能大于活动成本');
    } else {
      callback();
    }
  };

  validateCampaignBudget = (rule, value, callback) => {
    const { form } = this.props;
    if (
      (value || value == 0) &&
      form.getFieldValue('campaignCost') &&
      Number(value) > Number(form.getFieldValue('campaignCost'))
    ) {
      callback('活动预算不能大于活动成本');
    } else {
      callback();
    }
  };

  disabledStartDate = startValue => {
    const { form } = this.props;
    const endDate = form.getFieldValue('endDate');

    if (!startValue || !endDate) {
      return false;
    }

    return startValue.valueOf() > endDate.valueOf();
  };

  disabledEndDate = endValue => {
    const { form } = this.props;
    const startDate = form.getFieldValue('startDate');
    if (!endValue || !startDate) {
      return false;
    }
    return endValue.valueOf() <= startDate.valueOf();
  };

  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlow/getMccFolderList',
      payload: {},
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          treeData: res.svcCont.data,
        });
      }
    });
  };

  validateData = e => {
    e.preventDefault();
    const { id, selectedCampaignList, parentCode, isTemp, tempState, tempType } = this.state;
    const { form, dispatch, getActivityDesc, userInfo } = this.props;
    const ownerId =
      userInfo && userInfo.staffInfo && userInfo.staffInfo.staffId
        ? userInfo.staffInfo.staffId
        : '';
    const mccCampaignMutexListData = selectedCampaignList.map(item => ({
      mutexCampaignId: item.id,
    }));

    if (parentCode === '-1') {
      form.setFields({
        busiType: {
          errors: [new Error('请选择二级目录')],
        },
      });
    } else {
      form.validateFields((err, fieldsValue) => {
        if (!err) {
          this.setState({ nextLoding: true });
          const {
            endDate,
            startDate,
            description,
            exclusionPeriod,
            extCode,
            extName,
            tempName,
            busiType,
            priorityCode,
            isAutoCode,
          } = fieldsValue;
          if (tempType === 'edit') {
            const tempModelObj = {
              id,
              isTemp,
              tempName,
              isAutoCode,
              extCode: isAutoCode === '1' ? null : extCode,
              busiType,
              priorityCode,
              description,
              // type: tempType,
            };
            dispatch({
              type: `activityFlow/${id ? 'updateCampaignBasic' : 'saveCampaign'}`,
              payload: {
                ...tempModelObj,
                type: 'edit',
              },
            }).then(res => {
              if (res && res.svcCont && res.svcCont.data) {
                let campaignInfo = res.svcCont.data.campaign;
                // 不是自己创建的，则设置为完成只能看不能改

                // if (campaignInfo.ownerId != userInfo.userInfo.userId) {
                //   campaignInfo = {
                //     ...campaignInfo,
                //     campaignState: 'Finished',
                //   };
                // } else {
                campaignInfo = {
                  ...campaignInfo,
                  campaignState: this.campaignState !== 'Editing' ? '' : 'Editing',
                };
                // }

                getActivityDesc(res.svcCont.data.campaign.id, campaignInfo);
              } else {
                message.error(res && res.topCont && res.topCont.remark ? res.topCont.remark : '');
              }
              this.setState({ nextLoding: false });
            });
          } else if (tempType === 'add') {
            // console.log(isTemp);

            dispatch({
              type: `activityFlow/${id ? 'updateCampaignBasic' : 'saveCampaign'}`,
              payload: {
                id,
                isAutoCode,
                extCode: isAutoCode === '1' ? null : extCode,
                extName,
                ownerId,
                type: isTemp === 'Y' ? 'add' : 'edit',
                // fold: this.fold,
                description,
                busiType,
                priorityCode,
                isTemp,
                endDate: moment(endDate).format('YYYY-MM-DD HH:mm:ss'),
                startDate: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
                // descriptionTxt: description || '',
                // campaignState: this.campaignState,
                // campaignType: 'BATCH',
                // isAutoCode,
                // mccCampaignMutexList: mccCampaignMutexListData,
              },
            }).then(res => {
              if (res && res.svcCont && res.svcCont.data) {
                let campaignInfo = res.svcCont.data.campaign;
                // 不是自己创建的，则设置为完成只能看不能改

                if (campaignInfo.ownerId != userInfo.userInfo.userId) {
                  campaignInfo = {
                    ...campaignInfo,
                    campaignState: 'Finished',
                  };
                }

                getActivityDesc(res.svcCont.data.campaign.id || campaignInfo.id, campaignInfo);
              } else {
                message.error(res && res.topCont && res.topCont.remark ? res.topCont.remark : '');
              }
              this.setState({ nextLoding: false });
            });
          }
        }
      });
    }
  };

  handleCampaignVisible = () => {
    this.setState({ campaignVisible: true });
  };

  // 选完互斥活动
  handleOk = selectedCampaignList => {
    const { form } = this.props;
    const campaignNames = [];
    const campaignIds = [];
    if (selectedCampaignList.length > 3) {
      message.info('最多选择三条活动');
      return;
    }
    selectedCampaignList.map(campaign => {
      campaignNames.push(campaign.extName);
      campaignIds.push(campaign.id);
      return campaign;
    });

    // 回写到输入框
    form.setFieldsValue({ mccCampaignMutexList: campaignNames.join(',') });

    this.setState({
      selectedCampaignList,
      campaignVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({ campaignVisible: false });
  };

  // 查询区域
  // qryRegions = () => {
  //   const { dispatch, userorgInfo } = this.props;
  //   dispatch({
  //     type: 'activityFlow/qryAllLan',
  //     payload: {
  //       commonRegionId: userorgInfo.regionId,
  //     },
  //     success: svcCont => {
  //       const { data } = svcCont;
  //       this.setState({
  //         orgTree: data.map(v => ({ ...v, isLeaf: false })),
  //       });
  //     },
  //   });
  // };

  onChangeTree = (value, label, extra) => {
    this.setState({ parentCode: extra.triggerNode.props.parentCode });
  };

  render() {
    const {
      id,
      description,
      isRunNotify,
      name,
      // campaignBudget,
      // campaignCost,
      // exclusionPeriod,
      ownerId,
      isAutoCode,
      extName,
      tempName,
      extCode,
      busiType,
      priorityCode,
      startDate,
      endDate,
      visible,
      treeData,
      disabled,
      campaignVisible,
      selectedCampaignList,
      campaignExpNum,
      mccCampaignMutexList,
      pathCode,
      exclusiveCampaignId,
      campaignState,
      ownerName,
      isTemp,
      tempType,
      nextLoding,
      // orgTree,
      // distributeRange,
    } = this.state;
    const { userInfo, location } = this.props;
    const { query } = location;

    // console.log(treeData);
    // const ownerName =
    //   ownerId ||
    //   (userInfo && userInfo.staffInfo && userInfo.staffInfo.staffName
    //     ? userInfo.staffInfo.staffName
    //     : '');
    const {
      form: { getFieldDecorator },
      attrSpecCodeList: { CAMPAIGN_BUSI_TYPE, CAMPAIGN_PRIORITY_TYPE },
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    const loop = data =>
      data.map(item => {
        if (item.childTypes) {
          return (
            <TreeNode
              key={item.busiCode}
              title={item.busiName}
              value={item.busiCode}
              parentCode={item.parentCode}
            >
              {loop(item.childTypes)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.busiCode}
            title={item.busiName}
            value={item.busiCode}
            parentCode={item.parentCode}
          />
        );
      });

    return (
      <Fragment>
        <div className={styles.headerBox}>
          活动概述
          <Button
            type="primary"
            size="small"
            className={classnames('fr', styles.middle)}
            onClick={this.validateData}
            loading={nextLoding}
          >
            下一步
          </Button>
          <Button
            size="small"
            className={classnames('fr', 'mr10', styles.middle)}
            onClick={() => {
              router.push({
                pathname:
                  tempType === 'edit'
                    ? '/activityConfigModel'
                    : '/activityConfigManage/marketingActivityList',
                state: {
                  type: 'cancel',
                },
              });
            }}
          >
            关闭
          </Button>
        </div>
        <div className={styles.cententBox}>
          {/* <div className={styles.title}>基本信息</div> */}
          <Form className={styles.mainBox} {...formItemLayout}>
            <Row gutter={8} className={styles.formRow}>
              {tempType === 'add' ? (
                <Col span={8}>
                  <Form.Item label="活动名称">
                    {getFieldDecorator('extName', {
                      rules: [
                        { required: true, message: '请输入活动名称' },
                        { max: 20, message: '内容请控制在20个字符以内' },
                      ],
                      initialValue: extName,
                    })(
                      <Input
                        placeholder="请输入活动名称"
                        disabled={disabled}
                        size="small"
                        maxLength={21}
                      />,
                    )}
                  </Form.Item>
                </Col>
              ) : (
                <Col span={8}>
                  <Form.Item label="模板名称">
                    {getFieldDecorator('tempName', {
                      rules: [
                        { required: true, message: '请输入模板名称' },
                        { max: 20, message: '内容请控制在20个字符以内' },
                      ],
                      initialValue: tempName,
                    })(
                      <Input
                        placeholder="请输入模板名称"
                        disabled={disabled}
                        size="small"
                        maxLength={21}
                      />,
                    )}
                  </Form.Item>
                </Col>
              )}

              <Col span={8} className={styles.textEclicips}>
                <Form.Item label={<Tooltip title="自动生成活动编码">自动生成活动编码</Tooltip>}>
                  {getFieldDecorator('isAutoCode', {
                    rules: [],
                    initialValue: isAutoCode || '1',
                    onChange: e => {
                      const val = e.target.value;
                      this.setState({
                        isAutoCode: val,
                      });
                    },
                  })(
                    <Radio.Group disabled={disabled} size="small">
                      <Radio value="1">是</Radio>
                      <Radio value="0">否</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="活动编码">
                  {getFieldDecorator('extCode', {
                    rules: [
                      { required: isAutoCode === '0', message: '请输入活动编码' },
                      { max: 20, message: '内容请控制在20个字符以内' },
                    ],
                    initialValue: extCode,
                  })(
                    <Input
                      placeholder="活动编码"
                      disabled={isAutoCode !== '0'}
                      size="small"
                      maxLength={21}
                    />,
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="活动分类">
                  {getFieldDecorator('busiType', {
                    rules: [{ required: true, message: '请选择活动分类' }],
                    initialValue: busiType || query.fold,
                  })(
                    <TreeSelect
                      showSearch
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择活动分类"
                      allowClear
                      disabled={disabled}
                      treeDefaultExpandAll
                      onChange={this.onChangeTree}
                    >
                      {loop(treeData)}
                    </TreeSelect>,
                  )
                  /* eslint-disable react/jsx-wrap-multilines */
                  // <Input
                  //   disabled
                  //   placeholder="活动目录"
                  //   size="small"
                  //   suffix={
                  //     <Button
                  //       style={{ marginRight: -12 }}
                  //       type="primary"
                  //       size="small"
                  //       disabled={disabled}
                  //       onClick={() => {
                  //         this.setState({
                  //           visible: true,
                  //         });
                  //       }}
                  //     >
                  //       <Icon type="search" />
                  //     </Button>
                  //   }
                  // />,
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="优先级">
                  {getFieldDecorator('priorityCode', {
                    rules: [{ required: true, message: '请选择优先级' }],
                    initialValue: priorityCode,
                  })(
                    <Select placeholder="选择优先级" allowClear disabled={disabled} size="small">
                      {CAMPAIGN_PRIORITY_TYPE &&
                        CAMPAIGN_PRIORITY_TYPE.map(item => {
                          return (
                            <Option key={item.attrValueCode} value={item.attrValueCode}>
                              {item.attrValueName}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              {/* <Col span={8}>
                <Form.Item label="业务类型">
                  {getFieldDecorator('busiType', {
                    rules: [{ required: true, message: '请选择业务类型' }],
                    initialValue: busiType,
                  })(
                    <Select placeholder="选择业务类型" allowClear disabled={disabled} size="small">
                      {CAMPAIGN_BUSI_TYPE &&
                        CAMPAIGN_BUSI_TYPE.map(item => {
                          return (
                            <Option key={item.attrValueCode} value={item.attrValueCode}>
                              {item.attrValueName}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </Form.Item>
              </Col> */}
              {tempType === 'add' ? (
                <div>
                  <Col span={8}>
                    <Form.Item label="开始时间">
                      {getFieldDecorator('startDate', {
                        rules: [
                          { required: true, message: '请选择开始时间' },
                          {
                            validator: (rule, value, callback) => {
                              const currentDate = moment().startOf('day');
                              if (startDate === value) {
                                callback();
                              } else if (currentDate > value) {
                                callback('请不要选择过去的时间');
                              } else {
                                callback();
                              }
                            },
                          },
                        ],
                        initialValue: startDate,
                      })(
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          style={{ width: '100%' }}
                          size="small"
                          disabledDate={this.disabledStartDate}
                          disabled={disabled}
                        />,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="结束时间">
                      {getFieldDecorator('endDate', {
                        rules: [{ required: true, message: '请选择结束时间' }],
                        initialValue: endDate,
                      })(
                        <DatePicker
                          showTime
                          format="YYYY-MM-DD HH:mm:ss"
                          size="small"
                          className="fullWidth"
                          disabledDate={this.disabledEndDate}
                          disabled={disabled}
                        />,
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="状态">
                      {getFieldDecorator('name', {
                        rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
                        initialValue:
                          campaignState !== undefined ? status[campaignState].text : '编辑中',
                      })(<Input className="fullWidth" disabled size="small" maxLength={21} />)}
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item label="创建人">
                      {getFieldDecorator('ownerId', {
                        rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
                        initialValue: ownerName || userInfo.userInfo.userCode,
                      })(
                        <Input
                          placeholder="创建人"
                          className="fullWidth"
                          disabled
                          size="small"
                          maxLength={21}
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </div>
              ) : null}

              {/* <Col span={8} className={styles.textEclicips}>
                <Form.Item label={<Tooltip title="运行通知管理员">运行通知管理员</Tooltip>}>
                  {getFieldDecorator('isRunNotify', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: isRunNotify,
                  })(
                    <Radio.Group disabled={disabled} size="small">
                      <Radio value="Y">是</Radio>
                      <Radio value="N">否</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col> */}
              {/* <Col span={8} className={styles.textEclicips}>
                <Form.Item label="活动互斥">
                  {getFieldDecorator('mccCampaignMutexList', {
                    initialValue: mccCampaignMutexList,
                  })(
                    <Input.Search
                      size="small"
                      readOnly
                      allowClear
                      onSearch={this.handleCampaignVisible}
                    />,
                  )}
                </Form.Item>
              </Col> */}
              {/* <Col span={8} className={styles.textEclicips}>
                <Form.Item label={<Tooltip title="到期提醒天数">到期提醒天数</Tooltip>}>
                  {getFieldDecorator('campaignExpNum', {
                    initialValue: campaignExpNum,
                  })(<InputNumber min={0} precision={0} style={{ width: '100%' }} />)}
                </Form.Item>
              </Col> */}

              {/* <Col span={8} className={styles.textEclicips}>
                <Form.Item label={<Tooltip title="派发范围">派发范围</Tooltip>}>
                  {getFieldDecorator('distributeRange', {
                   // initialValue: distributeRange,
                  })(
                    <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择派发范围">
                      {orgTree &&
                        orgTree.map(item => {
                          return (
                            <Option key={item.commonRegionId} value={item.commonRegionId}>
                              {item.regionName}
                            </Option>
                          );
                        })}
                    </Select>,
                  )}
                </Form.Item>
              </Col> */}

              <Col span={24}>
                <Form.Item label="描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  {getFieldDecorator('description', {
                    rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                    initialValue: description,
                  })(
                    <TextArea
                      placeholder="请输入活动描述"
                      disabled={disabled}
                      size="small"
                      maxLength={151}
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <Modal
          title="营销目录"
          visible={visible}
          onOk={() => {
            const { currentData } = this.SearchTree;
            const { form } = this.props;
            if (!currentData) {
              message.error('请选择目录');
              return;
            }
            this.fold = currentData.eventKey;
            this.setState({
              visible: false,
              busiType: currentData.name,
              pathCode: currentData.dataRef && currentData.dataRef.code,
            });
            form.setFieldsValue({ busiType: currentData.name });
          }}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          centered
        >
          <SearchTree
            treeData={treeData}
            showButtons={false}
            Refs={v => {
              this.SearchTree = v;
            }}
          />
        </Modal>
        {campaignVisible ? (
          <CampaignModal
            campaignVisible
            exclusiveCampaignId={exclusiveCampaignId}
            fold={this.fold}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
            initSelectedCampaignList={selectedCampaignList}
            pathCode={pathCode}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default withRouter(ActivityDesc);
