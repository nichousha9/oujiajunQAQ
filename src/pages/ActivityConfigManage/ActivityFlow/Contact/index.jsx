/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// 接触类弹窗：eg:App
import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import Iconfont from '@/components/Iconfont';
import commonStyles from '../common.less';
import InputCell from '../components/InputCell/index';
import AdviceChannel from '../components/AdviceChannel/index';
import Creativity from '../components/Creativity/index';
import Commodity from '../components/Commodity/index';
import Rule from '../components/Rule/index';
import Segment from '../components/Segment/index';
import Output from '../components/Output/index';
import ResponseTemp from '../components/ResponseTemp/index';
import Effective from '../components/Effective/index';
import Template from '../components/Template/index';

const dateFormat = 'YYYY/MM/DD';
const timeFormat = 'HH:mm:ss';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
}))
class Contact extends React.Component {
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  constructor(props) {
    super(props);
    this.state = {
      // 环节信息
      processInfo: {},
    };
    const { nodeData, activityInfo } = props;
    const {
      channelid: channelId, // 渠道id
      processname: processName, // 节点名称
      isaccumulation: isAccumulation, // 渠道是否累计展示
      PROCESS_ID: processId, // 环节id
      processType, // 环节类型
      channelcode: channelCode,
      isresponsetemp: isResponseTemp, // 是否展示回复模板
      iseffdate: isEffDate, // 是否展示有效期
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
    };
  }

  async componentDidMount() {
    const { processId } = this.selectItem;

    if (processId) {
      await this.qryProcess();
    }
  }

  // componentWillUnmount() {
  //   this.reset();
  // }

  // // 重置
  // reset = () => {
  //   const { dispatch } = this.props;
  //   this.setState({
  //     processInfo: {}
  //   });
  //   dispatch({ type: 'activityFlowContact/reset' });
  // }

  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  // 当前节点有processId，获取环节信息
  qryProcess = async () => {
    const { dispatch } = this.props;
    const { processId } = this.selectItem;
    await dispatch({
      type: 'activityFlowContact/qryProcess',
      payload: {
        processId,
      },
      success: svcCont => {
        const { data } = svcCont;
        // isAccumulation、isResend、isCreativeRecommend、isOfferRecommend之类
        this.setState({ processInfo: data || {} });
        // console.log(this.props.activityFlowContact);
      },
    });
  };

  // 格式化日期时间
  formatDate = (value, type) => {
    if (value) {
      return moment(value).format(type);
    }
    return '';
  };

  /**
   *
   *提交节点
   * @memberof Contact
   */
  handleSubmit = () => {
    const { dispatch, form, activityFlowContact, onOk, onCancel, nodeData } = this.props;
    const {
      inputCellList, // 接入数据
      mccProcessAdviceChannelRel, // 运营位
      creativeInfoRels, // 创意
      creativeIreGroups, // 创意决策
      offerRels, // 商品列表
      offerIreGroups, // 商品分组
      processRcmdRulesRels, // 商品推荐规则组
      processOptimize, // 规则信息内容
      // 名单信息
      redList, // 红名单
      whiteList, // 白名单
      blackList, // 黑名单
      testContactList, // 测试名单
      outputCellList, // 输出
      responseTempList, // 回复模板列表
      processModelRel, // 模板
    } = activityFlowContact;
    // const addFlag = !processId;
    const offerRelist = offerRels === null ? [] : offerRels;
    if (creativeInfoRels.length === 0) {
      message.error('请选择话术');
    } else {
      form.validateFieldsAndScroll((err, values) => {
        const { PROCESS_ID, channelId, processname } = nodeData;
        const prodIds = [];
        offerRelist.map(item => prodIds.push(item.prodId));

        const params = {
          processId: Number(PROCESS_ID),
          channelId,
          adviceId: creativeInfoRels[0].adviceId,
          prodIds: prodIds.toString(),
        };

        dispatch({
          type: 'activityFlowContact/modProcess',
          payload: params,
          success: svcCont => {
            const { data = {} } = svcCont;
            const newNodeData = {
              ...nodeData,
              ...data,
              PROCESS_ID,
            };
            newNodeData.NODE_STATE = 2;

            onOk(newNodeData);
            onCancel();
          },
        });
      });
    }
  };

  render() {
    // nodeData是节点数据，prevNodeData上一个节点数据（有些弹窗有用到），activityInfo是流程数据
    const { loading, form, onCancel, nodeData, prevNodeData, prevAllNodeData } = this.props;
    const {
      channelId,
      processName,
      isAccumulation,
      processId,
      flowchartId,
      campaignId,
      channelCode,
      isResponseTemp,
      isEffDate,
    } = this.selectItem;
    const { getFieldDecorator } = form;
    const { processInfo } = this.state;
    const title = (
      <div>
        <span className={commonStyles.modalTitle}>触点渠道</span>
        {/* <Divider type="vertical" />
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
        </Form.Item> */}
      </div>
    );

    const inputCellProps = {
      form,
      processId,
      prevNodeData,
      flowchartId,
      showIsAccumulation: isAccumulation === '1',
      showDealDay: true,
      processInfo,
    };

    const adviceChannelProps = {
      form,
      processId,
      channelId,
    };

    const creativityProps = {
      form,
      processId,
      prevAllNodeData,
      adviceChannelFlag: true,
      processInfo,
      needAdviceChannel: true, // 需要有运营位才可以选择创意
    };

    const commodityProps = {
      processId,
      form,
      nodeData,
      prevAllNodeData,
      processInfo,
    };

    const ruleProps = {
      form,
      processId,
      campaignId,
    };

    const outputProps = {
      isControlGroup: true, // 是否有控制
      processId,
      processName,
      flowchartId,
    };

    const responseTempProps = {
      form,
      processId,
      channelId,
    };

    const effectiveProps = {
      form,
      processId,
    };

    const templateProps = {
      form,
      nodeData,
    };

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
          {/* <InputCell {...inputCellProps} /> */}
          {/* 添加模板 */}
          {/* <Template {...templateProps} /> */}
          {/* 运营位 */}
          {/* <AdviceChannel {...adviceChannelProps} /> */}
          {/* 创意信息) */}
          <Creativity {...creativityProps} />
          {/* 有效期 */}
          {/* {isEffDate ? <Effective {...effectiveProps} /> : null} */}
          {/* 回复模板反馈 */}
          {/* {isResponseTemp ? <ResponseTemp {...responseTempProps} /> : null} */}
          {/* 商品 */}
          <Commodity {...commodityProps} />
          {/* 规则信息 */}
          {/* <Rule {...ruleProps} /> */}
          {/* 名单信息 */}
          {/* <Segment processId={processId} /> */}
          {/* 输出信息 */}
          {/* <Output {...outputProps} /> */}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Contact);
