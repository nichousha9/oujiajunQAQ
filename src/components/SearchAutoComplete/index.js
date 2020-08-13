import React from 'react';
import { Input,AutoComplete,Icon  } from 'antd';
import { debounce } from '../../utils/utils';


const Option = AutoComplete.Option;


class SearchAutoComplete extends  React.PureComponent{
  state ={
    data:[],
    value:'',
    isMore: false,
  }
  handleSearch = ()=>{
    const { searchFn,searchName='keyword',page = false,pages = false} = this.props;
    const { data=[] } = this.state;
    if(searchFn && this.inputRef.props.value && this.inputRef.props.value.length >1){
      const obj={}
      obj[searchName] = this.inputRef.props.value;
      if(pages){
        obj['ps'] = 100;
      }
      searchFn(obj).then((res) => {
        if(res.status === 'OK') {
          if(pages){
            const newData = [...res.data.userList.content];
            this.setState({data: newData});
            return;
          }
          if(page){
            const totalElements = res.data.total;
            const newData = [...data,...res.data.list];
            this.setState({data: newData,isMore: totalElements>newData.length})
          }else{
            this.setState({data: res.data})
          }
        }
      })
    }
  }

  handleSelect=(selectId)=>{
   const { selected,onChange } = this.props;
   const {data=[]} = this.state;
   const selectItem = data.filter((item)=>{return selectId===item.id});
   if(selected) selected(selectItem);
   if(onChange) onChange(selectId);
   return selectItem.nickname;
  }
  renderEmpty =()=>{
    const arr =[{}];
    return arr.map((item) =>{
      return (
        <Option  key='' value='' label=''>
          <div className="text-center padding-15" style={{color:'rgba(0,21,41,0.45)'}}>暂无数据</div>
        </Option >
      )
    })
  }
  renderItem =(item) =>{
    const { renderSearchItem, searchName : searchKey='keyword' } = this.props;
    const searchName= this.inputRef.props.value
    const curTest = new RegExp(searchName, 'g');
    const newName = (item.nickname || '').replace(curTest, `<span class=searchName>${searchName}</span>`);
    if(renderSearchItem){
     return renderSearchItem(searchName,item,Option);
    }
    return (
      <Option  key={item.id} value={item.id} label={item.nickname}>
        <div dangerouslySetInnerHTML={{__html: newName}} />
        { searchKey==='keyword' && (
          <div className="font12" style={{color:'rgba(0,21,41,0.45)'}}>{`来自分组: ${item.class_name}-${item.name}`}</div>
        )}
        { searchKey!=='keyword' && (
          <div className="font12" style={{color:'rgba(0,21,41,0.45)'}}>{`用户名:${item.username}`}</div>
        )}
      </Option >
    )
  }
  render(){
    const { data =[] } = this.state;
    const { searchName,style } =  this.props;
    const options = data.map((item) => {
      return this.renderItem(item)
    });
    const emptyOption = this.renderEmpty();
    return(
      <AutoComplete
        onSelect={this.handleSelect}
        dropdownMatchSelectWidth={false}
        size="large"
        style={{margin:searchName==='keyword' ? 10 : 0,...style}}
        dataSource={data.length ? options : emptyOption}
        placeholder="请输入"
        optionLabelProp="label"
      >
        <Input ref={(ele) =>{this.inputRef = ele}} onKeyUp={debounce(this.handleSearch,500)} suffix={<Icon type="search" className="certain-category-icon" />} />
      </AutoComplete>
    )
  }
}

export default SearchAutoComplete;
