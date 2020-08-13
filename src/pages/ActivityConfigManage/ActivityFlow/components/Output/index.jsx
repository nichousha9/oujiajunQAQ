// 输出模块
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Badge } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames';
import Iconfont from '@/components/Iconfont';
import commonStyles from '../../common.less';
import styles from './index.less';
import OutputEdit from './OutputEdit';
import OutputControl from './OutputControl';

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/qryOutputCells'],
}))

class Output extends React.Component {
  outputColumns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.outPutSet' }), // '输出客户群',
      dataIndex: 'cellName',
      key: 'cellName',
      width: 280,
      render: (text, record) => {
        return this.getCell(record, true);
      },
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.state' }), // '状态',
      dataIndex: 'isControl',
      key: 'isControl',
      render: (text) => {
        if(text === "N") {
          return (
            <div>
              <Badge status="default" /> 
              {/* 未启用 */}
              {formatMessage({ id: 'activityConfigManage.contact.notUse' })}
            </div>
          )
        }
        return (
          <div>
            <Badge status="success" />
            {/* 已启用 */}
            {formatMessage({ id: 'activityConfigManage.contact.use' })}
          </div>
        )
      }
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.controlCell' }), // '控制单元',
      dataIndex: 'controlCellName',
      key: 'controlCellName',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      outputCells: [], // 获取的输出列表
      outputEditVisible: false, // 输出元素设置弹窗
      outputControlVisible: false, // 控制设置弹窗
      currentEditItem: {}, // 当前要编辑的元素
    }
  }

  componentDidMount() {
    this.qryOutputCells();
  }

  componentDidUpdate(prevProps) {
    const { activityFlowContact } = this.props;
    const { inputCellList } = activityFlowContact;
    if(inputCellList !== prevProps.activityFlowContact.inputCellList){
      this.handleOutputList();
    }
  }

  // 输出块
  getCell = (record, isOperate) => {
    return (
      <Row type="flex" justify="space-between" align="middle" className={classnames(commonStyles.outputCus, isOperate ? null : commonStyles.widther)}>
        <span className={commonStyles.icon}>
          <Iconfont type="iconoutput" />
        </span>
        <Col className={commonStyles.text}>
          <p>{record.cellName}</p>
          <p className={commonStyles.tip}>{record.cellCode}</p>
        </Col>
        {
          isOperate ? (
            <Col>
              <div className={commonStyles.operate}>
                <a onClick={()=>{this.setState({ outputEditVisible: true, currentEditItem: record })}}>
                  <Iconfont type="iconeditx" />
                </a>
                <a onClick={()=>{this.setState({ outputControlVisible: true, currentEditItem: record })}}>
                  <Iconfont type="iconpeizhi" />
                </a>
              </div>
            </Col>
          ) : null
        }
      </Row>
    )
  }
  
  // 根据processId获取所有输出列表
  qryOutputCells = () => {
    const { dispatch, processId } = this.props;
    if(processId){
      this.qryFlag = true;
      dispatch({
        type:'activityFlowContact/qryOutputCells',
        payload: { processId },
        success: (svcCont) => {
          this.qryFlag = false;
          this.setState({
            outputCells: svcCont.data || []
          }, this.handleOutputList)
        },
        error: () => {
          this.qryFlag = false;
        }
      })
    }
  }

  // 根据输入和数据处理输出列表
  handleOutputList = async (dataSource = [], index = 0) => {
    const { dispatch } = this.props;
    const { activityFlowContact } = this.props;
    const { inputCellList } = activityFlowContact;
    if(this.qryFlag) {
      return
    }
    if(inputCellList && inputCellList.length){
      const node = await this.getNewNode(inputCellList[index]);
      dataSource.push(node);
      const next = index + 1;
      if(next < inputCellList.length) {
        await this.handleOutputList(dataSource,next)
      }
      else {
        dispatch({
          type: 'activityFlowContact/save',
          payload: {
            outputCellList: dataSource
          }
        })
      }
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
  getNewNode = async (input) => {
    const { processName } = this.props;
    const { outputCells } = this.state;
    let target;
    outputCells.forEach(output =>{
      if(input.id === output.inputCellId){
        target = output;
      }
    });
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
    node.cellName = `${input.cell_name}_${processName}_${node.processingCellId}`;
    node.offerId = '';
    node.offerName = '';
    node.isControl = "N";
    node.isControlName = "No";
    node.inputLinkFlag = false;
    // targetCell的判断
    // if (input.cell_id && input.cell_id != 'null') {
    //     node.inputLinkFlag = true;
    //     node.inputTargetCellId = input.cell_id;
    //     node.targetCellid = input.cell_id;
    //     node.cellCode = input.target_cell_code;
    //     node.cellName = input.cell_name;
    // }
    return node
  }
  
  // 编辑弹窗成功返回
  onEditOk = (values) => {
    const { dispatch, activityFlowContact } = this.props;
    const { outputCellList } = activityFlowContact;
    outputCellList.forEach((item,index) => {
      if(item.processingCellId === values.processingCellId){
        outputCellList[index] = values;
      }
    });
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        outputCellList
      }
    });
    this.setState({ outputEditVisible: false });
  }

  // 编辑控制弹窗成功返回
  onControlOk = (returnValue) => {
    const { dispatch, activityFlowContact } = this.props;
    const { outputCellList } = activityFlowContact;
    // 设置否控制组(只能有一个输出时控制的)
    if (returnValue.isControl == 'Y') {
      for (let i = 0; i < outputCellList.length; i += 1) {
          outputCellList[i].isControl = "N";
          outputCellList[i].isControlName = "No";
      }
    }

    outputCellList.forEach((item,index) => {
      // 设置新数据
      if(item.processingCellId === returnValue.processingCellId){
        outputCellList[index] = {
          ...outputCellList[index],
          isControl: returnValue.isControl,
          controlCellid: returnValue.controlCellid,
          controlCellName: returnValue.controlCellName,
          isControlName: returnValue.isControl == 'Y' ? 'Yes' : 'No'
        };
      }
      // 如果其它输入控制到它则重置
      if (item.controlCellid == returnValue.processingCellId) {
        outputCellList[index] = {
          ...outputCellList[index],
          controlCellid: '',
          controlCellName: '',
        };
      }
    });
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        outputCellList
      }
    });
    this.setState({ outputControlVisible: false });
  }

  render() {
    const { activityFlowContact, loading, flowchartId, processId, isControlGroup } = this.props;
    const { outputCellList } = activityFlowContact;
    const { outputEditVisible, currentEditItem, outputControlVisible } = this.state;

    const outputEditProps = {
      flowchartId, // 流程id
      processId,// 环节单元ID
      currentEditItem,
      onCancel: () => {
        this.setState({ outputEditVisible:false });
      },
      onOk: this.onEditOk
    }

    const outputControlProps = {
      currentEditItem,
      outputList: outputCellList,
      onCancel: () => {
        this.setState({ outputControlVisible:false });
      },
      onOk: this.onControlOk
    }
    return (
      <Fragment>
        {outputEditVisible && <OutputEdit {...outputEditProps} />}
        {outputControlVisible && <OutputControl {...outputControlProps} />}
        <div className={commonStyles.block}>
          <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.outputData' })}</p>
          {
            isControlGroup ? (
              <Table
                rowKey='inputCellId'
                className={styles.outputList}
                dataSource={outputCellList}
                columns={this.outputColumns}
                pagination={false}
                loading={loading}
              />
            ) : (
              <Row gutter={24}>
                {
                  outputCellList.map((item) => {
                    return (
                      <Col span={12} key={item.cellCode} className={commonStyles.outputCusRow}>{this.getCell(item, false)}</Col>
                    )
                  })
                }
              </Row>
            )
          }
        </div>
      </Fragment>
    )
  }
}

export default Output