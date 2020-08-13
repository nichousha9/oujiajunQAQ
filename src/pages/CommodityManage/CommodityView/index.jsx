import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Button, Row, Col, Badge, Spin } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
 // import CommodityType from './components/commodityType';
import BasicInfo from './components/basicInfo';
import ValidityPeriod from './components/validityPeriod';
import Package from './components/package';
import AddTag from './components/addTag/index';
import DetailInfo from './components/detailInfo';
import styles from './index.less';
// import styles from './index.less';

// const { Link } = Anchor;

// ---------------------------------------- 暂时不需要 ----------------------------
function ChangeCard(props) {
  const { chooseType, readOnly } = props;
  if (chooseType === '2') {
    return (
      <Card
        title={formatMessage({ id: 'commodityManage.name.validityPeriod' })}
        id="validityPeriod"
        size="small"
        bordered={false}
        headStyle={{ border: 'none' }}
      >
        <div className={styles.switchCardStyle}>
          <ValidityPeriod readOnly={readOnly} />
        </div>
      </Card>
    );
  }
  if (chooseType === 'P') {
    return (
      <Card
        title={formatMessage({ id: 'commodityManage.name.package' })}
        id="package"
        size="small"
        bordered={false}
        headStyle={{ border: 'none' }}
      >
        <div className={styles.switchCardStyle}>
          <Package values={{ readOnly }} />
        </div>
      </Card>
    );
  }
  if (chooseType === 'T') {
    return '';
  }
  return '';
}
// ---------------------------------------- 暂时不需要 ----------------------------

