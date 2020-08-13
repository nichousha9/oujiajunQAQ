/* eslint-disable no-restricted-syntax */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Spin, Card, Button, Input, Row, Col, message, Icon, Select, Modal } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
const { confirm } = Modal;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

@connect(({ common, loading }) => ({
  featureType: common.attrSpecCodeList.FEATURE_TYPE || [],
  fmdataType: common.attrSpecCodeList.FMDATA_TYPE || [],
  loading: loading.effects['featureDetail/queryFeatureViewInfoById'],
  submitLoading: loading.effects['featureDetail/updateFeatureView'] || loading.effects['featureDetail/addFeatureView']
}))
@Form.create()
class FeatureDetail extends React.Component {
  gutter = { xs: 8, sm: 16 };

  groupId = 0;

  mappingId = 0;

  constructor(props) {
    super(props);
    this.state = {
      groupMapping: {}, // 每个特征对应的mapping的key值
      featureMeta: [], // 特征列表
      featureView: {}, // 基本信息
    }
  }

  componentDidMount() {
    this.getSpecCode();
    this.fetchDetail();
  }

  // 获取选择类型
  getSpecCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'FMDATA_TYPE',
      },
    });
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'FEATURE_TYPE',
      },
    });
  };

  // 获取之前保存数据
  fetchDetail = () => {
    const { dispatch, location, form } = this.props;
    const { query } = location;
    if(query.schemaId) {
      dispatch({
        type: 'featureDetail/queryFeatureViewInfoById',
        payload: {
          schemaId: query.schemaId
        },
        success: (svcCont) => {
          const { data } = svcCont;
          const { featureMeta = [], featureView = {} } = data;
          const initialKeys = [];
          const initialGroupMapping = {};
          this.groupId = featureMeta.length;
          featureMeta.forEach((item, index) => {
            initialKeys.push(index);
            initialGroupMapping[index] = [];
            item.mccFeatureMappingList.forEach(() => {
              initialGroupMapping[index].push(this.mappingId);
              this.mappingId += 1;
            })
          })
          this.setState({
            featureMeta, 
            featureView,
            groupMapping: initialGroupMapping
          });
          form.setFieldsValue({
            keys: initialKeys,
          });
        }
      })
    }
  }

  // 添加特征编辑区
  addGroup = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.groupId);
    this.groupId += 1;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  // 删除特征编辑区
  removeGroup = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  // 添加mapping编辑区
  addMapping = (k) => {
    const { groupMapping } = this.state;
    const myGroupMapping = JSON.parse(JSON.stringify(groupMapping));
    if (!myGroupMapping[k]) {
      myGroupMapping[k] = [];
    };
    myGroupMapping[k].push(this.mappingId);
    this.mappingId += 1;
    this.setState({
      groupMapping: myGroupMapping
    });
  }

  // 删除mapping编辑区
  removeMapping = (k, mk) => {
    const { groupMapping } = this.state;
    const myGroupMapping = JSON.parse(JSON.stringify(groupMapping));

    if (myGroupMapping[k] && myGroupMapping[k].length) {
      myGroupMapping[k] = myGroupMapping[k].filter(key => key !== mk);
    }
    this.setState({ groupMapping: myGroupMapping });
  };

  // 提交
  handleSubmit = () => {
    const { dispatch, form } = this.props;
    const { groupMapping, featureView, featureMeta: defaultFeatureMeta } = this.state;
    const { schemaId } = featureView;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { keys, schemaName, schemaCode, metaName, sourceType, featureType, tableName, tablePk, defValue, fieldName, type, alias  } = values;
        let isMappingLess = false; // 有特征没有mapping
        const valSet = {};
        valSet[schemaName] = true;
        let valDoubble = false; // 特征名称，数据源，表名，别名都不可相同
        const validDoubbleObj = {
          metaName: formatMessage({ id: 'feature.metaName' }), // '数据源名',
          tableName: formatMessage({ id: 'feature.tableName' }), // '表名',
        };
        const validMappingDoubbleObj = {
          alias: formatMessage({ id: 'feature.otherName' }), // '别名'
        };
        const featureMeta = []; // 处理后的特征数组
        // 至少添加一个特征
        if (!keys.length) {
          message.info(formatMessage({ id: 'feature.oneLeast' }));
          return
        }
        for(let i = 0; i< keys.length; i += 1) {
          if(!groupMapping[keys[i]] || !groupMapping[keys[i]].length) {
            isMappingLess = true;
            break
          }
        }
        if(isMappingLess) {
          message.info(formatMessage({ id: 'feature.oneLeastMapping' }));
          return
        }
        for(let i = 0; i < keys.length; i += 1) {
          const key = keys[i];
          const mappingKeys = groupMapping[keys[i]];
          const mccFeatureMappingList = [];
          // 检验每个特征中数据源，表名互相以及与特征名称不相同
          for(const vtype in validDoubbleObj) {
            if (Object.prototype.hasOwnProperty.call(validDoubbleObj, vtype)) {
              if(values[vtype] && values[vtype][i] && valSet[values[vtype][i]]) {
                valDoubble = validDoubbleObj[vtype];
                break 
              }
              valSet[values[vtype][i]] = true;
            }
          }
          if(valDoubble) {
            break
          }
          // 检测每个mapping别名有没有跟上面数据源，表名互相以及与特征名称相同
          if(mappingKeys && mappingKeys.length) {
            for(let j = 0; j < mappingKeys.length; j += 1) {
              const mappingKey = mappingKeys[j];
              for(const vtype in validMappingDoubbleObj) {
                if (Object.prototype.hasOwnProperty.call(validMappingDoubbleObj, vtype)) {
                  if(values[vtype] && values[vtype][mappingKey] && valSet[values[vtype][mappingKey]]) {
                    valDoubble = validMappingDoubbleObj[vtype];
                    break 
                  }
                  valSet[values[vtype][mappingKey]] = true;
                }
              }
              if(valDoubble) {
                break
              }
              mccFeatureMappingList.push({
                defValue: defValue[mappingKey],
                fieldName: fieldName[mappingKey],
                type: type[mappingKey],
                alias: alias[mappingKey]
              })
            }
          }
          if(valDoubble) {
            break
          }
          featureMeta.push({
            metaName: metaName[key],
            sourceType: sourceType[key],
            featureType: featureType[key],
            tableName: tableName[key],
            tablePk: tablePk[key],
            metaId: defaultFeatureMeta[key] && defaultFeatureMeta[key].metaId || '',
            // action: '',
            mccFeatureMappingList
          });
        }

        if(valDoubble) {
          message.info(`${valDoubble}:${formatMessage({ id: 'feature.hasSameValue' })}`);
          return
        }
        const param = {
          featureView: {
            schemaId,
            schemaName,
            schemaCode,
            status: '1'
          },
          featureMeta,
          viewAttr: [],
        }
        confirm({
          title: '',
          content: formatMessage({ id: 'common.title.isConfirmSubmit' }),
          cancelText: formatMessage({ id: 'common.btn.cancel' }),
          okText: formatMessage({ id: 'common.btn.confirm' }),
          onOk() {
            dispatch({
              type: schemaId ? 'featureDetail/updateFeatureView' : 'featureDetail/addFeatureView',
              payload: param,
              success: () => {
                message.success(formatMessage({ id: 'common.message.successfully'})).then(() => {
                  dispatch(
                    routerRedux.push({
                      pathname: '/feature',
                    }),
                  );
                })
              }
            })
          }
        });
      }
    });
  };

  render() {
    const { dispatch, loading, submitLoading, form, featureType, fmdataType, location } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { groupMapping, featureView, featureMeta } = this.state;
    const { query } = location;
    const disabled = query.type === 'view';

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');

    const extra = [
      ...disabled ? [] : [
        <Button
          onClick={this.handleSubmit}
          type="primary"
          style={{ marginRight: '10px' }}
          size="small"
          loading={submitLoading}
        >
          {formatMessage({ id: 'common.btn.save' })}
        </Button>
      ],
      <Button
        onClick={() => {
          dispatch(
            routerRedux.push({
              pathname: '/feature',
            }),
          );
        }}
        size="small"
      >
        {formatMessage({ id: 'common.btn.cancel' })}
      </Button>
    ]
    return (
      <Spin spinning={!!loading}>
        <Card title={formatMessage({ id: 'feature.featureViewInformation' })} extra={extra} size="small">
          <Form {...formItemLayout} className='small-form'>
            {/* 基本信息 */}
            <Card
              title={formatMessage({ id: 'feature.baseInfo' })}
              size="small"
              bordered={false}
              className={styles.innerCard}
            >
              <Row>
                <Col xs={24} sm={12}>
                  {/* 特征名称 */}
                  <Form.Item label={formatMessage({ id: 'feature.featureName' })}>
                    {getFieldDecorator('schemaName', {
                      rules: [
                        {
                          required: true,
                          maxLength: 60,
                          message: formatMessage({ id: 'common.form.required' }),
                        },
                      ],
                      initialValue: featureView.schemaName
                    })(
                      <Input size="small" disabled={disabled} />,
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}  >
                  {/* 特征编码 */}
                  <Form.Item label={formatMessage({ id: 'feature.featureCode' })}>
                    {getFieldDecorator('schemaCode', {
                      initialValue: featureView.schemaCode
                    })(
                      <Input size="small" disabled={disabled} />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
            {/* 特征 */}
            <Card
              title={formatMessage({ id: 'feature.userFeature' })}
              size='small'
              bordered={false}
              extra={
                <Button size='small' disabled={disabled} onClick={this.addGroup}><Icon type='plus' />{formatMessage({ id: 'common.btn.add' })}</Button>
              }
              className={styles.innerCard}
            >
              {
                keys.map((k) => {
                  const featureMetaData = featureMeta[k] || {};
                  return (
                    <div key={k} className={styles.featureGroupBlock}>
                      <Row gutter={this.gutter}>
                        {/* 数据源名称 */}
                        <Col span={8}>
                          <Form.Item label={formatMessage({ id: 'feature.metaName' })}>
                            {getFieldDecorator(`metaName[${k}]`, {
                              rules: [
                                { required: true, max: 40, message: formatMessage({ id: 'common.form.required' }) }
                              ],
                              initialValue: featureMetaData.metaName
                            })(
                              <Input size='small' disabled={disabled} />,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          {/* 数据源类型 */}
                          <Form.Item label={formatMessage({ id: 'feature.dataSourceType' })}>
                            {getFieldDecorator(`sourceType[${k}]`, {
                              initialValue: featureMetaData.sourceType || 'OPEN_HBASE'
                            })(
                              <Select size='small' disabled={disabled}>
                                <Select.Option value='OPEN_HBASE'>OPEN_HBASE</Select.Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8} className={styles.delBtnBox}>
                          <Form.Item wrapperCol={{span: 24}}>
                            <Button size='small' disabled={disabled} onClick={() => { this.removeGroup(k) }}><Icon type='plus' />{formatMessage({ id: 'common.table.action.delete' })}</Button>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={this.gutter}>
                        <Col span={8}>
                          {/* 表名 */}
                          <Form.Item label={formatMessage({ id: 'feature.tableName' })}>
                            {getFieldDecorator(`tableName[${k}]`, {
                              rules: [
                                { required: true, max: 60, message: formatMessage({ id: 'common.form.required' }) }
                              ],
                              initialValue: featureMetaData.tableName
                            })(
                              <Input size='small' disabled={disabled} />,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          {/* 主键 */}
                          <Form.Item label={formatMessage({ id: 'feature.primaryKey' })}>
                            {getFieldDecorator(`tablePk[${k}]`, {
                              rules: [
                                { required: true, max: 30, message: formatMessage({ id: 'common.form.required' }) }
                              ],
                              initialValue: featureMetaData.tablePk
                            })(
                              <Input size='small' disabled={disabled} />,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          {/* 特征类型 */}
                          <Form.Item label={formatMessage({ id: 'feature.featureType' })}>
                            {getFieldDecorator(`featureType[${k}]`, {
                              rules: [
                                { required: true, message: formatMessage({ id: 'common.form.required' }) }
                              ],
                              initialValue: featureMetaData.featureType
                            })(
                              <Select
                                size='small'
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={disabled}
                              >
                                {
                                  featureType && featureType.map((item) => {
                                    return <Select.Option key={item.attrValueCode} value={item.attrValueCode}>{item.attrValueName}</Select.Option>
                                  })
                                }
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Card
                        title='Feature Mapping'
                        size='small'
                        bordered={false}
                        extra={
                          <Button size='small' disabled={disabled} onClick={() => { this.addMapping(k) }}><Icon type='plus' />{formatMessage({ id: 'common.btn.add' })}</Button>
                        }
                        className={styles.innerCard}
                      >
                        {
                          groupMapping[k] && groupMapping[k].map((mk, i) => {
                            const data = featureMeta[k] && featureMeta[k].mccFeatureMappingList && featureMeta[k].mccFeatureMappingList[i] || {};
                            return (
                              <Row key={mk} gutter={this.gutter}>
                                <Col xs={24} sm={12} md={6}>
                                  {/* 字段名 */}
                                  <Form.Item label={formatMessage({ id: 'feature.fieldName' })}>
                                    {getFieldDecorator(`fieldName[${mk}]`, {
                                      rules: [
                                        { required: true, max: 60, message: formatMessage({ id: 'common.form.required' }) }
                                      ],
                                      initialValue: data.fieldName
                                    })(
                                      <Input size='small' disabled={disabled} />,
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                  {/* 类型 */}
                                  <Form.Item label={formatMessage({ id: 'feature.type' })}>
                                    {getFieldDecorator(`type[${mk}]`, {
                                      initialValue: data.type
                                    })(
                                      <Select
                                        size='small'
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        disabled={disabled}
                                      >
                                        {
                                          fmdataType && fmdataType.map((item) => {
                                            return <Select.Option key={item.attrValueCode} value={item.attrValueCode}>{item.attrValueName}</Select.Option>
                                          })
                                        }
                                      </Select>
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                  {/* 默认值 */}
                                  <Form.Item label={formatMessage({ id: 'feature.defValue' })}>
                                    {getFieldDecorator(`defValue[${mk}]`, {
                                      rules: [
                                        { required: true, max: 60, message: formatMessage({ id: 'common.form.required' }) }
                                      ],
                                      initialValue: data.defValue
                                    })(
                                      <Input size='small' disabled={disabled} />,
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                  {/* 别名 */}
                                  <Form.Item label={formatMessage({ id: 'feature.otherName' })}>
                                    {getFieldDecorator(`alias[${mk}]`, {
                                      rules: [
                                        { required: true, max: 60, message: formatMessage({ id: 'common.form.required' }) }
                                      ],
                                      initialValue: data.alias
                                    })(
                                      <Input size='small' disabled={disabled} />,
                                    )}
                                  </Form.Item>
                                </Col>
                                <Col span={24} className={styles.delBtnBox}>
                                  <Button size='small' disabled={disabled} onClick={() => { this.removeMapping(k, mk) }}><Icon type='minus' />{formatMessage({ id: 'common.table.action.delete' })}</Button>
                                </Col>
                              </Row>
                            )
                          })
                        }
                      </Card>
                    </div>
                  )
                })
              }
            </Card>
          </Form>
        </Card>
      </Spin>
    )
  }
}

export default FeatureDetail