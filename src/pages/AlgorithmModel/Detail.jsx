import React from 'react';
import { connect } from 'dva';
import { Card, Form, Row, Col, Input, Select, Spin, Button, Radio, Tag, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import FeatureModal from './components/FeatureModal';
import styles from './index.less';
import { getAlgorithmCode } from './common';

const { Option } = Select;

@connect(({ algorithmModel, loading }) => ({
  engineCode: algorithmModel.engineCode,
  algorithmTypeList: algorithmModel.algorithmTypeList,
  currentCatalogBasicInfo: algorithmModel.currentCatalogBasicInfo,
  qryAlgorithmByIdEffectLoading: loading.effects['algorithmModel/qryAlgorithmByIdEffect'],
}))
@Form.create()
class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optimizeTargetList: [],
      actionType: '',
      currentAlgorithmModel: {},
      isFeatureVisible: false, // 特征视图选择
      selectedFeature: {}, // 选择的特征
      algorithmParams: [], // 算法参数
    };
  }

  componentDidMount() {
    const { location, currentCatalogBasicInfo, form } = this.props;
    const { query } = location;
    // 获取静态数据
    this.qryOptimizeTargetList();
    this.setState({
      actionType: query.action,
    });
    // 初始化长度为1的算法参数列表
    const algorithmParams = [
      {
        attrKey: '',
        attrValue: '',
        attrId: '',
      },
    ];
    this.setState(
      {
        algorithmParams,
      },
      () => {
        if (query.action !== 'add') {
          const { id } = query;
          this.qryAlgorithmById(id);
        }
        form.setFieldsValue({ foldName: currentCatalogBasicInfo && currentCatalogBasicInfo.title });
      },
    );
  }

  // 优化目标列表
  qryOptimizeTargetList = () => {
    const { dispatch, engineCode } = this.props;
    dispatch({
      type: 'algorithmModel/qryStaticsListEffect',
      payload: {
        attrSpecCode: engineCode === 'ali' ? 'ACTION' : 'IWHALE_ACTION',
      },
      callback: svcCont => {
        this.setState({
          optimizeTargetList: svcCont.data,
        });
      },
    });
  };

  // 获取当前算法信息, 填充表单
  qryAlgorithmById = async id => {
    const { dispatch, form } = this.props;
    await dispatch({
      type: 'algorithmModel/qryAlgorithmByIdEffect',
      payload: { algoId: id },
      callback: svcCont => {
        this.setState(
          {
            currentAlgorithmModel: svcCont.data,
          },
          () => {
            if (svcCont.data) {
              const { baseInfo, algoAttr } = svcCont.data;
              const {
                algoName,
                algoType,
                algoDesc,
                algoVersion,
                action,
                schemaId,
                schemaName,
              } = baseInfo;
              form.setFieldsValue({
                algoCode: getAlgorithmCode(baseInfo),
                algoName,
                algoType,
                algoDesc,
                algoVersion,
                action,
              });

              if (algoAttr && algoAttr.length > 0) {
                // 当前算法模型的算法参数若有数据，更新当前算法参数并填充数据到表单
                this.setState(
                  {
                    algorithmParams: algoAttr,
                  },
                  () => {
                    algoAttr.map((item, index) => {
                      form.setFieldsValue({
                        [`attrKey${index}`]: item.attrKey,
                        [`attrValue${index}`]: item.attrValue,
                      });

                      return item;
                    });
                  },
                );
              }

              // 保存模型的特征视图数据
              this.setState({
                selectedFeature: {
                  schemaId,
                  schemaName,
                },
              });
            }
          },
        );
      },
    });
  };

  // 算法参数操作
  addAlgorithmParams = () => {
    // 增加一个空值参数
    const { algorithmParams: tempAlgorithmParams } = this.state;
    tempAlgorithmParams.push({
      attrKey: '',
      attrValue: '',
      attrId: '',
    });
    this.setState({
      algorithmParams: tempAlgorithmParams,
    });
  };

  // 删除第index个算法参数对
  deleteAlgorithmParams = index => {
    this.setState(prevState => {
      const { algorithmParams: prevAlgorithmParams } = prevState;
      prevAlgorithmParams.splice(index, 1);
      return {
        algorithmParams: prevAlgorithmParams,
      };
    });
  };

  // 合并某一字段全部的取值为数组 长度为1时或全部为空值时返回字符串
  getAlgorithmParamsFieldAryOrStr = field => {
    const { algorithmParams } = this.state;
    if (algorithmParams.length === 1 || !algorithmParams.some(item => item[field] !== '')) {
      return algorithmParams[0][field];
    }
    return algorithmParams.map(algorithmParamItem => algorithmParamItem[field]);
  };

  // 从表单更新算法参数
  /**
   * @param {integer} index 下标
   * @param {string}  value 取值
   * @param {field}  field 字段key ['attrKey', 'attrValue']
   */
  getAlgorithmParams = (index, value, field) => {
    const { algorithmParams: tempAlgorithmParams } = this.state;
    tempAlgorithmParams[index] = {
      ...tempAlgorithmParams[index],
      [field]: value,
    };
    this.setState({
      algorithmParams: tempAlgorithmParams,
    });
  };

  // 判断算法参数列表为1，且取值都为空时，返回[],
  formatAlgorithmParams = () => {
    const { algorithmParams: tempAlgorithmParams } = this.state;
    if (
      tempAlgorithmParams.length === 1 &&
      tempAlgorithmParams[0].attrKey === '' &&
      tempAlgorithmParams[0].attrValue === ''
    ) {
      return [];
    }
    return tempAlgorithmParams;
  };

  handleSubmit = () => {
    const { actionType, currentAlgorithmModel, selectedFeature } = this.state;
    const { currentCatalogBasicInfo } = this.props;
    const { form, dispatch } = this.props;
    const { schemaId, schemaName } = selectedFeature || {};
    const { key: fold, title: foldName } = currentCatalogBasicInfo || {};

    form.validateFields((err, values) => {
      if (err) return;
      // 区分新增和更新
      const { action, algoDesc, algoName, algoType, algoVersion } = values;

      let params = {
        action,
        algoDesc,
        algoName,
        algoType,
        algoVersion,
        schemaId,
        schemaName,
        foldName,
        fold: String(fold),
        algoAttr: this.formatAlgorithmParams(),
        'algoAttr.attrKey': this.getAlgorithmParamsFieldAryOrStr('attrKey'),
        'algoAttr.attrValue': this.getAlgorithmParamsFieldAryOrStr('attrValue'),
        'algoAttr.attrId': this.getAlgorithmParamsFieldAryOrStr('attrId'),
      };

      if (actionType === 'add') {
        params = { ...params, algoId: '' };
      } else if (actionType === 'update') {
        params = { ...currentAlgorithmModel.baseInfo, ...params };
      }

      dispatch({
        type:
          actionType === 'add'
            ? 'algorithmModel/addAlgorithmModuleEffect'
            : 'algorithmModel/updateAlgorithmModuleEffect',
        payload: params,
        callback: () => {
          this.goBackIndex();
        },
      });
    });
  };

  handleCancel = () => {
    this.goBackIndex();
  };

  // 返回列表页
  goBackIndex = () => {
    router.push({
      pathname: '/algorithmModel',
    });
  };

  // 特征视图弹窗
  onFeatureOk = selectedRows => {
    this.setState({
      selectedFeature: selectedRows[0],
    });
    this.toggleFeatureModal();
  };

  toggleFeatureModal = () => {
    this.setState(preState => ({ isFeatureVisible: !preState.isFeatureVisible }));
  };

  handleFeatureCancel = () => {
    this.toggleFeatureModal();
  };

  render() {
    const {
      optimizeTargetList,
      actionType,
      selectedFeature,
      isFeatureVisible,
      algorithmParams,
    } = this.state;
    const { form, algorithmTypeList, qryAlgorithmByIdEffectLoading } = this.props;
    const { getFieldDecorator } = form;

    const disabled = actionType === 'view';

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const colLayout = {
      sm: {
        span: 24,
      },
      md: {
        span: 12,
      },
    };

    return (
      <Spin spinning={!!qryAlgorithmByIdEffectLoading}>
        <Card>
          <Form {...formItemLayout}>
            <Row>
              {/* 算法名称 */}
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.algorithmName',
                  })}
                >
                  {getFieldDecorator('algoName', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'common.form.required',
                        }),
                      },
                    ],
                  })(<Input size="small" allowClear disabled={disabled} />)}
                </Form.Item>
              </Col>
              {/* 算法编码 */}
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.algorithmCode',
                  })}
                >
                  {getFieldDecorator('algoCode')(
                    <Input
                      size="small"
                      placeholder={formatMessage({
                        id: 'algorithmModel.algorithmIdPlaceHolder',
                      })}
                      readOnly
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {/* 算法版本 */}
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.algorithmVersion',
                  })}
                >
                  {getFieldDecorator('algoVersion', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'common.form.required',
                        }),
                      },
                    ],
                  })(<Input size="small" disabled={disabled} />)}
                </Form.Item>
              </Col>
              {/* 当前目录 */}
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.currentCatalog',
                  })}
                >
                  {getFieldDecorator('foldName')(<Input size="small" readOnly />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {/* 算法类型 */}
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.algorithmType',
                  })}
                >
                  {getFieldDecorator('algoType', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'common.form.required',
                        }),
                      },
                    ],
                  })(
                    <Select
                      size="small"
                      placeholder={formatMessage({
                        id: 'common.form.select',
                      })}
                      allowClear
                      disabled={disabled}
                    >
                      {algorithmTypeList.map(type => (
                        <Option key={type.attrValueCode} value={type.attrValueCode}>
                          {type.attrValueName}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/* 优化目标 */}
            <Row>
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.optimizeTarget',
                  })}
                >
                  {getFieldDecorator('action', {
                    rules: [
                      {
                        required: true,
                        message: formatMessage({
                          id: 'common.form.required',
                        }),
                      },
                    ],
                  })(
                    <Radio.Group
                      size="small"
                      placeholder={formatMessage({
                        id: 'common.form.select',
                      })}
                      disabled={disabled}
                    >
                      {optimizeTargetList.map(type => (
                        <Radio key={type.attrValueCode} value={type.attrValueCode}>
                          {type.attrValueName}
                        </Radio>
                      ))}
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/* 特征视图 */}
            <Row>
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.feature',
                  })}
                >
                  <Row>
                    <Col className={styles.tagWrapper}>
                      <Tag onClick={this.toggleFeatureModal} className={styles.algorithmTag}>
                        {selectedFeature && selectedFeature.schemaName ? (
                          <span>{selectedFeature.schemaName}</span>
                        ) : (
                          <>
                            <Icon type="plus" />
                            <span>{formatMessage({ id: 'algorithmModel.chooseFeature' })}</span>
                          </>
                        )}
                      </Tag>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
            {/* 算法参数 */}
            <Row>
              <Col sm={24} xs={24}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.algorithmParam',
                  })}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 18 }}
                >
                  {algorithmParams.map((pair, index) => (
                    <Row className={styles.paramsWrapper}>
                      <Col sm={24} md={8}>
                        <Form.Item
                          label={formatMessage({
                            id: 'algorithmModel.key',
                          })}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 14 }}
                        >
                          {getFieldDecorator(`attrKey${index}`)(
                            <Input
                              size="small"
                              disabled={disabled}
                              onChange={e => {
                                this.getAlgorithmParams(index, e.target.value, 'attrKey');
                              }}
                            />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={8}>
                        <Form.Item
                          label={formatMessage({
                            id: 'algorithmModel.value',
                          })}
                          labelCol={{ span: 6 }}
                          wrapperCol={{ span: 14 }}
                        >
                          {getFieldDecorator(`attrValue${index}`)(
                            <Input
                              size="small"
                              disabled={disabled}
                              onChange={e => {
                                this.getAlgorithmParams(index, e.target.value, 'attrValue');
                              }}
                            />,
                          )}
                        </Form.Item>
                      </Col>
                      <Col sm={24} md={8}>
                        {index === 0 ? (
                          <Button
                            onClick={() => {
                              this.addAlgorithmParams();
                            }}
                            disabled={disabled}
                            icon="plus"
                          >
                            {formatMessage({ id: 'common.btn.add' })}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              this.deleteAlgorithmParams(index);
                            }}
                            disabled={disabled}
                            icon="delete"
                          >
                            {formatMessage({ id: 'common.table.action.delete' })}
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                </Form.Item>
              </Col>
            </Row>
            {/* 描述信息 */}
            <Row>
              <Col {...colLayout}>
                <Form.Item
                  label={formatMessage({
                    id: 'algorithmModel.descriptionInfo',
                  })}
                >
                  {getFieldDecorator('algoDesc', {
                    rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                  })(<Input.TextArea autoSize disabled={disabled} maxLength={151} />)}
                </Form.Item>
              </Col>
            </Row>
            {/* 操作按钮 */}
            {actionType !== 'view' ? (
              <Row type="flex" justify="center">
                <Col className={styles.featureFooterBtn}>
                  <Button type="primary" onClick={this.handleSubmit}>
                    {formatMessage({ id: 'common.btn.save' })}
                  </Button>
                </Col>
                <Col>
                  <Button onClick={this.handleCancel}>
                    {formatMessage({ id: 'common.btn.cancel' })}
                  </Button>
                </Col>
              </Row>
            ) : null}
          </Form>
        </Card>
        {isFeatureVisible ? (
          <FeatureModal
            onFeatureOk={this.onFeatureOk}
            handleFeatureCancel={this.handleFeatureCancel}
            isFeatureVisible={isFeatureVisible}
          />
        ) : null}
      </Spin>
    );
  }
}

export default Detail;
