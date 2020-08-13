import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, DatePicker } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../index.less';

const { TextArea } = Input;

@connect(({ commodityList }) => ({
  goodDetalis: commodityList.goodDetalis,
}))
@Form.create({})
class DetailInfo extends PureComponent {
  state = {
    starttime: null,
    endtime: null,
  };

  componentDidMount() {
    const { goodDetalis = {} } = this.props;
    const fomatNextGoodDetalis = {
      prodName: goodDetalis.prodName,
      prodCode: goodDetalis.prodCode,
      brandName: goodDetalis.brandName,
      goodsUnit: goodDetalis.goodsUnit,
      specification: goodDetalis.specification,
      costPrice: goodDetalis.costPrice && (goodDetalis.costPrice / 100).toFixed(2),
      prodPrice: goodDetalis.prodPrice && (goodDetalis.prodPrice / 100).toFixed(2),
      prodEffDate: moment(goodDetalis.prodEffDate),
      prodExpDate: moment(goodDetalis.prodExpDate),
      goodsTypeName: goodDetalis.goodsTypeName,
      saleStore: goodDetalis.saleStore,
      saleChannel: goodDetalis.saleChannel,
      saleStatus: String(goodDetalis.saleStatus),
      prodDesc: goodDetalis.prodDesc,
    };
    this.setFormData(fomatNextGoodDetalis);
  }

  componentWillReceiveProps(nextProps) {
    const { goodDetalis: nextGoodDetalis = {} } = nextProps; // ---- 新表单值----
    const { goodDetalis = {} } = this.props; // ---- 旧表单值 ----

    // ------------ 新旧表单之不一样才重设 ----------------
    if (JSON.stringify(nextGoodDetalis) !== JSON.stringify(goodDetalis)) {
      // ---------------------------设置表单值---------------------
      
      // 格式化数据
      const fomatNextGoodDetalis = {
        prodName: nextGoodDetalis.prodName,
        prodCode: nextGoodDetalis.prodCode,
        brandName: nextGoodDetalis.brandName,
        goodsUnit: nextGoodDetalis.goodsUnit,
        specification: nextGoodDetalis.specification,
        costPrice: nextGoodDetalis.costPrice && (nextGoodDetalis.costPrice / 100).toFixed(2),
        prodPrice: nextGoodDetalis.prodPrice && (nextGoodDetalis.prodPrice / 100).toFixed(2),
        prodEffDate: moment(nextGoodDetalis.prodEffDate),
        prodExpDate: moment(nextGoodDetalis.prodExpDate),
        goodsTypeName: nextGoodDetalis.goodsTypeName,
        saleStore: nextGoodDetalis.saleStore,
        saleChannel: nextGoodDetalis.saleChannel,
        saleStatus: String(nextGoodDetalis.saleStatus),
        prodDesc: nextGoodDetalis.prodDesc,
      };
      this.setFormData(fomatNextGoodDetalis);
      // ---------------------------设置表单值--------------------
    }
    // ------------ 新旧表单之不一样才重设 ----------------
  }

  componentWillUnmount() {
    // ------------ 清空表单数据 ----------------
    this.initGoodDetalis();
    // ------------ 清空表单数据 ----------------
  }

