import React from 'react';
import { Modal,Button,message } from 'antd';
import { connect } from 'dva';
import KnowledgeModify from '../../components/KnowledgeModify';
import CommonButton from '../../components/CommonButton';

@connect(({knowPickUpSaveAudite,loading})=>{
    return{
      knowPickUpSaveAudite,
      submitLoading: loading.effects['knowPickUpSaveAudite/fetchKnowSubmit'],
    }
  })
export default class KnowledgeCollection extends React.PureComponent{
  constructor(props){
    super(props);
    const { editItem = {} } = this.props;
    this.state = {
      errorsArr:[],
      editItem, // 当前收录问题的信息
    }
  }

  // 提交审核
  submitToAudit = () =>{
    const { dispatch } = this.props;
    const { editItem } = this.state;
    const validate = this.handleValidate();
    if(validate){
      return;
    }
    dispatch({
      type:'knowPickUpSaveAudite/fetchKnowSubmit',
      payload:{
        dEsid: editItem.esid,
        content:editItem.content,
        question:editItem.question,
        sortId: editItem.sortId ||'',
        area: editItem.area || '',
        catecodeId: editItem.catecodeId || '',
      },
    }).then((res)=>{
      if(res && res.status === 'OK'){
        message.success('提交成功')
        this.props.onCancel()
        // message.success('暂存成功！');
        // this.setState({editItem: res.data})
        // callBack();
      }
    })
  }
  // 校验
  handleValidate =() =>{
    const { editItem } = this.state;
    if(!editItem.sortId || !editItem.area || !editItem.catecodeId){
      const arr = [];
      if(!editItem.sortId) arr.push('sortId');
      if(!editItem.area) arr.push('area');
      if(!editItem.catecodeId) arr.push('catecodeId');
      this.setState({ errorsArr: arr})
      return true;
    } else if(!editItem.content) {
      message.error('请输入解决方案！')
      return true;
    }
    this.setState({ errorsArr: []})
    return false;
  }
  handleKnowChange = (type,value) =>{
    if(!type) return;
    const { editItem={} } = this.state;
    const obj = {};
    obj[type] = value;
    this.setState({ editItem: {...editItem,...obj}});
  }
  render(){
    const { visible,onCancel,submitLoading=false} = this.props;
    const { editItem ={},errorsArr=[] } = this.state;
    return (
      <Modal
        width="750px"
        onCancel={onCancel}
        visible={visible}
        maskClosable={false}
        title="知识收录"
        footer={[
          <Button key="back" onClick={onCancel}>取消</Button>,
          <CommonButton key="submit" type="primary" loading={submitLoading} onClick={this.submitToAudit}>
            提交审核
          </CommonButton>,
        ]}
      >
        <KnowledgeModify
          changeSelectMessage={this.changeSelectMessage}
          changeItemInf={this.handleKnowChange}
          knowledgeInfo={editItem}
          errorsArr={errorsArr}
        />
      </Modal>
    )
  }
}
