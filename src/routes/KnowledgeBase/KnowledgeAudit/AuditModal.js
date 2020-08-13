/* eslint-disable react/no-unused-state */
import React from 'react';
import { Modal,Steps,Button,message } from 'antd';
import { connect } from 'dva';
import SimilarQuestionTable from '../../../components/SimilarQuestionTable';
import KnowledgeModify from "../../../components/CommonKnowledgeModify";
import CommonEndPage from "../../../components/CommonEndPage";
import CommonButton from "../../../components/CommonButton";

const { Step } = Steps;
const steps = [
  { key: 'audit', title: '审核'},
  { key: 'similar', title: '相似问题'},
  { key: 'merge', title: '合并'},
  { key: 'end', title: '结束'},
];
@connect(({knowPickUpSaveAudite,loading})=>{
  return {knowPickUpSaveAudite,loading:loading.models.knowPickUpSaveAudite}
})
export default class AuditModal extends React.PureComponent{
  constructor(props){
    super(props)
    const { editItem={} } = this.props;
    this.state = {
      errorsArr:[],
      currentStep: 0, // 默认在第0步，
      qIndexArr:{}, // 当前的问题的序号，
      editItem,
      mergItem:{},
      mergQuestion:{}, // 合并的问题
    }
  }
  // 上一步，下一步
  changeStep =(type) => {
    const {currentStep} = this.state;
    if (!currentStep && type === 'reduce') {
      const {onCancel} = this.props;
      onCancel();
      return;
    }
    this.setState({currentStep: type==='add'? currentStep+1:currentStep-1});
  }
  // 问题或者答案修改更新editItem
  changeEditItem = (editItem) =>{
    const { currentStep } = this.state;
    if(currentStep>1){
      this.setState({mergItem:editItem})
    }else{
      this.setState({editItem})
    }
  }
  // 地区和分类改变的时候
  handleKnowChange = (type,value) =>{
    if(!type) return;
    const { editItem={},currentStep=0,mergItem={} } = this.state;
    const obj = {};
    obj[type] = value;
    if(currentStep>1){
      this.setState({ mergItem: {...mergItem,...obj}});
    }else{
      this.setState({ editItem: {...editItem,...obj}});
    }
  }
  // 当前的问题的序号改变
  changeQuestionIndex =(index) =>{
    const { currentStep=0,qIndexArr={}}  = this.state;
    qIndexArr[currentStep] = index;
    this.setState({qIndexArr:{...qIndexArr}});
  }
  // 获取当前的问题
  handleGetQuestion = ()=>{
    const { qIndexArr,currentStep=0,editItem={},mergItem={} } = this.state;
    const curIndex = qIndexArr[currentStep] || 0;
    const curItem = currentStep > 1 ? mergItem : editItem
    if (editItem.id) {
      if (curIndex === 0) return curItem.question;
      if (curIndex === 1) return curItem.content;
    }
  }
  // 当前 merg
  handleGetMergItem =(question={})=>{
    const { editItem={} } = this.state;
    const mergItem = {
      ...editItem,
      content: editItem.content + question.answercontent,
    }
    this.setState({mergItem,question:editItem.question + question.question,mergQuestion: question},()=>{
      this.changeStep('add');
    });
  }
  handleAuditeKnow = (isaccept=0)=>{
    const { dispatch,onCancel } = this.props;
    const { editItem ={},currentStep=0,mergItem={},mergQuestion={}} = this.state;
    let obj = {};
    if(!isaccept){
      obj = {
        pickupId:editItem.id,
        isaccept:0,
      }
    }else{
      const curItem = currentStep > 1 ? mergItem : editItem;
      if( !curItem.sortId || !curItem.area || !curItem.catecodeId){
        const arr = [];
        if(!editItem.sortId) arr.push('sortId');
        if(!editItem.area) arr.push('area');
        if(!editItem.catecodeId) arr.push('catecodeId');
        this.setState({errorsArr:arr})
        return;
      }
      obj = {
        pickupId:curItem.id,
        ques: curItem.question || '',
        content: curItem.content || '',
        sortId: curItem.sortId || '',
        area: curItem.area || '',
        kdbQuesId: mergQuestion.questionid || '',
        kdbQuesSource: mergQuestion.source || 'xiaomi',
        catecodeId: curItem.catecodeId || '',
        isaccept:1,
      }
    }
    dispatch({
      type:'knowPickUpSaveAudite/fetchKnowAudite',
      payload:{ ...obj },
    }).then((res)=>{
      if(!res || res.status !=='OK') return;
      if(!isaccept) {
        message.success('审核不通过完成');
        if(onCancel) onCancel();
      }else{
        // 审核通过直接进入审核完成页面
        this.setState({currentStep:3});
        message.success('审核通过');
      }
    })
  }
  // 显示的操作按钮
  returnFooterList =()=>{
    const { currentStep } = this.state;
    const { loading,onCancel} = this.props;
    if(currentStep<1){
     return [
       <Button key="next" onClick={()=>{this.changeStep('add')}}>下一步</Button>,// 获取相似问题
       <CommonButton key="notPass" type="primary" loading={loading} onClick={()=>{this.handleAuditeKnow(0)}}>不通过</CommonButton>,
      ]
    }
    if(currentStep===(steps.length-1)){
      return [
        <Button key="close" onClick={onCancel}>关闭</Button>,// 关闭Modal
      ]
    }
    if(currentStep===1){
      return [
        <Button key="prve" onClick={()=>{this.changeStep('reduce')}}>上一步</Button>,// 获取相似问题
        <CommonButton key="notPass" type="primary" loading={loading} onClick={()=>{this.handleAuditeKnow(0)}}>不通过</CommonButton>,
        <CommonButton key="pass" type="primary" loading={loading} onClick={()=>{this.handleAuditeKnow(1)}}>通过</CommonButton>,
      ]
    }
    // 合并
    if(currentStep===2){
      return [
        <Button key="prve" onClick={()=>{this.changeStep('reduce')}}>上一步</Button>,// 获取相似问题
        <CommonButton key="notPass" type="primary" loading={loading} onClick={()=>{this.handleAuditeKnow(0)}}>不通过</CommonButton>,
        <CommonButton key="pass" type="primary" loading={loading} onClick={()=>{this.handleAuditeKnow(1)}}>通过</CommonButton>,
      ]
    }
    return [
      <Button key="prve" onClick={()=>{this.changeStep('reduce')}}>上一步</Button>,// 获取相似问题
      <Button key="next" onClick={()=>{this.changeStep('add')}}>下一步</Button>,// 获取相似问题
      <CommonButton key="notPass" type="primary" loading={loading} onClick={()=>{this.handleAuditeKnow(0)}}>不通过</CommonButton>,
      <CommonButton key="pass" type="primary" loading={loading} onClick={()=>{this.handleAuditeKnow(1)}}>通过</CommonButton>,
    ]
  }
  render(){
    const { visible,onCancel} = this.props;
    const { currentStep,editItem={},mergItem={},errorsArr=[] } = this.state;
    return (
      <Modal
        width="700px"
        title="审核"
        visible={visible}
        onCancel={onCancel}
        footer={this.returnFooterList()}
        maskClosable={false}
      >
        <Steps size="small" current={currentStep}>
          {steps.map(item => <Step key={item.key} title={item.title} />)}
        </Steps>
        <div className="margin-top-20">
          {steps[currentStep].key==='audit'&& (
            <KnowledgeModify
              errorsArr={errorsArr}
              showCreateUser
              changeItemInf={this.handleKnowChange}
              changeEditItem={this.changeEditItem}
              changeQuestionIndex={this.changeQuestionIndex}
              knowledgeInfo={editItem}
            />
          )}
          {steps[currentStep].key==='merge'&& (
            <KnowledgeModify
              errorsArr={errorsArr}
              changeItemInf={this.handleKnowChange}
              changeEditItem={this.changeEditItem}
              changeQuestionIndex={this.changeQuestionIndex}
              knowledgeInfo={mergItem}
            />
          )}
          {steps[currentStep].key === 'similar' && (
            <SimilarQuestionTable act getMergItem={this.handleGetMergItem} question={this.handleGetQuestion()} />
          )}
          {steps[currentStep].key === 'end' && <CommonEndPage />}
        </div>
      </Modal>
    )
  }
}
