/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Input,
  Form,
  Row,
  Col,
  // Radio,
  Select,
  Modal,
  Button,
  Divider,
  Table,
  message,
  InputNumber,
  Popconfirm,
  TreeSelect,
} from 'antd';
import styles from '../index.less';
import LabelSpecModal from './LabelSpecModal';
import TreeModal from './TreeModal';
const { TreeNode } = TreeSelect;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
};

@connect(({ labelManage, common }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
  labelCodeData: labelManage.labelCodeData,
  currentLabelData: labelManage.currentLabelData,
  rawLabelCatalogData: labelManage.rawLabelCatalogData,
  currentCatalogId: labelManage.currentCatalogId,
  currentCatalogName: labelManage.currentCatalogName,
}))
@Form.create()
class className extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelValueTypeVisible: false, // 标签值规格列表的可见性
      labelValueList: [], // 标签值规格列表的数据
      catalogModalVisible: false, // 修改标签时的目录树的可见性
      LabelSpecModalVisible: false, // 新建或修改标签值规格的对话框的可见性
      labelSpecModalTitle: '', // 标签值规格列表的标题（新增标签值/编辑标签值）
      curLabelValue: null, // 当前想要编辑的标签值
      filterLabelTypes: [], // 过滤后的filterLabelTypes
      treeData: [],
      nextLoading: false,
    };
  }

  componentWillMount() {
    this.getStaticData();
    this.getTreeData();
    // const {
    //   attrSpecCodeList: { labelValueType, LABEL_TYPES, LABEL_TABLE_CODE, LABEL_VALUE_DATE_TYPE }, // 静态数据
    // } = this.props;
    // // 获取数据字典
    // if (!labelValueType) {
    //   this.getAttrValueByCode({
    //     attrSpecCode: 'LABEL_VALUE_TYPE', // 标签值数据类型
    //   });
    // }
    // if (!LABEL_TABLE_CODE) {
    //   this.getAttrValueByCode({
    //     attrSpecCode: 'LABEL_TABLE_CODE', // 输入宽表选项
    //   });
    // }
    // if (!LABEL_TYPES) {
    //   this.getAttrValueByCode({
    //     attrSpecCode: 'LABEL_TYPES', // 输入宽表选项
    //   });
    // }
    // if (!LABEL_VALUE_DATE_TYPE) {
    //   this.getAttrValueByCode({
    //     attrSpecCode: 'LABEL_VALUE_DATE_TYPE', // 输入宽表选项
    //   });
    // }
  }

  componentDidMount() {
    const { form, modalType, currentCatalogId, currentCatalogName } = this.props;
    if (modalType === 'create') {
      this.setState({
        filterLabelTypes: [],
      });
      form.setFieldsValue({
        catalogName: currentCatalogName,
        catalogId: currentCatalogId,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextLabelData = nextProps.currentLabelData;
    const { currentLabelData, dispatch, modalType } = this.props;
    // 获取到异步的标签详细信息时
    if (modalType !== 'create' && !currentLabelData.data && nextLabelData.data) {
      // 在只读的时候不会请求静态数据
      if (modalType !== 'read') {
        // 获取相应的“标签对应字段”
        dispatch({
          type: 'labelManage/getLabelTableCodeField',
          payload: { tableCode: nextLabelData.data.mccLabelDetail.tableCode },
        });
      }

      // 修改标签值规格列表的可见性
      this.setState({
        labelValueTypeVisible: nextLabelData.data.mccLabelDetail.labelValueType === '2000',
        labelValueList: nextLabelData.data.valueList,
      });
      this.getFilterLabelTypes(nextLabelData.data.tableCode);
    }
  }

  getStaticData = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'LABEL_VALUE_TYPE', // 标签值数据类型
      },
    });
    await dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'LABEL_TABLE_CODE', // 输入宽表选项
      },
    });
    await dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'LABEL_TYPES', // 输入宽表选项
      },
    });
    await dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'LABEL_VALUE_DATE_TYPE', // 输入宽表选项
      },
    });
  };

  // 获取数字字典
  getAttrValueByCode = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: params,
    });
  };

  handleConfirmDelete = record => {
    const { labelValueList } = this.state;
    // let newLabelList = [];
    let labelIndex = null;

    for (let i = 0; i < labelValueList.length; i += 1) {
      if (labelValueList[i].labelValueId === record.labelValueId) labelIndex = i;
    }
    labelValueList.splice(labelIndex, 1);

    this.setState({ labelValueList });
  };

  // 获取树状目录的数据
  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelManage/getMccLabelCatalogList',
      payload: {},
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // const rootElement = res.svcCont.data.find(tree => tree.pathCode.indexOf('.') === -1);
        this.handleTreeData(res.svcCont.data);
        // this.setState({
        //   treeData: res.svcCont.data,
        // });
      }
    });
  };

  // 处理返回的目录数组
  handleTreeData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.grpName, // 目录的名称
      key: item.grpId, // 目录的ID
      pathCode: item.pathCode,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentGrpId, // 父目录的ID
      children: [],
      labelType: item.labelType,
    }));

    const newArr = [];
    const getChild = (node, index) => {
      // 拿到当前节点的子节点
      if (index === len - 1) {
        return;
      }
      for (let i = 0; i < len; i += 1) {
        // 如果当前节点的路径长度大于 node 且 parentKey = node.key 那么它就是 node 的子元素
        if (
          treeArr[i].pathCodeLen > node.pathCodeLen &&
          treeArr[i].parentKey === node.key &&
          !treeArr[i].used
        ) {
          node.children.push(treeArr[i]);
          treeArr[i].used = true;
          getChild(treeArr[i], i);
        }
      }
    };
    for (let i = 0; i < len; i += 1) {
      if (treeArr[i].pathCodeLen === 1) {
        newArr.push(treeArr[i]);
        treeArr[i].used = true;
        getChild(treeArr[i], i);
      }
    }

    this.setState({
      treeData: newArr,
    });
  };

  getColums = () => {
    const { modalType } = this.props;
    return [
      {
        title: '标签值',
        dataIndex: 'labelValue',
        key: 'labelValue',
      },
      {
        title: '标签值名称',
        key: 'valueName',
        dataIndex: 'valueName',
      },
      {
        title: '标签值描述',
        key: 'valueDesc',
        dataIndex: 'valueDesc',
      },
      {
        title: '操作',
        key: 'labelId',
        align: 'center',
        render: record => {
          return (
            <span>
              <a
                disabled={modalType === 'read'}
                onClick={() => {
                  this.showEditLabelSpecModal(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="是否确认删除?"
                onConfirm={() => {
                  this.handleConfirmDelete(record);
                }}
              >
                <a disabled={modalType === 'read'}>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
  };

  // 隐藏新建标签值的对话框
  hideSpecModal = () => {
    this.setState({
      LabelSpecModalVisible: false,
      curLabelValue: null,
    });
  };

  // 显示标签目录树
  showCatalogModal = () => {
    this.setState({
      catalogModalVisible: true,
    });
  };

  // 隐藏标签目录树
  hideCatalogModal = () => {
    this.setState({
      catalogModalVisible: false,
    });
  };

  // 点击OK按钮再保存到表单内
  handleCatalogModalOK = (curCatalogKey, curCatalogName) => {
    const { form } = this.props;
    form.setFieldsValue({
      catalogName: curCatalogName,
      catalogId: curCatalogKey,
    });
    this.hideCatalogModal();
  };

  // 获取输入的宽表对应的“标签对应字段”
  getLabelTableCodeField = params => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'labelManage/getLabelTableCodeField',
      payload: params,
    });

    // 筛选标签列表
    this.getFilterLabelTypes(params.tableCode);
    form.setFieldsValue({
      field: '',
    });
  };

  getFilterLabelTypes = tableCode => {
    const {
      attrSpecCodeList: { LABEL_TYPES },
      form,
    } = this.props;

    if (LABEL_TYPES) {
      const filterLabelTypes = LABEL_TYPES.filter(type => type.attrValueCode === tableCode);
      this.setState({
        filterLabelTypes,
      });
      if (filterLabelTypes && filterLabelTypes.length > 0) {
        const [defaultLabelType] = filterLabelTypes;
        const { attrValueCode } = defaultLabelType;
        form.setFieldsValue({ type: attrValueCode });
      }
    }
  };

  // 是否显示下方标签值列表
  handleValueTypeChanged = value => {
    this.setState({
      labelValueTypeVisible: value === '2000',
      labelValueList: [],
    });
  };

  // 切换标签值数据类型会清空标签值列表
  handleDataTypeChanged = () => {
    this.setState({
      labelValueList: [],
    });
  };

  // 显示新建标签值规格的对话框
  showCreateLabelSpecModal = () => {
    const { form } = this.props;
    // 仙剑标签值规格之前必须先输入标签值数据类型
    form.validateFields(['dataType'], error => {
      if (!error) {
        this.setState({
          LabelSpecModalVisible: true,
          labelSpecModalTitle: '新建标签值',
        });
      }
    });
  };

  // 显示修改标签值规格的对话框
  showEditLabelSpecModal = record => {
    const { form } = this.props;
    form.validateFields(['dataType'], error => {
      if (!error) {
        this.setState({
          LabelSpecModalVisible: true,
          labelSpecModalTitle: '编辑标签值',
          curLabelValue: record,
        });
      }
    });
  };

  // 新建或修改标签值规格，点击OK后的回调
  handleOkCallback = item => {
    const { labelValueList } = this.state;
    // 根据返回对象是否有id来判断是新建还是编辑
    if (item.labelValueId === undefined) {
      /* 新建标签值 */
      let isExisted = 0; // 判断是否重复
      for (let i = 0; i < labelValueList.length; i += 1) {
        if (labelValueList[i].labelValue === item.labelValue) {
          message.error('标签值与现有的重复');
          isExisted = 1;
          break;
        }
        if (labelValueList[i].valueName === item.valueName) {
          message.error('标签值名称与现有的重复!');
          isExisted = 1;
          break;
        }
      }
      // 如果没有重复值，则暂时给他一个随机id
      if (isExisted === 0) {
        const newItem = {
          ...item,
          id: Math.random()
            .toString(36)
            .substr(2),
        };

        // 然后添加到列表后面
        this.setState({
          labelValueList: labelValueList.concat(newItem),
        });
        this.hideSpecModal();
      }
    } else {
      /* 编辑标签值 */
      let labelValueCount = 0; // 标签值的计数
      let valueNameCount = 0; // 标签值名称的计数
      for (let i = 0; i < labelValueList.length; i += 1) {
        if (labelValueList[i].labelValueId !== item.labelValueId) {
          // 将自己与自己的那一次对比排除调
          if (labelValueList[i].labelValue === item.labelValue) {
            labelValueCount += 1; // 如果标签值有重复就加一
          }
          if (labelValueList[i].valueName === item.valueName) {
            valueNameCount += 1; // 如果标签值名称有重复也加一
          }
        }
      }
      // 如果没有重复的话
      if (labelValueCount === 0 && valueNameCount === 0) {
        // 生成修改后的新数据
        const newList = labelValueList.map(val => {
          if (val.labelValueId === item.labelValueId) {
            return item;
          }
          return val;
        });

        this.setState({
          labelValueList: newList,
        });
        this.hideSpecModal();
      } else {
        // 如果有重复的话
        if (labelValueCount !== 0) {
          message.error('标签值与现有的重复');
        }
        if (valueNameCount !== 0) {
          message.error('标签值名称与现有的重复');
        }
      }
    }
  };

  // 关闭对话框的同时关闭下方的标签规格列表，并清空列表数据
  handleHideModal = () => {
    const { hideModal } = this.props;
    hideModal();
    this.setState({
      labelValueTypeVisible: false,
      labelValueList: [],
    });
  };

  // 在选择标签对应字段之前先校验宽表
  handleCheckTable = () => {
    const { form } = this.props;
    form.validateFields(['wideTable']);
  };

  // 提交新建或编辑标签
  handleSubmit = () => {
    const { form, modalType, dispatch, currentLabelData, qryLabelInfo } = this.props;
    const { labelValueList, treeData } = this.state;

    form.validateFields((error, values) => {
      const treeItem = treeData[0].children.filter(items => values.catalogName === items.title)[0];
      if (!error) {
        this.setState({ nextLoading: true });
        if (values.catalogName === '标签类型' && treeItem === undefined) {
          form.setFields({
            catalogName: {
              errors: [new Error('请选择二级目录')],
            },
          });
          this.setState({ nextLoading: false });
        } else if (modalType === 'create') {
          /* 发送新建标签的请求 */
          dispatch({
            type: 'labelManage/addLabel',
            payload: {
              labelName: values.name, // 标签名称
              labelGrpId: treeItem.key || '', // 标签目录ID
              labelGrpName: values.catalogName, // 标签目录名称
              labelType: values.wideTable, // 标签类型
              labelTable: values.wideTable, // 宽表
              labelTableField: values.field, // 标签对应字段
              labelValueType: values.valueType, // 标签值类型
              labelDataType: values.dataType, // 标签值数据类型
              orderBy: values.order, // 排序
              labelDesc: values.description, // 标签描述
              valueList: labelValueList, // 标签值规格列表
            },
          }).then(res => {
            if (res && res.topCont && res.topCont.resultCode === 0) {
              message.success('新增标签成功');
              qryLabelInfo(1);
              this.handleHideModal();
            } else if (res && res.topCont && res.topCont.remark) {
              // 暂时处理，防止报错
              message.error(res.topCont.remark);
            } else {
              message.error('新增标签失败');
            }
            this.setState({ nextLoading: false });
          });
        } else if (modalType === 'edit') {
          /* 发送修改标签的请求 */
          dispatch({
            type: 'labelManage/updateLabel',
            payload: {
              labelId: currentLabelData.data.mccLabelDetail.labelId, // 标签ID
              labelName: values.name, // 标签名称
              labelGrpId: treeItem.key || '', // 标签目录ID
              labelGrpName: values.catalogName, // 标签目录名称
              labelType: values.wideTable, // 标签类型
              labelTable: values.wideTable, // 宽表
              labelTableField: values.field, // 标签对应字段
              labelValueType: values.valueType, // 标签值类型
              labelDataType: values.dataType, // 标签值数据类型
              orderBy: values.order, // 排序
              labelDesc: values.description, // 标签描述
              valueList: labelValueList, // 标签值规格列表
            },
          }).then(res => {
            if (res && res.topCont && res.topCont.resultCode === 0) {
              message.success('编辑标签成功');
              qryLabelInfo();
              this.handleHideModal();
            } else if (res && res.topCont && res.topCont.remark) {
              // 暂时处理，防止报错
              message.error(res.topCont.remark);
            } else {
              message.error('编辑标签成功');
            }
            this.setState({ nextLoading: false });
          });
        }
      }
    });
  };

  render() {
    const {
      labelValueTypeVisible,
      labelValueList,
      catalogModalVisible,
      LabelSpecModalVisible,
      labelSpecModalTitle,
      curLabelValue,

      treeData,
      nextLoading,
    } = this.state;
    const {
      modalVisible,
      modalTitle,
      modalType,
      form,
      labelCodeData, // 输入宽表对应的“标签对应字段”
      attrSpecCodeList: { LABEL_VALUE_TYPE, LABEL_VALUE_DATE_TYPE, LABEL_TABLE_CODE }, // 静态数据
      currentLabelData, // 当前选中的标签详细信息
    } = this.props;
    // 传入新建或编辑标签值规格的窗口
    const specModalProps = {
      modalVisible: LabelSpecModalVisible,
      hideModal: this.hideSpecModal,
      okCallback: this.handleOkCallback,
      modalTitle: labelSpecModalTitle, // 标题
      curLabelDataType: form.getFieldValue('dataType'), // 当前的标签数据类型
      curLabelValue, // 当前想要编辑的标签值
    };

    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} value={item.title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} value={item.title} />;
      });

    return (
      <Modal
        title={modalTitle}
        width="844px"
        visible={modalVisible}
        onCancel={this.handleHideModal}
        className={styles.modalForm}
        maskClosable={false}
        destroyOnClose
        footer={
          <div className={styles.modalFooter}>
            {modalType === 'read' ? null : (
              <Button
                size="small"
                type="primary"
                key="submit"
                onClick={this.handleSubmit}
                loading={nextLoading}
              >
                提交
              </Button>
            )}
            <Button size="small" key="back" onClick={this.handleHideModal}>
              返回
            </Button>
          </div>
        }
      >
        <Form {...formItemLayout}>
          <Row className={styles.titleBackground}>
            <span className={styles.title}>基础信息</span>
          </Row>
          <Row>
            <Col span={11}>
              <Form.Item label="标签名称">
                {form.getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标签名称',
                    },
                    { max: 20, message: '内容请控制在20个字符以内' },
                  ],

                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.labelName
                      : undefined,
                })(
                  <Input
                    size="small"
                    maxLength={21}
                    placeholder="请输入"
                    disabled={modalType === 'read'}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="标签目录">
                {form.getFieldDecorator('catalogName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择标签目录！',
                    },
                  ],
                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.labelGrpName
                      : undefined,
                })(
                  <TreeSelect
                    disabled={modalType === 'read'}
                    showSearch
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择目录"
                    allowClear
                    treeDefaultExpandAll
                    onChange={this.onChangeTree}
                  >
                    {loop(treeData)}
                  </TreeSelect>,
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="输入宽表">
                {form.getFieldDecorator('wideTable', {
                  rules: [
                    {
                      required: true,
                      message: '请选择输入宽表!',
                    },
                  ],
                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.tableCode
                      : undefined,
                })(
                  <Select
                    // onChange={value => this.labelCodeVerify(value)}
                    size="small"
                    placeholder="请选择"
                    showSearch
                    disabled={modalType === 'read'}
                    optionFilterProp="children"
                    onChange={value => {
                      this.getLabelTableCodeField({ tableCode: value });
                    }}
                  >
                    {LABEL_TABLE_CODE
                      ? LABEL_TABLE_CODE.map(item => (
                          <Option value={item.attrValueCode} key={item.attrValueCode}>
                            {item.attrValueName}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="标签对应字段">
                {form.getFieldDecorator('field', {
                  rules: [
                    {
                      required: true,
                      message: '请选择标签对应字段',
                    },
                  ],
                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.labelCode
                      : undefined,
                })(
                  <Select
                    size="small"
                    placeholder="请选择"
                    onFocus={this.handleCheckTable}
                    showSearch
                    optionFilterProp="children"
                    disabled={modalType === 'read'}
                  >
                    {labelCodeData && labelCodeData.data
                      ? labelCodeData.data.map(item => (
                          <Option value={item.attrValueCode} key={item.attrValueCode}>
                            {item.attrValueName}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="标签值类型">
                {form.getFieldDecorator('valueType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择标签值类型!',
                    },
                  ],
                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.labelValueType
                      : undefined,
                })(
                  <Select
                    size="small"
                    placeholder="请选择"
                    onChange={this.handleValueTypeChanged}
                    showSearch
                    optionFilterProp="children"
                    disabled={modalType === 'read'}
                  >
                    {LABEL_VALUE_TYPE
                      ? LABEL_VALUE_TYPE.map(item => (
                          <Option value={item.attrValueCode} key={item.attrValueCode}>
                            {item.attrValueName}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="标签值数据类型">
                {form.getFieldDecorator('dataType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择标签值数据类型!',
                    },
                  ],
                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.labelDataType
                      : undefined,
                })(
                  <Select
                    size="small"
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="children"
                    onChange={this.handleDataTypeChanged}
                    disabled={modalType === 'read'}
                  >
                    {LABEL_VALUE_DATE_TYPE
                      ? LABEL_VALUE_DATE_TYPE.map(item => (
                          <Option value={item.attrValueCode} key={item.attrValueCode}>
                            {item.attrValueName}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="标签排序">
                {form.getFieldDecorator('order', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标签排序!',
                    },
                    {
                      type: 'integer',
                      message: '请输入整型',
                    },
                  ],
                  validateFirst: true,
                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.orderBy
                      : '',
                })(
                  <InputNumber
                    size="small"
                    style={{ width: 235 }}
                    placeholder="请输入整数"
                    disabled={modalType === 'read'}
                    max={99999}
                    maxLength={5}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={1}>
              <Form.Item
                label="描述"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 20 }}
                style={{ marginLeft: 20 }}
              >
                {form.getFieldDecorator('description', {
                  rules: [{ max: 150, message: '内容请控制在150个字符以内' }],
                  initialValue:
                    currentLabelData && currentLabelData.data
                      ? currentLabelData.data.mccLabelDetail.labelDesc
                      : '',
                })(
                  <Input.TextArea placeholder="" disabled={modalType === 'read'} maxLength={151} />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {labelValueTypeVisible ? (
          <div className={styles.createLabelValuebackground}>
            <Row type="flex" justify={modalType === 'read' ? 'start' : 'space-between'}>
              <Col>
                <div className={styles.labelValueTitle}>标签值规格</div>
              </Col>
              {modalType === 'read' ? null : (
                <Col>
                  <Button
                    type="primary"
                    size="small"
                    className={styles.labelValueButton}
                    onClick={this.showCreateLabelSpecModal}
                  >
                    新建标签值
                  </Button>
                </Col>
              )}
            </Row>
            <Row type="flex" justify="space-around">
              <Col span={22}>
                <div className={styles.tableBackground}>
                  <Table
                    rowKey={record => record.labelValueId}
                    columns={this.getColums()}
                    dataSource={labelValueList}
                    pagination={{
                      defaultPageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20', '30', '40'],
                      showQuickJumper: true,
                    }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        ) : null}
        <LabelSpecModal {...specModalProps} />
        {/* 标签目录树的对话框，在新建或修改标签是用来选择目录 */}
        <TreeModal
          modalVisible={catalogModalVisible}
          hideModal={this.hideCatalogModal}
          handleModalOK={this.handleCatalogModalOK}
        />
      </Modal>
    );
  }
}

export default className;
