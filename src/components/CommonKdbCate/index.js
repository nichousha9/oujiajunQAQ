import React from 'react';
import { connect } from 'dva';
import CommonTreeSelect from '../../components/CommonTreeSelect';

@connect(({dataDic})=>({dataDic:dataDic.dataDic}))
class CommonKdbCate extends React.PureComponent{
  componentDidMount(){
    const { dispatch,dataDic:{ cateAllList=[] } } = this.props;
    if(!cateAllList.length){
      dispatch({ type:'dataDic/fetchGetKdbCateList'})
    }
  }
  render(){
    const { dataDic:{ cateAllList=[] },style,onChange,defaultVal } = this.props;
    return (
      <CommonTreeSelect
        defaultVal={defaultVal}
        onChange={onChange}
        style={style}
        treeData={cateAllList}
      />
    )
  }
}

export default CommonKdbCate;
