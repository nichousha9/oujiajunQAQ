import React from 'react';
import { connect } from 'dva';
import { Popconfirm  } from 'antd';
import StandardTable from '../StandardTable';
import CommonShowEditor from '../CommonShowEditor';
import {formatDatetime} from "../../utils/utils";

// loading:loading.dataDic.effects['dataDic/fetchGetRelateQues']
@connect(({dataDic,loading})=>{
    return {dataDic:dataDic.dataDic,loading:loading.effects['dataDic/fetchGetRelateQues']}
  })
export default class SimilarQuestionTable extends React.PureComponent{
  componentDidMount(){
    const { question, dispatch } = this.props;
    dispatch({
      type:'dataDic/fetchGetRelateQues',
      payload:{
        content: question,
        isNeedAnswer:1,
        isAllSource:1,
      },
    })
  }
  render(){
    const columns = [
      {
        title: '问题',
        dataIndex: 'question',
        render:(data)=>{
          return <CommonShowEditor data={data} />
        },
      },
      {
        title: '答案',
        dataIndex: 'answercontent',
        render:(data)=>{
          return <CommonShowEditor data={data} />
        },
      },
    ];
    const { loading,dataDic:{ relateQuesList =[]},act = false,getMergItem } = this.props;
    if(act){
      columns.push({
        title:'操作',
        width:70,
        dataIndex: 'act',
        render:(val,data)=>{
          // 是否使用当前审核信息更新此问题
          return <Popconfirm okText="是" cancelText="否" onConfirm={()=>{if(getMergItem)getMergItem(data)}} title="是否使用当前审核信息更新此问题"><a>合并</a></Popconfirm >
        },
      })
    }
    const tableProps = {
      noSelect: true,
      loading,
      noTotalPage:true,
      data:{
        list: relateQuesList,
        pagination:false,
      },
      columns,
      pagination:false,
    }
    return(
      <div>
        <div className="tip">点击问题或答案显示完整信息，确定是否继续当前操作新增知识</div>
        <StandardTable {...tableProps} />
      </div>
    )
  }
}
