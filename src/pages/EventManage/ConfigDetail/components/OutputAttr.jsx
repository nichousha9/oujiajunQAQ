import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Divider, Popconfirm, message } from 'antd';
import OutputAttrDetail from './OutputAttrDetail';
import style from '../index.less';

const { Column } = Table;

const mapStateToProps = ({ configDetail, eventManageComm, loading }) => ({
  isShowOutputAttrForm: configDetail.isShowOutputAttrForm,
  eventItme: eventManageComm.itemDetail,
  pageInfo: configDetail.outputAttrPageInfo,
  outputAttrListData: configDetail.outputAttrListData,
  forceGetOutputAttrList: configDetail.forceGetOutputAttrList,
  outputAttrSearchVal: configDetail.outputAttrSearchVal,
  eventOutputDetail: configDetail.eventOutputDetail,
  loading: loading.effects['configDetail/getOutputAttrListEffect'],
});

function OutputAttr(props) {
  const {
    dispatch,
    isShowOutputAttrForm,
    eventItme,
    pageInfo = {},
    outputAttrListData = [],
    forceGetOutputAttrList,
    outputAttrSearchVal,
    eventOutputDetail,
    loading,
  } = props;
  const { pageNum, pageSize, total } = pageInfo;
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); // 表格展开项

  // 设置展开项
  function handleExpandedRow(key) {
    setExpandedRowKeys([key]);
  }

  // 处理输出属性详情表单显示形式
  function handleShowOutputAtrrForm(type) {
    dispatch({
      type: 'configDetail/handleShowOutputAtrrForm',
      payload: type,
    });
  }

  // 存当前项详情数据
  function saveOutputAttrItemDetail(record) {
    dispatch({
      type: 'configDetail/saveOutputAttrItemDetail',
      payload: record,
    });
  }

  // 处理编辑表格项
  function handleEdit(row) {
    // 设置展开项
    handleExpandedRow(row.id);

    // 设置表单显示形式
    handleShowOutputAtrrForm('edit');

    // 保存当前项详情数据
    saveOutputAttrItemDetail(row);
  }

  // 处理显示新增表单 Modal
  function handleShowAddForm() {
    if (isShowOutputAttrForm !== 'edit') {
      handleShowOutputAtrrForm('add');
    }
  }

  // 改变页码信息
  function changePageInfo(num, size) {
    dispatch({
      type: 'configDetail/changeOutputAttrPageInfo',
      payload: {
        pageNum: num,
        pageSize: size,
      },
    });
  }

  // 获取输出属性列表数据
  function getOutputAttrList(params) {
    const defaultParams = {
      eventId: eventItme.id,
      pageInfo: {
        pageNum: pageNum || 1,
        pageSize,
      },
    };
    if (outputAttrSearchVal) {
      defaultParams.name = outputAttrSearchVal;
    }

    dispatch({
      type: 'configDetail/getOutputAttrListEffect',
      payload: { ...defaultParams, ...params },
    });
  }

  // 处理删除
  async function handleDelete(row) {
    // ...code
    await dispatch({
      type: 'configDetail/deleteOutputAttr',
      payload: {
        id: row.id,
        statusCd: '1000',
      },
    });

    // 获取列表数据
    getOutputAttrList();
  }

  // 改变搜索值
  function changeOutputAttrSearchVal(val) {
    dispatch({
      type: 'configDetail/changeOutputAttrSearchVal',
      payload: val,
    });
  }

  // 处理搜索
  function handleSearchOutputAttr(val) {
    // 改变页码数
    changePageInfo(1, pageSize);
    // 改变搜索值
    changeOutputAttrSearchVal(val);
  }

  // 获取输出属性列表数据
  useEffect(() => {
    if (forceGetOutputAttrList) {
      getOutputAttrList();
    }
  }, [pageNum, pageSize, outputAttrSearchVal, forceGetOutputAttrList]);

  return (
    <div className={style.outputAttr}>
      <div className={style.inputSearch}>
        <Popconfirm
          title="正在编辑项，继续操作将丢失未保存的信息，确定继续？"
          onConfirm={() => {
            handleShowOutputAtrrForm('add');
          }}
          okText="确定"
          cancelText="取消"
          disabled={isShowOutputAttrForm !== 'edit'}
        >
          <Button
            size="small"
            type="primary"
            onClick={() => {
              if (!eventOutputDetail.id) {
                message.error('请先设置格式配置');
              } else {
                saveOutputAttrItemDetail({});
                handleShowAddForm();
              }
              return undefined;
            }}
          >
            新增
          </Button>
        </Popconfirm>
        &nbsp;&nbsp;
        <Input.Search size="small" onSearch={handleSearchOutputAttr} />
      </div>
      <Table
        loading={loading}
        size="middle"
        expandIconAsCell={false}
        expandIconColumnIndex={-1}
        rowKey={record => record.id}
        expandedRowRender={() => <OutputAttrDetail />}
        expandedRowKeys={
          isShowOutputAttrForm == 'edit' || isShowOutputAttrForm == 'readonly'
            ? expandedRowKeys
            : []
        }
        dataSource={outputAttrListData}
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
        <Column title="属性名称" dataIndex="name" key="name" />
        <Column title="属性编码" dataIndex="code" key="code" />
        <Column
          title="是否为空"
          dataIndex="isNull"
          render={text => (text == 'Y' ? '是' : '否')}
          key="isNull"
        />
        <Column title="序列" dataIndex="lineSequence" key="lineSequence" />
        <Column
          title="数组类型"
          dataIndex="isArray"
          render={text => (text == 'Y' ? '是' : '否')}
          key="isArray"
        />
        <Column title="长度" dataIndex="length" key="length" />
        <Column
          title="关键"
          dataIndex="isKey"
          render={text => (text == 'Y' ? '是' : '否')}
          key="isKey"
        />
        <Column
          title="操作"
          key="action"
          render={(_, record) => (
            <Fragment>
              <a
                onClick={() => {
                  handleEdit(record);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
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

export default connect(mapStateToProps)(OutputAttr);
