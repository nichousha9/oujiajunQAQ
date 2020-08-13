import React, { PureComponent } from 'react';
import { Table,Popover } from 'antd';
import CommonTableHeaderExtral from '../CommonTableHeaderExtral';
import classnames from 'classnames';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}
const fixItem = (item) => {
  Object.assign(item, {
    key: item.key || item.dataIndex,
  });
  if(item.percent && !item.render){
    Object.assign(item, {
      render: (data) => {return data ? `${data}%` : 0;},
    });
  }
  if (!item.noWidth) {
    Object.assign(item, {
      width: item.width || 100,
    });
  }
  if (!item.render && item.addTitle) {
    Object.assign(item, {
      render: (text) => {
        return text ? (
          <Popover content={text} placement="topLeft">
            {text}
          </Popover>
        ) : (
          '-'
        );
      },
    });
  }
  if (!item.render) {
    if (item.renderText && typeof item.renderText === 'function') {
      Object.assign(item, {
        render: (text, record) => {
          return item.renderText(text, record) || (item.noDefaultText ? '' : '-');
        },
      });
    } else {
      Object.assign(item, {
        render: (text) => {
          return text || text === 0 ? `${text}` : item.noDefaultText ? '' : '-';
        },
      });
    }
  }
  if (item.children) {
    item.children.forEach((innerItem) => {
      fixItem(innerItem);
    });
  }
};
export default class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      current:0,
      selectedRowKeys: [],
      selectedRows: [],
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    const { pagination = {} } = (nextProps.data || {});
    if ((nextProps.selectedRows || []).length === 0 || pagination.current !== this.state.current) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        current:pagination.current || 0,
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map(item => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList, selectedRows });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({current: pagination.current},() => {
      this.pagination = pagination;
      this.props.onChange(pagination, filters, sorter);
    });
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };
  handleGetPagination =(pagination) => {
    if(!pagination) return false;
    if(!(Object.keys(pagination) ||[]).length) return false;
    const { noTotal } = this.props;
    const mypagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    }
    if (!noTotal) {
      mypagination.showTotal = (total) => {
        const totalHtml = (
          <div className='totalPage'>
            {`共${total}条记录 第${pagination.current}/${pagination.totalPages}页`}
          </div>
        )
        return totalHtml;
      }
    }
    return mypagination
  }
  render() {
    let clientHeight = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
    const { selectedRowKeys,current } = this.state;
    const { scroll ={}, noSelect,tableClass,noScrollY,data = {} , onRow=()=>{},tableClassName,loading, columns, rowKey,extralContent,listName,coverHeader,noTotalPage,checkable,...otherProps } = this.props;
    let { showTableHeader } = this.props;
    showTableHeader = !!extralContent || !!coverHeader || !!showTableHeader;
    const { list = [], pagination = {} } = data;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    const tableHeaderExtralProps = {
      coverHeader,
      extralContent,
      listName,
      pagination,
      noTotalPage,
    }
    clientHeight -= otherProps.cutHeight || 320;
    clientHeight = Math.min(clientHeight, 680);

    columns.forEach(fixItem);
    let totalWidth = 0;
    columns.forEach((item) => {
      totalWidth += item.width || 100;
    });
    if (!noSelect) {
      totalWidth += 62;
    }
    const tableProps = {
      onRow,
      current,
      loading,
      rowKey:rowKey || 'id',
      rowSelection: checkable ? rowSelection : null,
      dataSource:list,
      columns,
      pagination:this.handleGetPagination(pagination),
      onChange:this.handleTableChange,
      scroll:{
        x:totalWidth,
        y: scroll.y || clientHeight - 40,
      },
    }
    if(noSelect){
      delete tableProps.rowSelection
    }
    return (
      <div className={styles.standardTable}>
        { showTableHeader && <CommonTableHeaderExtral {...tableHeaderExtralProps} />}
        <div className={tableClass}>
          <Table {...tableProps} className={classnames({ [styles.table]: true }, tableClassName)} />
        </div>
      </div>
    );
  }
}