  // ------------ 清空表单数据 ----------------
  initGoodDetalis = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'commodityList/setGoodDetalis',
      payload: {},
    });
  };
  // ------------ 清空表单数据 ----------------

  // ------------------------------ 设置表单值 ------------------
  setFormData = (data = {}) => {
    const {
      form: { setFieldsValue },
      goodDetalis = {},
    } = this.props;
    const {
      prodName,
      prodCode,
      brandName,
      goodsUnit,
      specification,
      costPrice,
      prodPrice,
      prodEffDate,
      prodExpDate,
      goodsTypeName,
      saleStore,
      saleChannel,
      saleStatus,
      prodDesc,
    } = goodDetalis;

    const defaultParams = {
      prodName,
      prodCode,
      brandName,
      goodsUnit,
      specification,
      costPrice,
      prodPrice,
      prodExpDate: moment(prodExpDate),
      prodEffDate: moment(prodEffDate),
      goodsTypeName,
      saleStore,
      saleChannel,
      saleStatus: String(saleStatus),
      prodDesc,
    };
    setFieldsValue({ ...defaultParams, ...data });
  };
  // ------------------------------ 设置表单值 ------------------

  disabledDate = current => {
    // Can not select days before today
    return current < moment().startOf('day');
  };

  disabledEndDate = current => {
    const { starttime } = this.state;
    return current < starttime;
  };

  onChange = value => {
    const { endtime } = this.state;
    const { form } = this.props;
    if (value > endtime) {
      this.setState({ endtime: null });
      form.setFieldsValue({ offerExpDate: null });
    }
    this.setState({ starttime: value });
  };

  onChangeEndDate = value => {
    this.setState({ endtime: value });
  };

  render() {
    const { form, values } = this.props;
    const { getFieldDecorator } = form;
    const { readOnly } = values;
    return (
      <Form
        className={styles.infoFormStyle}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onSubmit={this.handleSubmit}
      >
        <Row>
          <Col span={12}>
            <Form.Item label="产品名称">
              {getFieldDecorator('prodName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={100}
                  disabled={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="产品编码">
              {getFieldDecorator('prodCode', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={100}
                  disabled={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* <Row>
          <Col span={12}>
            <Form.Item label="品牌">
              {getFieldDecorator('brandName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={100}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="计量单位">
              {getFieldDecorator('goodsUnit', {})(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
        </Row> */}
        {/* <Row>
          <Col span={12}>
            <Form.Item label="规格">
              {getFieldDecorator('specification', {})(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={100}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="成本价格(元)">
              {getFieldDecorator('costPrice', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
        </Row> */}
        <Row>
          <Col span={12}>
            <Form.Item label="定价">
              {getFieldDecorator('prodPrice', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                  maxLength={100}
                  disabled={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item label="创建时间">
              {getFieldDecorator('prodEffDate', {})(
                <DatePicker
                  disabled={readOnly}
                  // placeholder={formatMessage({ id: 'common.form.select' })}
                  style={{ width: '100%' }}
                  size="small"
                />,
              )}
            </Form.Item>
          </Col> */}
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="产品生效时间">
              {getFieldDecorator('prodEffDate', {})(
                <DatePicker
                  disabled={readOnly}
                  // placeholder={formatMessage({ id: 'common.form.select' })}
                  style={{ width: '100%' }}
                  size="small"
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="产品失效时间">
              {getFieldDecorator('prodExpDate', {})(
                <DatePicker
                  disabled={readOnly}
                  // placeholder={formatMessage({ id: 'common.form.select' })}
                  style={{ width: '100%' }}
                  size="small"
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        {/* <Row>
          <Col span={12}>
            <Form.Item label="产品类型">
              {getFieldDecorator('goodsTypeName', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.input' })}
                  size="small"
                  readOnly={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="销售商铺">
              {getFieldDecorator('saleStore', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.select' })}
                  size="small"
                  readOnly={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
        </Row> */}
        {/* <Row>
          <Col span={12}>
            <Form.Item label="销售渠道">
              {getFieldDecorator('saleChannel', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.inputOfferName' }),
                  },
                ],
              })(
                <Input
                  // placeholder={formatMessage({ id: 'common.form.select' })}
                  size="small"
                  readOnly={readOnly}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="销售状态">
              {getFieldDecorator('saleStatus')(
                <Radio.Group disabled={readOnly}>
                  <Radio value="2">上架</Radio>
                  <Radio value="1">下架</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
        </Row> */}
        <Row>
          <Form.Item label="产品描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
            {getFieldDecorator('prodDesc', {})(
              <TextArea
                // placeholder={formatMessage({ id: 'common.form.input' })}
                size="small"
                readOnly={readOnly}
                disabled={readOnly}
                autosize={{ minRows: 2, maxRows: 10 }}
              />,
            )}
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default DetailInfo;
