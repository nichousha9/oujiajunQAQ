import shortId from 'shortid';
import {connect} from 'dva';
import React from 'react';
import {Spin, Icon} from 'antd';
import DialogSample from './DialogSample';
import DialogReply from './DialogReply';
import styles from '../index.less';

@connect((props) => {
  const {loading, sceneIntention} = props;
  return {
    sceneIntention,
    loading: loading.models.sceneIntention,
  }
})
export default class ConfigSceneIntention extends React.Component {
  state = {
    dialogReplyList: [],
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const {sceneIntention: {dialogReplyList}} = nextProps;
    // 校验规则有问题,key会每次都更新,相当于每次数据都不一样,document会每次更新,需要优化,去掉key值对比校验
    if (JSON.stringify(this.convertDialogReplyList(dialogReplyList)) !== JSON.stringify(this.state.dialogReplyList)) {
      this.setState({dialogReplyList: this.convertDialogReplyList(dialogReplyList)})
    }
  };


  onchange(key, value) {
    if (this.state[key] !== value) {
      this.setState({[key]: value});
    }
  };

  addReply() {
    const {dialogReplyList} = this.state;
    const reply = {
      id: '',
      key: shortId.generate(),
      rules: [
        // {key: '1', id: '1', word: 'param1', operator: 'exist', values: '100,200'},
        // {key: '2', id: '2', word: 'param2', operator: 'gt', values: ''},
      ],
      response: "",
      errType: "1",
      errRetry: "3",
    };
    dialogReplyList.push(reply);
    this.setState({dialogReplyList});
  };

  deleteReply(key) {
    const {dialogReplyList} = this.state;
    const filteredReplyList = dialogReplyList.filter(o => o.key !== key);
    this.setState({dialogReplyList: filteredReplyList});
  }

  convertDialogReplyList(dialogReplyList) {
    let replyList = dialogReplyList;
    if (typeof(dialogReplyList) === 'string') {
      replyList = JSON.parse(dialogReplyList);
    }
    const convertRuleList=this.convertRuleList.bind(this);
    return replyList.map(o => {
      // stateChat 回复
      // enterChat 触发
      return {
        id: o.id,
        key: shortId.generate(),
        rules: convertRuleList(o.enterChat && o.enterChat.rules || ''),
        response: o.stateChat && o.stateChat.response || '',
        errType: o.stateChat && o.stateChat.errType || '',
        errRetry:o.stateChat &&  o.stateChat.errRetry || '',
      }
    });
  }

  refreshData = () =>{
   console.log("传数据！");
  }

  convertRuleList(rules){
    if(rules===''){
      return [];
    }
    const ruleList=JSON.parse(rules);
    ruleList.forEach(o=>{o.key=shortId.generate();});
    return ruleList;
  }

  render() {
    const {loading, sceneId, intention,updateSlotList} = this.props;
    const {dialogReplyList} = this.state;
    return (
      <Spin spinning={loading}>
        <div className={styles.configContainer} >
          <DialogSample
            sceneId={sceneId}
            updateSlotList={updateSlotList}
            intention={intention}
            onChange={(v) => this.onchange('dialogSampleList', v)}
          />
          {/* <p className={styles.title}>快速回复</p>
          {
            dialogReplyList.map((reply, index) => {
                return (
                  <DialogReply
                    sceneId={sceneId}
                    intention={intention}
                    key={reply.key}
                    reply={reply}
                    onChange={(v) => this.onchange('dialogReplyList', index, v)}
                    onDelete={this.deleteReply.bind(this)}
                  />
                )
              }
            )}
          <p className={styles.p} onClick={() => this.addReply()}>
            <Icon type="plus" />
            添加快速回复
          </p> */}
        </div>
      </Spin>
    );
  }
}
