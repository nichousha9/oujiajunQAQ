/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Row, Col, message, Table, Modal, Form, Button, Popover, Pagination } from 'antd';
import { connect } from 'dva';
// import {getQueryVariable} from '../../utils/utils'

@connect(({ knowledgeSupplement }) => ({
  knowledgeSupplement,
}))
class NetPubSpecialtySelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //   data: [],
      // pageNum: 1,
      // pageSize: 10,
    };
  }

  componentDidMount = () => {};

  // componentWillReceiveProps = nextProps => {
  //   const { batchId, detailType } = nextProps;
  //   if (detailType !== this.props.detailType) {
  //     this.queryList(batchId, detailType);
  //   }
  // };

  // onPageChange = (pageNum, pageSize) => {
  //   this.setState({ pageNum, pageSize }, () => {
  //     this.queryList();
  //   });
  // };

  // queryList = (batchId, detailType) => {
  //   const { dispatch } = this.props;
  //   const { pageNum, pageSize } = this.state;
  //   if (detailType === 2) {
  //     dispatch({
  //       type: 'knowledgeSupplement/qryInsertErrorByFileList',
  //       payload: {
  //         batchId,
  //         pageInfo: {
  //           pageNum,
  //           pageSize,
  //         },
  //       },
  //     });
  //   }
  //   if (detailType === 3) {
  //     dispatch({
  //       type: 'knowledgeSupplement/qryInsertErrorByInterfaceList2',
  //       payload: {
  //         batchId,
  //         pageInfo: {
  //           pageNum,
  //           pageSize,
  //         },
  //       },
  //     });
  //   }
  // };

  reImport = (ids) => {
    // const { selectedRows1,selectedRows2 } = this.state
    // console.log('batchId',batchId)
    const { dispatch } = this.props;
    dispatch({
      type: 'knowledgeSupplement/reimport',
      payload: {
        // count: 8,
        ids: [ids],
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('重新导入成功');
      }
    });
  };

  handleOk = () => {
    const { changeVisible } = this.props;
    if (changeVisible) {
      changeVisible(false);
    }
  };

  handleCancel = () => {
    const { changeVisible } = this.props;

    if (changeVisible) {
      changeVisible(false);
    }
  };

  handleTableChange = (pageNum = 1, pageSize) => {
    const { batchId, detailType, dispatch } = this.props;
    if (detailType === 2) {
      dispatch({
        type: 'knowledgeSupplement/qryInsertErrorByFileList',
        payload: {
          batchId,
          pageInfo: {
            pageNum,
            pageSize: 10,
          },
        },
      });
    }
    if (detailType === 3) {
      dispatch({
        type: 'knowledgeSupplement/qryInsertErrorByInterfaceList2',
        payload: {
          batchId,
          pageInfo: {
            pageNum,
            pageSize: 10,
          },
        },
      });
    }
    // const pager = { ...this.state.pagination };
    // pager.current = pagination.current;
    // this.setState({
    //   pagination: pager,
    // });
    // this.fetch({
    //   results: pagination.pageSize,
    //   page: pagination.current,
    //   sortField: sorter.field,
    //   sortOrder: sorter.order,
    //   ...filters,
    // });
  };

  render() {
    const { visible, detailType } = this.props;

    const columns = [
      {
        title: '知识名称',
        dataIndex: 'question',
        width: 250,
        ellipsis: true,
        render: (text) => (
          <Popover content={text}>
            <span
              style={{
                width: '250px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {text}
            </span>
          </Popover>
        ),
      },
      {
        title: '导入知识库',

        dataIndex: 'kdbName',
      },
      {
        title: '开始时间',
        width: 200,
        dataIndex: 'begintime',
      },

      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.reImport(record.errorId)}>重新导入</a>
          </span>
        ),
      },
    ];

    const { knowledgeSupplement = {} } = this.props;
    const { faceList2 = {}, errorFileList = {} } = knowledgeSupplement;

    // const paginationInfo1 = {
    //   pageSize: faceList2.pageSize || 10,
    //   total: faceList2.total || 0,
    //   onChange: this.onPageChange3,
    // };

    // const paginationInfo2 = {
    //   pageSize: errorFileList.pageSize || 10,
    //   total: errorFileList.total || 0,
    //   onChange: this.onPageChange,
    // };

    // const rowSelection = {
    //   type: 'radio',
    //   onChange: (changeSelectedRowKeys, selectedRows) => {
    //     this.setState({
    //       selectedRows,
    //       selectedRowKeys: changeSelectedRowKeys,
    //     });
    //   },
    //   selectedRowKeys,
    //   // hideDefaultSelections: true,
    // };
    //
    // const paginationInfo = {
    //   pageSize: pageInfo.pageSize || 5,
    //   total: pageInfo.total || 0,
    //   onChange: this.qryPartnerShopInfo,
    //   showQuickJumper: true,
    //   defaultCurrent: 1,
    // };

    return (
      <Modal
        title="异常知识查看"
        width="53%"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        maskClosable={false}
        centered
      >
        {detailType && (
          <div>
            <Table
              // rowSelection={rowSelection}
              columns={columns}
              dataSource={detailType === 2 ? errorFileList.list : faceList2.list}
              size="middle"
              style={{ minHeight: '300px' }}
              pagination={false}
              rowKey="batchId: 706"
            />
            <div style={{ textAlign: 'right', marginTop: 15 }}>
              <Pagination
                current={detailType === 2 ? errorFileList.pageNum || 0 : faceList2.pageNum || 0}
                onChange={this.handleTableChange}
                total={detailType === 2 ? errorFileList.total || 0 : faceList2.total || 0}
                pageSize={detailType === 2 ? errorFileList.pageSize || 0 : faceList2.pageSize || 0}
              />
            </div>
          </div>
        )}
      </Modal>
    );
  }
}
export default NetPubSpecialtySelect;
