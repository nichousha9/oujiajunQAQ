import React from 'react';
import { Modal, Input, Form, Row, Tooltip, Col } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import styles from '../index.less';

const RULE_TYPE = {
  SCORE_CALCULATION: '1',
  RECOMMENDATION_ITEM_FILTERING: '2',
};

@connect(({ user, loading }) => ({
  userInfo: user.userInfo,
  confirmLoading:
    loading.effects['intervene/addInterveneRuleEffect'] ||
    loading.effects['intervene/updateInterveneRuleEffect'],
}))
@Form.create()
class RuleModal extends React.Component {
  componentDidMount() {
    const { action, selectedRule, form } = this.props;
    if (action !== 'add') {
      const { ruleName, action: tempAction, condition, ruleOrder } = selectedRule;
      form.setFieldsValue({
        ruleName,
        condition,
        ruleOrder,
        action: tempAction,
      });
    }
  }

  handleOk = async () => {
    const {
      form,
      action,
      dispatch,
      selectedRule,
      toggleVisible,
      selectedIntervene,
      qryRuleList,
    } = this.props;
    await dispatch({
      type: 'user/getLoginInfo',
    });
    const { userInfo } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      let params = {
        ...values,
        staffId: userInfo.staffId,
        confId: selectedIntervene.confId,
      };
      if (action === 'edit') {
        params = {
          ...selectedRule,
          ...params,
        };
      }
      dispatch({
        type:
          action === 'add'
            ? 'intervene/addInterveneRuleEffect'
            : 'intervene/updateInterveneRuleEffect',
        payload: {
          ...params,
        },
        callback: () => {
          toggleVisible('Rule');
          qryRuleList(1);
        },
      });
    });
  };

  handleCancel = () => {
    const { toggleVisible } = this.props;
    toggleVisible('Rule');
  };

  render() {
    const { action, isRuleVisible, confirmLoading, form, selectedRule } = this.props;
    const { getFieldDecorator } = form;
    const readOnly = action === 'view';

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      <Modal
        title={formatMessage({
          id:
            selectedRule &&
            selectedRule.ruleType &&
            selectedRule.ruleType === RULE_TYPE.RECOMMENDATION_ITEM_FILTERING
              ? 'intervene.ruleInfoFilter'
              : 'intervene.ruleInfo',
        })}
        width={718}
        destroyOnClose
        visible={isRuleVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        confirmLoading={!!confirmLoading}
        okButtonProps={{ style: action === 'view' ? { display: 'none' } : null }}
      >
        <Form {...formItemLayout}>
          <Row>
            <Form.Item label={formatMessage({ id: 'intervene.ruleName' })}>
              {getFieldDecorator('ruleName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'common.form.required' }),
                  },
                ],
              })(
                <Input
                  size="small"
                  disabled={readOnly}
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  allowClear
                />,
              )}
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label={formatMessage({ id: 'intervene.sort' })}>
              {getFieldDecorator('ruleOrder', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'common.form.required' }),
                  },
                ],
              })(
                <Input
                  size="small"
                  placeholder={formatMessage({ id: 'common.form.input' })}
                  disabled={readOnly}
                  allowClear
                />,
              )}
            </Form.Item>
          </Row>
          <Row>
            <Col span={19}>
              <Form.Item
                label={formatMessage({ id: 'intervene.trigger' })}
                labelCol={{ sm: { span: 24 }, md: { span: 9 } }}
                wrapperCol={{ sm: { span: 24 }, md: { span: 15 } }}
              >
                {getFieldDecorator('condition', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                    { max: 150, message: '内容请控制在150个字符以内' },
                  ],
                })(
                  <Input.TextArea
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.input' })}
                    disabled={readOnly}
                    maxLength={151}
                    allowClear
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={2} className={styles.tooltip}>
              <Tooltip title={formatMessage({ id: 'intervene.sample.condition' })}>
                {formatMessage({ id: 'intervene.sample' })}
              </Tooltip>
            </Col>
          </Row>
          <Row>
            <Col span={19}>
              <Form.Item
                label={formatMessage({ id: 'intervene.callback' })}
                labelCol={{ sm: { span: 24 }, md: { span: 9 } }}
                wrapperCol={{ sm: { span: 24 }, md: { span: 15 } }}
              >
                {getFieldDecorator('action', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                    { max: 150, message: '内容请控制在150个字符以内' },
                  ],
                })(
                  <Input.TextArea
                    size="small"
                    disabled={readOnly}
                    placeholder={formatMessage({ id: 'common.form.input' })}
                    allowClear
                    maxLength={151}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={2} className={styles.tooltip}>
              <Tooltip title={formatMessage({ id: 'intervene.sample.action' })}>
                <span>{formatMessage({ id: 'intervene.sample' })}</span>
              </Tooltip>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default RuleModal;
