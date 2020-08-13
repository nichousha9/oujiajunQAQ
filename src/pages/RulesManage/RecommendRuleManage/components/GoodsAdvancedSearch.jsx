import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col, Select, message } from 'antd';
import style from '../index.less';

const { Option } = Select

@connect(({ recoRuleManage, common }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
  chooseGoodListCurPageSize: recoRuleManage.chooseGoodListCurPageSize,
}))
@Form.create({
  name: 'advanced_search',
})
class GoodsAdvancedSearch extends Component {

  constructor(props) {
    super(props)

    this.state = {
      brandNameList: []
    }
  }

  componentDidMount() {
    const { advancedSearchData } = this.props

    // 初始化高级筛选表单值
    this.setFormValues(advancedSearchData)

    // 获取商品品牌
    this.getBrandName()

    // 获取商品类型枚举数据
    this.getAttrValueByCode('GOODS_TYPE')
  }

  // 获取枚举数据
  getAttrValueByCode = (attrSpecCode) => {
    const { dispatch } = this.props

    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode,
      },
    })
  }

  // 获取商品品牌
  getBrandName = async () => {
    const { dispatch } = this.props

    const result = await dispatch({
      type: 'recoRuleManage/getBrandNameEffect'
    })

    if( result && result.topCont ) {
      if( result.topCont.resultCode === 0 ) {
        this.setState({
          brandNameList: result.svcCont.data
        })
      } else if(result.topCont.resultCode === -1) {
        message.error(result.topCont.remark)
      }
    }

  }

  // 设置高级筛选表单值
  setFormValues = (data = {}) => {
    const { form } = this.props
    const { setFieldsValue } = form
    const {
      offerName,
      goodsType,
      skuid,
      brandIdList
    } = data

    setFieldsValue({
      offerName,
      goodsType,
      skuid,
      brandIdList
    })
  }

  // 处理搜索
  handleSearch = () => {
    const { getChooseGoodList, changePageNum, chooseGoodListCurPageSize } = this.props

    // 保存搜索值
    const formData = this.saveGoodsSearchData()

    // 改变当前页码
    changePageNum(1)

    // 获取数据
    getChooseGoodList({
      ...formData,
      pageInfo: {
        pageNum: 1,
        pageSize: chooseGoodListCurPageSize
      }
    })
  }

  // 保存表单搜索值
  saveGoodsSearchData = () => {
    const { form, getGoodsSearchData } = this.props

    const { getFieldsValue } = form

    const FormData = getFieldsValue()
    // 如果是空数组，设置为 undefined，这样请求是不会带上该参数
    if(Array.isArray(FormData.brandIdList) && FormData.brandIdList.length === 0) {
      FormData.brandIdList = undefined
    }

    getGoodsSearchData(FormData)

    return FormData
  }

  render() {
    const { form, attrSpecCodeList: { GOODS_TYPE } } = this.props;
    const { getFieldDecorator } = form;
    const { brandNameList } = this.state

    return (
      <Form style={{marginBottom: '12px'}} layout="inline" className={style.goodsAdvancedSearch} labelAlign="right">
        <Row className={style.rowBorderBottom}>
          <Col span={9}>
            <Form.Item label="商品名称">
              {getFieldDecorator('offerName')(
                <Input
                  size="small"
                  placeholder="商品名称"
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item label="商品 SKUID">
              {getFieldDecorator('skuid')(
                <Input
                  size="small"
                  placeholder="商品 SKUID"
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row className={style.rowBorderBottom}>
          <Col span={9}>
            <Form.Item label="商品品牌">
              {getFieldDecorator('brandIdList')(
                <Select
                  size="small"
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  maxTagCount={1}
                  maxTagPlaceholder={(omittedValues) => (
                    <div style={{fontWeight: 700, color: '#555'}}>
                      +{omittedValues.length}
                    </div>
                  )}
                >
                  {brandNameList.length ?
                    brandNameList.map((item) => (
                    <Option key={item.brandId} value={Number(item.brandId)}>{item.brandName}</Option>
                  )) : null}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item label="商品类型">
              {getFieldDecorator('goodsType')(
                <Select
                  allowClear
                  size="small"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                >
                  {GOODS_TYPE ?
                    GOODS_TYPE.map((item) => (
                    <Option key={item.attrValueCode} value={String(item.attrValueCode)}>
                      {item.attrValueName}
                    </Option>
                  )) : null}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={6} className={style.btnCol}>
            <Button
              size="small"
              type="primary"
              onClick={this.handleSearch}
            >
              搜索
            </Button>
            <Button
              size="small"
              onClick={this.setFormValues}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default GoodsAdvancedSearch;


