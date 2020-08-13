// 输出元素设置
import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Radio, Table } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/qryCampCellByFlowchartId'],
}))
@Form.create()
class OutputEdit extends React.Component {
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.contact.cellName' }), // '分组名称',
      dataIndex: 'cell_name',
      key: 'cell_name',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.contact.cellCode' }), // '分组编号',
      dataIndex: 'cell_code',
      key: 'cell_code',
    },
  ];

  constructor(props) {
    super(props);
    const initialValue = this.getInitial();
    this.state = {
      campCellList: [], // 目标客户群列表
      selectedCell: {}, // 选中目标客户
      initialValue, // 处理初始值
      linkToTargetCell: initialValue.linkToTargetCell, // cell类型
    };
  }

  componentDidMount() {
    this.qryCampCellByFlowchartId();
  }

  /**
   *
   *获取查询输出元素设置弹出框的目标客户群列表数据
   * @memberof OutputEdit
   */
  qryCampCellByFlowchartId = () => {
    const { dispatch, flowchartId, processId, currentEditItem } = this.props;
    dispatch({
      type: 'activityFlowContact/qryCampCellByFlowchartId',
      payload: {
        FLOWCHART_ID: flowchartId, // 流程id
        PROCESSING_CELL_ID: processId, // 环节单元ID
        TARGET_NOT_EXIST: 'Y', // 目标是否不存在
        pageInfo: {},
      },
      success: svcCont => {
        const { data = [] } = svcCont;
        let selectedCell = {};
        data.forEach(item => {
          if (currentEditItem.targetCellid && item.cellid === currentEditItem.targetCellid) {
            selectedCell = item;
          }
        });
        this.setState({ campCellList: (svcCont && svcCont.data) || [], selectedCell });
      },
    });
  };

  // 处理默认值
  getInitial = () => {
    const { currentEditItem } = this.props;
    const initialValue = {};

    initialValue.cellName = currentEditItem.cellName;
    if (currentEditItem.targetCellid && currentEditItem.targetCellid != 'null') {
      initialValue.linkToTargetCell = 'linkToTargetCellId';
    } else {
      initialValue.linkToTargetCell = 'createProcessingCellId';
    }

    return initialValue;
  };

  // 选中某一条目标客户群
  clickRow = record => {
    const { form } = this.props;
    this.setState({ selectedCell: record });
    form.setFieldsValue({
      cellName: record.cell_name,
    });
  };

  // 处理选中目标客户群颜色区分
  setClassName = record => {
    const { selectedCell } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.cellid === selectedCell.cellid ? commonStyles.tableRowSelect : '';
  };

  // cell类型变化
  linkToTargetCellChange = e => {
    const { form, currentEditItem } = this.props;
    const { campCellList } = this.state;
    const { value } = e.target;
    let selectedCell = {};
    if (value === 'linkToTargetCellId') {
      campCellList.forEach(item => {
        if (currentEditItem.targetCellid && item.cellid === currentEditItem.targetCellid) {
          selectedCell = item;
        }
      });
      form.setFieldsValue({
        cellName: selectedCell.cell_name || '',
      });
    } else {
      form.setFieldsValue({
        cellName: currentEditItem.cellName || '',
      });
    }
    this.setState({ linkToTargetCell: value, selectedCell });
  };

  // 提交
  handleSubmit = () => {
    const { form, onOk, currentEditItem } = this.props;
    const { selectedCell } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const params = {
        ...currentEditItem,
        cellName: values.cellName,
      };

      if (values.linkToTargetCell === 'linkToTargetCellId') {
        params.targetCellid = selectedCell.cellid;
      }

      onOk(params);
    });
  };

  render() {
    const { loading, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const { campCellList, initialValue, linkToTargetCell } = this.state;

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.contact.outputCellSetting' })}
        visible
        width={840}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <Form {...this.formItemLayout}>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.cellType' })}>
            {getFieldDecorator('linkToTargetCell', {
              rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
              initialValue: initialValue.linkToTargetCell,
              onChange: this.linkToTargetCellChange,
            })(
              <Radio.Group>
                <Radio value="createProcessingCellId">{formatMessage({ id: 'activityConfigManage.contact.createProcessingCell' })}</Radio>
                <Radio value="linkToTargetCellId">{formatMessage({ id: 'activityConfigManage.contact.linkToTargetCell' })}</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.cellName' })}>
            {getFieldDecorator('cellName', {
              rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
              initialValue: initialValue.cellName,
            })(<Input disabled={linkToTargetCell === 'linkToTargetCellId'} />)}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.targetCell' })}>
            <Table
              rowKey="cellid"
              dataSource={campCellList}
              columns={this.columns}
              pagination={false}
              loading={loading}
              {...(linkToTargetCell === 'linkToTargetCellId'
                ? {
                    rowClassName: this.setClassName,
                    onRow: record => ({ onClick: this.clickRow.bind(this, record) }),
                  }
                : {})}
            />
            <p>{formatMessage({ id: 'activityConfigManage.contact.linkToTargetCellHint' })}</p>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default OutputEdit;
