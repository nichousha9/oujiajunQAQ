// 运营位
import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import CustomSelect from '@/components/CustomSelect/index';
import commonStyles from '../../common.less';

@connect(({ activityFlowContact, loading }) => ({
  activityFlowContact,
  loading: loading.effects['activityFlowContact/qryAdviceChannel'],
}))
@Form.create()
class AdviceChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adviceChannelList: [],
    };
  }

  componentDidMount() {
    this.getData();
    const { processId } = this.props;
    // 如果有processId则去请求之前保存数据
    if(processId){
      this.qryAdviceChannelRel();
    }
  }

  /**
   *
   *获取运营位数据
   * @memberof AdviceChannel
   */
  getData = () => {
    const { dispatch, channelId } = this.props;
    dispatch({
      type: 'activityFlowContact/qryAdviceChannel',
      payload: {
        channelId,
      },
      success: ({ data = [] }) => {
        this.setState({
          adviceChannelList: data,
        });
      },
    });
  };

  /**
   *
   *查询环节之前保存接入数据
   * @memberof AdviceChannel
   */
  qryAdviceChannelRel = () => {
    const { dispatch, processId } = this.props;
    dispatch({
      type: 'activityFlowContact/qryAdviceChannelRel',
      payload: {
        processId
      },
      success: ({ data = [] }) => {
        dispatch({
          type: 'activityFlowContact/save',
          payload:{ mccProcessAdviceChannelRel: data && data[0] || {} }
        });
      },
    });
  };

  /**
   *
   *运营位选择变化
   * @memberof AdviceChannel
   */
  handleChange = key => {
    const { dispatch } = this.props;
    const { adviceChannelList } = this.state;
    const result = adviceChannelList.filter(item => item.adviceChannel === key);
    dispatch({
      type: 'activityFlowContact/save',
      payload: { mccProcessAdviceChannelRel: result && result[0] || {} }
    })
  };

  render() {
    const { form, activityFlowContact } = this.props;
    const { getFieldDecorator } = form;
    const { adviceChannelList } = this.state;
    const { mccProcessAdviceChannelRel } = activityFlowContact;
    const dataSource = [];
    adviceChannelList.forEach(item => {
      dataSource.push({
        label: item.adviceChannelName,
        value: String(item.adviceChannel),
      });
    });
    return (
      <div className={commonStyles.block}>
        <p className={commonStyles.title}>{formatMessage({ id: 'activityConfigManage.contact.operationalInformation' })}</p>
        {/* 运营位选择 */}
        <Form.Item label={formatMessage({ id: 'activityConfigManage.contact.operational' })}>
          {getFieldDecorator('adviceChannelId', {
            rules: [{ required: true, message: formatMessage({ id: 'common.form.required' }) }],
            initialValue: mccProcessAdviceChannelRel.adviceChannel && String(mccProcessAdviceChannelRel.adviceChannel),
            onChange: this.handleChange,
          })(<CustomSelect dataSource={dataSource} />)}
        </Form.Item>
      </div>
    );
  }
}

export default AdviceChannel;
