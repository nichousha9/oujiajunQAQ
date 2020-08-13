/* 触发器弹窗
参数：{
  form
  processInfo // 初始数据
}; */
import React, { Fragment } from 'react';
import { Form, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import CustomSelect from '@/components/CustomSelect';
import TriggerChoose from './TriggerChoose';
import commonStyles from '../../common.less';

class Trigger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerChooseVisible: false,
      triggerData: {}
    };
  }

  componentWillUpdate(nextProps) {
    const { processInfo } = this.props;
    if(JSON.stringify(nextProps.processInfo) != JSON.stringify(processInfo) && nextProps.processInfo.mktEvent) {
      this.setInitial();
    }
  }

  setInitial = (nextProps) => {
    this.setState({ 
      triggerData: { 
        id: nextProps.processInfo.mktEvent, 
        name: nextProps.processInfo.mktEventName,
        eventInputName: nextProps.processInfo.eventInputName
      } 
    });
  }

  /**
   *
   *选择弹窗选择规则
   * @memberof Trigger
   */
  addTrigger = () => {
    this.setState({ triggerChooseVisible: true });
  };

  /**
   *选中规则返回
   *
   * @memberof Trigger
   */
  onOk = values => {
    this.setState({ triggerChooseVisible: false, triggerData: values });
  };

  /**
   *
   *删除已有规则
   * @memberof Trigger
   */
  onClose = () => {
    this.setState({ triggerData: {} });
  };

  // 外部校验获取数据
  getTriggerData = () => {
    const { triggerData } = this.state;
    if(!triggerData.id) {
      message.info('请选择营销事件');
      return false
    }
    return triggerData
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { triggerChooseVisible, triggerData } = this.state;

    const customSelectProps = {
      mode: 'tags',
      dataSource:
      triggerData && triggerData.id
          ? [
              {
                label: `事件名称：${triggerData.name} 规则策略：${triggerData.eventInputName}`,
                value: triggerData.id,
              },
            ]
          : [],
      onClose: this.onClose,
      otherNode: <a onClick={this.addTrigger}>添加</a>,
    };

    const ruleChooseProps = {
      visible: triggerChooseVisible,
      onCancel: () => {
        this.setState({ triggerChooseVisible: false });
      },
      onOk: this.onOk,
    };
    return (
      <Fragment>
        {triggerChooseVisible && <TriggerChoose {...ruleChooseProps} />}
        <div className={commonStyles.block}>
          <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.listener.trigger' })}</p>
          <Form.Item label={formatMessage({ id: 'activityConfigManage.listener.marketingEvent' })}>
            {getFieldDecorator('triggerData', {
              initialValue: [],
            })(<CustomSelect {...customSelectProps} />)}
          </Form.Item>
        </div>
      </Fragment>
    );
  }
}

export default Trigger;