@connect(({ commodityList, loading }) => ({
  submitData: commodityList.submitData,
  effDate: commodityList.effDate,
  fold: commodityList.fold,
  dataSource: commodityList.labelTableData,
  goodDetalis: commodityList.goodDetalis,
  // loading: loading.effects['commodityList/getGoodDetalisEffect'],
  loading: loading.effects['commodityList/qryOffersInfo'],
  commodityList,
}))
class CommodityInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // chooseType: 'T', // ------  选择的商品类型  --------
      chooseType: '2', // 选择的商品类型
      readOnly: true, // 只读
      // actionType: '',
      // chooseTypeFlag: false,
      // cmdInfo:{},
      // dataSource: [], // 标签外层table数据
      count: 0,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { location } = this.props;
    const { query } = location;
    // const { form } = this.formRef.props;
    if (undefined !== location.query.fold) {
      
      // ------------------------ 暂时不需要这些信息 -------------------
      // const { 
      //   actionType, 
      // } = query;
      // 基础信息
      this.getcmdData('cmd', {
        fold: query.fold,
        OFFER_ID: query.prodId,
        pageInfo: { pageNum: 1, pageSize: 5 },
      });
      // 包成员信息
      this.getcmdData('package', {
        IS_SEARCH_PACKAGE: 'Y',
        LIST_OFFER_ID: parseInt(query.prodId, 10),
        pageInfo: { pageNum: 1, pageSize: 999 },
      });
      // 标签信息
      // this.getlabelDate(query.prodId);
      // ----------------------- 暂时不需要这些信息 --------------------

      // ------------------------ 获取详细信息  ---------------------
       this.getGoodDetails();
      // ------------------------ 获取详细信息  ---------------------

      // ----------------------- 暂时不需要这些 --------------------
      // if (actionType === 'updata') {
      //   // 编辑商品
      //   console.log('updata');
      //   this.setState({ readOnly: false, actionType: 'updata' });
      // } else if (actionType === 'view') {
      //   // 查看商品
      //   console.log('view');
      //   this.setState({ readOnly: true, actionType: 'view' });
      // }
      // ----------------------- 暂时不需要这些 --------------------
    } else {
      // ----------------------- 暂时不需要这些 --------------------
      // 新增商品
      // console.log('add');
      // const { submitData, dispatch } = this.props;
      // dispatch({ type: 'commodityList/resetState' }); // 清空数据
      // form.setFieldsValue({ offerTypeName: submitData.offerTypeName });
      // this.setState({ readOnly: false, actionType: 'add', chooseTypeFlag: true });
      // ----------------------- 暂时不需要这些 --------------------
    }
  }

  // ----------------------------------------------
  // componentWillReceiveProps(nextProps) {
  //   const {
  //     location: { query: {prodCode} },
  //   } = nextProps

  //   const {
  //     goodDetalis: { skuid }
  //   } = this.props

  //   // if(prodCode && skuid && prodCode != skuid) {
  //   //   // ------------------------ 获取详细信息  ---------------------
  //   //   this.getGoodDetails();
  //   //   // ------------------------ 获取详细信息  ---------------------
  //   // }
  // }
  // -------------------------------------------------

  componentWillUnmount() {
    // 重置数据
    const { dispatch } = this.props;
    dispatch({ type: 'commodityList/resetState' });
    // eslint-disable-next-line no-unused-vars
    this.setState = (state, callback) => {
      // eslint-disable-next-line no-useless-return
      return;
    };
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  // ---------------------  获取商品详细信息  ---------------------
  getGoodDetails = params => {
    const {
      dispatch,
      location: { query },
    } = this.props;

    // 默认参数
    const defaultParams = {
      prodId: query.prodId,
    };

    dispatch({
      type: 'commodityList/getGoodDetalisEffect',
      payload: { ...defaultParams, ...params },
    });
  };
  // ---------------------  获取商品详细信息  ---------------------

  // ----------------------------  暂时不需要 ----------------------------
  // // 提交
  // handleSubmit = () => {
  //   // 基础信息
  //   const { form } = this.formRef.props;
  //   const { submitData, dispatch, fold } = this.props;
  //   console.log(submitData, 'submi');
  //   const { actionType } = this.state;
  //   const url = `commodityList/${actionType}Offer`;
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       const newvalues = {
  //         ...values,
  //         offerEffDate: values.offerEffDate.format('YYYY-MM-DD hh:mm:ss'),
  //         offerExpDate: values.offerExpDate.format('YYYY-MM-DD hh:mm:ss'),
  //       };
  //       console.log({ ...submitData, ...newvalues });
  //       dispatch({
  //         type: url,
  //         payload: { ...submitData, ...newvalues },
  //       }).then(response => {
  //         if (response && response.topCont && response.topCont.resultCode === 0) {
  //           const actiontip = actionType === 'add' ? '添加成功' : '修改成功';
  //           // 添加成功
  //           message.success(actiontip);
  //           // 重新获取商品列表数据
  //           const params = { pageInfo: { pageNum: 1, pageSize: 5 }, fold };
  //           this.getcmdData('addsuccess', params);
  //           // 清空表单数据
  //           this.clearFormData();
  //           // 跳转回商品管理页面
  //           dispatch(
  //             routerRedux.push({
  //               pathname: '/commodityManage',
  //             }),
  //           );
  //         } else message.error('操作失败');
  //       });
  //     }
  //   });
  // };
  // ----------------------------  暂时不需要 ----------------------------

  // 清空表单数据
  clearFormData = () => {
    const { dispatch } = this.props;
    const { form } = this.formRef.props;
    // 如果是新增规则的话，需要清空表单和列表数据
    dispatch({
      type: 'commodityList/resetState',
    });
    form.resetFields();
  };

  // handleUpdate = () => {
  //   // newvalues:基础信息  submitData:包成员和标签信息
  //   const { form } = this.formRef.props;
  //   const { submitData } = this.props;
  //   const { dispatch } = this.props;
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       const newvalues = {
  //         ...values,
  //         offerEffDate: values.offerEffDate.format('YYYY-MM-DD hh:mm:ss'),
  //         offerExpDate: values.offerExpDate.format('YYYY-MM-DD hh:mm:ss'),
  //       };
  //       dispatch({
  //         type: 'commodityList/updataOffer',
  //         payload: { ...submitData, ...newvalues },
  //       });
  //     }
  //   });
  // };

  // -------------------------------- 暂时不需要 -------------------------------
  // // 商品类型点击事件
  // handleClick = offer => {
  //   const { submitData } = this.props;
  //   const { dispatch } = this.props;
  //   if (offer.offerType !== 'T') {
  //     const { form } = this.formRef.props;
  //     form.setFieldsValue({ offerTypeName: offer.offerTypeName }); // 默认的offerType
  //   }
  //   dispatch({
  //     type: 'commodityList/changeSubmitData',
  //     payload: { ...submitData, offerType: offer.offerType, offerTypeName: offer.offerTypeName },
  //   });
  //   this.setState({
  //     chooseType: offer.offerType,
  //   });
  // };
  // -------------------------------- 暂时不需要 -------------------------------

  // 删除标签
  handleLabelDelete = key => {
    const { dispatch, dataSource } = this.props;
    const newdataSource = [...dataSource].filter(item => item.key !== key);
    dispatch({
      type: 'commodityList/changeLabelTableData',
      payload: newdataSource,
    });
  };

  // 新增标签
  handleLabelAdd = () => {
    const { count } = this.state;
    const { dispatch, dataSource } = this.props;
    const newData = {
      key: count,
      labelName: '',
      labelValue: '',
    };
    dispatch({
      type: 'commodityList/changeLabelTableData',
      payload: [...dataSource, newData],
    });
    this.setState({
      count: count + 1,
    });
  };

  getcmdData = (action, params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/qryOffersInfo',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        if (res.svcCont.data.length) {
          if (action === 'cmd') {
            // 商品基础信息
            this.dealcmdData(res.svcCont.data[0]);
          } else if (action === 'package') {
            // 包成员数据
            this.dealpackageData(res.svcCont.data);
          } else if (action === 'addsuccess') {
            // 新增成功后重新获取商品列表的数据
            this.dealcmdListData(res.svcCont.data);
          }
        }
      }
    });
  };

  dealcmdListData = data => {
    const { dispatch } = this.props;
    const cmdState = {
      I: <Badge status="default" text={formatMessage({ id: 'commodityManage.status.initial' })} />,
      A: (
        <Badge status="processing" text={formatMessage({ id: 'commodityManage.status.active' })} />
      ),
      R: <Badge status="error" text={formatMessage({ id: 'commodityManage.status.return' })} />,
    };
    const cmdInfo = data.map(item => ({
      state: cmdState[item.state],
      statecode: item.state,
      prodName: item.prodName,
      prodCode: item.prodCode,
      offerType: item.offerType,
      offerTypeName: item.offerTypeName,
      prodId: item.prodId,
      offerPrice: item.offerPrice,
      offerEffDate: item.offerEffDate,
      offerExpDate: item.offerExpDate,
      externalOfferCode: item.externalOfferCode,
    }));
    dispatch({
      type: 'commodityList/saveCmdInfo',
      payload: cmdInfo,
    });
  };

  dealpackageData = data => {
    // console.log(data, 'data');
    const { dispatch } = this.props;
    const memberProps = data.map(item => ({
      tagId: item.prodId,
      tagName: item.prodName,
    }));
    dispatch({
      type: 'commodityList/changeMemberProps',
      payload: memberProps,
    });
  };

  dealcmdData = data => {
    const { form } = this.formRef.props;
    const { dispatch, submitData, validityDate } = this.props;
    let cmdInfo = {};
    if (data.offerType === 'T') {
      // 详细信息
      cmdInfo = {
        prodName: data.OFFER_NAME,
        offerCode: data.SKUID,
        brandId: data.brand_id,
        goodsUnit: data.goods_unit,
        specification: data.specification,
        efficacy: data.efficacy,
        salesPrice: data.sales_price,
        costPrice: data.cost_price,
        goodsType: data.goods_type,
        createdTime: moment(data.created_time),
        saleChannel: data.sale_channel,
        saleStore: data.sale_store,
        saleStatus: data.sale_status,
      };
      form.setFieldsValue(cmdInfo);
    } else {
      // 基础信息
      cmdInfo = {
        prodName: data.prodName,
        prodCode: data.prodCode,
        offerTypeName: data.offerTypeName,
        offerPrice: data.offerPrice,
        offerEffDate: moment(data.offerEffDate),
        offerExpDate: moment(data.offerExpDate),
        externalOfferCode: data.externalOfferCode,
      };
      form.setFieldsValue(cmdInfo);
      cmdInfo = { ...cmdInfo, offerType: data.offerType, prodId: data.prodId };
    }
    const chooseType = undefined === data.offerType ? 'T' : data.offerType;
    this.setState({ chooseType });
    dispatch({
      type: 'commodityList/changeSubmitData',
      payload: { ...submitData, ...cmdInfo },
    });

    // 商品类型为product的有效期信息
    if (data.offerType === '2') {
      const getvalidityDate = {
        effDate: {
          effDateOffsetUnit: data.effDateOffsetUnit,
          effDateType:
            typeof data.effDateType !== 'string' && data.effDateType !== null
              ? data.effDateType.toString()
              : data.effDateType,
          effDate: data.effDate,
          effDateOffset: data.effDateOffset,
          effDateOffsetTime: data.effDateOffsetTime,
        },
        expDate: {
          expDateOffsetUnit: data.expDateOffsetUnit,
          expDateType:
            typeof data.expDateType !== 'string' && data.expDateType !== null
              ? data.expDateType.toString()
              : data.expDateType,
          expDate: data.expDate,
          expDateOffset: data.expDateOffset,
          expDateOffsetTime: data.expDateOffsetTime,
        },
      };
      // console.log(getvalidityDate);
      dispatch({
        type: 'commodityList/changeValDate',
        payload: { ...validityDate, ...getvalidityDate },
      });
    }
  };

  // 获取标签数据
  getlabelDate = prodId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/qryProLabelRelData',
      payload: { objectId: prodId, objectType: '02' },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.deallabelDate(res.svcCont.data);
      }
    });
  };

  deallabelDate = data => {
    // console.log(data);
    const { dispatch, submitData } = this.props;
    // 标签tabel的dataSource
    let count = 0;
    const dataSource = data.map(item => {
      const newitem = {
        key: count,
        labelName: item.labelName,
        labelValue: item.labelValue,
      };
      count += 1;
      return newitem;
    });
    dispatch({
      type: 'commodityList/changeLabelTableData',
      payload: dataSource,
    });
    this.setState({ count });
    // submitData.relLabelList
    count = 0;
    const relLabelList = data.map(item => {
      const newitem = {
        key: count,
        ...item,
      };
      count += 1;
      return newitem;
    });
    // console.log(dataSource, relLabelList);
    dispatch({
      type: 'commodityList/changeSubmitData',
      payload: { ...submitData, relLabelList },
    });
  };

  render() {
    const { 
      chooseType, 
      readOnly, 
      // chooseTypeFlag, 
      count } = this.state;
    const { dataSource, loading } = this.props;
    // const defaultStyle = { display: 'none' };
    // const showStyle = { display: 'block' };
    // const anchorShow = chooseType===0 ? 'block'
    // console.log(submitData,'submitData');

    const extra = !readOnly ? (
      <Fragment>
        <Button
          onClick={this.handleSubmit}
          type="primary"
          style={{ marginRight: '10px' }}
          size="small"
        >
          {formatMessage({ id: 'commodityManage.action.save' })}
        </Button>
        <Button
          onClick={() => {
            const { dispatch } = this.props;
            dispatch(
              routerRedux.push({
                pathname: '/commodityManage',
              }),
            );
          }}
          size="small"
        >
          {formatMessage({ id: 'common.btn.cancel' })}
        </Button>
      </Fragment>
    ) : (
      <Button
        onClick={() => {
          const { dispatch } = this.props;
          dispatch(
            routerRedux.push({
              pathname: '/commodityManage',
              state: 'cancel'
            }),
          );
        }}
        size="small"
      >
        {formatMessage({ id: 'common.btn.back' })}
      </Button>
    );
    
    // ------------------------------------------------
    // const handleClick = (e, link) => {
    //   e.preventDefault();
    //   console.log(link);
    // };
    // ------------------------------------------------

    return (
      <div className={styles.wrapper}>
        <Row gutter={16}>
          {/* <Col span={5}>  ----------------------  左侧导航暂时不需要 -----------------
            <Affix>
              <Card title={formatMessage({ id: 'commodityManage.name.anchor' })} size="small">
                <Anchor onClick={handleClick}>
                  <Link
                    href="#commodityType"
                    title={formatMessage({ id: 'commodityManage.name.offerType' })}
                    className={styles.anchorLink}
                  />
                  {chooseType === 'T' ? (
                    <Link
                      href="#detailInfo"
                      title={formatMessage({ id: 'commodityManage.name.detailInfo' })}
                      className={styles.anchorLink}
                    />
                  ) : (
                    <Link
                      href="#basicInfo"
                      title={formatMessage({ id: 'commodityManage.name.basicInfo' })}
                      className={styles.anchorLink}
                    />
                  )}
                  {chooseType === 'P' ? (
                    <Link
                      href="#package"
                      title={formatMessage({ id: 'commodityManage.name.package' })}
                      className={styles.anchorLink}
                      style={chooseType === 'P' ? defaultStyle : showStyle}
                    />
                  ) : (
                    ''
                  )}
                  {chooseType === '2' ? (
                    <Link
                      href="#validityPeriod"
                      title={formatMessage({ id: 'commodityManage.name.validityPeriod' })}
                      className={styles.anchorLink}
                      style={chooseType === 'P' ? showStyle : defaultStyle}
                    />
                  ) : (
                    ''
                  )}
                </Anchor>
              </Card>
            </Affix>
          </Col> ----------------------  左侧导航暂时不需要 ----------------- */}
          <Col span={24}>
            <Spin spinning={loading}>
              <Card title='商品详情' extra={extra} size="small">
                {/* <Card
                  size="small"
                  title={formatMessage({ id: 'commodityManage.name.offerType' })}
                  id="commodityType"
                  bordered={false}
                  headStyle={{ border: 'none' }}
                >
                  <CommodityType
                    chooseType={chooseType}
                    chooseTypeFlag={chooseTypeFlag}
                    handleClick={this.handleClick}
                  />
                </Card> */}
                {chooseType === 'T' ? (
                  <Card
                    title="详细信息"
                    size="small"
                    id="detailInfo"
                    bordered={false}
                    headStyle={{ border: 'none' }}
                  >
                    <DetailInfo wrappedComponentRef={this.saveFormRef} values={{ readOnly }} />
                  </Card>
                ) : (
                  <Card
                    title={formatMessage({ id: 'commodityManage.name.basicInfo' })}
                    size="small"
                    id="basicInfo"
                    bordered={false}
                    headStyle={{ border: 'none' }}
                  >
                    <BasicInfo wrappedComponentRef={this.saveFormRef} values={{ readOnly }} />
                  </Card>
                )}
                <ChangeCard
                  formRef={formRef => {
                    this.formRef = formRef;
                  }}
                  chooseType={chooseType}
                  readOnly={readOnly}
                />
                {chooseType === 'T' ? (
                  ''
                ) : (
                  <Card bordered={false} id="addTag" size="small">
                    <AddTag
                      dataSource={dataSource}
                      count={count}
                      handleLabelDelete={this.handleLabelDelete}
                      handleLabelAdd={this.handleLabelAdd}
                      readOnly={readOnly}
                    />
                  </Card>
                )}
              </Card>
            </Spin>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommodityInfo;
