import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Table, Input } from 'antd';
import style from '../index.less';

const { Column } = Table;

const mapStateToProps = ({ srcConfigDetail, eventSrcComm, loading }) => ({
  eventItem: eventSrcComm.itemDetail,
  pageInfo: eventSrcComm.logPageInfo,
  listData: eventSrcComm.logListData,
  logSearchVal: srcConfigDetail.logSearchVal,
  loading: loading.effects['srcConfigDetail/getLogListEffect'],
});

function InputAttr(props) {
  const { eventItem, pageInfo = {}, listData, logSearchVal, loading, dispatch } = props;
  const { pageNum, pageSize, total } = pageInfo;

  // 获取日志列表数据
  function getInputAttrList(params) {
    const defaultParams = {
      inputId: eventItem.id,
      name: logSearchVal,
      pageInfo: {
        pageNum,
        pageSize,
      },
    };

    dispatch({
      type: 'srcConfigDetail/getLogListEffect',
      payload: { ...defaultParams, ...params },
    });
  }

  // 改变页码信息
  function changePageInfo(num, size) {
    dispatch({
      type: 'srcConfigDetail/changeLogPageInfo',
      payload: {
        pageNum: num,
        pageSize: size,
      },
    });
  }

  // 改变搜索值
  function changeLogSearchVal(val) {
    dispatch({
      type: 'srcConfigDetail/changeLogSearchVal',
      payload: val,
    });
  }

  // 处理搜索
  function handleSearch(val) {
    // 改变页码信息
    changePageInfo(1, pageSize);
    // 更改搜索值
    changeLogSearchVal(val);
  }

  // 获取日志列表数据
  useEffect(() => {
    getInputAttrList();
  }, [pageNum, pageSize, logSearchVal]);

  return (
    <div className={style.detailLog}>
      <Input.Search className={style.inputSearch} size="small" onSearch={handleSearch} />
      <Table
        loading={loading}
        size="middle"
        dataSource={listData}
        pagination={{
          current: pageNum,
          defaultPageSize: pageSize,
          pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          size: 'small',
          total,
          onChange: changePageInfo,
          onShowSizeChange: changePageInfo,
        }}
      >
        <Column title="文件名称" dataIndex="name" key="name" />
        <Column title="创造事件" dataIndex="event" key="event" />
        <Column title="开始时间" dataIndex="startTime" key="startTime" />
        <Column title="状态" dataIndex="state" key="state" />
        <Column title="描述" dataIndex="desc" key="desc" />
      </Table>
    </div>
  );
}

export default connect(mapStateToProps)(InputAttr);
