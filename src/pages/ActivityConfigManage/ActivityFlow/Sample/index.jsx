// Sample节点
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, message, InputNumber, Radio, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont';
import InputCell from '../components/InputCell/index';
import CustomSelect from '@/components/CustomSelect';
import SearchTree from '@/components/SearchTree/index';
import SampleTable from './SampleTable';
import commonStyles from '../common.less';

@connect(({ user, loading, activityFlowContact }) => ({
  userInfo: user.userInfo,
  loading:
    loading.effects['activityFlowSample/addProcess'] ||
    loading.effects['activityFlowSample/modProcess'],
  activityFlowContact,
}))
class Sample extends React.Component {
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  formItemLayout2 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  constructor(props) {
    super(props);
    this.state = {
      // 环节信息
      processInfo: {},
      visible: false, // 排序标签弹窗
      dimList: [], // 标签树
      labels: [], // 选中的标签
    };
    // 储存已请求的目录id
    this.getDimListIdArr = [];
    const { nodeData = {}, activityInfo = {} } = props;
    const {
      channelid: channelId, // 渠道id
      processname: processName, // 节点名称
      isaccumulation: isAccumulation, // 渠道是否累计展示
      PROCESS_ID: processId, // 环节id
      processType, // 环节类型
      channelcode: channelCode,
      isresponsetemp: isResponseTemp, // 是否展示回复模板
      iseffdate: isEffDate, // 是否展示有效期
      tempProcessId,
      actionType,
    } = nodeData;
    const {
      id: flowchartId, // 流程id
      campaignId,
      name: flowchartName, // 流程名字
      campaignState, // 活动流程状态
    } = activityInfo;
    // 用到的流程图传来的信息
    this.selectItem = {
      channelId, // 渠道id
      processName, // 节点名称
      isAccumulation, // 渠道是否累计展示
      processId, // 环节id
      processType, // 环节类型
      channelCode,
      flowchartId, // 流程id
      flowchartName, // 流程名字
      campaignId, // 活动id
      isResponseTemp: isResponseTemp === 1 || isResponseTemp === '1',
      campaignState, // 活动流程状态
      isEffDate: isEffDate === 1 || isEffDate === '1', // 是否展示有效期
      tempProcessId,
      actionType,
    };
    if (actionType === 'A') {
      this.tableCode = `MCC_X_${processType}_${tempProcessId}`;
    } else {
      this.tableCode = `MCC_X_${processType}_${processId}`;
    }
  }

