// AB决策节点
import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, DatePicker, Radio, InputNumber, message, Row, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import Iconfont from '@/components/Iconfont';
import CustomSelect from '@/components/CustomSelect/index';
import commonStyles from '../common.less';
import styles from './index.less';
import SampleTable from './SampleTable';
import { objToLineCase, objToLowerCase }  from '@/utils/common';

const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ user, loading, activityAbDecision }) => ({
  userInfo: user.userInfo || {},
  loading: loading.effects['activityAbDecision/addProcess'] || loading.effects['activityAbDecision/modProcess'],
  activityAbDecision
}))
class AbDecision extends React.Component {
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
      outputCellList: [], // 输出数据
      inputCellList: [], // 选中的输入
      // 环节信息
      processInfo: {},
      sampleNum: 0, // 采样条数
      outputcellTempList: [], // output的id存放
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
    // 获取输入数据
    this.qryProcessCellName();
    // 获取上次保存数据
    this.getInitialInfo();
  }

  componentDidUpdate(prevProps) {
    const { activityAbDecision } = this.props;
    const { sampleList } = activityAbDecision;
    const { processInfo } = this.state;
    if(JSON.stringify(sampleList) !== JSON.stringify(prevProps.activityAbDecision.sampleList)){
      if(JSON.stringify(sampleList) !== JSON.stringify(processInfo.sampleList)) {
        if(sampleList.length === prevProps.activityAbDecision.sampleList.length) {
          this.controlOutput();
        }
        else{
          this.handleOutputList();
        }
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityAbDecision/reset'
    })
  }

  // 获取输入数据
  qryProcessCellName = () => {
    const { dispatch, userInfo, prevNodeData = [] } = this.props;
    const preProcessIds = [];
    prevNodeData.forEach(item => {
      if(item.PROCESS_ID) {
        preProcessIds.push(parseInt(item.PROCESS_ID, 10))
      }
    });
    if(prevNodeData.length && preProcessIds.length) {
      dispatch({
        type: 'activityAbDecision/qryProcessCellName',
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

  // 获取初始数据
  getInitialInfo = () => {
    const { dispatch, userInfo } = this.props;
    const { processId } = this.selectItem;
    if(!processId){
      return
    }
    dispatch({
      type: 'activityAbDecision/qryProcessCellInfo',
      payload: { id: processId },
      success: (svcCont) => {
        const { data = [] } = svcCont;
        this.setState({
          inputCellList: data,
        });
      }
    });
    dispatch({
      type: 'activityAbDecision/getAbDetatil',
      payload: { 
        processId,
        staffId: userInfo.staffInfo.staffId, // 当前用户id
        staffName: userInfo.staffInfo.staffName // 用户姓名
      },
      success: (svcCont) => {
        const { data = {} } = svcCont;
        const { mccDecision = {}, mccDecisionBlock = [], outCellList = [], mccDecisionsConditions = [] } = data;
        this.setState({
          processInfo: {
            ...mccDecision,
            sampleNum: mccDecision.outputCellsAmount,
            sampleList: objToLowerCase(mccDecisionBlock),
            responseType: mccDecisionsConditions.map((item) => item.response_type && item.response_type.toString())
          },
          outputCellList: objToLowerCase(outCellList),
        });
      }
    });
  }
    
  // 判断节点是否不可编辑
  getDisabledFlag = () => {
    const { campaignState } = this.selectItem;
    return campaignState !== 'Editing';
  };

  inputChange = (values) => {
    const { inputList } = this.state;
    const inputCellList = inputList.filter((item) => (values.indexOf(item.id) > -1));
    this.setState({ inputCellList });
  }

  // 根据采样列表和数据处理输出列表
  handleOutputList = async () => {
    const { activityAbDecision } = this.props;
    const { sampleList } = activityAbDecision;
    const { outputcellTempList } = this.state;
    if(sampleList && sampleList.length){
      const sampleLength = sampleList.length;
      const nowOutlength = outputcellTempList.length;
      if(sampleLength > nowOutlength) {
        const addNum = sampleLength - nowOutlength;
        const { seqList, codeList } = await this.getOutputSeqList(addNum);
        for (let i = 0; i < seqList.length; i += 1) {
          outputcellTempList.push({
            id: seqList[i],
            code: codeList[i]
          })
        }
        this.setState({ outputcellTempList }, this.controlOutput)
      }
      else { this.controlOutput() }
    }
    else {
      this.setState({ outputCellList: [] });
    }
  }

  
  // 获取output序列码
  getOutputSeqList = (count) => {
    const { dispatch, userInfo } = this.props;
    return new Promise(resolve => {
      dispatch({
        type: 'activityAbDecision/getSeqList',
        payload: {
          COUNT: count,
          TYPE: 'PROCESSING_CELL',
          AUTO_CELL_CODE : true,
          staffId: userInfo.staffInfo.staffId, // 当前用户id
          staffName: userInfo.staffInfo.staffName // 用户姓名
        },
        success: (svcCont) => {
          const { data = {} } = svcCont;
          const { SEQ_LIST: seqList = [], CODE_LIST: codeList = [] } = data;
          resolve({seqList, codeList});
        }
      });
    })
  }

  controlOutput = () => {
    const { activityAbDecision } = this.props;
    const { sampleList } = activityAbDecision;
    const { outputcellTempList } = this.state;
    const list = [];
    for(let i = 0; i < sampleList.length; i += 1) {
      const sample = sampleList[i];
      const obj = {
        id: outputcellTempList[i].id,
        inputcellId: 0,  // 没数据了现在 input.ID;
        sampleBlockId: sample.id, // sample的id
        percent: sample.percent,
        inputCellName: "AbDecision", // input.CELL_NAME;
        sample: sample.blockName,
        outputCellName: `AbDecision.${sample.blockName}_${outputcellTempList[i].id}_${sample.percent}`, // input.CELL_NAME + "." + block.BLOCK_NAME;
        cellCode: outputcellTempList[i].code
      };
      list.push(obj);
      this.setState({ outputCellList: list });
    }
  }

  // 采样条数改变
  sampleNumChange = () => {
    const { form } = this.props;
    const { getFieldValue } = form;
    this.setState({ sampleNum: getFieldValue('sampleNum') })
  }

  // 增加采样
  addSample = () => {
    const { form } = this.props;
    const { inputCellList, sampleNum = 0 } = this.state;
    const newNum = sampleNum + 1;
    // 请选择接入数据
    if(!inputCellList.length) {
      message.info(formatMessage({ id: 'activityConfigManage.abDecision.inputError' }));
      return
    }
    // 采样条数不能超过5条
    if(sampleNum >= 5) {
      message.info(formatMessage({ id: 'activityConfigManage.abDecision.sampleCount' }));
      return
    }
    this.setState({ sampleNum: newNum });
    form.setFieldsValue({ sampleNum: newNum });
  }
  
  /**
   *
   *提交节点
   * @memberof ActivityFlowSetting
   */
  handleSubmit = () => {
    const { dispatch, form, nodeData, onOk, onCancel, userInfo, activityAbDecision } = this.props;
    const { sampleList } = activityAbDecision;
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
      const { inputCellList, outputCellList } = this.state;
      const { processName, sampleNum, responseType, sampleMethod, jobDate, decisionsInput } = values;
      if(!processName.trim()) {
        message.info(formatMessage({ id: 'activityConfigManage.abDecision.proNameError'}));
      }
      if(!sampleNum || sampleNum < 1) {
        message.info(formatMessage({ id: 'activityConfigManage.abDecision.sampleInputError' }));
        return
      }
      // 校验采样列表：名称不能相同，百分比加起来不能超过100
      const hasSampleName = {};
      let hasRepeat = false;
      let percentAmount = 0;
      for(let i = 0; i < sampleList.length; i += 1) {
        const sample = sampleList[i];
        percentAmount += sample.percent;
        if(hasSampleName[sample.blockName]) {
          hasRepeat = true;
          break
        }
      }
      // 存在重复的采集名称 Sample Name
      if(hasRepeat) {
        message.info(formatMessage({ id: 'activityConfigManage.abDecision.sampleNameError' }));
        return
      }
      // 百分比总和超过百分之100%
      if(percentAmount > 100) {
        message.info(formatMessage({ id: 'activityConfigManage.abDecision.totalPercentError' }));
        return
      }
      // 百分比总和少于或等于0
      if(percentAmount <= 0) {
        message.info(formatMessage({ id: 'activityConfigManage.abDecision.totalPercentLessError' }));
        return
      }
      const contactProcess = {
        FLOWCHART_ID: flowchartId,
        PROCESS_TYPE: processType,
        PROCESS_NAME: processName,
        SAMPLE_LIST: objToLineCase(sampleList, 'upper'),
        SIZE_METHOD: 'P',
        RESPONSE_TYPE_LIST: responseType && responseType.length && responseType.join(',') || '', // 决策动作
        SAMPLE_METHOD: sampleMethod, // 决策条件
        JOB_DATE: jobDate && moment(jobDate).format(dateTimeFormat), // 决策时间
        DECISIONS_INPUT: decisionsInput, // 决策条数
        INPUT_CELLS: objToLineCase(inputCellList, 'upper'),
        OUTPUT_CELL: objToLineCase(outputCellList, 'upper'),
        OUTPUT_CELLS_AMOUNT: outputCellList.length
      };
      const params = {
        contactProcess,
        staffId: userInfo.staffInfo.staffId, // 当前用户id
        staffName: userInfo.staffInfo.staffName // 用户姓名
      };

      dispatch({
        type: addFlag ? 'activityAbDecision/addProcess' : 'activityAbDecision/modProcess',
        payload: params,
        success: (svcCont) => {
          const { data = {} } = svcCont;
          const newNodeData = { 
            ...nodeData,
            ...data,
            PROCESS_ID: data.PROCESS_ID,
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
    const { getFieldDecorator, getFieldValue } = form;
    const {
      processName,
    } = this.selectItem;
    const { inputList, processInfo, outputCellList, inputCellList, sampleNum } = this.state;

    const responseType = [
      { id:'24', name:'BUY' },
      { id:'23', name:'CLOSE'},
      { id:'20', name:'Opt In'},
      { id:'15', name:'Agree'},
    ];

    const title = (
      <div>
        <span className={commonStyles.modalTitle}>{formatMessage({ id: 'activityConfigManage.abDecision.title' })}</span>
        <Divider type='vertical' />
        <Form.Item className={commonStyles.titleNameFormItem}>
          {getFieldDecorator('processName', {
            initialValue: processName,
          })(
            <Input
              size='small'
              className={commonStyles.titleNameInput}
              placeholder={formatMessage({ id: 'activityConfigManage.flow.customName' })}
              addonAfter={<Iconfont type='iconbianji1' />}
            />,
          )}
        </Form.Item>
      </div>
    );

    const inputCustomProps = {
      mode: 'multiple',
      dataSource: inputList.map(item => ({ value: item.id, label: item.cell_name }))
    }

    const ResponseCustomProps = {
      mode: 'multiple',
      dataSource: responseType.map(item => ({ value: item.id, label: item.name }))
    }

    
    const sampleTableProps = {
      sampleNum,
      defaultList: processInfo.sampleList,
      handleAdd: this.addSample,
      changeNum: (num) => {
        this.setState({ sampleNum: num });
        form.setFieldsValue({ sampleNum: num });
      }
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
        <Form {...this.formItemLayout} className={styles.abDecisionForm} id='abDecisionForm'>
          <div className={commonStyles.block}>
            <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.inputData' })}</p>
            {/* 接入选择 */}
            <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.access' })}>
              {getFieldDecorator('inputCellList', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
                initialValue: inputCellList.map(item => item.id),
                onChange: this.inputChange
              })(<CustomSelect {...inputCustomProps} />)}
            </Form.Item>
          </div>
          {/* 决策规则 */}
          <div className={commonStyles.block}>
            <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.abDecision.ruleChoose' })}</p>
            {/* 决策动作 */}
            <Form.Item label={formatMessage({ id: 'activityConfigManage.abDecision.action' })}>
              {getFieldDecorator('responseType', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
                initialValue: processInfo.responseType
              })(<CustomSelect {...ResponseCustomProps} />)}
            </Form.Item>
            {/* 决策条件 */}
            <Form.Item label={formatMessage({ id: 'activityConfigManage.abDecision.decisionsConditions' })}>
              {getFieldDecorator('sampleMethod', {
                initialValue: processInfo.sampleMethod || '1'
              })(
                <Radio.Group>
                  <Radio value='1'>{formatMessage({ id: 'activityConfigManage.abDecision.nNumber' })}</Radio>
                  <Radio value='2'>{formatMessage({ id: 'activityConfigManage.abDecision.nDate' })}</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            {/* 决策条数 */}
            {/* 决策时间 */}
            {
              getFieldValue('sampleMethod') === '1' ? (
                <Form.Item label={formatMessage({ id: 'activityConfigManage.abDecision.trigger' })}>
                  {getFieldDecorator('decisionsInput', {
                    initialValue: processInfo.decisionsInput
                  })(
                    <InputNumber size='small' min={1} precision={0} className={styles.fixedWidth} />,
                  )}
                </Form.Item>
              ) : (
                <Form.Item label={formatMessage({ id: 'activityConfigManage.abDecision.jobDate' })}>
                  {getFieldDecorator('jobDate', {
                    rules: [{ type: 'object' }],
                    initialValue: processInfo.jobDate && moment(processInfo.jobDate)
                  })(
                    <DatePicker size='small' showTime className={styles.fixedWidth} getCalendarContainer={() => document.getElementById('abDecisionForm')} />,
                  )}
                </Form.Item>
              )
            }
          </div>
          {/* 决策信息 */}
          <div className={commonStyles.block}>
            <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.abDecision.decisionRule' })}</p>
            {/* 采样条数 */}
            <Form.Item label={formatMessage({ id: 'activityConfigManage.abDecision.trigger' })}>
              {getFieldDecorator('sampleNum', {
                rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
                initialValue: processInfo.sampleNum
              })(
                <InputNumber size='small' min={0} precision={0} max={5} onBlur={this.sampleNumChange} className={styles.fixedWidth} />,
              )}
            </Form.Item>
            {/* 采样列表 */}
            <SampleTable {...sampleTableProps} />
          </div>
          {/* 输出数据 */}
          {
            inputCellList && inputCellList.length ?
            <div className={commonStyles.block}>
              <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.outputData' })}</p>
              <Row gutter={24}>
                {
                  outputCellList.map((item) => {
                    return (
                      <Col span={12} key={item.cellCode} className={commonStyles.outputCusRow}>
                        <Row type="flex" justify="space-between" align="middle" className={commonStyles.outputCus}>
                          <span className={commonStyles.icon}>
                            <Iconfont type="iconoutput" />
                          </span>
                          <Col className={commonStyles.text}>
                            <p>{item.outputCellName}</p>
                            <p className={commonStyles.tip}>{item.cellCode}</p>
                          </Col>
                        </Row>
                      </Col>
                    )
                  })
                }
              </Row>
            </div>
            : null
          }
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AbDecision)