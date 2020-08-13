import React, { Component } from 'react';
import { Button, Card, Divider, message, Popconfirm, Table } from 'antd';
import WorkOrderModal from './component/WorkOrderModal';

const stateCode = {
  1000: '待派发',
  2000: '已派发',
  3000: '已处理',
};
class DailyWorkOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableLoading: true, // 表格loading效果
      index: 2, // 当前要生成表格数据的index
      total: 2, // 数据总量
      visible: false, // 弹窗
      orderData: {}, // 当前选择的任务单的数据
      // 表格数据
      tableData: [
        {
          id: '0',
          cityName: '济南市',
          districtName: '天桥区',
          taskName: '双v会员推送',
          workDetail: '双v会员流量大放送',
          executive: '李斯',
          state: '3000',
          startDate: '2020-01-03 14:05',
          endDate: '2020-01-24 16:23',
          createDate: '2020-01-01 14:12',
        },
        {
          id: '1',
          cityName: '济南市',
          districtName: '商河县',
          taskName: '流量定制',
          workDetail: '流量专属定制',
          executive: '张山',
          state: '1000',
          startDate: '2020-02-03 11:18',
          endDate: '2020-04-24 20:15',
          createDate: '2020-02-27 08:32',
        },
      ],
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        tableLoading: false,
      });
    }, 1000);
  }

  // 设置工单数据
  setOrderData = data => {
    this.setState(
      {
        tableLoading: true,
      },
      () => {
        const { id } = data;
        const { tableData, index } = this.state;
        if (id) {
          // 存在id即为编辑
          const findDataIndex = tableData.findIndex(value => value.id === data.id);
          if (findDataIndex !== -1) {
            tableData[findDataIndex] = data;
            setTimeout(() => {
              this.setState({
                tableLoading: false,
                tableData,
              });
              message.success('操作成功');
            }, 1000);
          } else {
            setTimeout(() => {
              this.setState({
                tableLoading: false,
              });
              message.error('操作失败');
            }, 1000);
          }
        } else {
          // 不存在id即为新增
          tableData.push({ ...data, id: index });
          setTimeout(() => {
            this.setState({
              tableData,
              index: index + 1,
              tableLoading: false,
            });
          }, 1000);
        }
      },
    );
  };

  // 设置弹窗显示
  setVisible = visible => {
    this.setState({
      visible,
    });
  };

  // 回收工单
  setOrderState = (data, state) => {
    this.setOrderData({
      ...data,
      state,
    });
  };

  // 删除工单
  deleteOrder = data => {
    this.setState(
      {
        tableLoading: true,
      },
      () => {
        const { tableData } = this.state;
        const findDataIndex = tableData.findIndex(value => value.id === data.id);
        if (findDataIndex !== -1) {
          tableData.splice(findDataIndex, 1);
          setTimeout(() => {
            message.success('删除成功');
            this.setState({
              tableLoading: false,
              tableData,
            });
          }, 1000);
        } else {
          setTimeout(() => {
            message.error('删除失败');
            this.setState({
              tableLoading: false,
            });
          }, 1000);
        }
      },
    );
  };

  render() {
    const { tableData, tableLoading, total, visible, orderData } = this.state;
    // 右上操作按钮
    const rightInput = (
      <div>
        <Button
          className="dropdown-style"
          size="small"
          type="primary"
          onClick={() => {
            this.setState({
              orderData: '',
              visible: true,
            });
          }}
        >
          新增
        </Button>
      </div>
    );
    const columns = [
      {
        title: '地市',
        dataIndex: 'cityName',
      },
      {
        title: '区县',
        dataIndex: 'districtName',
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
      },
      {
        title: '工作内容',
        dataIndex: 'workDetail',
      },
      {
        title: '执行人',
        dataIndex: 'executive',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: text => stateCode[text],
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '操作',
        render: (text, record) => {
          let content;
          if (record.state === '1000') {
            content = (
              <>
                <a
                  onClick={() => {
                    this.setState({
                      visible: true,
                      orderData: record,
                    });
                  }}
                >
                  编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="是否派发该工单"
                  onConfirm={() => {
                    this.setOrderState(record, '2000');
                  }}
                >
                  <a>派发</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="是否删除该工单"
                  onConfirm={() => {
                    this.deleteOrder(record);
                  }}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            );
          } else if (record.state === '2000') {
            content = (
              <Popconfirm
                title="是否回收该工单"
                onConfirm={() => {
                  this.setOrderState(record, '1000');
                }}
              >
                <a>回收</a>
              </Popconfirm>
            );
          } else {
            content = <span className="operate-disable">编辑</span>;
          }
          return <div>{content}</div>;
        },
      },
    ];
    // 分页器props
    const pagination = {
      total,
      showQuickJumper: true,
      showSizeChanger: true,
    };

    return (
      <Card title="日常工单任务" extra={rightInput}>
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey="id"
          dataSource={tableData}
          pagination={pagination}
        />
        {visible && (
          <WorkOrderModal
            setVisible={this.setVisible}
            setData={this.setOrderData}
            orderData={orderData}
          />
        )}
      </Card>
    );
  }
}

export default DailyWorkOrder;
