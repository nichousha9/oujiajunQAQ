import React from 'react';
import { Button, Card, Input, Table, Tooltip } from 'antd';
import { connect } from 'dva';
import RulesModal from '@/pages/DistributionRules/components/RulesModal';

@connect(({ loading, distributionRules }) => ({
  tableLoading:
    loading.effects['distributionRules/selectDispatchRules'] ||
    loading.effects['distributionRules/delDispatchRules'],
  ORDER_CREATE_TYPE: distributionRules.ORDER_CREATE_TYPE,
}))
class DistributionRules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      ruleName: '', // 搜索框输入的规则名
      visibleModal: false, // 是否展示痰喘
      id: '', // 当前查看详情的规则id
    };
  }

  componentDidMount() {
    this.fetchData();
    this.qryAttrValueByCode();
  }

  // 请求表格数据
  fetchData = () => {
    const { dispatch } = this.props;
    const { pageInfo, ruleName } = this.state;
    dispatch({
      type: 'distributionRules/selectDispatchRules',
      payload: {
        pageInfo,
        ruleName,
      },
      success: svcCont => {
        const {
          data = [],
          pageInfo: { total = 0 },
        } = svcCont;
        this.setState({
          tableData: data,
          total,
          id: '', // 清空id
        });
      },
    });
  };

  // 查询静态字段
  qryAttrValueByCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'distributionRules/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'ORDER_CREATE_TYPE',
      },
    });
  };

  // 处理搜索
  handleSearch = (ruleName, e) => {
    // 如果点击的不是搜索图标，阻止事件, 防止清除和搜索事件冲突
    if (e.target.nodeName === 'INPUT') return;
    this.setState(
      {
        ruleName,
      },
      this.fetchData,
    );
  };

  // 改变分页信息
  changePageInfo = (pageNum, pageSize) => {
    this.setState(
      {
        pageInfo: {
          pageNum,
          pageSize,
        },
      },
      this.fetchData,
    );
  };

  // 改变弹窗展示
  changeVisibleModal = visibleModal => {
    this.setState({
      visibleModal,
    });
  };

  // 查看详情
  seeDetail = ({ id = '' }) => {
    this.setState({
      id,
      visibleModal: true,
    });
  };

  // 删除规则
  deleteRule = record => {
    const { dispatch } = this.props;
    const { id } = record;
    if (id) {
      dispatch({
        type: 'distributionRules/delDispatchRules',
        payload: {
          id,
        },
        success: this.fetchData,
      });
    }
  };

  render() {
    const { tableLoading } = this.props;
    const { pageInfo, total, tableData, visibleModal, id } = this.state;
    const columns = [
      {
        title: '规则编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '规则名称',
        dataIndex: 'ruleName',
      },
      // {
      //   title: '规则类型',
      //   dataIndex: 'ruleType',
      // },
      {
        title: '创建人',
        dataIndex: 'createdName',
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
      },
      {
        title: '最后修改时间',
        dataIndex: 'updateDate',
      },
      {
        title: '派发规则',
        dataIndex: 'dispatchRules',
        render: text => {
          const { ORDER_CREATE_TYPE = {} } = this.props;
          // 1000 优先派发客户经理  2000 优先派发网格经理
          const dispatchRules = ORDER_CREATE_TYPE[text];
          return (
            <div className="text-ellipsis">
              <Tooltip title={dispatchRules} placement="bottom">
                {dispatchRules}
              </Tooltip>
            </div>
          );
        },
      },
      {
        title: '操作',
        render: record => (
          <>
            <Button
              type="link"
              size="small"
              onClick={() => {
                this.seeDetail(record);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                this.deleteRule(record);
              }}
            >
              删除
            </Button>
          </>
        ),
      },
    ];
    // 分页器props
    const pagination = {
      total,
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.changePageInfo,
      onShowSizeChange: this.changePageInfo,
    };
    // 右上操作区
    const inputSearch = (
      <div>
        <Input.Search
          allowClear
          className="filter-input"
          size="small"
          placeholder="搜索规则名"
          onSearch={this.handleSearch}
        />
        <Button
          className="dropdown-style"
          size="small"
          type="primary"
          onClick={() => {
            this.changeVisibleModal(true);
          }}
        >
          新增
        </Button>
      </div>
    );
    return (
      <Card title="规则管理" extra={inputSearch}>
        <Table
          loading={!!tableLoading}
          rowKey="id"
          dataSource={tableData}
          columns={columns}
          pagination={pagination}
        />
        {visibleModal && (
          <RulesModal id={id} setVisible={this.changeVisibleModal} fetchData={this.fetchData} />
        )}
      </Card>
    );
  }
}

export default DistributionRules;
