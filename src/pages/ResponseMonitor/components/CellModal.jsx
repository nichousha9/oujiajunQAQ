import React from 'react';
import { Modal, Table } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';

@connect(({ responseMonitor, loading }) => ({
  executeStatusList: responseMonitor.executeStatusList,
  cellsList: responseMonitor.cellsList,
  cellsListLoading: loading.effects['responseMonitor/getCellsListEffect'],
  cellIds: responseMonitor.cellIds,
  selectedCells: responseMonitor.selectedCells,
  cellPageInfo: responseMonitor.cellPageInfo,
  cellVisible: responseMonitor.cellVisible
}))
class CellModal extends React.Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.getCellsList();

    const { cellsList, cellIds, selectedCells } = this.props;

    if(cellsList && cellsList.length && cellIds) {
      this.setState({
        selectedRowKeys: [...cellIds],
        selectedRows: [...selectedCells]
      });
    }
  }

  getCellsList = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'responseMonitor/getCellsListEffect'
    });
  }

  handlePagination = (pageNum, pageSize) => {
    const { dispatch, cellPageInfo } = this.props;

    dispatch({
      type: 'responseMonitor/getCellPageInfo',
      payload: { ...cellPageInfo, pageNum, pageSize }
    });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  handleTableChange = (pageNum, pageSize) => {
    this.handlePagination(pageNum, pageSize);
    this.getCellsList();
  }

  handleCancel = () => {
    this.closeModal();
  }

  handleOk = async () => {
    const { selectedRows } = this.state;
    const { dispatch, afterClose } = this.props;

    await dispatch({
      type: 'responseMonitor/getSelectedCells',
      payload: selectedRows
    });
  
    afterClose();
    this.closeModal();
  }

  closeModal = () => {
    const { dispatch } = this.props;
  
    dispatch({
      type: 'responseMonitor/handleCellVisible',
      payload: false,
    });

    this.handlePagination(1, 10);
  }


  render() {
    const { cellsList, cellsListLoading, cellVisible }  = this.props;
    const { selectedRowKeys } = this.state;

    const columns = [{
      title: formatMessage({ id: 'responseMonitor.cellNames' }, '分组名称' ),
      dataIndex: 'cellName',
      align: 'center',
    }, {
      title: formatMessage({ id: 'responseMonitor.cellCode' }, '客户群编码' ),
      dataIndex: 'extCellcode',
      align: 'center',
    }, {
      title: formatMessage({ id: 'responseMonitor.isControl' }, '是否是对照组' ),
      dataIndex: 'isControl',
      align: 'center',
    }];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const paginationProps = {
      showSizeChanger: true, 
      showQuickJumper: true, 
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };


    return (
      <Modal 
        title={formatMessage(
          {
            id: 'responseMonitor.selectCell',
          },
          '选择单元'
        )}
        width={960}
        destroyOnClose
        visible={cellVisible}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        // afterClose={afterClose}
      >
        <Table 
          rowKey={record => record.cellid}
          columns={columns}
          loading={cellsListLoading}
          dataSource={cellsList}
          rowSelection={rowSelection}
          pagination={paginationProps}
        />
      </Modal>
    )
  }
}

export default CellModal;