  componentDidMount() {
    this.fetchInitilaData();
    this.getDimList();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'activityFlowContact/reset' });
  }

  // 获取初始数据
  fetchInitilaData = () => {
    const { dispatch } = this.props;
    const { processId } = this.selectItem;
    if (!processId) {
      return;
    }
    dispatch({
      type: 'activityFlowSample/qryProcess',
      payload: { id: processId },
      success: svcCont => {
        const { data = {} } = svcCont;
        this.setState(({ processInfo }) => {
          return {
            processInfo: {
              ...processInfo,
              ...data,
            },
          };
        });
      },
    });
    // 获取sample初始数据
    dispatch({
      type: 'activityFlowSample/qryTarGrps',
      payload: { processId },
      success: svcCont => {
        const { data: tarGrpRels = [] } = svcCont;
        if (tarGrpRels && tarGrpRels.length) {
          const tarGrpRel = tarGrpRels[0];
          const { sebgmentKind, sampleSortType, sortType } = tarGrpRel;
          const labels = [];
          if (sampleSortType === '2') {
            const labelRel = {};
            labelRel.id = tarGrpRel.labelCode;
            labelRel.name = tarGrpRel.labelName;
            labels.push(labelRel);
          }
          this.setState(({ processInfo }) => {
            return {
              processInfo: {
                ...processInfo,
                tarGrpRels,
                sampleNum: tarGrpRels.length,
                sebgmentKind,
                sampleSortType,
                sortType,
                labels,
              },
            };
          });
        }
      },
    });
  };

  // 获取左侧树列表
  getDimList = id => {
    return new Promise(resolve => {
      if (this.getDimListIdArr.indexOf(id) > -1) {
        // 已请求
        resolve();
        return;
      }
      if (id) this.getDimListIdArr.push(id);
      const { dispatch } = this.props;
      dispatch({
        type: 'activityFlowSample/getDimList',
        payload: {
          id,
        },
        success: async res => {
          await this.formatDimList(id, res.data);
          resolve();
        },
      });
    });
  };

  // 格式化标签树 id为父级目录，data为节点数据
  formatDimList = (id, data) => {
    return new Promise(resolve => {
      const { dimList } = this.state;
      const treeArr = data.map(item => ({
        id: item.id,
        parentGrpId: item.parent_grp_id,
        labelId: item.obj_id,
        title: item.name || '',
        key: item.id,
        isLeaf: !item.isParent,
        children: [],
        labelValueType: item.labelValueType,
        labelDataType: item.label_Date_type,
        tableCode: item.tar_table_code,
      }));
      let newArr = [].concat(dimList);
      if (!id) {
        newArr = treeArr;
      } else {
        treeArr.forEach(item => {
          const parentItem = this.findTreeItem(`cat_${item.parentGrpId}`, newArr);
          if (parentItem) {
            parentItem.children.push(item);
          }
        });
      }
      this.setState(
        {
          dimList: newArr,
        },
        () => {
          resolve();
        },
      );
    });
  };

  // 根据id遍历已有标签树，返回对应treeItem
  findTreeItem = (id, treeArr) => {
    let treeItem;
    treeArr.forEach(item => {
      if (item.id === id) {
        treeItem = item;
      } else if (item.children && item.children.length) {
        treeItem = this.findTreeItem(id, item.children);
      }
    });
    return treeItem;
  };

  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  // 选择标签
  addLable = () => {
    this.setState({ visible: true });
  };

  // 标签选择成功
  selectLabelOk = () => {
    const { currentData } = this.SearchTree;
    if (!currentData) {
      this.setState({ visible: false });
      return;
    }
    this.setState({
      visible: false,
      labels: [
        {
          id: currentData.eventKey,
          name: currentData.name,
        },
      ],
    });
  };

  /**
   *
   *删除选中的标签
   * @memberof Commondity
   */
  onClose = id => {
    const { labels } = this.state;
    const newArr = labels.filter(item => item.id != id);
    this.setState({ labels: newArr });
  };

  /**
   *
   *提交节点
   * @memberof ActivityFlowSetting
   */
  handleSubmit = () => {
    const { dispatch, form, nodeData, onOk, onCancel, activityFlowContact } = this.props;
    const { labels } = this.state;
    const {
      flowchartId,
      processId,
      processType,
      flowchartName,
      channelCode,
      actionType,
      tempProcessId,
    } = this.selectItem;
    const {
      inputCellList, // 接入数据
    } = activityFlowContact;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      // 获取抽样组数列表
      const tarGrpRels = this.sampleTable.getTarGrpRels();
      if (!tarGrpRels) {
        return;
      }

      const { processName, sebgmentKind, sampleSortType, sortType } = values;
      const addFlag = !processId;
      const label = labels.length && labels[0];
      const mccProcess = {
        id: actionType === 'A' ? tempProcessId : processId, // processId，有则修改没则新增
        processType,
        name: processName, // 环节名称
        flowchartId, // 流程id
        flowchartName,
        isAccumulation: values.isAccumulation,
        isCreativeRecommend: '0',
        isOfferRecommend: '0',
      };
      const params = {
        PROCESS_TYPE: processType,
        PROCESS_ID: processId,
        mccProcess,
        // 接入数据
        inputCellList: inputCellList.map(item => {
          return { cellName: item.cell_name, inputCellId: item.id };
        }),
        mccChannel: {
          channelCode,
        },
        // sample
        mccTarGrps:
          tarGrpRels.data &&
          tarGrpRels.data.map(item => ({
            ...item,
            grpSql: '',
            sebgmentKind,
            sampleSortType,
            // 排序标签
            ...(sampleSortType == '2' && label
              ? {
                  labelCode: label.id,
                  name: label.name,
                  sortType,
                }
              : {
                  labelCode: '',
                  name: '',
                }),
            ...(sebgmentKind == '1'
              ? {
                  maxCount: '',
                }
              : {
                  sebgmentCount: '',
                }),
          })),
      };

      if (!processName) {
        message.info(formatMessage({ id: 'activityConfigManage.flow.nameWarn' }));
        return;
      }
      if (processName.length > 30) {
        message.info(formatMessage({ id: 'activityConfigManage.flow.nameLenWarn' }));
        return;
      }
      dispatch({
        type: addFlag ? 'activityFlowSample/addProcess' : 'activityFlowSample/modProcess',
        payload: params,
        success: svcCont => {
          const { data = {} } = svcCont;
          const newNodeData = {
            ...nodeData,
            ...data,
            PROCESS_ID: data.processId,
            processname: processName,
          };
          if (addFlag) newNodeData.NODE_STATE = 2;
          onOk(newNodeData);
          onCancel();
        },
      });
    });
  };

  render() {
    // nodeData是节点数据，prevNodeData上一个节点数据（有些弹窗有用到），activityInfo是流程数据
    const { loading, form, onCancel, prevNodeData } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { processName, processId, flowchartId } = this.selectItem;
    const { processInfo, visible, dimList, labels } = this.state;

    const title = (
      <div>
        <span className={commonStyles.modalTitle}>
          {formatMessage({ id: 'activityConfigManage.sample.sampletitle' })}
        </span>
        <Divider type="vertical" />
        <Form.Item className={commonStyles.titleNameFormItem}>
          {getFieldDecorator('processName', {
            initialValue: processName,
          })(
            <Input
              size="small"
              className={commonStyles.titleNameInput}
              placeholder={formatMessage({ id: 'activityConfigManage.flow.customName' })}
              addonAfter={<Iconfont type="iconbianji1" />}
            />,
          )}
        </Form.Item>
      </div>
    );

    const inputCellProps = {
      form,
      processId,
      prevNodeData,
      flowchartId,
      showIsAccumulation: false,
      processInfo,
    };

    const customSelectProps = {
      mode: 'tags',
      dataSource: labels.map(item => ({
        label: item.name,
        value: item.id,
      })),
      onClose: this.onClose,
      otherNode: <a onClick={this.addLable}>添加</a>,
    };

    const sampleTableProps = {
      tableCode: this.tableCode,
      sampleNum: getFieldValue('sampleNum') || 0,
      sebgmentKind: getFieldValue('sebgmentKind') === '1' ? 'ratio' : 'num',
      defaultList: processInfo.tarGrpRels,
    };

    return (
      <Fragment>
        <Modal
          title={title}
          width={960}
          visible
          onOk={this.handleSubmit}
          onCancel={onCancel}
          okText={formatMessage({ id: 'common.btn.submit' })}
          cancelText={formatMessage({ id: 'common.btn.back' })}
          wrapClassName={commonStyles.flowModal}
          confirmLoading={loading}
          okButtonProps={{ disabled: this.getDisabledFlag() }}
        >
          <Form {...this.formItemLayout}>
            {/* 接入数据 */}
            <InputCell {...inputCellProps} />
            <div className={commonStyles.block}>
              <p className={commonStyles.title}>
                {formatMessage({ id: 'activityConfigManage.sample.sampletitle' })}
              </p>
              {/* 抽样组数 */}
              <Form.Item
                className={commonStyles.doubleFormItem}
                label={formatMessage({ id: 'activityConfigManage.sample.wantedsamplenum' })}
              >
                <Form.Item className={commonStyles.inlineFormItem}>
                  {getFieldDecorator('sampleNum', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'common.form.required' }) },
                    ],
                    initialValue: processInfo.sampleNum,
                  })(
                    <InputNumber
                      size="small"
                      precision={0}
                      min={0}
                      style={{ width: '180px', marginRight: '16px' }}
                    />,
                  )}
                </Form.Item>
                <Form.Item className={commonStyles.inlineFormItem}>
                  {getFieldDecorator('sebgmentKind', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'common.form.required' }) },
                    ],
                    initialValue: processInfo.sebgmentKind || '1',
                  })(
                    <Radio.Group>
                      {/* 根据百分比分组 */}
                      <Radio value="1">
                        {formatMessage({ id: 'activityConfigManage.sample.percentage' })}
                      </Radio>
                      {/* 根据记录数分组 */}
                      <Radio value="2">
                        {formatMessage({ id: 'activityConfigManage.sample.number' })}
                      </Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Form.Item>
              {/* 抽样方式 */}
              <Form.Item label={formatMessage({ id: 'activityConfigManage.sample.sampleType' })}>
                {getFieldDecorator('sampleSortType', {
                  initialValue: processInfo.sampleSortType || '1',
                })(
                  <Radio.Group>
                    <Radio value="1">
                      {formatMessage({ id: 'activityConfigManage.sample.random' })}
                    </Radio>
                    <Radio value="2">
                      {formatMessage({ id: 'activityConfigManage.sample.sort' })}
                    </Radio>
                    <Radio value="3">
                      {formatMessage({ id: 'activityConfigManage.sample.percentageType' })}
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              {/* 抽样标签 */}
              {getFieldValue('sampleSortType') === '2' ? (
                <Row>
                  <Col span={12}>
                    {/* 排序标签 */}
                    <Form.Item
                      label={formatMessage({ id: 'activityConfigManage.sample.labelselect' })}
                      {...this.formItemLayout2}
                    >
                      {getFieldDecorator('labelRel', {
                        rules: [
                          {
                            required: true,
                            message: formatMessage({ id: 'common.form.requiredSelect' }),
                          },
                        ],
                      })(<CustomSelect {...customSelectProps} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={formatMessage({ id: 'activityConfigManage.sample.sortType' })}
                      {...this.formItemLayout2}
                    >
                      {getFieldDecorator('sortType', {
                        initialValue: processInfo.sortType || '1',
                      })(
                        <Radio.Group>
                          <Radio value="1">
                            {formatMessage({ id: 'activityConfigManage.sample.asc' })}
                          </Radio>
                          <Radio value="2">
                            {formatMessage({ id: 'activityConfigManage.sample.sampledesc' })}
                          </Radio>
                        </Radio.Group>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}
              <SampleTable
                wrappedComponentRef={table => {
                  this.sampleTable = table;
                }}
                {...sampleTableProps}
              />
            </div>
          </Form>
        </Modal>
        {/* 排序标签选择 */}
        <Modal
          title={formatMessage({ id: 'activityConfigManage.sample.label' })}
          visible={visible}
          onOk={this.selectLabelOk}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          centered
        >
          <SearchTree
            hideSearch
            showButtons={false}
            loadData={treeNode => this.getDimList(treeNode.props.eventKey)}
            treeData={dimList}
            Refs={v => {
              this.SearchTree = v;
            }}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default Form.create()(Sample);
