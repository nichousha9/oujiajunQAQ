/* 有效期
参数：
form,
processId */
import React from 'react';
import { connect } from 'dva';
import { Form, DatePicker, InputNumber, Select, TimePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import CustomSelect from '@/components/CustomSelect';
import commonStyles from '../../common.less';
import styles from './index.less';

@connect(({ activityFlowContact }) => ({
  activityFlowContact
}))

class Effective extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {}
    };
  }

  componentDidMount() {
    this.qryProcessEffDateRel();
  }
  
  qryProcessEffDateRel = () => {
    const { dispatch, processId } = this.props;
    // 如果有processId则去请求之前保存数据
    if(!processId){
      return
    }
    dispatch({
      type: 'activityFlowContact/qryProcessEffDateRel',
      payload: { processId },
      success: (svcCont) => {
        const { data = {} } = svcCont;
        this.setState({ info: data });
      }
    })
  }

   /**
   *
   * 不可选择日期
   * @memberof ResponseTemp
   */
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { info } = this.state;
    const dataSource = [
      {
        label: formatMessage({ id: 'activityConfigManage.listener.immediate' }), // '立刻',
        value: 'IMM',
      },
      {
        label: formatMessage({ id: 'activityConfigManage.listener.absoluteTime' }) , // '绝对时间',
        value: 'ABS',
      },
      {
        label: formatMessage({ id: 'activityConfigManage.listener.relativeTime' }), // '相对时间',
        value: 'REL',
      },
    ];

    return (
      <div className={commonStyles.block} id='effective'>
        {/* 有效期 */}
        <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.listener.validityPeriod' })}</p>
        {/* 生效时间 */}
        <Form.Item label={formatMessage({ id: 'activityConfigManage.flow.effTime' })}>
          {getFieldDecorator('resEffType', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
            initialValue: info.resEffType || 'IMM'
          })(<CustomSelect dataSource={dataSource} />)}
        </Form.Item>
        {/* 绝对时间 开始时间  */}
        {
          getFieldValue('resEffType') === 'ABS' ? (
            <div className={styles.greyBlock}>
              <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.startDate' })}>
                {getFieldDecorator('resEffDate', {
                  rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                  initialValue: info.resEffDate && moment(info.resEffDate)
                })(
                  <DatePicker showTime disabledDate={this.disabledDate} getCalendarContainer={() => document.getElementById('effective')} />,
                )}
              </Form.Item>
            </div>
          ) : null
        }
        {/* 相对时间 开始时间 */}
        {
          getFieldValue('resEffType') === 'REL' ? (
            <div className={styles.greyBlock}>
              <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.startDate' })} className={commonStyles.doubleFormItem}>
                  <Form.Item className={commonStyles.inlineFormItem}>
                    {getFieldDecorator('resEffOffset',{
                      rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                      initialValue: info.resEffOffset
                    })(
                      <InputNumber min={0} precision={0} />,
                    )}
                  </Form.Item>
                  <Form.Item className={commonStyles.inlineFormItem}>
                    {getFieldDecorator('resEffOffsetUnit',{
                      initialValue: info.resEffOffsetUnit || 'D'
                    })(
                      <Select getPopupContainer={() => document.getElementById('effective')}>
                        <Select.Option value='D'>{formatMessage({ id: 'activityConfigManage.listener.day' })}</Select.Option>
                        <Select.Option value='H'>{formatMessage({ id: 'activityConfigManage.listener.hour' })}</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  {
                    getFieldValue('resEffOffsetUnit') === 'D' ? [
                      <span key='1'>{formatMessage({ id: 'activityConfigManage.listener.at' })}</span>,
                      <Form.Item key='2' className={commonStyles.inlineFormItem}>
                        {getFieldDecorator('resEffTime', {
                          rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                          initialValue: info.resEffTime && moment(info.resEffTime, 'HH:mm:ss')
                        })(
                          <TimePicker getPopupContainer={() => document.getElementById('effective')} />,
                        )}
                      </Form.Item>
                    ] : null
                  }
              </Form.Item>
            </div>
          ) : null
        }
        {/* 失效时间 */}
        <Form.Item label={formatMessage({ id: 'activityConfigManage.flow.effTime' })}>
          {getFieldDecorator('resValidityType', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
            initialValue: info.resValidityType || 'ABS'
          })(
            <CustomSelect 
              dataSource={[
                {
                  label: formatMessage({ id: 'activityConfigManage.listener.absoluteTime'}), // '绝对时间',
                  value: 'ABS',
                },
                {
                  label: formatMessage({ id: 'activityConfigManage.listener.relativeTime'}), // '相对时间',
                  value: 'REL',
                },
              ]} 
            />
          )}
        </Form.Item>
        <div className={styles.greyBlock}>
          {/* 结束时间 */}
          {
            getFieldValue('resValidityType') === 'ABS' ? (
              <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.endDate' })}>
                {getFieldDecorator('resValidityDate', {
                  rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                  initialValue: info.resValidityDate && moment(info.resValidityDate)
                })(
                  <DatePicker showTime disabledDate={this.disabledDate} getCalendarContainer={() => document.getElementById('effective')} />,
                )}
              </Form.Item>
            ) : (
              <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.endDate' })} className={commonStyles.doubleFormItem}>
                  <Form.Item className={commonStyles.inlineFormItem}>
                    {getFieldDecorator('resValidityOffset',{
                      rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
                      initialValue: info.resValidityOffset
                    })(
                      <InputNumber min={1} max={300} precision={0} />,
                    )}
                  </Form.Item>
                  <Form.Item className={commonStyles.inlineFormItem}>
                    {getFieldDecorator('resOffsetUnit',{
                      initialValue: info.resOffsetUnit || 'D'
                    })(
                      <Select getPopupContainer={() => document.getElementById('effective')}>
                        <Select.Option value='D'>{formatMessage({ id: 'activityConfigManage.listener.day' })}</Select.Option>
                        <Select.Option value='H'>{formatMessage({ id: 'activityConfigManage.listener.hour' })}</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  {
                    getFieldValue('resOffsetUnit') === 'D' ? [
                      <span key='1'>{formatMessage({ id: 'activityConfigManage.listener.at' })}</span>,
                      <Form.Item key='2' className={commonStyles.inlineFormItem}>
                        {getFieldDecorator('resValidityTime', {
                          rules: [{ type: 'object', required: true, message: formatMessage({ id: 'common.form.required' }) }],
                          initialValue: info.resValidityTime && moment(info.resValidityTime, 'HH:mm:ss')
                        })(
                          <TimePicker getPopupContainer={() => document.getElementById('effective')} />,
                        )}
                      </Form.Item>
                    ] : null
                  }
              </Form.Item>
            )
          }
        </div>
      </div>
    );
  }
}

export default Effective;
