// Listener弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import Iconfont from '@/components/Iconfont';
import commonStyles from '../common.less';
import InputCell from '../components/InputCell/index';
import Rule from '../components/Rule/index';
import Output from '../components/Output/index';
import Effective from '../components/Effective/index';
import Trigger from '../components/Trigger/index';
import Frequency from '../components/Frequency/index';

const timeFormat = 'HH:mm:ss';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/addProcess'] || loading.effects['activityFlowContact/modProcess'],
}))
class Listener extends React.Component {
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  constructor(props) {
    super(props);
    this.state = {
      // 环节信息
      processInfo: {}
    };
    const { nodeData, activityInfo } = props;
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
    const { processId } = this.selectItem;
    if(processId){
      this.qryProcess();
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  // 重置
  reset = () => {
    const { dispatch } = this.props;
    this.setState({
      processInfo: {}
    });
    dispatch({ type: 'activityFlowContact/reset' });
  }
  
  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };
  
  // 当前节点有processId，获取环节信息
  qryProcess = () => {
    const { dispatch } = this.props;
    const { processId } = this.selectItem;
    dispatch({
      type: 'activityFlowListener/qryMccListener',
      payload: {
        id: processId,
      },
      success: svcCont => {
        const { data } = svcCont;
        // isAccumulation、isResend、isCreativeRecommend、isOfferRecommend之类
        this.setState({ processInfo: data || {} });
      },
    });
  };

  // 格式化日期时间
  formatDate = (value, type) => {
    if(value){
      return moment(value).format(type)
    }
    return ''
  }

  /**
   *
   *提交节点
   * @memberof Listener
   */
  handleSubmit = () => {
    const { dispatch, form, activityFlowContact, onOk, onCancel, nodeData } = this.props;
    const {  
      campaignId, 
      flowchartId, 
      flowchartName, 
      processId, 
      processType, 
    } = this.selectItem;
    const { 
      inputCellList, // 接入数据
      testSegment, // 测试群组
      processOptimize, // 规则信息内容
      outputCellList, // 输出
    } = activityFlowContact;
    const addFlag = !processId;

    form.validateFieldsAndScroll((err, values) => {
      const{  
        processName, 
        isAccumulation, 
        isCreativeRecommend, 
        isOfferRecommend, 
        // 有效期
        resEffType, // 生效时间类型
        resEffDate, // 开始时间
        resEffOffset, // 生效相对时间：间隔
        resEffOffsetUnit, // 生效相对时间单位
        resEffTime, // 生效相对时间：时刻
        resValidityType, // 失效时间类型
        resValidityDate, // 结束时间
        resValidityOffset, // 失效相对时间：间隔
        resOffsetUnit, // 失效相对时间单位
        resValidityTime, // 失效相对时间：时刻
        isAllCust, // 全网用户
        // 频率
        isFrequencyControl, // 频率控制
        frequencyDuration,
        frequencyControl,
        times,
        totalTimes,
        runInclude, // 运行时包含测试群组 
      } = values;

      if (err) {
        return
      }

      if(!processName) {
        message.info(formatMessage({ id: 'activityConfigManage.flow.nameWarn' }));
        return
      }
      if(processName.length > 30) {
        message.info(formatMessage({ id: 'activityConfigManage.flow.nameLenWarn' }));
        return 
      }

      const triggerData = this.triggerRef.getTriggerData();
      if(!triggerData) {
        return
      }

      const mccProcess = {
        campaignId,// 活动id
        flowchartId,// 流程id
        flowchartName,// 流程名字
        id: processId,// processId，有则修改没则新增
        isAccumulation: isAccumulation ? "1" : "0",// 是否积累(在接入数据中)
        isCreativeRecommend: isCreativeRecommend ? "1" : "0",// 是否创意推荐
        isOfferRecommend: isOfferRecommend ? "1" : "0",// 商品推荐
        name: processName,// 环节名称
        processType,// 环节类型,
      }
      
      const mccListener = {
        // 输入
        isAllCust: isAllCust ? 1 : 0,
        segmentId: testSegment && testSegment.id,
        asReply: 'N',
        // 营销事件
        mktEvent: triggerData.id,
        mktEventName: triggerData.name,
        // 有效期
        // eslint-disable-next-line no-nested-ternary
        effType: resEffType === 'ABS' ? '2' : (resEffType === 'REL' ? '1' : '3'), // 生效时间类型
        effDate: this.formatDate(resEffDate, dateTimeFormat), // 开始时间
        effOffset: resEffOffset, // 生效相对时间：间隔,
        effOffsetUnit: resEffOffsetUnit, // 生效相对时间单位
        effTime: this.formatDate(resEffTime, timeFormat), // 生效相对时间：时刻
        // eslint-disable-next-line no-nested-ternary
        expireType: resValidityType === 'ABS' ? '2' : (resValidityType === 'REL' ? '1' : ''), // 失效时间类型
        expireDate: this.formatDate(resValidityDate, dateTimeFormat), // 结束时间
        offsets: resValidityOffset, // 失效相对时间：间隔
        offsetUnit: resOffsetUnit, // 失效相对时间单位
        expTime: this.formatDate(resValidityTime, timeFormat), // 失效相对时间：时刻
        // 频率
        ...isFrequencyControl ? {
          ckFrequencyControl: 'Y',
          frequencyDuration,
          frequencyControl,
          times,
          totalTimes,
        } : {}
      }

      const params = {
        // mccChannel: {
        //   channelId // 渠道id
        // },
        mccProcess,
        // // 接入数据
        inputCellList: inputCellList.map(item => { return {cellName: item.cell_name, inputCellId: item.id} }),
        mccListener,
        // 测试群组
        mccTestContactSeg: {
          segmentId: triggerData.id,
          runInclude: runInclude ? 'Y' : 'N', // 运行时包含测试群组 
        },
        // 规则
        processOptimize: {
          ...processOptimize,
          ignoreAsSchedule: 'N', // 定时运行是否跳过优化
          autoAddRmCtrlCell: 'N', // 自动创建规则排除的控制组
        },
        // 输出
        outputCellList,
      }

      dispatch({
        type: addFlag ? 'activityFlowListener/addProcess' : 'activityFlowListener/modProcess',
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
    const { loading, form, onCancel, prevNodeData } = this.props;
    const {
      processName,
      isAccumulation,
      processId,
      flowchartId,
      campaignId,
      processType
    } = this.selectItem;
    const { getFieldDecorator } = form;
    const { processInfo } = this.state;

    const title = (
      <div>
        <span className={commonStyles.modalTitle}>{formatMessage({ id: 'activityConfigManage.listener.flowchartListener' })}</span>
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
      showIsAccumulation: isAccumulation === '1',
      showIsAllCustom: true,
      showTestSeg: true,
      processInfo
    }

    const ruleProps = {
      form,
      processId,
      campaignId,
    };

    const outputProps = {
      isControlGroup: false, // 是否有控制
      processId,
      processName,
      flowchartId
    };

    const effectiveProps = {
      form,
      processId
    }

    const triggerProps = {
      form,
      processId,
      campaignId,
      processInfo
    }

    const frequencyProps = {
      form,
      processType,
      processInfo
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
          {/* 触发器 */}
          <Trigger ref={(triggerRef) => {this.triggerRef = triggerRef}} {...triggerProps} />
          {/* 有效期 */}
          <Effective {...effectiveProps} />
          {/* 频率 */}
          <Frequency {...frequencyProps} />
          {/* 规则信息 */}
          <Rule {...ruleProps} />
          {/* 输出信息 */}
          <Output {...outputProps} />
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Listener);
