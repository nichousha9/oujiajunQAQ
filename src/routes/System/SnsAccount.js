/* eslint-disable no-script-url */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Popover,
  Divider,
  Row,
  Col,
  Icon,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import { confirm, formatDatetime, getPaginationList } from '../../utils/utils';
import styles from './System.less';
import {
  getSnsaccountPk,
  resetSnsaccountPk,
  listSnsaccount,
  deleteSnsaccount,
} from '../../services/api';

const FormItem = Form.Item;

let _self;

@Form.create()
@connect()
export default class Agent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPk: false,
      loading: false,
      list: [],
      dialogVisible: false,
      item: {
        name: '',
        baseURL: '',
      },
    };
  }

  async componentDidMount() {
    _self = this;
    await this.fetchList();
  }

  async fetchList(page = 0) {
    this.setState({ loading: true });
    const { pagination = {} } = this.tableRef || {};
    const res = await listSnsaccount({ p: page, ps: pagination.pageSize || 10 });
    if (!res || !res.data) return;
    this.setState({
      loading: false,
      ...getPaginationList(res),
    });
  }

  async handleOk() {
    const {form} = _self.props;
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

    // 新增/编辑
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
    await deleteSnsaccount({ id: item.id });
    _self.setState({ dialogVisible: false, item: {} });
    await _self.fetchList();
  }

  handleViewScript(data) {
    const { item } = this.state;
    const obj = {
      ...item,
      script: `<script defer="true" src="${global.im_url}/im/script/script.js?appid=${data.snsid}"></script>`,
      url: `${global.im_url}/im/text/${data.snsid}.html`,
      usertype: data.usertype,
      snsid: data.snsid,
    };
    // 如果当前的时候企业，请求接口
    if (data.usertype === 'staff') {
      getSnsaccountPk({
        snsid: data.snsid,
      }).then((res) => {
        if (res.status === 'OK') {
          _self.pkValue = res.data;
          _self.setState({ showPk: false, dialogVisible2: true, item: { ...obj, pk: res.data } });
        }
      });
      return;
    }
    _self.setState({ showPk: false, dialogVisible2: true, item: obj });
  }

  updatePk = () => {
    const { item } = this.state;
    resetSnsaccountPk({
      snsid: item.snsid,
    }).then((res) => {
      if (res.status === 'OK') {
        message.success('公钥重置成功');
        this.fetchList();
        this.setState({ dialogVisible2: false });
      }
    });
  };
  render() {
    const UserType = {
      visitor: '匿名访客',
      // 'user': '网站用户',
      staff: '企业用户',
    };

    const { item, showPk } = this.state;
    const columns = [
      {
        title: '网站名称',
        dataIndex: 'name',
      },
      {
        title: '网站地址',
        dataIndex: 'baseURL',
      },
      {
        title: '网站标识',
        dataIndex: 'snsid',
      },
      {
        title: '用户类型',
        dataIndex: 'usertype',
        render: (text) => <span>{UserType[text]}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createtime',
        width: 150,
        render: (text) => <span>{formatDatetime(text)}</span>,
      },
      {
        title: '操作',
        width: 150,
        render: (text, record) => (
          <Fragment>
            <a
              href="javascript:;"
              onClick={() => {
                this.handleViewScript(record);
              }}
            >
              接入代码
            </a>
            <Divider type="vertical" />
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
    const { pagination, list } = this.state;
    const pkContent = (
      <Input
        defaultValue={item.pk}
        type={showPk ? 'text' : 'password'}
        addonAfter={
          <Icon
            onClick={() => {
              this.setState({ showPk: !showPk });
            }}
            type={!showPk ? 'eye' : 'eye-o'}
          />
        }
        style={{ cursor: 'pointer' }}
        readOnly
      />
    );
    return (
      <div className="border padding-left-20 padding-right-20 height100">
        <div className={styles.tableList}>
          <StandardTable
            ref={(ele) => {
              this.tableRef = ele;
            }}
            loading={this.state.loading}
            columns={columns}
            cutHeight={250}
            noSelect
            noTotalPage
            extralContent={
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.setState({ dialogVisible: true })}
              >
                新建
              </Button>
            }
            onChange={(data) => {
              this.fetchList(data.current);
            }}
            data={{ pagination, list }}
          />
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
              <FormItem {...formItemLayout} label="网站名称">
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [{ required: true, message: '请输入网站名称' }],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="网站地址">
                {getFieldDecorator('baseURL', {
                  initialValue: item.baseURL,
                  rules: [{ required: true, message: '请输入网站地址' }],
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="用户类型">
                {getFieldDecorator('usertype', {
                  initialValue: item.usertype,
                  rules: [{ required: true, message: '请选择用户类型' }],
                })(
                  <Select>
                    {Object.keys(UserType).map((key) => (
                      <Select.Option value={key}>{UserType[key]}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Form>
          </Modal>
          <Modal
            title="接入代码"
            visible={this.state.dialogVisible2}
            footer={null}
            width="70%"
            onCancel={() => {
              this.setState({ dialogVisible2: false });
            }}
          >
            <Row className={styles.row}>
              <Col md={6} sm={24} className={styles.label}>
                接入代码：
              </Col>
              <Col md={16} sm={24}>
                <Input value={item.script} readOnly />
                <div className={styles.tip}>
                  请将以上代码添加到你的网站 HTML 源代码中，放在&lt;head&gt;&lt;/head&gt;标签之间.
                </div>
              </Col>
            </Row>
            <Row className={styles.row}>
              <Col md={6} sm={24} className={styles.label}>
                文字链代码：
              </Col>
              <Col md={16} sm={24}>
                <Input value={item.url} readOnly />
                <div className={styles.tip}>
                  请将以上代码添加到你的网站 链接代码上，可以自由定义链接的内容形式{' '}
                </div>
              </Col>
            </Row>
            {item.usertype === 'staff' && (
              <Row className={styles.row}>
                <Col md={6} sm={24} className={styles.label}>
                  企业公钥：
                </Col>
                <Col md={9} sm={24}>
                  {showPk ? (
                    <Popover
                      overlayStyle={{ maxWidth: 500, wordBreak: 'break-all', padding: 10 }}
                      content={`${item.pk}`}
                    >
                      {pkContent}
                    </Popover>
                  ) : (
                    pkContent
                  )}
                </Col>
                <Col md={2} sm={24} className="text-right">
                  <Button onClick={this.updatePk}>重置</Button>
                </Col>
                <Col md={5} sm={24} className="text-right">
                  <a
                    href={`${global.req_url}/smartim/snsaccount/downloadFile?fileId=group1/M00/01/35/Ci0vElsPnsGABjp8AAElqK3AWNg0060468&filename=单点接入文档.doc`}
                  >
                    单点接入文档.doc
                  </a>
                </Col>
              </Row>
            )}
          </Modal>
        </div>
      </div>
    );
  }
}
