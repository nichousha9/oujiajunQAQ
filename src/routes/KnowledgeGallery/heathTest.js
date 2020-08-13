/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Input,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  Button,
  Table,
  Icon,
  Divider,
  Switch,
  Popconfirm,
  Modal,
} from 'antd';
import { connect } from 'dva';

import styles from './index.less';

const { Search } = Input;
@Form.create()
@connect(({ knowledgeGallery, loading }) => ({
  knowledgeGallery,
  loading: loading.effects['knowledgeGallery/getHeath'],
}))
export default class Knowledgebase extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    symbol: [],
    savestate: [],
    symbols: [],
    // firstFetchList: true,
  };
  componentDidMount() {
    this.getHeathList();
    this.getKdbList();
    this.getSonDicsByPcode();
    this.getSonDicsByStatus();
  }

  onChange = (value) => {
    this.setState({ symbol: value });
  };

  getSonDicsByStatus = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/getSonDicsByPcode',
      payload: {
        pcode: 'STATUS',
      },
      callback: (res) => {
        this.setState({ savestate: res });
      },
    });
  };

  getKdbList = (kdbName) => {
    const { dispatch } = this.props;
    dispatch({ type: 'knowledgeGallery/clearList' });

    dispatch({
      type: 'knowledgeGallery/fetchKdbList',
      payload: {
        // count: 8,
        kdbName,
      },
    });
  };

  getSonDicsByPcode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/getSonDicsByPcode',
      payload: {
        pcode: 'SYMBOL',
      },
      callback: (res) => {
        this.setState({ symbols: res });
      },
    });
  };

  getHeathList = () => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { pageNum, pageSize, symbol } = this.state;
    const params = getFieldsValue();
    dispatch({
      type: 'knowledgeGallery/qryCheckHealthList',
      payload: {
        symbol,
        ...params,
        time: params.time ? moment(params.time).format('YYYY-MM-DD HH:mm:ss') : '',
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
  };

  listChange = (pageNum, pageSize) => {
    this.setState({ pageNum, pageSize }, () => {
      this.getHeathList();
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { dispatch, location } = this.props;
    const params = location.query;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      {
        title: '知识库',
        dataIndex: 'kdbName',
      },
      {
        title: '原问题',
        dataIndex: 'formQuestion',
      },
      {
        title: '对比问题',
        dataIndex: 'compareQuestion',
      },
      {
        title: '相似度',
        dataIndex: 'score',
        render: (text, record) => <span>{`${text}%`}</span>,
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (text, record) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={styles.point}
              style={{
                backgroundColor: text === '00L' ? 'rgba(250, 173, 20, 1)' : 'rgba(205, 210, 202)',
              }}
            />
            {text === '00L' ? '待处理' : '已处理'}
          </div>
        ),
      },
      {
        title: '计算时间',
        dataIndex: 'createTime',
        sorter: (a, b) => new Date(a.createTime) - new Date(b.createTime),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          let actionText = '';
          if (record.state === '00D') {
            actionText = (
              <span
                style={{
                  color: 'rgba(205, 210, 202)',
                }}
              >
                处理
              </span>
            );
          } else {
            actionText = (
              <span>
                <a
                  onClick={() => {
                    dispatch(
                      routerRedux.push({
                        pathname: '/knowledgebase/problemComparison',
                        query: { params: record },
                      })
                    );
                  }}
                >
                  处理
                </a>
              </span>
            );
          }
          return actionText;
        },
      },
    ];

    const { knowledgeGallery, form } = this.props;
    const { getFieldDecorator } = form;
    const { heathList, kdbList } = knowledgeGallery;
    const { list } = heathList;
    // const  {pageNum=1,pageSize=10,total=1 } =pageInfo
    const { savestate, symbols } = this.state;
    const pagination = {
      pageSize: heathList.pageSize || 10,
      current: heathList.pageNum,
      onChange: this.listChange,
    };

    const kdbArr = kdbList.filter((item) => item.id !== 0);

    // className="selfAdapt"
    return (
      <div className={styles.selfAdapt}>
        <div className={styles.searchdiv}>
          <Form {...formItemLayout} className={styles.searchBox}>
            <Row gutter={24}>
              <Col span={5}>
                <Form.Item label="知识库">
                  {getFieldDecorator('kdbId', {
                    // onChange:()=>this.getHeathList(),
                  })(
                    <Select>
                      {kdbArr &&
                        kdbArr.map((item) => (
                          <Select.Option value={item.id} key={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="状态" state={{ marginLeft: 10 }}>
                  {getFieldDecorator('state', {
                    // onChange:()=>this.getHeathList(),
                  })(
                    <Select>
                      {savestate.map((item) => (
                        <Select.Option value={item.code} key={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="相似度">
                  {getFieldDecorator('symbol', {
                    // onChange:()=>this.getHeathList(),
                  })(
                    <Select onChange={this.onChange}>
                      {symbols.map((item) => (
                        <Select.Option value={item.code} key={item.code}>
                          {item.code}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label=" " colon={false}>
                  {getFieldDecorator('score', {
                    rules: [
                      {
                        required: false,
                        pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                        message: '请输入数字',
                      },
                    ],
                    // onChange:()=>this.getHeathList(),
                  })(<Input addonAfter="%" />)}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="计算时间">
                  {getFieldDecorator('time', {
                    // onChange:()=>this.getHeathList(),
                  })(<DatePicker />)}
                </Form.Item>
              </Col>
            </Row>
            <Row type="flex" justify="end">
              <Button type="primary" onClick={() => this.getHeathList()}>
                查询
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={() => this.handleReset()}>
                重置
              </Button>
            </Row>
          </Form>
        </div>
        <Table
          rowKey="compareId"
          style={{ marginTop: '16px' }}
          columns={columns}
          dataSource={list}
          pagination={pagination}
        />
      </div>
    );
  }
}
