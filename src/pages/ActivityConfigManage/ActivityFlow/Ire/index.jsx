// Ire节点
import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont';
import InputCell from '../components/InputCell/index';
import Output from '../components/Output/index';
import AlgorithmGroup from './AlgorithmGroup';
import commonStyles from '../common.less';

@connect(({ user, loading, common, activityFlowContact }) => ({
  userInfo: user.userInfo,
  loading: loading.effects['activityFlowIre/addProcess'] || loading.effects['activityFlowIre/modProcess'],
  divinBucketTypes: common.attrSpecCodeList.DIVID_BUCKET_TYPE,
  activityFlowContact
}))
class Ire extends React.Component {
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
      processInfo: {}
    };
    const { nodeData = {}, activityInfo = {} } = props;
    const { 
      channelid: channelId, // 渠道id
      processname: processName, // 节点名称
      isaccumulation: isAccumulation,// 渠道是否累计展示
      PROCESS_ID: processId, // 环节id
      processType, // 环节类型
      channelcode: channelCode,
      isresponsetemp: isResponseTemp, // 是否展示回复模板
      iseffdate: isEffDate // 是否展示有效期
    } = nodeData;
    const { 
      id: flowchartId, // 流程id
      campaignId,
      name: flowchartName,// 流程名字
      campaignState // 活动流程状态
    } = activityInfo;
    // 用到的流程图传来的信息
    this.selectItem = {
      channelId, // 渠道id
      processName, // 节点名称
      isAccumulation,// 渠道是否累计展示
      processId, // 环节id
      processType, // 环节类型
      channelCode,
      flowchartId, // 流程id
      flowchartName,// 流程名字
      campaignId, // 活动id
      isResponseTemp: isResponseTemp === 1 || isResponseTemp === '1',
      campaignState, // 活动流程状态
      isEffDate: isEffDate === 1 || isEffDate === '1' // 是否展示有效期
    }
  }
  
  componentDidMount() {
    this.fetchInitilaData();
    this.qryAttrValueByCode();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'activityFlowContact/reset' });
  }

  // 获取初始数据
  fetchInitilaData = () => {
    const { dispatch } = this.props;
    const { processId } = this.selectItem;
    if(!processId){
      return
    }
    dispatch({
      type: 'activityFlowIre/qryMccAppAllInfo',
      payload: { processId },
      success: (svcCont) => {
        const { data = {} } = svcCont;
        this.setState({ processInfo: data });
      }
    })
  }
    
  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  // 获取分桶类型选择项
  qryAttrValueByCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'common/qryAttrValueByCode',
      payload: { attrSpecCode: 'DIVID_BUCKET_TYPE' }
    })
  }
  
  /**
   *
   *提交节点
   * @memberof ActivityFlowSetting
   */
  handleSubmit = () => {
    const { dispatch, form, nodeData, onOk, onCancel, activityFlowContact } = this.props;
    const {
      flowchartId,
      processId,
      processType,
      campaignId,
      flowchartName
    } = this.selectItem;
    const { 
      inputCellList, // 接入数据
      outputCellList, // 输出
    } = activityFlowContact;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      // 获取算法分组数据
      const groupInfo  =  this.groupRef.getGroupInfo();
      if(!groupInfo) {
        return
      }
      const { algorithmGroupings, ireGroupsMapTemp } = groupInfo;
      const { processName } = values;
      const addFlag = !processId;
      const mccProcess = {
        campaignId,// 活动id
        flowchartId,// 流程id
        id: processId,// processId，有则修改没则新增
        processType,
        name: processName,// 环节名称
      }
      const params = {
        flowchartId,
        processId,
        processType,
        campaignId,
        flowchartName,
        ...values,
        processName,
        mccProcess,
        // 接入数据
        inputCellList: inputCellList.map(item => { return {cellName: item.cell_name, inputCellId: item.id} }),
        outputCellList, // 输出
        algorithmGroupings, // 算法分组
        ireGroupsMapTemp, // 算法分组里桶数据
      };

      if(!processName) {
        message.info(formatMessage({ id: 'activityConfigManage.flow.nameWarn' }));
        return
      }
      if(processName.length > 30) {
        message.info(formatMessage({ id: 'activityConfigManage.flow.nameLenWarn' }));
        return 
      }
      dispatch({
        type: addFlag ? 'activityFlowIre/addProcess' : 'activityFlowIre/modProcess',
        payload: params,
        success: (svcCont) => {
          const { data = {} } = svcCont;
          const newNodeData = { 
            ...nodeData,
            ...data,
            PROCESS_ID: data.processId,
            processname: processName
          };
          if (addFlag) newNodeData.NODE_STATE = 2;
          onOk(newNodeData);
          onCancel();
        }
      })
    });
  };

  render() {
    // nodeData是节点数据，prevNodeData上一个节点数据（有些弹窗有用到），activityInfo是流程数据
    const { loading, form, onCancel, prevNodeData, divinBucketTypes } = this.props;
    const { getFieldDecorator } = form;
    const {
      processName,
      processId,
      flowchartId,
    } = this.selectItem;
    const { processInfo } = this.state;

    const title = (
      <div>
        <span className={commonStyles.modalTitle}>下一波次</span>
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
      processInfo
    }

    const outputProps = {
      processId,
      processName,
      flowchartId
    };

    const algorithmGroupProps = {
      processId,
      divinBucketTypes,
      ireProcessDto: processInfo.ireProcessDto || {} // 初始数据
    }

    return (
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
          {/* 算法分组 */}
          {
            !processId || processInfo.ireProcessDto ? (
              <AlgorithmGroup ref={(group) => {this.groupRef = group}} {...algorithmGroupProps} />
            ) : null
          }
          {/* 输出信息 */}
          <Output {...outputProps} />
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(Ire)