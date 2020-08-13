import React from 'react';
import { Input,Spin } from 'antd';
import { connect } from 'dva';
import QuestionList from './QuestionList';
import styles from './Agent.less';
import {getUserInfo} from "../../utils/userInfo";

const { Search } = Input;

@connect(({agentSmartReply,loading})=>({agentSmartReply,loading:loading.effects['agentSmartReply/fetchGetRelateQuesList']}))
export default class SmartReply extends React.PureComponent{

  // 获取相关问题
  getRelateQues= (str) =>{
    const { dispatch } = this.props;
    const user = getUserInfo();
    dispatch({
      type:'agentSmartReply/fetchGetRelateQuesList',
      payload:{
        isNeedAnswer: '1', // 当前拿到只能回复的接口 传1表示需要答案；
        tenantid: user.orgi,
        question: str,
        content: str,
      },
    })
  }
  render(){
    const { clientHeight,agentSmartReply:{ relateQuesList =[] },sendMessage ,loading = false} = this.props;
    return (
      <div style={{padding:'15px 20px 0 20px'}}>
        <Search
          placeholder="请输入"
          onSearch={search => this.getRelateQues(search)}
          enterButton
        />
        <Spin spinning={loading}>
          <div className={styles.searchCount}>搜索结果({relateQuesList.length})</div>
          <div style={{overflow:'auto',height:clientHeight-245}}>
            <QuestionList list={relateQuesList} sendMessage={sendMessage} />
          </div>
        </Spin>
      </div>
    )
  }
}
