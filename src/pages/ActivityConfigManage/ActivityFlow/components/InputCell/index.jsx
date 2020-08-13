/* 接入数据
参数props:
processId: 节点id
prevNodeData: 上个节点
flowchartId： 流程id
form，
showIsAccumulation： 是否展示累计，
processInfo：部分初始值，
showDealDay： 工单最大处理天数, 
showIsAllCustom： 全网用户
showTestSeg: 测试群组 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Switch, InputNumber, Row, Col, Checkbox } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import CustomSelect from '@/components/CustomSelect/index';
import SegmentChoose from '../Segment/SegmentChoose';
import commonStyles from '../../common.less';

@connect(({ activityFlowContact }) => ({
  activityFlowContact
}))

class InputCell extends React.Component {
  formItemLayout2 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  formItemLayout3 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };

  constructor(props) {
    super(props);
    this.state = {
      inputList: [], // 输入列表
      segmentChooseVisible: false, // 测试群组选择弹窗
    };
  }

  componentDidMount() {
    this.qryPreProcessInfos();
    this.getInitialInfo();
  }

  /**
   *
   *查询环节接入数据接口
   * @memberof InputCell
   */
  qryPreProcessInfos = () => {
    const { dispatch, prevNodeData, flowchartId } = this.props;
    const preIds = [];
    if(!prevNodeData || prevNodeData.length < 1) {
      return
    }
    prevNodeData.forEach(element => {
      preIds.push(element.PROCESS_ID);
    });
    dispatch({
      type: 'activityFlowContact/qryPreProcessInfos',
      payload: {
        flowchartId,// 流程id
        preIds// 环节id
      },
      success: ({ data = [] }) => {
        this.setState({
          inputList: data && data.commonInfos || [],
        });
      },
    });
  };
  
  /**
   *
   *查询环节之前保存接入数据
   * @memberof InputCell
   */
  getInitialInfo = () => {
    const { dispatch, processId, showTestSeg, form } = this.props;
    // 如果有processId则去请求之前保存数据
    if(processId) {
      dispatch({
        type: 'activityFlowContact/qryProcessCellInfo',
        payload: {
          id: processId
        },
        success: ({ data = [] }) => {
          dispatch({
            type: 'activityFlowContact/save',
            payload:{ inputCellList: data }
          })
        },
      });
    }
    if(processId && showTestSeg) {
      dispatch({
        type: 'activityFlowContact/qryTestContactSeg',
        payload: {
          processId
        },
        success: (svcCont) => {
          const { data = [] } = svcCont;
          if(data && data.length) {
            const segment = data[0];
            dispatch({
              type: 'activityFlowContact/save',
              payload:{ 
                testSegment: {id: segment.segmentId, name: segment.segmentName, ...segment} 
              }
            });
            if(segment.runInclude && segment.runInclude === 'Y') {
              form.setFieldsValue({ runInclude: true });
            }
          }
        }
      })
    }
  }


  /**
   *
   *接入选择变化
   * @memberof InputCell
   */
  handleChange = keys => {
    const { dispatch } = this.props;
    const { inputList } = this.state;
    const result = inputList.filter(item => keys.indexOf(item.id) > -1);
    dispatch({
      type: 'activityFlowContact/save',
      payload:{ inputCellList: result }
    })
  };

  // 选择测试群组
  addTestSegment = () => {
    this.setState({ segmentChooseVisible: true });
  }

  // 删除测试群组
  onClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        testSegment: {}
      }
    });
  }

  
  /**
   *选中测试群组返回
   *
   * @memberof Segment
   */
  onOk = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        testSegment: values
      }
    });
    this.setState({ 
      segmentChooseVisible: false
    });
  };

  render() {
    const { form, activityFlowContact, showIsAccumulation, processInfo, showDealDay, showIsAllCustom, showTestSeg } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { inputList, segmentChooseVisible } = this.state;
    const { inputCellList, testSegment } = activityFlowContact;
    const dataSource = [];
    inputList.forEach(item => {
      dataSource.push({
        label: item.cell_name,
        value: item.id,
      })
    });

    const customSelectProps = {
      mode: 'tags',
      dataSource: testSegment.id ? [{
        label: testSegment.name,
        value: testSegment.id
      }] : [],
      onClose: this.onClose,
      otherNode: <a onClick={this.addTestSegment}>添加</a>,
    };

    const SegmentChooseProps = {
      visible: segmentChooseVisible,
      onCancel: () => {
        this.setState({ segmentChooseVisible: false });
      },
      onOk: this.onOk,
    };

    return (
      <Fragment>
        {segmentChooseVisible && <SegmentChoose {...SegmentChooseProps} />}
        <div>
          <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.inputData' })}</p>
          {/* 全网用户 */}
          {
            showIsAllCustom && (
              <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.allAust' })}>
                {getFieldDecorator('isAllCust', {
                  valuePropName: 'checked',
                  initialValue: processInfo.isAllCust === '1'
                })(<Switch />)}
              </Form.Item>
            )
          }
          {/* 接入选择 */}
          {
            !getFieldValue('isAllCust') ? (
              <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.access' })}>
                {getFieldDecorator('inputCellList', {
                  rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
                  initialValue: inputCellList.map(item => item.id),
                  onChange: this.handleChange
                })(<CustomSelect mode='multiple' dataSource={dataSource} />)}
              </Form.Item>
            ) : null
          }
          {/* 是否累计 */}
          {/* {
            showIsAccumulation && (
              <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.isAccumulation' })}>
                {getFieldDecorator('isAccumulation', {
                  valuePropName: 'checked',
                  initialValue: processInfo.isAccumulation === '1'
                })(<Switch />)}
              </Form.Item>
            )
          } */}
          {/* 工单最大处理天数 */}
          {
            showDealDay ? 
            <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.orderMaxDay' })}>
              {getFieldDecorator('dealDay', {
                initialValue: processInfo.dealDay
              })(<InputNumber min={0} precision={0} size='small' />)}
            </Form.Item>
            : null
          }
          {
            showTestSeg ? (
              <Row>
                <Col span={12}>
                  <Form.Item {...this.formItemLayout2} label={formatMessage({ id: 'activityConfigManage.contact.testSegment' })}>
                    {getFieldDecorator('testSegmentRel', {
                      rules: [{
                        required: true, message: formatMessage({ id: 'common.form.required' })
                      }],
                    })(<CustomSelect {...customSelectProps} />)}
                  </Form.Item>
                </Col>
                {
                  testSegment.id ? (
                    <Col span={12}>
                      <Form.Item {...this.formItemLayout3} label={formatMessage({ id: 'activityConfigManage.contact.includedWhenRun' })}>
                        {getFieldDecorator('runInclude', {
                          valuePropName: 'checked',
                        })(<Checkbox />)}
                      </Form.Item>
                    </Col>
                  ) : null
                }
              </Row>
            ) : null
          }
        </div>
      </Fragment>
    );
  }
}

export default InputCell;
