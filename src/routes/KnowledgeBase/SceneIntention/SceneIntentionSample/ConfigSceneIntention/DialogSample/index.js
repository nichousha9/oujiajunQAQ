import shortId from 'shortid';
import React from 'react';
import {connect} from 'dva';
import {Table, Button, Icon,message, Modal,Input} from 'antd';
import styles from '../../index.less';
import AddDialogSample from './AddDialogSample';
import { getResMsg } from '../../../../../../utils/codeTransfer'
import {deleteIntentionDialog} from "../../../../../../services/sceneApiList";

@connect((props) => {
  const {loading, sceneIntention} = props;
  return {
    sceneIntention,
    loading: loading.models.sceneIntention,
  }
})
export default class DialogSample extends React.Component {
  state = {
    // sentenceList: this.props.sentenceList,
    addVisible: false,
    selectItem: {},
    // 实体列表
    sceneEntityList: [],
    dialogSampleList: [],
  };

  componentWillMount() {
    this.loadEntity();
  };

  componentWillReceiveProps(nextProps) {
    const {sceneIntention: {sceneEntityList}} = nextProps;
    if (JSON.stringify(sceneEntityList) !== JSON.stringify(this.state.sceneEntityList)) {
      this.setState({sceneEntityList})
    }
    const {sceneIntention: {dialogSampleList}} = nextProps;
    if (JSON.stringify(dialogSampleList) !== JSON.stringify(this.state.dialogSampleList)) {
      this.convertDialogSampleList(dialogSampleList);
      this.setState({dialogSampleList})
    }
  };

  // 对话删除
  handleDelete(record) {
    const {dispatch,updateSlotList} = this.props;
    const {sceneId, intent, intentId, id} = record;
    Modal.confirm({
      title: '确认删除？',
      okText: "确认",
      cancelText: "取消",
      onOk() {
        deleteIntentionDialog({id}).then((res) => {
          if (res.status === 'OK') {
            message.success('删除成功');
            if(updateSlotList) updateSlotList();
            // 保存后获取列表
            dispatch({
              type: 'sceneIntention/fetchIntentionDialogSampleList',
              payload: {
                sceneid: sceneId,
                intent,
                intentId,
                p: 1,
                ps: 100,
              },
            })
          } else {
            message.error('删除失败！');
          }
        });
      },
    });
  }

  closeModal() {
    this.setState({addVisible: false});
  }

  convertDialogSampleList(dialogSampleList) {
    if (!dialogSampleList) {
      return [];
    }

    // dialogSampleList.map(o=> {
    //   o.words = o.annots.map(ob => ob.slotcode).join(',');
    //   o.key = shortId.generate();
    // });

    dialogSampleList.forEach(o=> {
      o.words = (o.annots || []).map(ob => ob.slotcode).join(',');
      o.key = shortId.generate();
    });
  }

  // 显示新建窗口
  showAdd(record) {
    if (record) {
      this.setState({selectItem: record});
    } else {
      this.setState({
        selectItem: {
          id: '',
          sentence: '',
          words: [],
        },
      });
    }
    this.setState({addVisible: true});
  }

  // 对话新增
  handleAdd(param) {
    if(!param){
      if(updateSlotList) updateSlotList();
      return;
    }
    const {dispatch,updateSlotList,refreshData} = this.props;
    dispatch({
      type: 'sceneIntention/fetchSaveIntentionDialogSample',
      payload: param,
    }).then((res) => {
      if(res && res.status==='OK'){
        this.setState({addVisible: false});
        // 重新获取当前的词槽
        message.success(param.id? '修改成功' : '修改成功');
        if(updateSlotList) updateSlotList();
        return;
      }
      if(res){
        message.error(getResMsg(res.msg));
      }
    })
    
  }

  callBackDataSourceChange(sentenceList) {
    if (this.props.onChange) {
      this.props.onChange(sentenceList);
    }
  }

  loadEntity() {
    const {dispatch, sceneId: sceneid} = this.props;
    // dispatch({
    //   type: 'sceneIntention/fetchSceneEntityList',
    //   payload: {
    //     sceneid,
    //     p: 1,
    //     ps: 100,
    //   },
    // })
  }


  // 对话列
  sentenceColumns = [
    {
      title: '对话样本',
      dataIndex: 'sentence',
      key: 'sentence',
      // width:'90%',
      backgroun:'red',
      render:(text) => {
        return (
          <div >
            <span style={{width:'37%',display:'inline-block',textAlign:'right'}}>用户问询：</span>
            <Input readOnly defaultValue={text} style={{width:'62%'}} />
          </div>
          )
      }, 
    },{
      title: '操作',
      key: 'operator',
      width:120,
      render: (record) => {
        const that = this;
        return (
          <div style={{float:'right'}}>
            <a onClick={() => {
              that.showAdd(record);
            }}
            >
              <Icon type="edit" />
            </a>
            <span style={{display: 'inline-block', margin: '0 5px'}}>&nbsp;</span>
            <a onClick={() => {
              that.handleDelete(record);
            }}
            >
              <Icon type="delete" />
            </a>
          </div>
        )
      },
    },
  ];

  



  render() {
    const {sceneId, intention} = this.props;
    const {dialogSampleList, addVisible, selectItem, sceneEntityList} = this.state;
    const addPros = {
      sceneId,
      intention,
      handleOk: this.handleAdd.bind(this),
      dialogSample: selectItem,
      closeModal: this.closeModal.bind(this),
      visible: addVisible,
      sceneEntityList,
    };
    return (
      <React.Fragment>
        
        <Table
          dataSource={dialogSampleList}
          columns={this.sentenceColumns}
          pagination={false}
          showHeader={false}
          bordered={false}
        />
        <p className={styles.title}>
          <Button onClick={() => this.showAdd()} style={{border:'none',color:'#1890FF',marginLeft:'25%'}}><Icon type="plus" />增加问询</Button>
        </p>
        {addVisible && <AddDialogSample {...addPros} />}
        
      </React.Fragment>
    );
  }
}
