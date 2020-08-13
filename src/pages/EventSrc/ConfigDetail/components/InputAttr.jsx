import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Divider, Popconfirm } from 'antd';
import InputAttrDetail from './InputAttrDetail';
import style from '../index.less';

const { Column } = Table;

const mapStateToProps = ({ srcConfigDetail, eventSrcComm, loading }) => ({
  isShowInputAttrForm: srcConfigDetail.isShowInputAttrForm,
  eventItme: eventSrcComm.itemDetail,
  pageInfo: srcConfigDetail.inputAttrPageInfo,
  inputAttrListData: srcConfigDetail.inputAttrListData,
  forceGetInputAttrList: srcConfigDetail.forceGetInputAttrList,
  inputAttrSearchVal: srcConfigDetail.inputAttrSearchVal,
  loading: loading.effects['srcConfigDetail/getInputAttrListEffect'],
});

function InputAttr(props) {
  const {
    dispatch,
    isShowInputAttrForm,
    eventItme,
    pageInfo = {},
    inputAttrListData = [],
    forceGetInputAttrList,
    inputAttrSearchVal,
    loading,
  } = props;
  const { pageNum, pageSize, total } = pageInfo;
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); // 表格展开项

  // 设置展开项
  function handleExpandedRow(key) {
    setExpandedRowKeys([key]);
  }

  // 处理输入属性详情表单显示形式
  function handleShowInputAtrrForm(type) {
    dispatch({
      type: 'srcConfigDetail/handleShowInputAtrrForm',
      payload: type,
    });
  }

  // 存当前项详情数据
  function saveInputAttrItemDetail(record) {
    dispatch({
      type: 'srcConfigDetail/saveInputAttrItemDetail',
      payload: record,
    });
  }

  // 处理编辑表格项
  function handleEdit(row) {
    // 设置展开项
    handleExpandedRow(row.id);

    // 设置表单显示形式
    handleShowInputAtrrForm('edit');

    // 保存当前项详情数据
    saveInputAttrItemDetail(row);
  }

  // 处理显示新增表单 Modal
  function handleShowAddForm() {
    if (isShowInputAttrForm !== 'edit') {
      handleShowInputAtrrForm('add');
    }
  }

  // 改变页码信息
  function changePageInfo(num, size) {
    dispatch({
      type: 'srcConfigDetail/changeInputAttrPageInfo',
      payload: {
        pageNum: num,
        pageSize: size,
      },
    });
  }

  // 获取输入属性列表数据
  function getInputAttrList(params) {
    const defaultParams = {
      inputId: eventItme.id,
      name: inputAttrSearchVal,
      pageInfo: {
        pageNum,
        pageSize,
      },
    };

    dispatch({
      type: 'srcConfigDetail/getInputAttrListEffect',
      payload: { ...defaultParams, ...params },
    });
  }

  // 处理删除
  async function handleDelete(row) {
    // ...code
    await dispatch({
      type: 'srcConfigDetail/deleteInputAttr',
      payload: {
        id: row.id,
        statusCd: '1000',
      },
    });

    // 获取列表数据
    getInputAttrList();
  }

  // 改变搜索值
  function changeInputAttrSearchVal(val) {
    dispatch({
      type: 'srcConfigDetail/changeInputAttrSearchVal',
      payload: val,
    });
  }

  // 处理搜索
  function handleSearchInputAttr(val) {
    // 改变页码数
    changePageInfo(1, pageSize);
    // 改变搜索值
    changeInputAttrSearchVal(val);
  }

  // 获取输入属性列表数据
  useEffect(() => {
    if (forceGetInputAttrList) {
      getInputAttrList();
    }
  }, [pageNum, pageSize, inputAttrSearchVal, forceGetInputAttrList]);

  return (
    <div className={style.inputAttr}>
      <div className={style.inputSearch}>
        <Popconfirm
          title="正在编辑项，继续操作将丢失未保存的信息，确定继续？"
          onConfirm={() => {
            handleShowInputAtrrForm('add');
          }}
          okText="确定"
          cancelText="取消"
          disabled={isShowInputAttrForm !== 'edit'}
        >
          <Button
            size="small"
            type="primary"
            onClick={() => {
              saveInputAttrItemDetail({});
              handleShowAddForm();
            }}
          >
            新增
          </Button>
        </Popconfirm>
        &nbsp;&nbsp;
        <Input.Search size="small" onSearch={handleSearchInputAttr} />
      </div>
      <Table
        loading={loading}
        size="middle"
        expandIconAsCell={false}
        expandIconColumnIndex={-1}
        rowKey={record => record.id}
        expandedRowRender={() => <InputAttrDetail />}
        expandedRowKeys={
          isShowInputAttrForm == 'edit' || isShowInputAttrForm == 'readonly' ? expandedRowKeys : []
        }
        dataSource={inputAttrListData}
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
        <Column
          title="是否为空"
          dataIndex="isNull"
          render={text => (text == 'Y' ? '是' : '否')}
          key="isNull"
        />
        <Column title="序列" dataIndex="lineSequence" key="lineSequence" />
        <Column title="数组分隔符" dataIndex="dataSeparateSymbol" key="dataSeparateSymbol" />
        <Column title="字符串" dataIndex="str" key="str" />
        <Column
          title="数组类型"
          dataIndex="isArray"
          render={text => (text == 'Y' ? '是' : '否')}
          key="isArray"
        />
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

export default connect(mapStateToProps)(InputAttr);
