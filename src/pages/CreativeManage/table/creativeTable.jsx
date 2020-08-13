/* eslint-disable no-console */
import React, { Component, Fragment } from 'react';
import { Icon, Table, Popconfirm, Divider, message, Modal } from 'antd';
import { connect } from 'dva';
import ImgCreative from './addUpdate/imgCreative';
import TxtCreative from './addUpdate/txtCreative';
import HtmlCreative from './addUpdate/htmlCreative';
import styles from '../index.less';

@connect(({ loading }) => ({
  loadingCopy: loading.effects['creativeIdeaManage/copyAdviceType'],
  loadingMove: loading.effects['creativeIdeaManage/changeAdviceType'],
}))
class CreativeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pagination: {},
      loading: false,
      expandedRowKeys: [],
      visible: false,
    };
    this.param = {};
    this.columns = [
      {
        title: '创意名称',
        dataIndex: 'creativeInfoName',
      },
      {
        title: '编码',
        dataIndex: 'creativeInfoCode',
      },
      {
        title: '渠道',
        dataIndex: 'channelId',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '创意模板类型',
        dataIndex: 'templateInfoType',
        render: text => {
          switch (String(text)) {
            // case '1':
            //   return '图片创意';
            case '2':
              return '文本创意';
            // case '3':
            //   return 'HTML创意';
            default:
              return '未知';
          }
        },
      },
      {
        title: '创意模板',
        dataIndex: 'isEngine',
        render: text => (text === '0' ? '否' : '是'),
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <React.Fragment>
              <a onClick={() => this.triggerRow(record.creativeInfoId)}>
                查看创意关联商品
                <Icon className={styles.arrowDown} type="down" />
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.handleEdit(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.handleCopy(record);
                }}
              >
                复制
              </a>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  this.handleMove(record);
                }}
              >
                移动
              </a>
              <Divider type="vertical" />
              <Popconfirm
                placement="topLeft"
                title="确定删除"
                onConfirm={() => {
                  this.handleDel(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </React.Fragment>
          );
        },
      },
    ];
    props.getParam(this);
  }

  componentDidMount() {}

  getData = param => {
    const { pagination } = this.state;
    this.param = {
      ...param,
      pageInfo: {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      },
    };
    this.getServerData();
  };

  getServerData = () => {
    const { dispatch } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'creativeIdeaManage/qryCreativeInfoList',
      payload: this.param,
    }).then(res => {
      console.log('返回值', res);
      this.setState({
        loading: false,
      });
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          dataSource: res.svcCont.data,
          pagination: {
            current: res.svcCont.pageInfo.pageNum, // 当前页数
            pageSize: 10, // 每页条数
            total: res.svcCont.pageInfo.total, // 数据总数
          },
        });
      } else {
        message.error('获取创意列表失败');
      }
    });
  };

  // 编辑创意
  handleEdit = obj => {
    let document = '';
    if (obj.templateInfoType === '1') {
      document = <ImgCreative handleCancel={this.handleCancel} updateParam={obj} isEdit />;
    } else if (obj.templateInfoType === '2') {
      document = <TxtCreative handleCancel={this.handleCancel} updateParam={obj} isEdit />;
    } else if (obj.templateInfoType === '3') {
      document = <HtmlCreative handleCancel={this.handleCancel} updateParam={obj} isEdit />;
    }
    this.setState({
      typeDocument: document,
      visible: true,
    });
  };

  onChange = page => {
    console.log('分页', page);
    const { pagination } = this.state;
    this.setState({
      pagination: {
        ...pagination,
        current: page.current,
      },
    });
    this.getServerData();
  };

  // 查看创意关联商品
  triggerRow = creativeInfoId => {
    const { expandedRowKeys } = this.state;
    const element = expandedRowKeys.find(e => e === creativeInfoId);
    this.setState(
      {
        expandedRowKeys: element ? [] : [creativeInfoId],
      },
      this.getAssoList,
    );
  };

  // 查看创意关联商品
  getAssoList = (pageNum = 1) => {
    const { dispatch } = this.props;
    const { expandedRowKeys } = this.state;
    if (!expandedRowKeys.length) return;
    dispatch({
      type: 'creativeIdeaManage/qryOffersInfo',
      payload: {
        pageInfo: {
          pageNum,
          pageSize: 99,
        },
        creativeInfoIds: [expandedRowKeys[0]],
        offerStatueList: ['A'],
        creativeOfferId: expandedRowKeys[0],
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        console.log(res);
        // this.setState({
        //   assoList: res.svcCont.data,
        // });
      }
    });
  };

  // 关闭修改弹窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    this.getServerData();
  };

  render() {
    const { dataSource, pagination, loading, expandedRowKeys, visible, typeDocument } = this.state;
    return (
      <Fragment>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          expandedRowRender={this.expandedRowRender}
          expandIcon={() => null}
          rowKey="id"
          expandedRowKeys={expandedRowKeys}
          className="assoTable"
          onChange={this.onChange}
        />
        <Modal
          title="编辑创意"
          width="80%"
          visible={visible}
          footer={false}
          onCancel={this.handleCancel}
          destroyOnClose
        >
          {typeDocument}
        </Modal>
      </Fragment>
    );
  }
}

export default CreativeTable;
