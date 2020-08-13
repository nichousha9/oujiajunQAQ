import React from 'react';
import { connect } from 'dva';
import { Form, Radio, InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../common.less';

@connect(({ activityDirectBonus }) => ({
  activityDirectBonus
}))
class OfferQuantity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQuantityLimit: true,
    }
  }

  componentDidMount() {
    const { processId } = this.props;
    // 如果有processId则去请求之前保存数据
    if(processId){
      this.qryMccListenerInjection();
    }
  }
  
  qryMccListenerInjection = () => {
    const { dispatch, processId, form } = this.props;
    dispatch({
      type: 'activityDirectBonus/qryMccListenerInjection',
      payload: { processId },
      callback: svcCont => {
        const { data = {} } = svcCont;
        const { qntlimitTimeFrame, quantityLimit } = data;
        if(quantityLimit >= 0) {
          form.setFieldsValue({ qntlimitTimeFrame, quantityLimit, offerLimitIndex: 'Y' });
        } else {
          form.setFieldsValue({ qntlimitTimeFrame, quantityLimit, offerLimitIndex: 'N' });
        }
       
        this.setState({
          showQuantityLimit: quantityLimit >= 0,
        });
      }
    });
  }



  handleChange = e => {
    const offerLimitIndex = e.target.value;
    this.setState({
      showQuantityLimit: offerLimitIndex === 'Y',
    });
  }

  render() {
    const { showQuantityLimit } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;

    const offerLimitOptions = [
      {
        label: formatMessage({ id: 'common.text.yes' }, '是'),
        value: 'Y',
      },
      {
        label: formatMessage({ id: 'common.text.no' }, '否'),
        value: 'N',
      },
    ];

    const qntlimitTimeFrameOptions = [
      {
        label: formatMessage({ id: 'activityConfigManage.directBonus.everyDay' }, '每天'),
        value: 'PERDAY',
      },
      {
        label: formatMessage({ id: 'activityConfigManage.directBonus.validityPeriodOfReply' }, '回复的有效期内'),
        value: 'RSPVALID',
      },
    ];

    return (
      <div className={commonStyles.block}>
        <p className={commonStyles.title}>
          {formatMessage({ id: 'activityConfigManage.directBonus.offerQuantity' }, '商品数量限制')}
        </p>
        {/* 接入选择 */}
        <Form.Item label={formatMessage({ id: 'activityConfigManage.directBonus.offerLimit' }, '商品限制')}>
          {getFieldDecorator('offerLimitIndex', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
            initialValue: 'Y',
            onChange: this.handleChange
          })(<Radio.Group options={offerLimitOptions} />)}
        </Form.Item>

        {showQuantityLimit && (
          <Form.Item label={formatMessage({ id: 'activityConfigManage.directBonus.offerQuantity' }, '商品数量限制')}>
            {getFieldDecorator('quantityLimit', {
             rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
             initialValue: 0,
            })(<InputNumber min={0} precision={0}/>)}
          </Form.Item>
        )}
      
        <Form.Item label={formatMessage({ id: 'activityConfigManage.directBonus.quantityEffectiveTime' }, '数量有效时间')}>
          {getFieldDecorator('qntlimitTimeFrame', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.required' })}],
            initialValue: 'PERDAY',
          })(<Radio.Group options={qntlimitTimeFrameOptions} />)}
        </Form.Item>
      </div>
    );
  }
}

export default OfferQuantity;