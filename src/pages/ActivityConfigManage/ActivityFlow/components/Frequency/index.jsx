// 频率
// 参数： form,processType,processInfo
import React from 'react';
import { Form, Switch, Radio, InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import classnames from 'classnames'
import commonStyles from '../../common.less';
import styles from './index.less';

class Frequency extends React.Component {

  render() {
    const { form, processType, processInfo } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    return (
      <div className={commonStyles.block}>
        {/* 频率 */}
        <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.listener.campaignFrequency'})}</p>
        {/* 控制频率 */}
        <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.frequencyControl'})} {...this.formItemLayout2}>
          {getFieldDecorator('isFrequencyControl', {
            valuePropName: 'checked',
            initialValue: !processInfo.id || processInfo.frequencyControl
          })(
            <Switch/>,
          )}
        </Form.Item>
        {/* 次数 */}
        {
          getFieldValue('isFrequencyControl') ? (
            <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.times' })} className={commonStyles.doubleFormItem}>
              <Form.Item className={commonStyles.inlineFormItem}>
                {getFieldDecorator('times', {
                  rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                  initialValue: processInfo.times
                })(
                  <InputNumber size='small' min={0} precision={0} />,
                )}
              </Form.Item>
              <Form.Item className={classnames(commonStyles.inlineFormItem, styles.frequencyControlStyle)}>
                {getFieldDecorator('frequencyControl', {
                  initialValue: processInfo.frequencyControl || 'PERDAY'
                })(
                  <Radio.Group>
                    <Radio value="PERDAY">
                      <span>{formatMessage({ id: 'activityConfigManage.listener.every' })}</span>
                      <Form.Item className={commonStyles.inlineFormItem} style={{ marginLeft: '5px', marginRight: '5px' }}>
                        {getFieldDecorator('frequencyDuration', {
                          rules: [{ required: getFieldValue('frequencyControl') === 'PERDAY', message: formatMessage({ id: 'common.form.required' }) }],
                          initialValue: processInfo.frequencyDuration
                        })(
                          <InputNumber size='small' min={0} precision={0} disabled={getFieldValue('frequencyControl') != 'PERDAY'} />
                        )}
                      </Form.Item>
                      <span>{formatMessage({ id: 'activityConfigManage.listener.day' })}</span>
                    </Radio>
                    <Radio value="CMP">{formatMessage({ id: 'activityConfigManage.listener.marketingValidity' })}</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Form.Item>
          ) : null
        }
        {/* 总数 */}
        {
          processType == 'LISTENER' ? 
          <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.totalTimes' })}>
            {getFieldDecorator('totalTimes', {
              initialValue: processInfo.totalTimes
            })(
              <InputNumber size='small' min={0} precision={0} />,
            )}
          </Form.Item>
          : null
        }
      </div>
    )
  }
}

export default Frequency