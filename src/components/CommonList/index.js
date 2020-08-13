import React from 'react';
import { List,Pagination } from 'antd';
import { getLayoutHeight } from '../../utils/utils';


const ListItem = List.Item;
class CommonList extends React.PureComponent{
  componentWillReceiveProps(nextProps){
    const { pagination ={}} = this.props;
    if(pagination==={} && Object.keys(nextProps.pagination).length){
      this.pagination = {
        showQuickJumper:true,
        showSizeChanger:true,
        ...nextProps.pagination,
      };
    }
  }
  change = (cur,pageSize) =>{
    const { listChange } = this.props;
    this.pagination = {
      ...this.pagination,
      pageSize,
      page:cur,
    }
    if(listChange) listChange(cur);
  }
  pagination = {
    cucurrent: 1,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
    totalPages:0,
  }
  render(){

    const { listChange,pagination,loading,dataSource= [],renderItem,height,overflowY,...otherProps} = this.props;
    const curPagination ={
      showQuickJumper:true,
      showSizeChanger: true,
      ...pagination,
    }
    return (
      <React.Fragment>
        <div className="commonList" style={{height: height || getLayoutHeight(), overflowY: overflowY ||'scroll', overflowX: 'hidden'}}>
          <List
            {...otherProps}
            loading={loading}
            dataSource={dataSource}
            renderItem={(item={},index) => (
              <ListItem>{renderItem(item,index,loading)}</ListItem>
            )
            }
          />
        </div>
        { pagination && <Pagination  onChange={this.change} onShowSizeChange={this.change} style={{  marginTop: 20, float: 'right'}} {...curPagination} />}
      </React.Fragment>

    )
  }
}

export default CommonList;
