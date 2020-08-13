import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Popconfirm } from 'antd';
import style from '../index.less';

const { Column } = Table;

const mapStateToProps = ({ configDetail, eventManageComm, loading }) => ({
  eventItme: eventManageComm.itemDetail,
  pageInfo: configDetail.inputSrcPageInfo,
  inputSrcListData: configDetail.inputSrcListData,
  forceGetInputSrcList: configDetail.forceGetInputSrcList,
  loading: loading.effects['configDetail/getInputSrcListEffect'],
});

function InputAttr(props) {
  const {
    dispatch,
    eventItme,
    pageInfo = {},
    inputSrcListData = [],
    forceGetInputSrcList,
    loading,
  } = props;
  const { pageNum, pageSize, total } = pageInfo;

  // 处理是否显示输入源 Modal
  function handleShowEventModal(bool) {
    dispatch({
      type: 'configDetail/handleShowEventModal',
      payload: bool,
    });
  }

  // 改变页码信息
  function changePageInfo(num, size) {
    dispatch({
      type: 'configDetail/changeInputSrcPageInfo',
      payload: {
        pageNum: num,
        pageSize: size,
      },
    });
  }

  // 获取输入源列表数据
  function getInputSrcList(params) {
    const defaultParams = {
      eventId: eventItme.id,
      pageInfo: {
        pageNum,
        pageSize,
      },
    };

    dispatch({
      type: 'configDetail/getInputSrcListEffect',
      payload: { ...defaultParams, ...params },
    });
  }

  // 处理删除
  async function handleDelete(row) {
    // ...code
    await dispatch({
      type: 'configDetail/deleteInputSrc',
      payload: {
        inputId: row.id,
        eventId: eventItme.id,
      },
    });

    // 获取列表数据
    getInputSrcList();
  }

  // 获取输入属性列表数据
  useEffect(() => {
    if (forceGetInputSrcList) {
      getInputSrcList();
    }
  }, [pageNum, pageSize, forceGetInputSrcList]);

  return (
    <div className={style.inputSrc}>
      <div className={style.inputSearch}>
        <Button
          size="small"
          type="primary"
          onClick={() => {
            handleShowEventModal(true);
          }}
        >
          新增事件
        </Button>
      </div>
      <Table
        loading={loading}
        size="middle"
        rowKey={record => record.id}
        dataSource={inputSrcListData}
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
        <Column title="名称" dataIndex="name" key="name" />
        <Column title="编码" dataIndex="code" key="code" />
        <Column title="连接类型" dataIndex="inputType" key="inputType" />
        <Column title="创建时间" dataIndex="createTime" key="createTime" />
        <Column title="状态" dataIndex="statusCd" key="statusCd" />
        <Column
          title="操作"
          key="action"
          render={(_, record) => (
            <Fragment>
              <Popconfirm
                title="确定删除？"
                onConfirm={() => {
                  handleDelete(record);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
              ,
            </Fragment>
          )}
        />
      </Table>
    </div>
  );
}

export default connect(mapStateToProps)(InputAttr);
