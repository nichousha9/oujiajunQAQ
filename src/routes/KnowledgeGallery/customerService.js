/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Input,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  Button,
  Table,
  // Icon,
  Divider,
  Switch,
  Popconfirm,
  message,
  Upload,
  Progress,
  Tag,
} from 'antd';
import { Resizable } from 'react-resizable';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import styles from './index.less';

import AddQuestionModel from '../../components/KnowledgeModal/knowledgeModal';
import { kdbTempletDown } from '../../services/api';
import { createFileDown } from '../../utils/utils';
import { deleteAll } from '../../services/knowledgeGallery';
import Ellipsis from '../../components/Ellipsis';

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

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
    ids: '',
    keyWordArr: [],
    uploadFileList: [],
    // uploadFile:'',
    updateLoading: false,
    uploadLoading: false,
    uploadProcess: 0,

    rowKeys: [],
    columns: [
      {
        title: '问题',
        dataIndex: 'question',
        width: 150,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '答案',
        dataIndex: 'textContent',
        width: 160,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '核心词',
        dataIndex: 'keyword',
        width: 140,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '知识标签',
        dataIndex: 'label',
        align: 'center',
        width: 300,
        render: (label) => {
          return (
            <span>
              {this.getTabs(label).map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </span>
          );
        },
      },
      {
        title: '问题失效时间',
        dataIndex: 'endtime',
        width: 160,
      },
      {
        title: '状态更新时间',
        dataIndex: 'updatetime',
        width: 160,
      },
      {
        title: '状态',
        dataIndex: 'isenable',
        width: 120,
        render: (text, record) => {
          return (
            <Switch checked={text === '1'} onChange={(checked) => this.onChange(checked, record)} />
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        render: (text, record) => (
          <span>
            <a
              onClick={() => {
                this.getDetail(record.id);
              }}
            >
              修改
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => this.delete(record.id)}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ],
    columns1: [
      {
        title: '问题',
        dataIndex: 'question',
        width: 150,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '答案',
        dataIndex: 'textContent',
        width: 160,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '核心词',
        dataIndex: 'keyword',
        width: 140,
        render: (text) => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: '知识标签',
        dataIndex: 'label',
        align: 'center',
        width: 300,
        render: (label) => {
          return (
            <span>
              {this.getTabs(label).map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </span>
          );
        },
      },
      {
        title: '问题失效时间',
        dataIndex: 'endtime',
        width: 160,
      },
      {
        title: '状态更新时间',
        dataIndex: 'updatetime',
        width: 160,
      },
      {
        title: '状态',
        dataIndex: 'isenable',
        width: 120,
        render: (text, record) => {
          return <Switch checked={text === '1'} disabled />;
        },
      },
    ],
  };

  // componentWillMount () {
  //   // 拦截判断是否离开当前页面
  //   window.addEventListener('beforeunload', this.beforeunload);
  // }
  //
  componentDidMount() {
    const { location, dispatch } = this.props;
    const params = location.query;
    // if (!params) {
    //   dispatch(routerRedux.push('/user/login'));
    // }
    this.getQueList();
  }

  // componentWillUnmount () {
  //   // 销毁拦截判断是否离开当前页面
  //   window.removeEventListener('beforeunload', this.beforeunload);
  // }

  onChange = (checked, record) => {
    const { dispatch } = this.props;
    let ablevalue = 0;
    if (checked) {
      ablevalue = 1;
    } else {
      ablevalue = 0;
    }
    dispatch({
      type: 'knowledgeGallery/changeAble',
      payload: {
        ids: record.id,
        ablevalue,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('修改状态成功');
        this.getQueList();
      }
    });
  };

  onSearch = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/getWordList',
      payload: {
        searchKeyword: value,
      },
    }).then((res) => {
      if (res.status === 'OK') {
        this.setState({ keyWordArr: res.data });
      }
    });
  };

  getQueList = (text) => {
    const {
      dispatch,
      location,
      form: { getFieldsValue },
    } = this.props;
    const { pageNum, pageSize } = this.state;
    const params = location.query;
    const values = getFieldsValue();

    dispatch({
      type: 'knowledgeGallery/qryQesList',
      payload: {
        // count: 8,
        kdbid: params ? params.id : window.kdbid,
        isenable: values.isenable,
        endtime: values.endtime ? moment(values.endtime).format('YYYY-MM-DD hh:mm:ss') : '',
        keyword: values.keyword,
        queslike: values.queslike,
        // status:'00A',
        pageInfo: {
          pageNum: text === 'Click' ? 1 : pageNum,
          pageSize,
        },
      },
    });
  };

  getTabs = (label) => {
    let labelArr = [];
    if (label) {
      labelArr = label.split('|');
    }
    return labelArr;
  };

  getDetail = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeGallery/getStandardQuesDteail',
      payload: {
        id,
      },
    });
    this.setState({ addQuestionVisible: true });
  };

  beforeunload = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/user/login'));
  };

  delete = (ids) => {
    const { dispatch } = this.props;
    if (ids) {
      dispatch({
        type: 'knowledgeGallery/deleteReq',
        payload: {
          ids,
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          message.success('删除成功');
          this.getQueList();
          this.setState({ ids: undefined });
        }
      });
    }
  };

  beforeUpload = () => {
    this.setState({
      uploadLoading: true,
      uploadProcess: 0,
    });
    // const {sceneId} = this.props;
    // const param = {
    //   file,
    //   sceneId,
    // }
    // uploadFile(param).then(res => {
    //   if (res.status === 'OK') {
    //     message.info('开始上传');
    //     this.timer = setInterval(() => {
    //       this.getUploadProcess(res.data)
    //     }, 3000);
    //   } else {
    //     message.warning('上传文件失败！')
    //   }
    // })
    // return false;
  };

  batchDelete = () => {
    const { dispatch } = this.props;
    const { rowKeys } = this.state;
    if (rowKeys.length) {
      dispatch({
        type: 'knowledgeGallery/deleteReq',
        payload: {
          ids: rowKeys.join(','),
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          message.success('批量删除成功');
          this.getQueList();
          this.setState({ rowKeys: [] });
        }
      });
    }
  };

  dowonTemplte = () => {
    //  {/*href="http://10.45.54.31:8091/smartim/kdb/file/templet?importtype=kdb_standard_ques_import"*/}

    kdbTempletDown({ importtype: 'kdb_standard_ques_import' }).then((res) => {
      createFileDown(res);
    });
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

  // jump = params => {
  //   const { dispatch } = this.props;

  //   dispatch(routerRedux.push({ pathname: '/knowledgebase/heathTest', query: params }));
  // };

  savaFileInfo = ({ file, fileList }) => {
    const { dispatch, location } = this.props;
    const params = location.query;
    this.setState(
      {
        uploadFileList: fileList,
      },
      () => {
        const { uploadFileList } = this.state;
        if (uploadFileList.length === 0) {
          this.setState({
            uploadLoading: false,
          });
        }
      }
    );
    if (file.status !== 'uploading') {
      const attachmentids = [];
      this.setState({
        uploadProcess: 100,
      });
      for (let i = 0; i < fileList.length; i += 1) {
        attachmentids.push(fileList[i].response.data.id);
      }

      dispatch({
        type: 'knowledgeGallery/upload',
        payload: {
          kdbid: params ? params.id : window.kdbid,
          attachmentids,
          importtype: 'kdb_standard_ques_import',
        },
      }).then((res) => {
        if (res && res.status === 'OK') {
          message.info(res.msg);
          this.getQueList();
        }
      });
      // if(fileList){
      //   fileList.forEach(item => {
      //     let curId;
      //     if(item.response){
      //       const {data} = item.response;
      //       const {id} = data;
      //       curId = id;
      //     }else{
      //       curId = item.uid;
      //     }
      //
      //     arr.push(curId);
      //   })
      // }
      // const str = arr.join(',');
      // this.setState({
      //   uploadFile: str,
      // })
    }
  };

  kdbUpdate = () => {
    const { dispatch } = this.props;
    this.setState({ updateLoading: true });
    dispatch({
      type: 'knowledgeGallery/kdbUpdate',
    })
      .then((res) => {
        if (res && res.status === 'OK') {
          message.info('同步成功');
          this.getQueList();
        }
        this.setState({ updateLoading: false });
      })
      .catch(() => {
        this.setState({ updateLoading: false });
      });
  };

  // 清空知识库
  handleDelete = () => {
    const { location } = this.props;
    const params = location.query;
    const obj = {
      kdbid: params.id,
    };
    deleteAll(obj).then((res) => {
      if (res.status === 'OK') {
        this.getQueList();
      }
    });
  };

  resetSearch = () => {
    const { form } = this.props;
    form.resetFields();
  };

  handleResize = (index) => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const {
      form: { getFieldDecorator },
      knowledgeGallery: { quesList, quesDetail },
      location,
      loading,
      dispatch,
    } = this.props;
    const { list = [] } = quesList;
    const pagination = {
      pageSize: quesList.pageSize || 10,
      current: quesList.pageNum,
      total: quesList.total,
      onChange: this.listChange,
    };

    // eslint-disable-next-line no-unused-vars
    const {
      addQuestionVisible,
      // keyWordArr,
      uploadFileList,
      updateLoading,
      uploadProcess,
      uploadLoading,
      rowKeys,
      // columns
    } = this.state;
    const params = location.query;
    const { share } = location;

    const addQuestionProps = {
      visible: addQuestionVisible,
      query: quesDetail,
      kdbId: params ? params.id : '',
      // onOk: ()=>this.getQueList(),
      closeAddQuesModal: this.closeEditorModal,
    };

    const props = {
      name: 'file',
      withCredentials: true,
      action: `${global.req_url}/smartim/system/attachment/upload`,
      data: {
        kdbid: params ? params.id : '',
        catecode: '003',
        catecodeid: 62,
        importtype: 'kdb_standard_ques_import',
      },
      onChange: this.savaFileInfo,
      beforeUpload: this.beforeUpload,
      // fileList: curQuestionInfo.fileList && curQuestionInfo.fileList.map((item) => ({
      //   uid: item.id,
      //   name: item.filename,
      //   status: 'done',
      //   url: `${global.req_url}${item.filepath}?attname=${item.filename}`,
      // })),
    };

    // rowSelection object indicates the need for row selection
    const rowSelection = {
      selectedRowKeys: rowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ rowKeys: selectedRowKeys });
      },
    };

    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    const columns1 = this.state.columns1.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    // className="selfAdapt"
    return (
      <div className={styles.selfAdapt}>
        <Form {...formItemLayout} className="ant-advanced-search-form">
          <Row gutter={24}>
            {/* <Col span={1}>
              <Button
                type="link"
                onClick={() =>
                  dispatch(
                    routerRedux.push({
                      pathname: '/knowledgebase/knowledgeGallery',
                      query: { ...params },
                    })
                  )
                }
              >
                返回上一级
              </Button>
            </Col> */}
            <Col span={6}>
              <Form.Item label="状态">
                {getFieldDecorator('isenable', {
                  rules: [],
                })(
                  <Select style={{ width: '180px' }}>
                    <Select.Option key={0} value={1}>
                      启用
                    </Select.Option>
                    <Select.Option key={1} value={0}>
                      停用
                    </Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="失效时间">
                {getFieldDecorator('endtime', {
                  rules: [],
                })(<DatePicker style={{ width: '180px' }} format="YYYY-MM-DD HH:mm:ss" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="核心词">
                {getFieldDecorator('keyword', {
                  rules: [],
                })(<Input style={{ width: '180px' }} placeholder="请输入核心词" maxLength={20} />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="知识">
                {getFieldDecorator('queslike', {
                  rules: [],
                })(<Input style={{ width: '180px' }} placeholder="请输入知识" maxLength={20} />)}
              </Form.Item>
            </Col>
          </Row>

          <div className={styles.buttongroup}>
            {/* <Button
            type="primary"
            onClick={() => {
              this.setState({ addQuestionVisible: true });
            }}
          >
            <Icon type="plus" />
            新建{' '}
          </Button>
          <Button
            style={{ marginLeft: '8px' }}
            type="primary"
            onClick={() => {
              this.jump(params);
            }}
          >
            健康检查{' '}
          </Button> */}
            <div>
              {!share ? (
                <>
                  <Button
                    style={{ marginLeft: '8px' }}
                    type="primary"
                    onClick={() => {
                      this.kdbUpdate();
                    }}
                    loading={updateLoading}
                  >
                    同步数据
                  </Button>
                  <Popconfirm title="您确定要删除吗？" onConfirm={() => this.handleDelete()}>
                    <Button style={{ marginLeft: '8px' }} type="danger">
                      清空知识库
                    </Button>
                  </Popconfirm>
                  <Button style={{ marginLeft: '8px' }} onClick={this.batchDelete}>
                    批量删除
                  </Button>
                </>
              ) : null}

              <Button
                style={{ marginLeft: '8px' }}
                onClick={() =>
                  dispatch(
                    routerRedux.push({
                      pathname: '/knowledgebase/knowledgeGallery',
                      query: { ...params },
                      share: !share ? 0 : 1,
                    })
                  )
                }
              >
                返回上一级
              </Button>
            </div>
            <div style={{ display: 'flex', textAlign: 'right' }}>
              <Button
                style={{ marginLeft: '8px' }}
                type="primary"
                onClick={() => {
                  this.getQueList('Click');
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
            </div>
            {/* <Button style={{marginLeft:'8px'}} >批量停用 </Button> */}

            {/* <Upload style={{ marginBottom: '2px' }} {...props} fileList={uploadFileList}>
            <Button style={{ marginLeft: '8px' }}>批量导入 </Button>
          </Upload>
          {uploadLoading ? (
            <>
              <span style={{ padding: 20 }}>目前进度：</span>
              <div style={{ width: 140, display: 'inline-block' }}>
                <Progress size="small" percent={uploadProcess} />
              </div>
            </> 
          ) : null} */}
          </div>
        </Form>

        <Table
          components={this.components}
          style={{ marginTop: '16px' }}
          rowKey="id"
          rowSelection={!share ? rowSelection : null}
          bordered
          columns={!share ? columns : columns1}
          dataSource={list}
          pagination={pagination}
          loading={loading}
        />
        {addQuestionVisible && <AddQuestionModel {...addQuestionProps} />}
      </div>
    );
  }
}
