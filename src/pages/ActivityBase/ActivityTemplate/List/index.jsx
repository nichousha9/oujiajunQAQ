import React from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Input, Button, Popconfirm } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';

const { Search } = Input;

@connect(({ loading }) => ({
  loading: loading.effects['ActivityTemplateList/qryContactList'],
}))
@Form.create()
class ActivityTemplateList extends React.Component {
  columns = [
    {
      title: 'ID',
      dataIndex: 'modelId',
      key: 'modelId',
    },
    {
      title: formatMessage({ id: 'activityTemplate.modelName' }), // '模板名称',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: formatMessage({ id: 'activityTemplate.camType' }), // '模板类型',
      dataIndex: 'camType',
      key: 'camType',
    },
    {
      title: formatMessage({ id: 'activityTemplate.modelStatus' }), // '模板状态',
      dataIndex: 'statusCd',
      key: 'statusCd',
    },
    {
      title: formatMessage({ id: 'common.table.action' }), // '操作',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px' }}>
          <a
            onClick={() => {
              this.startModel(record.modelId, record.statusCd === '启动'? 1000: 1100);
            }}
          >
            {record.statusCd === '启动'? '失效': '启动'}
          </a>
          <Link
            to={{
              pathname: '/activityBase/templateDetail',
              query: {
                modelId: record.modelId,
                view: true,
              }
            }}
          >
            {formatMessage({ id: 'common.table.action.detail' })}
          </Link>
          <Link
            to={{
              pathname: '/activityBase/templateDetail',
              query: {
                modelId: record.modelId
              }
            }}
          >
            {formatMessage({ id: 'common.table.action.edit' })}
          </Link>
          <Popconfirm 
            title={formatMessage({ id: 'common.title.isConfirmDelete' })} 
            okText={formatMessage(
              {
                id: 'channelOperation.channel.confirm',
                defaultMessage: '确定',
              }
            )}
            cancelText={formatMessage(
              {
                id: 'channelOperation.channel.cancel',
                defaultMessage: '取消',
              }
            )}
            onConfirm={() => this.deleteModel(record.modelId)}
          >
            <a>{formatMessage({ id: 'common.table.action.delete' })}</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 列表
      pageNum: 1,
      pageSize: 10,
      pageInfo: {}, // 后端的返回
      name: '',
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  startModel = (modelId, statusCd) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ActivityTemplateList/startModel',
      payload: {
        modelId,
        statusCd
      },
      success: () => {
        this.fetchList();
      }
    });
  };

  deleteModel = modelId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ActivityTemplateList/delteModel',
      payload: {
        modelId,
      },
      success: () => {
        this.fetchList();
      }
    });
  };

  // 获取数据
  fetchList = () => {
    const { dispatch } = this.props;
    const { pageNum, pageSize, name } = this.state;
    dispatch({
      type: 'ActivityTemplateList/qryContactList',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
        name,
      },
      success: svcCont => {
        const { data, pageInfo } = svcCont;
        this.setState({
          data,
          pageInfo: {
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
          },
        });
      },
    });
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.fetchList,
    );
  };

  getSearchValue = e => {
    const {value} = e.target;
    this.setState({ name: value });
  };

  render() {
    const { loading } = this.props;
    const { data, pageInfo } = this.state;

    const topRightDiv = (
      <div>
        <Button type="primary" size="small">
          <Link to="/activityBase/templateDetail">{formatMessage({ id: 'common.btn.new' })}</Link>
        </Button>
        <Search
          size="small"
          placeholder={formatMessage({ id: 'activityTemplate.searchTempleteName' })}
          onSearch={() => {
            this.setState({ pageNum: 1 }, this.fetchList);
          }}
          onChange={value => this.getSearchValue(value)}
          className="filter-input"
        />
      </div>
    );

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Card size="small" title={formatMessage({ id: 'activityTemplate.listTitle' })} extra={topRightDiv}>
        <Table
          rowKey="modelId"
          dataSource={data}
          columns={this.columns}
          pagination={pagination}
          loading={loading}
          onChange={this.onChange}
        />
      </Card>
    );
  }
}

export default ActivityTemplateList;
