/* eslint-disable no-script-url */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/first */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Divider, Form, Input, Select, Button, Modal } from 'antd';
import { confirm, formatDatetime } from '../../utils/utils';
import StandardTable from 'components/StandardTable';
import {
  addWorkorderConfig,
  listWorkorderConfig,
  getPDicts,
  modifyWorkorderConfig,
  deleteWorkorderConfig,
} from '../../services/api';

const FormItem = Form.Item;

let _self = null;

@Form.create()
@connect()
export default class Agent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      dialogVisible: false,
      item: {
        field: '',
        code: '',
        showtype: '',
        diccode: '',
      },
      dicts: [], // 字典列表
    };
  }

  async componentDidMount() {
    _self = this;

    await this.fetchList();
    await this.fetchDicts();
  }

  async fetchDicts() {
    const res = await getPDicts();
    if (!res || !res.data) return;
    this.setState({ dicts: res.data });
  }

  async fetchList() {
    this.setState({ loading: true });
    const res = await listWorkorderConfig();
    if (!res || !res.data || !res.data.list) return;

    for (const item of res.data.list) {
      // eslint-disable-next-line prefer-template
      item.required = Number(item.required) + '';
    }

    this.setState({
      loading: false,
      list: res.data.list,
    });
  }

  async handleOk() {
    const { form } = _self.props;
    form.validate = () => {
      return new Promise((resolve, reject) => {
        form.validateFields((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    };

    // 校验表单
    await form.validate();
    const values = form.getFieldsValue();
    values.id = _self.state.item.id;

    for (const key in values) {
      if (values[key] === null) values[key] = '';
    }

    // 新增/编辑
    // eslint-disable-next-line no-unused-vars
    const res = values.id ? await modifyWorkorderConfig(values) : await addWorkorderConfig(values);
    _self.setState({ dialogVisible: false, item: {} });
    await _self.fetchList();
  }

  handleUpdate(item) {
    this.setState({
      item,
      dialogVisible: true,
    });
  }

  async handleDelete(item) {
    await confirm('确定要删除吗？');
    await deleteWorkorderConfig({ id: item.id });
    _self.setState({ dialogVisible: false, item: {} });
    await _self.fetchList();
  }

  render() {
    const Showtype = {
      '0': '文字',
      '1': '图片',
      '2': '附件',
      '3': '字典',
    };
    const Type = {
      '0': '基础字段',
      '1': '自定义字段',
      '2': '默认字段',
    };
    const { item, loading = false } = this.state;
    const columns = [
      {
        title: '字段',
        dataIndex: 'code',
      },
      {
        title: '字段名称',
        dataIndex: 'field',
      },
      {
        title: '字段类型',
        dataIndex: 'type',
        render: (text) => <span>{Type[text]}</span>,
      },
      {
        title: '字段格式',
        dataIndex: 'showtype',
        render: (text) => <span>{Showtype[text]}</span>,
      },
      {
        title: '创建时间',
        width: 170,
        dataIndex: 'createtime',
        render: (text) => <span>{formatDatetime(text)}</span>,
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) =>
          record.type === 1 ? (
            <Fragment>
              <a
                href="javascript:;"
                onClick={() => {
                  this.handleUpdate(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                href="javascript:;"
                onClick={() => {
                  this.handleDelete(record);
                }}
              >
                删除
              </a>
            </Fragment>
          ) : (
            ''
          ),
      },
    ];

    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const tableProps = {
      loading,
      noTotalPage: true,
      data: {
        list: this.state.list,
        pagination: false,
      },
      columns,
      onChange: this.handleStandardTableChange,
      cutHeight: 250,
      pagination: false,
      extralContent: (
        <Button icon="plus" type="primary" onClick={() => this.setState({ dialogVisible: true })}>
          新建
        </Button>
      ),
    };
    return (
      <div className="border padding-left-20 padding-right-20 height100">
        <StandardTable {...tableProps} />
        <Modal
          maskClosable={false}
          title="网站信息"
          visible={this.state.dialogVisible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ dialogVisible: false, item: {} });
          }}
        >
          <Form>
            <FormItem {...formItemLayout} label="字段">
              {getFieldDecorator('code', {
                initialValue: item.code,
                rules: [{ required: true, message: '请输入字段(英文)' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="字段名称">
              {getFieldDecorator('field', {
                initialValue: item.field,
                rules: [{ required: true, message: '请输入字段名称' }],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="字段格式">
              {getFieldDecorator('showtype', {
                initialValue: item.showtype,
                rules: [{ required: true, message: '请选择字段格式' }],
              })(
                <Select
                  onChange={(e) => {
                    this.state.item.showtype = e;
                  }}
                >
                  {Object.keys(Showtype).map((key) => (
                    <Select.Option value={key}>{Showtype[key]}</Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>

            {item.showtype === 3 ? (
              <FormItem {...formItemLayout} label="字典配置">
                {getFieldDecorator('diccode', {
                  initialValue: item.diccode,
                  rules: [{ required: true, message: '请选择字典配置' }],
                })(
                  <Select>
                    {this.state.dicts.map(items => (
                      <Select.Option value={items.code}>{items.name}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            ) : (
              ''
            )}

            <FormItem {...formItemLayout} label="是否必填">
              {getFieldDecorator('required', {
                initialValue: item.required,
                rules: [{ required: true, message: '请选择是否必填' }],
              })(
                <Select>
                  <Select.Option value="0">否</Select.Option>
                  <Select.Option value="1">是</Select.Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="数据类型">
              {getFieldDecorator('datatype', {
                initialValue: item.datatype,
                rules: [{ required: true, message: '请选择数据类型' }],
              })(
                <Select>
                  <Select.Option value="string">字符串</Select.Option>
                  <Select.Option value="int">整数</Select.Option>
                  <Select.Option value="float">浮点型</Select.Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="最小长度">
              {getFieldDecorator('minlength', {
                initialValue: item.minlength,
              })(<Input />)}
            </FormItem>

            <FormItem {...formItemLayout} label="最大长度">
              {getFieldDecorator('maxlength', {
                initialValue: item.maxlength,
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
