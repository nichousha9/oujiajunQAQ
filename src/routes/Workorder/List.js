/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable import/first */
/* eslint-disable no-script-url */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Modal } from 'antd';

import { formatDatetime } from '../../utils/utils';
import StandardTable from 'components/StandardTable';
import styles from './Workorder.less';

import {
  listWorkorder,
  listWorkorderConfig,
  getSonDicsByPcode,
  getFileByFileids,
} from '../../services/api';

const FormItem = Form.Item;

@Form.create()
@connect()
export default class Agent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: { list: [], total: 0 },
      configs: [],
      dialogVisible: false,
      // 详细信息
      details: [],
      pageSize: 10,
    };
  }

  async componentDidMount() {
    await this.fetchList();
    await this.fetchConfig();
  }

  handleStandardTableChange = (pagination) => {
    this.fetchList(pagination.current);
  };

  // 工单配置
  async fetchConfig(page = 0) {
    const res = await listWorkorderConfig({
      p: page,
      ps: 10,
    });
    if (!res || !res.data) return;

    const list = res.data.list || [];
    for (const item of list) {
      if (item.showtype === 3) {
        // 字典类型
        const res = await getSonDicsByPcode({ pcode: item.diccode });
        item.diclist = res.data || [];
      }
    }
    this.setState({
      configs: list,
    });
  }

  // 工单列表
  async fetchList(page) {
    const res = await listWorkorder({ p: page || 1, ps: this.state.pageSize });
    if (!res || !res.data) return;
    this.setState({
      page: res.data,
    });
  }
  async handleDetail(order) {
    let { ext } = order;
    ext = JSON.parse(ext);

    const details = [];
    // 配置
    const { configs } = this.state;
    for (const item of configs) {
      item.value = ext[item.code]; // 字段值
      // 文件
      if (item.showtype === 1 || item.showtype === 2) {
        const res = await getFileByFileids({ fileids: item.value });
        item.files = res && res.data ? res.data : [];
      }
      details.push(item);
    }

    this.setState({
      details,
      dialogVisible: true,
    });
  }
  render() {
    const States = {
      pending: '待处理',
      processing: '处理中',
      processed: '已处理',
      closed: '已关闭',
    };

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text) => <span>{States[text]}</span>,
      },
      {
        title: '联系人',
        dataIndex: 'contacter',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '创建时间',
        dataIndex: 'createtime',
        width: 170,
        render: (text) => <span>{formatDatetime(text)}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a
              href="javascript:;"
              onClick={() => {
                this.handleDetail(record);
              }}
            >
              详细信息
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
    const tableProps = {
      data: {
        list: this.state.page.list,
        pagination: { pageSize: this.state.pageSize, total: this.state.page.total },
      },
      columns,
      onChange: this.handleStandardTableChange,
      cutHeight: 250,
    };
    return (
      <div className="border height100 padding-20">
        <div className={styles.tableList}>
          <StandardTable {...tableProps} />
          <Modal
            maskClosable={false}
            title="网站信息"
            visible={this.state.dialogVisible}
            onCancel={() => {
              this.setState({ dialogVisible: false });
            }}
          >
            <Form>
              {this.state.details.map((item) => {
                return (
                  <FormItem {...formItemLayout} label={item.field}>
                    {item.showtype === 0 ? <Input readOnly defaultValue={item.value} /> : ''}
                    {item.showtype === 3 ? (
                      <Select defaultValue={item.value} readOnly>
                        {item.diclist.map((dic) => (
                          <Select.Option value={dic.code}>{dic.name}</Select.Option>
                        ))}
                      </Select>
                    ) : (
                      ''
                    )}
                    {/* 图片 */}
                    {item.showtype === 1 && item.files ? (
                      <div>
                        {item.files.map((file) => (
                          <p>
                            <a href={file.url} target="_blank">
                              <img style={{ width: '80px' }} src={file.url} />
                            </a>
                          </p>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                    {/* 附件 */}
                    {item.showtype === 2 && item.files ? (
                      <div>
                        {item.files.map((file) => (
                          <div>
                            <a href={file.url} target="_blank">
                              {file.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </FormItem>
                );
              })}
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
