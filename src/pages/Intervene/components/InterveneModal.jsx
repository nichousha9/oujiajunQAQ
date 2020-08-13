import React from 'react';
import { Modal, Input, Form, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

@connect(({ user, loading })=>({
  userInfo: user.userInfo,
  confirmLoading: loading.effects['intervene/addInterveneEffect'] || loading.effects['intervene/updateInterveneEffect'],
}))
@Form.create()
class InterveneModal extends React.Component {
  componentDidMount() {
    const { action, selectedIntervene, form } = this.props;
    if(action !== 'add') {
      form.setFieldsValue({
        offerId: selectedIntervene.offerId,
      });
    }
  }

  handleOk = async () => {
    const { form, action, dispatch, selectedIntervene, toggleVisible, qryInterveneList } = this.props;
    await dispatch({
      type: 'user/getLoginInfo',
    });
    const { userInfo } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      let params = {
        ...values,
        staffId: userInfo.staffId,
      }
      if(action === 'edit') {
        const { confId, staffId } = selectedIntervene;
        params = {
          confId,
          staffId,
          ...params,
        }
      }
      dispatch({
        type: action === 'add' ? 'intervene/addInterveneEffect' : 'intervene/updateInterveneEffect',
        payload: {
          ...params,
        },
        callback: () => {
          qryInterveneList(1);
          toggleVisible('Intervene');
        }
      });
    });
  }

  handleCancel = () => {
    const { toggleVisible } = this.props;
    toggleVisible('Intervene');
  }

  render() {
    const { action, isInterveneVisible, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    const readOnly = action === 'view';

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13},
      },
    };

    return (
      <Modal
        title={formatMessage({ id: 'intervene.interveneRule' })}
        width={718}
        destroyOnClose
        visible={isInterveneVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okButtonProps={{ style: action === 'view' ? { display: 'none' } : null }}
        confirmLoading={!!confirmLoading}
      >
        <Form {...formItemLayout}>
          <Row>
            <Form.Item label={formatMessage({ id: 'intervene.interveneName' })}>
              {getFieldDecorator('offerId', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'common.form.required' }),
                  },
                ],
              })(
                <Input
                  size="small"
                  placeholder={formatMessage({ id: 'intervene.interveneNamePlaceHolder' })}
                  disabled={readOnly}
                  allowClear
                />,
              )}
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default InterveneModal;
