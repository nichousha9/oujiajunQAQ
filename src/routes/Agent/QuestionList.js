/* eslint-disable react/no-danger */
import React from 'react';
import { Button,Collapse  } from 'antd';
import classnames from 'classnames';
import styles from './Agent.less';

const {Panel} = Collapse;

export default class QuestionList extends React.Component{
  render(){
    const { list=[],sendMessage } = this.props;
    return (
      <div className="questionList">
        {!!list.length && (
          <Collapse defaultActiveKey={list[0].questionid} accordion>
            { list.map((item,index)=>{
              return(
                <Panel
                  header={<div className={classnames(styles.searchResult)}>{index+1}.{item.question}</div>}
                  key={item.questionid}
                >
                  <div style={{overflow:'hidden'}}>
                    <Button
                      className='floatRight margin-bottom-15'
                      onClick={()=>{sendMessage(item.answercontent)}}
                      type="primary"
                      size="small"
                      ghost
                    >
                      发送
                    </Button>
                  </div>
                  <div className={styles.searchResult} dangerouslySetInnerHTML={{__html:item.answercontent}} />
                </Panel>
              )
            })}
          </Collapse>
        )}
      </div>
    )
  }
}
