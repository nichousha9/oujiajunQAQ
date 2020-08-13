/* eslint-disable react/no-array-index-key */
import React from 'react';
import { connect } from 'dva';
import { Modal,Form,Input,Row,Col,Icon,message } from 'antd';
import CommonSelect  from '../../../components/CommonSelect';
import { quickReplayType } from '../../../utils/resource';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
@connect(({sceneDialogNode,loading,sceneDialogSetting})=>({
  sceneDialogNode,
  sceneDialogSetting,
  loading: loading.effects['sceneDialogSetting/fetchGetNodeDetail'],
}))
export default class SettingCondModal extends React.Component{
  state ={
    setData:[],
    editItem:this.props.editItem || {},
  }
  componentDidMount(){
    const { editItem,dispatch ,sceneId,sceneDialogNode:{ intentionOperatorList =[]}} = this.props;
    if(!intentionOperatorList.length){
      dispatch({ type:'sceneDialogNode/fetchIntentionOperatorList'});
    }
    dispatch({
      type:'sceneDialogNode/fetchGetIntentionList',
      payload:{
        sceneId,
        p:1,
        ps: 1000,
      },
    }).then(()=>{
      if(!editItem.isSet){
        this.handleAddNew();
      }
      if(!!editItem.isSet && !!editItem.id){
        dispatch({
          type:'sceneDialogSetting/fetchGetNodeDetail',
          payload:{charId:editItem.id,sceneId},
        }).then(res => {
          const {sceneChat={},sceneTriggerList=[]} = res
          if(sceneChat.id === editItem.id){
            // const { rules = "[]" } = curSettingNode;
            const rules = sceneTriggerList.map(v => {
              const rule = {
                t: v.condRule,
                ptype: v.type,
                id: v.id,
                preRel: v.preRel,
              }
              if (v.type === 'intent') {
                rule.pdesc = v.intentId
              } else {
                rule.pdesc = v.wordId
              }
              return rule
            })
            this.setState({
              editItem: {...editItem,name: sceneChat.name},
              setData: rules,
            })
          }
        })
      }
    })
    dispatch({
      type:'sceneDialogNode/fetchGetSceneSlots',
      payload:{
        sceneId,
        p:1,
        ps: 1000,
      },
    });
  }
  handleAddNew =(condition) =>{
    const { setData } = this.state;
    const { sceneDialogNode:{ intentionOperatorList =[]} } = this.props;
    this.setState({
      setData:[...setData,{ptype:'word',t:!!intentionOperatorList.length && intentionOperatorList[0].code,preRel: condition}],
    })
  }
  // 要移除的下标
  handleRemove =(index,id) =>{
    const { setData } = this.state;
    if(setData.length <=1){
      message.error('最后一项移除失败');
      return;
    }
    if (id) {
      Modal.confirm({
        title: '确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk:() => {
          const {dispatch} = this.props
          dispatch({
            type:'sceneDialogSetting/deleteNodeDetail',
            payload: {id},
          }).then(res => {
            if (res.status === "OK") {
              message.success('删除成功！')
            }
          })
          this.setState({
            setData:setData.filter((item,i)=>{ return index!==i}),
          })
        },
      });
    } else {
      this.setState({
        setData:setData.filter((item,i)=>{ return index!==i}),
      })
    }
    
  }
  // 回复方式发生改变
  handleReplayTypeChange = (value,index)=>{
    const { setData = [] } = this.state;
    if(value){
     const newSetData = setData.map((item,i)=>{
        if(index===i) {
          // 方式发生改变， 内容也发生改变;
          return {
            ...item,
            ptype: value,
            pdesc: '',
          }
        }
        return item;
      });
     this.setState({setData: newSetData});
    }
  }
  changeValue = (index,value,type) =>{
    if(!type) return;
    const { setData = [] } = this.state;
    const obj = {};
    obj[type] = value;
    const newData = setData.map((val,i)=>{
      if(index === i){
        return {
          ...val,
          ...obj,
        }
      }
      return val;
    });
    this.setState({setData:newData})
  }

    // 显示提示语的函数
    handleShow = (res) =>{
      const { closeModal } = this.props;
      if(res && res.status==='OK'){
        closeModal();
        message.success('操作成功');
      }
    }

  
  //
  isEmptyItem =(item) =>{
    return !item.t || !item.ptype || !item.pdesc;
  }
  handleOnOK = () =>{
    const { onHandleOk,sceneId,form: { validateFieldsAndScroll } } = this.props;
    validateFieldsAndScroll((err, values)=>{
      if(err) return;
      const { editItem={} } = this.props;
      const { setData =[] } = this.state;
      // if(editItem.id && editItem.isSet){
      //   obj.id = editItem.id;
      // }
      const isEmpty = setData.some((item)=>{
        return this.isEmptyItem(item);
      })
      if(isEmpty){
        message.error('当前数据不完整');
        return;
      }
      const newSetData = setData.map((item)=>{
        const val = {
          condRule: item.t,
          type: item.ptype,
          charName: values.name,
          sceneId,
          id: item.id,
        }
        if (item.preRel) {
          val.preRel = item.preRel
        }
        if (item.ptype === 'word'){
          val.wordId = item.pdesc
        } else {
          val.intentId = item.pdesc
        }
        if (editItem.isSet) {
          val.charId = editItem.id
        }
        return val
      })
      let patch = 'sceneDialogSetting/fetchSaveNodeSetting'
      if (editItem.isSet) patch = 'sceneDialogSetting/updateSaveNodeSetting'
      if(onHandleOk) onHandleOk({sceneTriggerList: JSON.stringify(newSetData)},this.handleShow, patch)

    })
  }

  // type 发生改变做操作；
  renderTypeValue = (item,index) =>{
    const {sceneDialogNode:{ sceneSlotsList=[],intentionList=[] } } = this.props;
    if(item.ptype==='intent'){
      return (
        <CommonSelect
          onChange={(value)=>{this.changeValue(index,value,'pdesc')}}
          value={item.pdesc}
          style={{ width:'100%'}}
          optionData={{datas:intentionList}}
        />
      )
    }
    // 默认名词
    return (
      <CommonSelect
        onChange={(value)=>{this.changeValue(index,value,'pdesc')}}
        value={item.pdesc}
        style={{ width:'100%'}}
        optionData={{datas:sceneSlotsList,optionId:'id',optionName:'sortName'}}
      />
    )
  }
  
  render(){
    const { setData=[],editItem={} } = this.state;
    const { sceneDialogNode:{ intentionOperatorList =[] },form:{getFieldDecorator},visible,closeModal } = this.props;
    return (
      <Modal
        width="800px"
        maskClosable={false}
        onCancel={closeModal}
        onOk={this.handleOnOK}
        visible={visible}
        title={editItem.name?'修改触发条件': '新增触发条件'}
      >
        <Form>
          <FormItem  {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  message: '请输入名称！',
                  required:true,
                },
              ],
              initialValue:editItem.name || '',
            })(<Input  placeholder="名称" />)}
          </FormItem>
          <div style={{height:20,marginBottom:8}}>
            <div className="floatLeft margin-top-10" style={{width:'100%',borderBottom:'1px solid rgb(217,217,217)'}} />
          </div>
        </Form>
        <div>
          {
            setData.map((item,index)=>{
              return (
                <div key={index} className="border margin-bottom-10" style={{padding:'16px 0'}}>
                  <Row className="line-height32">
                    <Col span={24}><div style={{textAlign: 'center',fontSize: '20px',marginBottom: '15px'}}>{item.preRel && (item.preRel === 'or' ? '或条件' : '且')}</div></Col>
                    <Col span={4} className="textRight">变量：</Col>
                    <Col span={6}>
                      <CommonSelect
                        value={item.ptype}
                        onChange={(value)=>{this.handleReplayTypeChange(value,index)}}
                        style={{ width:'100%'}}
                        optionData={{datas:quickReplayType || []}}
                      />
                    </Col>
                    <Col span={11} offset={1}>
                      { this.renderTypeValue(item,index)}
                    </Col>
                    <Col span={2} className="textCenter">
                      <Icon onClick={() =>{this.handleRemove(index,item.id)}} className="pointer" type="minus-circle-o" />
                    </Col>
                  </Row>
                  <Row  className="line-height32" style={{marginTop:8}}>
                    <Col span={4} className="textRight">条件：</Col>
                    <Col span={6}>
                      <CommonSelect
                        onChange={(value)=>{this.changeValue(index,value,'t')}}
                        value={item.t || !!intentionOperatorList.length && intentionOperatorList[0].code}
                        style={{ width:'100%'}}
                        optionData={{datas:intentionOperatorList,optionId:'code',optionName:'description'}}
                      />
                    </Col>
                  </Row>
                </div>
              )
            })
          }
          <div style={{width: '100%',display: 'flex',justifyContent: 'space-around'}}>
            <span onClick={() =>this.handleAddNew('or')} style={{lineHeight: '40px',padding: '0 20px',fontSize: '24px',color: 'rgb(41, 141, 248)',cursor: 'pointer'}}>OR<Icon type="plus" /></span>
            <span onClick={() => this.handleAddNew('and')} style={{lineHeight: '40px',padding: '0 20px',fontSize: '24px',color: 'rgb(41, 141, 248)',cursor: 'pointer'}}>AND<Icon type="plus" /></span>
          </div>
          
        </div>
      </Modal>
    )
  }
}
