// NextStage节点
import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, Row, Col, DatePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import Iconfont from '@/components/Iconfont';
import CustomSelect from '@/components/CustomSelect/index';
import commonStyles from '../common.less';
const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ user, loading }) => ({
  userInfo: user.userInfo,
  loading: loading.effects['activityNextStage/addProcess'] || loading.effects['activityNextStage/modProcess'],
}))
class NextStage extends React.Component {
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
      inputList: [], // 输入数据
      responseList: [], // 接触反馈
      outputCellInfo: {}, // 输出数据（nextStage节点只有一个）
      inputCellList: [], // 选中的输入
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
    this.qryNextStageInfo();
    this.qryProcessCellName();
    this.qryResponseType();
  }

  componentDidUpdate(prevProps, prevState) {
    const { inputCellList } = this.state;
    if(inputCellList !== prevState.inputCellList){
      this.handleOutputList();
    }
  }

  // 获取输入数据
  qryProcessCellName = () => {
    const { dispatch, userInfo, prevNodeData } = this.props;
    const preProcessIds = [];
    prevNodeData.forEach(item => {
      if(item.PROCESS_ID) {
        preProcessIds.push(parseInt(item.PROCESS_ID, 10))
      }
    });
    if(prevNodeData.length && preProcessIds.length) {
      dispatch({
        type: 'activityNextStage/qryProcessCellName',
        payload: {
          queryParam: {
              ids: preProcessIds
          },
          staffId: userInfo.staffInfo.staffId, // 当前用户id
          staffName: userInfo.staffInfo.staffName // 用户姓名
        },
        success: (svcCont) => {
          const { data = [] } = svcCont;
          this.setState({ inputList: data });
        }
      })
    }
  }

  // 获取接触反馈
  qryResponseType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityNextStage/qryResponseType',
      payload: {},
      success: (svcCont) => {
        const { data = [] } = svcCont;
        this.setState({ responseList: data });
      }
    })
  }

  // 获取初始数据
  qryNextStageInfo = () => {
    const { dispatch } = this.props;
    const { processId } = this.selectItem;
    if(!processId){
      return
    }
    dispatch({
      type: 'activityNextStage/qryNextStageInfo',
      payload: { processId },
      success: (svcCont) => {
        const { data = {} } = svcCont;
        const { inputCells = [], outputCells = [] } = data;
        let outputCellInfo = {};
        if(outputCells.length && outputCells[0]){
          outputCellInfo = {
            ...outputCells[0],
            inputCellId: outputCells[0].targetCellid,
            processingCellId: outputCells[0].id,
          }
        }
        this.setState({ 
          processInfo: data, 
          inputCellList: inputCells, 
          outputCellInfo
        });
      }
    })
  }
    
  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  inputChange = (values) => {
    const { inputList } = this.state;
    const inputCellList = inputList.filter((item) => (values.indexOf(item.id) > -1))
    this.setState({ inputCellList });
  }

  // 根据输入和数据处理输出列表
  handleOutputList = async () => {
    const { inputCellList } = this.state;
    if(inputCellList && inputCellList.length){
      const node = await this.getNewNode();
      this.setState({ outputCellInfo: node });
    }
    else {
      this.setState({ outputCellInfo: {} });
    }
  }

  // 获取序列
  getSeqList = () => {
    const { dispatch } = this.props;
    return new Promise(resolve => {
      dispatch({
        type:'activityFlowContact/getSeqList',
        success: (svcCont) => {
          const { data } = svcCont;
          resolve(data);
        }
      });
    })
  }

  // 处理新的输出
  getNewNode = async () => {
    const { processName } = this.selectItem;
    const { outputCellInfo, inputCellList } = this.state;
    const input = inputCellList[0];
    let target;
    inputCellList.forEach(item => {
      if(item.id === outputCellInfo.inputCellId || item.id === outputCellInfo.targetCellid) {
        target = outputCellInfo;
      }
    })
    if(target){
      return target
    }
    // 获取的数组里没有输出项或者没有proceId去获取所有输出列表
    // 序列数据
    const segResult = await this.getSeqList() || {};
    const obj = {
      id: segResult.SEQ_LIST && segResult.SEQ_LIST[0],
      cellCode: segResult.CODE_LIST && segResult.CODE_LIST[0]
    };
    // 新增节点（根据输入数据和序列数据拼接新的输出）
    const node = {};
    node.inputCellId = input.id;
    node.processingCellId = obj.id;
    node.cellCode = obj.cellCode;
    node.cellName = `${processName}_${node.processingCellId}`;
    node.isControl = "N";
    node.isControlName = "No";
    node.inputLinkFlag = false;
    return node
  }
  
  /**
   *
   *提交节点
   * @memberof ActivityFlowSetting
   */
  handleSubmit = () => {
    const { dispatch, form, nodeData, onOk, onCancel } = this.props;
    const {
      flowchartId,
      processId,
      processType,
    } = this.selectItem;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const addFlag = !processId;
      const processName = values.processName || 'nextStage';
      const { startDate, endDate, respTypeList } = values;
      const { inputCellList, outputCellInfo } = this.state;
      const params = {
        flowchartId,
        processId,
        processType,
        limitFlag: 'R',
        limitSize: '6',
        processChgFlag: 'Y',
        startDate: moment(startDate).format(dateTimeFormat),
        endDate: moment(endDate).format(dateTimeFormat),
        inputCellList: inputCellList.map((item) => ({ cellId:item.cellid || item.targetCellid, inputCellId:item.id })),
        respTypeList: respTypeList.map((item) => ({ responseType:item })),
        processName,
        processingCellId: outputCellInfo.processingCellId,
        outputCellCode: outputCellInfo.cellCode,
        outputCellName: outputCellInfo.cellName,
        targetCellid: outputCellInfo.inputCellId,
      };

      dispatch({
        type: addFlag ? 'activityNextStage/addProcess' : 'activityNextStage/modProcess',
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
    const { loading, form, onCancel } = this.props;
    const { getFieldDecorator } = form;
    const {
      processName,
    } = this.selectItem;
    const { inputList, responseList, processInfo, outputCellInfo, inputCellList } = this.state;
    const { mccNextStageFilters = [], nextStage = {} } = processInfo;

    const title = (
      <div>
        <span className={commonStyles.modalTitle}>{formatMessage({ id: 'activityConfigManage.nextStage.nextStageTitle' })}</span>
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

    const inputCustomProps = {
      mode: 'multiple',
      dataSource: inputList.map(item => ({ value: item.id, label: item.cell_name })),
      onChange: this.inputChange
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
        <Form {...this.formItemLayout} id='nextStageForm'>
          <div className={commonStyles.block}>
            <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.inputData' })}</p>
            {/* 接入选择 */}
            <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.access' })}>
              {getFieldDecorator('inputCellList', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
                initialValue: inputCellList.map(item => item.id),
                onChange: this.handleChange
              })(<CustomSelect {...inputCustomProps} />)}
            </Form.Item>
          </div>
          {/* 接触反馈 */}
          <div className={commonStyles.block}>
            <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.nextStage.contactFeedback' })}</p>
            {/* 反馈动作 */}
            <Form.Item label={formatMessage({ id: 'activityConfigManage.nextStage.feedbackAction' })}>
              {getFieldDecorator('respTypeList', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
                initialValue: mccNextStageFilters && mccNextStageFilters.length ? mccNextStageFilters.map(item => item.responseType) : [],
                onChange: this.handleChange
              })(<CustomSelect mode='multiple' dataSource={responseList.map((item) => ({ value: item.response_type, label: item.name }))} />)}
            </Form.Item>
            <Row gutter={24}>
              <Col span={12}>
                {/* 生效时间 */}
                <Form.Item label={formatMessage({ id: 'activityConfigManage.flow.effTime' })} {...this.formItemLayout2}>
                  {getFieldDecorator('startDate', {
                    rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                    initialValue:  nextStage.startDate && moment(nextStage.startDate)
                  })(
                    <DatePicker showTime getCalendarContainer={() => document.getElementById('nextStageForm')} />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'activityConfigManage.flow.expTime' })} {...this.formItemLayout2}>
                  {getFieldDecorator('endDate', {
                    rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                    initialValue: nextStage.endDate && moment(nextStage.endDate)
                  })(
                    <DatePicker showTime getCalendarContainer={() => document.getElementById('nextStageForm')} />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div className={commonStyles.block}>
              <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.outputData' })}</p>
              {
                outputCellInfo.inputCellId ? (
                  <div>
                    <Row type="flex" justify="space-between" align="middle" className={commonStyles.outputCus}>
                      <span className={commonStyles.icon}>
                        <Iconfont type="iconoutput" />
                      </span>
                      <Col className={commonStyles.text}>
                        <p>{outputCellInfo.cellName}</p>
                        <p className={commonStyles.tip}>{outputCellInfo.cellCode}</p>
                      </Col>
                    </Row>
                  </div>
                ) : null
              }
            </div>
          </div>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(NextStage)