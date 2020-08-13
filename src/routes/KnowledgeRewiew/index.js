/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Input, Row, Col, Form, Select, DatePicker, Button, Table, Switch, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import OneKeyPassModel from './OneKeyPassModel';
import styles from './index.less';
import AddQuestionModel from '../../components/KnowledgeModal/knowledgeModal';
import Ellipsis from '../../components/Ellipsis';
import { kdbList } from '../../services/knowledgeGallery';

// const { Search } = Input
@Form.create()
@connect(({ knowledgeGallery, loading }) => ({
  knowledgeGallery,
  loading: loading.models.knowledgeGallery,
}))
export default class Knowledgebase extends Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    addQuestionVisible: false,
    selectedRowKeys: [],
    // keyWordArr:[],
    kdbId: '',
    kdbArr: [],
    oneKeyVisible: false,
    oneKeyObj: {},
  };
  componentDidMount() {
    this.getQueList();
    const obj = {
      kdbName: '',
    };
    kdbList(obj).then((res) => {
      if (res.status === 'OK') {
        this.setState({
          kdbArr: res.data,
        });
      }
    });
  }

  onChange = (checked, record) => {
    // console.log(`switch to ${checked}`,record.id);
    const { dispatch } = this.props;
    let aiStatus = 0;
    if (checked) {
      aiStatus = 0;
    } else {
      aiStatus = -1;
    }
    dispatch({
      type: 'knowledgeGallery/setAiStatus',
      payload: {
        id: record.id,
        aiStatus,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('修改状态成功');
        this.getQueList();
      }
    });
  };

  // onSearch = (value) =>{
  //   const { dispatch } = this.props
  //   dispatch({
  //     type: 'knowledgeGallery/getWordList',
  //     payload: {
  //       searchKeyword:value,
  //     },
  //   }).then(res=>{
  //     console.log('res',res)
  //     if(res.status==='OK'){
  //       this.setState({keyWordArr:res.data})
  //     }
  //   })
  // }

  getQueList = () => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { pageNum, pageSize } = this.state;

    const values = getFieldsValue();

    // console.log('params',params)
    dispatch({
      type: 'knowledgeGallery/qryQesList',
      payload: {
        // count: 8,
        // kdbid:params.id,
        status: '00L',
        aiStatus: values.aiStatus,
        endtime: values.endtime ? moment(values.endtime).format('YYYY-MM-DD hh:mm:ss') : '',
        keyword: values.keyword,
        kdbid: values.kdbName,
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
    });
  };

  getDetail = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/getStandardQuesDteail',
      payload: {
        id: record.id,
      },
    });
    this.setState({ addQuestionVisible: true, kdbId: record.kdbid });
  };

  listChange = (pageNum, pageSize) => {
    this.setState({ pageNum, pageSize }, () => {
      this.getQueList();
    });
  };

  closeEditorModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/clearDetail',
    });
    this.getQueList();
    this.setState({ addQuestionVisible: false });
  };

  pass = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'knowledgeGallery/passQuestion',
      payload: { ids: selectedRowKeys },
    }).then((res) => {
      if (res.status === 'OK') {
        message.info(res.msg);
        this.getQueList();
        this.setState({ selectedRowKeys: [] });
      }
    });
  };

  unPass = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'knowledgeGallery/unPassQuestion',
      payload: { ids: selectedRowKeys },
    }).then((res) => {
      if (res.status === 'OK') {
        message.info(res.msg);
        this.getQueList();
        this.setState({ selectedRowKeys: [] });
      }
    });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  showOneKeyModel = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    this.setState({
      oneKeyVisible: true,
      oneKeyObj: {
        aiStatus: values.aiStatus,
        endtime: values.endtime ? moment(values.endtime).format('YYYY-MM-DD hh:mm:ss') : '',
        keyword: values.keyword,
        kdbid: values.kdbName,
      },
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const columns = [
      {
        title: '问题',
        dataIndex: 'question',
        width: 180,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '答案',
        dataIndex: 'textContent',
        width: 180,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '核心词',
        dataIndex: 'keyword',
      },
      {
        title: '所在知识库',
        dataIndex: 'kdbName',
      },
      {
        title: '录入时间',
        dataIndex: 'updatetime',
      },
      {
        title: '状态',
        dataIndex: 'aiStatus',
        render: (text, record) => {
          return (
            <Switch checked={text === 0} onChange={(checked) => this.onChange(checked, record)} />
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.getDetail(record);
              }}
            >
              编辑
            </a>
          </span>
        ),
      },
    ];

    const {
      form: { getFieldDecorator },
      knowledgeGallery: { quesList, quesDetail },
      loading,
    } = this.props;
    const { list = [] } = quesList;

    // console.log(quesList.pageNum);

    const pagination = {
      pageSize: quesList.pageSize || 10,
      // current: quesList.pageNum,
      total: quesList.total,
      onChange: this.listChange,
    };
    const { selectedRowKeys } = this.state;

    const { addQuestionVisible, kdbId, kdbArr, oneKeyVisible, oneKeyObj } = this.state;

    const addQuestionProps = {
      visible: addQuestionVisible,
      query: quesDetail,
      kdbId,
      // onOk: this.loadTabList,
      closeAddQuesModal: this.closeEditorModal,
    };

    const oneKeyProps = {
      oneKeyObj,
      visible: oneKeyVisible,
      onCancel: () =>
        this.setState({ oneKeyVisible: false }, () => {
          this.resetSearch();
          this.getQueList();
        }),
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    // className="selfAdapt"
    return (
      <div className={styles.selfAdapt}>
        <Form {...formItemLayout} className="ant-advanced-search-form">
          <Row>
            <Col span={5}>
              <Form.Item label="状态">
                {getFieldDecorator('aiStatus', {
                  rules: [],
                })(
                  <Select style={{ width: '180px' }}>
                    <Select.Option key={0} value={-1}>
                      不合格
                    </Select.Option>
                    <Select.Option key={1} value={0}>
                      合格
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="知识库">
                {getFieldDecorator('kdbName', {
                  rules: [],
                })(
                  <Select style={{ width: '180px' }}>
                    {kdbArr.map((item) => {
                      return (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="核心词">
                {getFieldDecorator('keyword', {
                  rules: [],
                })(<Input style={{ width: '180px' }} placeholder="请输入核心词" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="失效时间">
                {getFieldDecorator('endtime', {
                  rules: [],
                })(<DatePicker style={{ width: '180px' }} format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button
                style={{ marginLeft: '8px' }}
                type="primary"
                onClick={() => {
                  this.getQueList();
                }}
              >
                查询
              </Button>
              <Button
                style={{ marginLeft: '8px' }}
                onClick={() => {
                  this.resetSearch();
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>

        <div className={styles.buttongroup}>
          <Button type="primary" onClick={() => this.showOneKeyModel()}>
            一键审核通过
          </Button>
          <Button style={{ marginLeft: '8px' }} type="primary" onClick={() => this.pass()}>
            批量审核通过
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={() => this.unPass()}>
            批量删除
          </Button>
        </div>
        <Table
          style={{ marginTop: '16px' }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={pagination}
          loading={loading}
        />
        {addQuestionVisible && <AddQuestionModel {...addQuestionProps} />}

        {oneKeyVisible && <OneKeyPassModel {...oneKeyProps} />}
      </div>
    );
  }
}
