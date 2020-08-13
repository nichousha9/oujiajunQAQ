import React from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Select, Row, Col } from 'antd';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import ActivityTemplateCon from './ActivityTemplateCon';
import styles from './index.less';

@connect(({ activityTemplateDetail, user, loading }) => ({
  activityTemplateDetail,
  userInfo: user.userInfo && user.userInfo.userInfo,
  loading: loading.effects['ActivityTemplateList/qryContactList'],
}))
@Form.create()
class ActivityTemplateDetail extends React.Component {
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  state = {
    camTypes: [],
    info: {},
    camType: '',
    contentList: [],
    tableList: [],
  };

  componentDidMount() {
    this.qryCamType();
    this.fetchDetail();
  }

  // 活动类型
  qryCamType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityTemplateDetail/qryCamType',
      payload: {},
      success: svcCont => {
        const { data } = svcCont;
        this.setState({
          camTypes: data,
        });
      },
    });
  };

  // 查询详情
  fetchDetail = () => {
    const { dispatch, location } = this.props;
    const { query } = location;
    if (query.modelId) {
      dispatch({
        type: 'activityTemplateDetail/qryMccModelColRel',
        payload: {
          modelId: query.modelId,
        },
        success: svcCont => {
          const { contentList, tableList, mccOrderModel = {} } = svcCont;
          this.setState({
            contentList,
            tableList,
            info: mccOrderModel,
            camType: mccOrderModel.camType,
          });
        },
      });
    }
  };

  // 保存
  submit = () => {
    const { dispatch, location, form } = this.props;

    const { query } = location;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let type;
      const { modelId } = query;
      if (modelId) {
        type = 'activityTemplateDetail/modifyOrderModel';
      } else {
        type = 'activityTemplateDetail/addOrderModel';
      }
      const { contentList, tableList } = this.templateRef.getWrappedInstance().getTemplateInfo();
      dispatch({
        type,
        payload: {
          modelId,
          ...values,
          contentList,
          tableList,
        },
        success: () => {
          this.backToList();
        },
      });
    });
  };

  // 类型改变
  onCamTypeChange = camType => {
    this.setState({
      camType,
    });
  };

  // 获取类型名字
  getCamTypeName = camTypeCode => {
    const { camTypes } = this.state;
    const targetCamType = camTypes.find(camTypeItem => camTypeItem.code === camTypeCode);
    if (targetCamType) {
      return targetCamType.name;
    }
    // return camTypeCode;
    return formatMessage({
      id: 'activityTemplate.customerBaseInfo',
      defaultMessage: '客户基础信息',
    });
  };

  // 返回列表页面
  backToList = () => {
    router.push({
      pathname: '/activityBase/activityTemplate',
      state: {
        type: 'cancel',
      },
    });
  };

  render() {
    const { form, userInfo, location } = this.props;
    const { getFieldDecorator } = form;
    const { camTypes, camType, info, contentList, tableList } = this.state;
    const { query } = location;
    const { modelId, view } = query;
    const disabled = !!view;

    return (
      <Card
        size="small"
        title={formatMessage({ id: 'activityTemplate.addTemplete', defaultMessage: '新增模板' })}
        extra={[
          <Button
            key="save"
            size="small"
            type="primary"
            className="mr16"
            onClick={this.submit}
            disabled={disabled}
          >
            {formatMessage({ id: 'common.btn.save' })}
          </Button>,
          <Button key="cancel" size="small" onClick={this.backToList}>
            {formatMessage({ id: 'common.btn.cancel' })}
          </Button>,
        ]}
        className={styles.wrapper}
      >
        <div className={styles.cententBox}>
          <div className={styles.title}>
            {formatMessage({ id: 'activityTemplate.baseInfo', defaultMessage: '基本信息' })}
          </div>
          <Form className={styles.mainBox} {...this.formItemLayout}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'activityTemplate.templateName',
                    defaultMessage: '模板名称',
                  })}
                >
                  {getFieldDecorator('modelName', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'common.form.input' }) },
                    ],
                    initialValue: info.modelName,
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
                <Form.Item
                  label={formatMessage({
                    id: 'activityTemplate.templateType',
                    defaultMessage: '模板类别',
                  })}
                >
                  {getFieldDecorator('camType', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'common.form.select' }) },
                    ],
                    initialValue: info.camType,
                  })(
                    <Select
                      placeholder={formatMessage({ id: 'common.form.select' })}
                      allowClear
                      disabled={disabled}
                      size="small"
                      onChange={this.onCamTypeChange}
                    >
                      {camTypes &&
                        camTypes.map(item => (
                          <Select.Option key={item.code} value={item.code} disabled={disabled}>
                            {item.name}
                          </Select.Option>
                        ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'activityTemplate.creator',
                    defaultMessage: '创建人',
                  })}
                >
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: formatMessage({ id: 'common.form.input' }) },
                    ],
                    initialValue: modelId ? info.creater : userInfo && userInfo.userName,
                  })(
                    <Input
                      placeholder={formatMessage({ id: 'common.form.input' })}
                      disabled
                      size="small"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <DndProvider backend={HTML5Backend}>
          <ActivityTemplateCon
            disabled={disabled}
            ref={r => {
              this.templateRef = r;
            }}
            contentList={contentList}
            tableList={tableList}
            camType={camType}
            getCamTypeName={this.getCamTypeName}
          />
        </DndProvider>
      </Card>
    );
  }
}

export default ActivityTemplateDetail;
