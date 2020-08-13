/**
 * 输出元素控制设置
 * 控制组--
 *  1、只有一个控制组
 *  2、设置为是控制组，其他输出组可选择
 */
import React from 'react';
import { Modal, Form, Radio, Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../../common.less';

@Form.create()
class OutputEdit extends React.Component {
  formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  // 提交
  handleSubmit = () => {
    const { form, currentEditItem, outputList, onOk } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let controlCellName;
      outputList.forEach(item => {
        if (item.processingCellId === values.controlCellid) {
          controlCellName = item.cellName;
        }
      });
      // 返回isControl，controlCellid，controlCellName
      onOk({ ...values, processingCellId: currentEditItem.processingCellId, controlCellName });
    });
  };

  // 控制项变化
  isControlChange = e => {
    const { form, currentEditItem } = this.props;
    const { value } = e.target;
    if (value === 'Y') {
      form.setFieldsValue({
        controlCellid: '',
      });
    } else {
      form.setFieldsValue({
        controlCellid: currentEditItem.controlCellid,
      });
    }
  };

  render() {
    const { onCancel, form, currentEditItem, outputList } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.contact.flowchartEditRecord' })}
        visible
        width={840}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <Form {...this.formItemLayout}>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.flowchartIsControl' })}>
            {getFieldDecorator('isControl', {
              rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
              initialValue: currentEditItem.isControl,
              onChange: this.isControlChange,
            })(
              <Radio.Group>
                <Radio value="Y">{formatMessage({ id: 'common.text.yes' })}</Radio>
                <Radio value="N">{formatMessage({ id: 'common.text.no' })}</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.controlCell' })}>
            {getFieldDecorator('controlCellid', {
              initialValue: currentEditItem.controlCellid,
            })(
              <Select placeholder={formatMessage({ id: 'common.form.input' })} disabled={getFieldValue('isControl') === 'Y'}>
                {outputList &&
                  outputList.map(item => {
                    if (
                      item.isControl === 'Y' &&
                      item.processingCellId !== currentEditItem.processingCellId
                    ) {
                      return (
                        <Select.Option key={item.processingCellId} value={item.processingCellId}>
                          {item.cellName}
                        </Select.Option>
                      );
                    }
                    return false;
                  })}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default OutputEdit;
