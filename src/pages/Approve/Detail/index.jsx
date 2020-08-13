import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Card, Button, Input, Select, Row, Col, DatePicker, Spin } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import Flow from './Flow';
import styles from './index.less';

const { RangePicker } = DatePicker;
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

@connect(({ common, loading, user }) => ({
  CAMPAIGN_BUSI_TYPE: common.attrSpecCodeList.CAMPAIGN_BUSI_TYPE,
  loading:
    loading.effects['approveDetail/addApprovalFlowchart'] ||
    loading.effects['approveDetail/modApprovalFlowchart'],
  pageLoading: loading.effects['approveDetail/qryApprovalFlowchartDtl'],
  userInfo: user.userInfo && user.userInfo.userInfo,
}))
@Form.create()
class ActivityTemplateDetail extends React.Component {
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  formItemLayout24 = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
  };

  state = {
    step: 1, // 分开基础信息和流程信息为两个步骤保存
    info: {}, // 基础信息数据
  };

  componentDidMount() {
    this.qryAttrValueByCode();
    this.fetchDetail();
  }

  // 业务类型
  qryAttrValueByCode = () => {
    const { dispatch, CAMPAIGN_BUSI_TYPE } = this.props;

    if (!CAMPAIGN_BUSI_TYPE || CAMPAIGN_BUSI_TYPE.length === 0) {
      dispatch({
        type: 'common/qryAttrValueByCode',
        payload: {
          attrSpecCode: 'CAMPAIGN_BUSI_TYPE',
        },
      });
    }
  };

  // 查询详情
  fetchDetail = () => {
    const { dispatch, location } = this.props;
    const { query } = location;
    if (query.id) {
      dispatch({
        type: 'approveDetail/qryApprovalFlowchartDtl',
        payload: {
          id: query.id,
        },
        success: svcCont => {
          const { data } = svcCont;
          this.setState({
            info: data,
          });
        },
      });
    }
  };

  // 保存
  submit = () => {
    const { dispatch, location, form, userInfo } = this.props;

    const { query } = location;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let type;
      const { id, fold } = query;
      if (id) {
        type = 'approveDetail/modApprovalFlowchart';
      } else {
        type = 'approveDetail/addApprovalFlowchart';
      }
      const startDate = values.date && values.date[0] && values.date[0].format(timeFormat);
      const endDate = values.date && values.date[1] && values.date[1].format(timeFormat);
      dispatch({
        type,
        payload: {
          id,
          createBy: userInfo && userInfo.userId,
          fold,
          ...values,
          startDate,
          endDate,
        },
        success: svcCont => {
          const { data } = svcCont;
          this.setState({ step: 2, info: data });
        },
      });
    });
  };

  // 返回列表页面
  backToList = () => {
    const { dispatch } = this.props;

    router.push({
      pathname: '/approve',
      state: {
        type: 'cancel',
      },
    });
    dispatch({
      type: 'approveList/save',
      payload: {
        pageType: 'back',
      },
    });
  };

  render() {
    const { form, location, CAMPAIGN_BUSI_TYPE, loading, pageLoading } = this.props;
    const { getFieldDecorator } = form;
    const { info, step } = this.state;
    const { query } = location;
    const { type } = query;
    const disabled = type === 'view';

    return (
      <Spin spinning={!!pageLoading}>
        <Card
          size="small"
          title={formatMessage({ id: 'approve.list.title' })}
          className={styles.wrapper}
        >
          {step === 1 ? (
            <div>
              {/* 基本信息 */}
              <div className={styles.title}>{formatMessage({ id: 'approve.detail.baseInfo' })}</div>
              <Form className="small-form" {...this.formItemLayout}>
                <Row type="flex" align="middle" justify="space-around" gutter={16}>
                  <Col span={12}>
                    {/* 流程名称 */}
                    <Form.Item label={formatMessage({ id: 'approve.detail.flowName' })}>
                      {getFieldDecorator('name', {
                        rules: [
                          { required: true, message: formatMessage({ id: 'common.form.input' }) },
                        ],
                        initialValue: info.name,
                      })(
                        <Input
                          placeholder={formatMessage({ id: 'common.form.input' })}
                          disabled={disabled}
                          size="small"
                        />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 流程编码 */}
                    <Form.Item label={formatMessage({ id: 'approve.list.extCode' })}>
                      {getFieldDecorator('code', {
                        initialValue: info.code,
                      })(<Input placeholder="编码自动生成" disabled size="small" />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 生效日期 */}
                    <Form.Item label={formatMessage({ id: 'approve.detail.effectDate' })}>
                      {getFieldDecorator('date', {
                        initialValue: info.startDate &&
                          info.endDate && [
                            moment(info.startDate, timeFormat),
                            moment(info.endDate, timeFormat),
                          ],
                        rules: [
                          { required: true, message: formatMessage({ id: 'common.form.input' }) },
                        ],
                      })(<RangePicker size="small" showTime disabled={disabled} />)}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {/* 业务类型 */}
                    <Form.Item label={formatMessage({ id: 'approve.detail.flowchartType' })}>
                      {getFieldDecorator('flowchartType', {
                        rules: [
                          { required: true, message: formatMessage({ id: 'common.form.select' }) },
                        ],
                        initialValue: info.flowchartType,
                      })(
                        <Select
                          placeholder={formatMessage({ id: 'common.form.select' })}
                          allowClear
                          disabled={disabled}
                          size="small"
                        >
                          {CAMPAIGN_BUSI_TYPE &&
                            CAMPAIGN_BUSI_TYPE.map(item => (
                              <Select.Option
                                key={item.attrValueCode}
                                value={item.attrValueCode}
                                disabled={disabled}
                              >
                                {item.attrValueName}
                              </Select.Option>
                            ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {/* 流程备注 */}
                    <Form.Item
                      label={formatMessage({ id: 'approve.detail.flowRemark' })}
                      {...this.formItemLayout24}
                    >
                      {getFieldDecorator('comments', {
                        initialValue: info.comments,
                        rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                      })(
                        <Input.TextArea
                          rows={4}
                          maxLength={151}
                          placeholder={formatMessage({ id: 'common.form.input' })}
                          disabled={disabled}
                          size="small"
                        />,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <div className={styles.footer}>
                <Button
                  loading={loading}
                  size="small"
                  type="primary"
                  className="mr16"
                  onClick={this.submit}
                >
                  {formatMessage({ id: 'common.btn.next' })}
                </Button>
                <Button size="small" onClick={this.backToList}>
                  {formatMessage({ id: 'common.btn.cancel' })}
                </Button>
              </div>
            </div>
          ) : (
            <Flow disabled={disabled} approveInfo={info} back={this.backToList} />
          )}
        </Card>
      </Spin>
    );
  }
}

export default ActivityTemplateDetail;
