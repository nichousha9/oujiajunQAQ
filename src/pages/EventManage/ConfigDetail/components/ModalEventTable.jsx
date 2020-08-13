import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

const { Column } = Table;

const mapStateToProps = ({ configDetail, loading }) => ({
  eventSrcPageInfo: configDetail.eventSrcPageInfo,
  eventSrcList: configDetail.eventSrcList,
  eventSrcSelectedRowKeys: configDetail.eventSrcSelectedRowKeys,
  tableLoading: loading.effects['configDetail/getEventSrcList'],
});

function ModalEventTable(props) {
  const {
    eventSrcPageInfo = {},
    eventSrcList,
    tableLoading,
    eventSrcSelectedRowKeys = [],
    dispatch,
  } = props;
  const { pageNum, pageSize, total } = eventSrcPageInfo;

  // 改变页码信息
  function changePageInfo(num, size) {
    dispatch({
      type: 'configDetail/changeEventSrcPageInfo',
      payload: {
        pageNum: num,
        pageSize: size,
        total,
      },
    });
  }

  // 获取事件源列表数据
  function getEventSrcList(params) {
    const defaultParams = {
      statusCd: '1000',
      pageInfo: {
        pageNum,
        pageSize,
      },
    };

    dispatch({
      type: 'configDetail/getEventSrcList',
      payload: { ...defaultParams, ...params },
    });
  }

  // 处理表格选中项改变
  function handleSelectedChange(selected) {
    dispatch({
      type: 'configDetail/setEventSrcSelectedRowKeys',
      payload: selected,
    });
  }

  // 获取事件源列表数据
  useEffect(() => {
    getEventSrcList();
  }, [pageNum, pageSize]);

  // 组件销毁时，清空选中项
  useEffect(() => {
    return handleSelectedChange([]);
  }, []);

  return (
    <Table
      loading={tableLoading}
      dataSource={eventSrcList}
      rowKey={record => record.id}
      size="middle"
      pagination={{
        current: pageNum,
        size: 'small',
        pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '30', '40'],
        onChange: changePageInfo,
        onShowSizeChange: changePageInfo,
      }}
      rowSelection={{
        eventSrcSelectedRowKeys,
        onChange: handleSelectedChange,
      }}
    >
      <Column title="名称" dataIndex="name" key="name" />
      <Column title="编码" dataIndex="code" key="code" />
      <Column title="状态" dataIndex="statusCd" key="statusCd" />
      <Column title="连接类型" dataIndex="inputType" key="inputType" />
      <Column title="创建时间" dataIndex="createTime" key="createTime" />
    </Table>
  );
}

export default connect(mapStateToProps)(ModalEventTable);
