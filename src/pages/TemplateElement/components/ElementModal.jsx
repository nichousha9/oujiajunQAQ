import React from 'react';
import { Modal, Form, Input, Select, Row } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';

const { Option } = Select;

const BOOL_LIST = [{
    title: formatMessage({ id: 'common.text.yes' }, '是'),
    value: 'Y',
  }, {
    title: formatMessage({ id: 'common.text.no' }, '否'),
    value: 'N',
  }
];

@connect(({ templateElement, loading })=>({
  fieldTypeList: templateElement.fieldTypeList,
  workOrderTypeList: templateElement.workOrderTypeList,
  mapTables: templateElement.mapTables,
  elementModalVisible: templateElement.elementModalVisible,
  action: templateElement.action,
  currentTemplateElement: templateElement.currentTemplateElement,
  confirmLoading:
    loading.effects['templateElement/addTemplateElementEffect']||
    loading.effects['templateElement/updateTemplateElementEffect'],
}))
@Form.create({ name: 'elementModal-form'})
class ElementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
      mapFields: [],
      iconList: [],
    }
  }

  async componentDidMount() {
    const { action, form } = this.props;
    await this.qryIcons();
    if(action !== 'add') {
      if (action === 'view') {
        this.setState({
          readOnly: true
        });
      }
      const { currentTemplateElement } = this.props;
      if(currentTemplateElement) {
        const {
          columnName,
          orderType,
          ifFilled,
          columnType,
          belongTable,
          columnCode,
          iconId,
        } = currentTemplateElement;
        this.qryMapFields(belongTable);
        form.setFieldsValue({
          columnName,
          orderType,
          ifFilled,
          columnType,
          belongTable,
          columnCode,
          iconId,
        });
      }
    }
  }

  changeMapTable = currentMapTable => {
    const { form } = this.props;
    form.resetFields(['columnCode']);
    if(currentMapTable) {
      this.qryMapFields(currentMapTable);
    }
  }

  qryMapFields = async currentMapTable => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'templateElement/fetchMapFieldEffect',
      payload: { tableCode : currentMapTable, pageType: 'columnPage' },
      callback: svcCont => {
        if(svcCont.data) {
          this.setState({
            mapFields: svcCont.data,
          });
        }
      }
    });
  }

  qryIcons = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'templateElement/qryIconsEffect',
      payload: {},
      callback: svcCont => {
        if(svcCont.data) {
          this.setState({
            iconList: svcCont.data,
          });
        }
      }
    });
  }

  getIconById = iconId => {
    const { iconList } = this.state;
    const targetIcon = iconList.find(iconItem => iconItem.id === iconId);
    return targetIcon;
  }

  getModalTitle = () => {
    const { action } = this.props;
    switch (action) {
      case 'add':
        return formatMessage({ id: 'templateElement.addElement' }, '新增要素');
      case 'edit':
        return formatMessage({ id: 'templateElement.updateElement' }, '修改要素');
      case 'view':
        return formatMessage({ id: 'templateElement.viewElement' }, '要素信息');
      default:
        return '';
    }
  }

  handleOk = () => {
    const { form, dispatch, action, currentTemplateElement, getTemplateElementList } = this.props;
    form.validateFields((err, fieldValues) => {
      if(err) return;
      // 区分新增和修改
      const actionType =
        action === 'add'
          ? 'templateElement/addTemplateElementEffect'
          : 'templateElement/updateTemplateElementEffect';
      const { iconId } = fieldValues;
      const iconItem = this.getIconById(iconId);
      dispatch({
        type: actionType,
        payload: {
          ...currentTemplateElement,
          ...fieldValues,
          iconPath: iconItem.path,
          iconName: iconItem.name,
        },
        callback: () => {
          this.closeModal();
          getTemplateElementList();
        }
      });
    });
  }

  handleCancel = () => {
    this.closeModal();
  }

  closeModal = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'templateElement/switchModalVisible',
      payload: false,
    });
    // 清空form和current数据
    form.resetFields();
    dispatch({
      type: 'templateElement/getCurrentTemplateElement',
      payload: {}
    });
  }

  render() {
    const {
      form,
      elementModalVisible,
      fieldTypeList,
      workOrderTypeList,
      confirmLoading,
      action,
      mapTables,
    } = this.props;
    const { getFieldDecorator } = form;

    const { readOnly, mapFields, iconList } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      // <Spin spinning={}>
        <Modal
          title={this.getModalTitle()}
          width={718}
          destroyOnClose
          visible={elementModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          confirmLoading={!!confirmLoading}
          okButtonProps={{ style: action === 'view' ? { display: 'none' } : null }}
        >
          <Form {...formItemLayout}>
            <Row>
              <Form.Item label={formatMessage({ id: 'templateElement.elementName' }, '要素名称')}>
                {getFieldDecorator('columnName',  {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                  ],
                })(
                  <Input
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.input' }, '请输入')}
                    disabled={readOnly}
                    allowClear
                  />,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={formatMessage({ id: 'templateElement.workOrderType' }, '工单类别')}>
                {getFieldDecorator('orderType', {
                   rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                  ],
                })(
                  <Select
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                    disabled={readOnly}
                    allowClear
                  >
                  {workOrderTypeList.map(workOrderTypeItem => (
                    <Option key={workOrderTypeItem.code} value={workOrderTypeItem.code}>
                      {workOrderTypeItem.name}
                    </Option>
                  ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={formatMessage({ id: 'templateElement.isFilling' }, '是否填充')}>
                {getFieldDecorator('ifFilled', {
                   rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                  ],
                })(
                  <Select
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                    disabled={readOnly}
                    allowClear
                  >
                  {BOOL_LIST.map(boolItem => (
                    <Option key={boolItem.value} value={boolItem.value}>{boolItem.title}</Option>
                  ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>

            <Row>
              <Form.Item label={formatMessage({ id: 'templateElement.fieldType' }, '字段类型')}>
                {getFieldDecorator('columnType', {
                   rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                  ],
                })(
                  <Select
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                    disabled={readOnly}
                    allowClear
                  >
                    {fieldTypeList.map(fieldTypeItem => (
                      <Option key={fieldTypeItem.attrValueCode} value={fieldTypeItem.attrValueCode}>
                        {fieldTypeItem.attrValueName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={formatMessage({ id: 'templateElement.belongTable' }, '映射表')}>
                {getFieldDecorator('belongTable', {
                   rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                  ],
                })(
                  <Select
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                    disabled={readOnly}
                    onChange={this.changeMapTable}
                    allowClear
                  >
                  {mapTables.map(mapTableItem => (
                    <Option key={mapTableItem.attrValueCode} value={mapTableItem.attrValueCode}>
                      {mapTableItem.attrValueName}
                    </Option>
                  ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={formatMessage({ id: 'templateElement.columnCode' }, '映射字段')}>
                {getFieldDecorator('columnCode', {
                   rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                  ],
                })(
                  <Select
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                    disabled={readOnly}
                    allowClear
                  >
                  {mapFields.map(mapFieldsItem => (
                    <Option key={mapFieldsItem.attrValueCode} value={mapFieldsItem.attrValueCode}>
                      {mapFieldsItem.attrValueName}
                    </Option>
                  ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label={formatMessage({ id: 'templateElement.icon' }, '图标')}>
                {getFieldDecorator('iconId', {
                   rules: [
                    {
                      required: true,
                      message: formatMessage({ id: 'common.form.required' }),
                    },
                  ],
                })(
                  <Select
                    size="small"
                    placeholder={formatMessage({ id: 'common.form.select' }, '请选择')}
                    disabled={readOnly}
                    allowClear
                  >
                  {iconList.map(iconListItem => (
                    <Option key={iconListItem.id} value={iconListItem.id}>
                      {iconListItem.name}
                    </Option>
                  ))}
                  </Select>,
                )}
              </Form.Item>
            </Row>
          </Form>
        </Modal>
      // </Spin>
    );
  }
}

export default ElementModal;
