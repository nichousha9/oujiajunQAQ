import React from 'react';
import {Modal, Form, Divider, Input, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont/index';
import commonStyles from '../common.less';
import InputCell from '../components/InputCell/index';
import Creativity from '../components/Creativity/index';
import Commodity from '../components/Commodity/index';
import Rule from '../components/Rule/index';
import Segment from '../components/Segment/index';
import Output from '../components/Output/index';
import OfferQuantity from './OfferQuantity';

@connect(({ activityFlowContact, activityDirectBonus, loading }) => ({
  activityFlowContact,
  activityDirectBonus,
  confirmLoading:
    loading.effects['activityDirectBonus/addProcess'] || loading.effects['activityDirectBonus/modProcess'],
}))
@Form.create()
class DirectBonus extends React.Component {
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  constructor(props) {
    super(props);
    this.state = {
      processInfo: {},
    };

    const { nodeData, activityInfo } = props;
    this.selectedItem = {
      processId: nodeData.PROCESS_ID,
      processType: nodeData.processType,
      actionType: nodeData.actionType,
      campaignId: activityInfo.campaignId, // 营销活动Id
      flowchartId: activityInfo.id,
      flowchartName: activityInfo.name,
      processName: nodeData.processname,
      // 当前活动状态信息，判断节点是否可编辑
      campaignState: activityInfo.campaignState,
      // 节点在xml中的数据
      id: nodeData.id,
      isAccumulation: nodeData.isaccumulation,
    }
  }

  componentDidMount() {
    const { processId } = this.selectedItem;
    const { dispatch } = this.props;
    if(processId){
      this.qryProcess();
    }

    dispatch({
      type: 'activityFlowContact/save',
      payload: { mccProcessAdviceChannelRel: {
        optionalCreativeType: '2,3',
      }}
    });
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
    const { campaignState } = this.selectedItem;
    return campaignState !== 'Editing';
  };
  
  // 当前节点有processId，获取环节信息
  qryProcess = () => {
    const { dispatch } = this.props;
    const { processId } = this.selectedItem;
    dispatch({
      type: 'activityDirectBonus/qryProcess',
      payload: {
        id: processId,
      },
      callback: svcCont => {
        const { data } = svcCont;
        // isAccumulation、isResend、isCreativeRecommend、isOfferRecommend之类
        this.setState({ processInfo: data || {} });
      },
    });
  };

  generateParams = values => {
    const { activityFlowContact } = this.props;
    const { 
      inputCellList, // 接入数
      creativeInfoRels,// 创意
      offerRels, // 商品列表
      processOptimize, // 规则信息内容
      // 名单信息
      redList, // 红名单
      whiteList, // 白名单
      blackList, // 黑名单
      testContactList, // 测试名单
      outputCellList, // 输出
    } = activityFlowContact;

    const {
      processName,
      offerLimitIndex,
      quantityLimit,
      qntlimitTimeFrame,
      isAccumulation,
      isCreativeRecommend, 
      isOfferRecommend, 
    } = values;

    const { 
       processId: id,
       processType, 
       flowchartName, 
       flowchartId,
       campaignId,
    } = this.selectedItem;

    return {
      mccProcess: {
        id,
        processType,
        name: processName,
        flowchartId,
        flowchartName,
        campaignId,
        isAccumulation: isAccumulation ? "1" : "0",// 是否积累(在接入数据中)
        isCreativeRecommend: isCreativeRecommend ? "1" : "0",// 是否创意推荐
        isOfferRecommend: isOfferRecommend ? "1" : "0",// 商品推荐
      },
      // inputCell
      inputCellList: inputCellList.map(item => { return {cellName: item.cell_name, inputCellId: item.id} }),
      // 创意
      creativeInfoRels,
      // 商品
      offerRels,
      // 商品限制
      mccListenerInjection: {
        processId: id,
        offerId: offerRels.length > 0 ? offerRels[0].offerId : null,
        adviceType: creativeInfoRels.length > 0 ? creativeInfoRels[0].adviceType : null,
        offerLimitIndex,
        quantityLimit,
        qntlimitTimeFrame,
      },
      // 规则
      processOptimize: {
        ...processOptimize,
        ignoreAsSchedule: 'N', // 定时运行是否跳过优化
        autoAddRmCtrlCell: 'Y', // 自动创建规则排除的控制组
      },
      // 名单
      redList,
      blackList,
      whiteList,
      testContactList,
      // outputCell
      outputCellList,
    }
  };

  isValid = () => {
    const { activityFlowContact } = this.props;
    const { 
      offerRels, // 商品列表
    } = activityFlowContact;

    if(offerRels && offerRels.length <= 0) {
      message.error(formatMessage({ id: 'activityConfigManage.directBonus.offerRequired' },'请选择商品'));
      return;
    } 
    return true;
  }

  handleSubmit = () => {
    const { form, dispatch, nodeData, onCancel, onOk } = this.props;
    const { processId } = this.selectedItem;
    const addFlag = !processId;
    form.validateFieldsAndScroll((err, values) => {
      if(err) {
        return;
      }
      if(!this.isValid()) {
        return;
      }
      const params = this.generateParams(values);
      const { processName } = values;
      dispatch({
        type: addFlag ? 'activityDirectBonus/addProcess' : 'activityDirectBonus/modProcess',
        payload: params,
        callback: svcCont => {
          const { data = {} } = svcCont;
          const newNodeData = { 
            ...nodeData,
            ...data,
            PROCESS_ID: data.processId,
            processname: processName
          };

          if (addFlag) newNodeData.NODE_STATE = 2;
          
          nodeData.NEED_OPT = !params.processOptimize.rulesetId ? 'Y' : 'N';
          onOk(newNodeData);
          onCancel();
        }
      })
    });
  };

  render() {
    const { 
      form, 
      onCancel, 
      confirmLoading, 
      prevNodeData, 
      prevAllNodeData, 
      nodeData, 
      campaignId,
    } = this.props;
    const { processInfo } = this.state;
    const { getFieldDecorator } = form;
    const { processId, processName, flowchartId, isAccumulation } = this.selectedItem;
    const title = (
      <div>
        <span className={commonStyles.modalTitle}>
          {formatMessage({ id: 'activityConfigManage.directBonus.directBonus' }, 'Direct Bonus')}
        </span>
        <Divider type="vertical" />
        <Form.Item className={commonStyles.titleNameFormItem}>
          {getFieldDecorator('processName', {
             rules: [
              {
                min: 1,
                max: 30,
                required: true,
                message: 'processName is required[1~30].',
              },
            ],
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

    const disabled = this.getDisabledFlag();

    const inputCellProps = {
      form,
      processId,
      prevNodeData,
      flowchartId,
      showIsAccumulation: isAccumulation === '1',
      // showDealDay: false,
      processInfo,
    }

    const creativityProps = {
      form,
      processId,
      prevAllNodeData,
      adviceChannelFlag: false,
      processInfo,
    };

    const commodityProps = {
      form,
      nodeData, 
      prevAllNodeData,
      processInfo,
    };

    const offerQuantityProps = {
      form,
      processId,
    };

    const ruleProps = {
      form,
      processId,
      campaignId,
    };

    const outputProps = {
      isControlGroup: false, // 是否有控制
      processId,
      processName,
      flowchartId,
    };

    return (
      <Modal
        title={title}
        visible
        width={960}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        okButtonProps={{ size: 'small', style: disabled ? { display: 'none' } : null }}
        cancelButtonProps={{ size: 'small' }}
        confirmLoading={!!confirmLoading}
        wrapClassName={commonStyles.flowModal}
      >
        <Form {...this.formItemLayout}>
          {/* 接入数据 */}
          <InputCell {...inputCellProps} />
          {/* 创意信息) */}
          <Creativity {...creativityProps} />
          {/* 商品 */}
          <Commodity {...commodityProps} />
          {/* 商品数量限制 */}
          <OfferQuantity {...offerQuantityProps} />
          {/* 名单信息 */}
          <Segment processId={processId} />
          {/* 规则信息 */}
          <Rule {...ruleProps} />
          {/* 输出信息 */}
          <Output {...outputProps} />
        </Form>
      </Modal>
    );
  }
}

export default DirectBonus;