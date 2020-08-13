/* eslint-disable no-param-reassign */
import React from 'react';
import { connect } from 'dva';
import { Modal,Form,Input,message,InputNumber,Checkbox,Icon, Row, Col } from 'antd';
import CommonSelect  from '../../../components/CommonSelect';
import StandardTable  from '../../../components/StandardTable';
import CommonAddNew from '../../../components/CommonAddNew'
import styles from './SettingBranch.less'
import { uuid } from '../../../utils/utils';

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 3,
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
export default class SettingBranchModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      editItem: this.props.editItem || {},
      tableData: [],
      replyIndex: 0, // 编辑反问,在表格所在index
      replyVisible: false, // 编辑反问弹窗的modal的visible
      slotAskList: [{uuid: uuid(10)}], // 编辑反问列表
    }
  }
  
  componentDidMount() {
    const { dispatch ,editItem,sceneId} = this.props;
    dispatch({
      type:'sceneDialogNode/fetchGetIntentionList',
      payload:{
        sceneid:sceneId,
        p:1,
        ps: 1000,
      },
    }).then(()=>{
      if(!!editItem.isSet && !!editItem.id){
        dispatch({
          type:'sceneDialogSetting/getSlotDetail',
          payload:{charId:editItem.id,sceneId},
        }).then(res => {
          const {sceneChat={},sceneSlot={}} = res.data
          const {slotParamList=[]} = sceneSlot
          if(sceneChat.id === editItem.id){
            // const { rules = "[]" } = curSettingNode;
            const rules = slotParamList.map(rule => {
              const askList = rule.slotAskList.map(list => {
                return {
                  ...list,
                  uuid: uuid(10),
                }
              })
              Object.assign(rule,{isArr: rule.isArr === '1',uuid: uuid(10),slotAskList: askList})
              return rule
            })
            this.setState({
              editItem: {...editItem,name: sceneChat.name,reply: sceneSlot.reply,intentId: sceneSlot.intentId,changeId: sceneSlot.id},
              tableData: rules,
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
  // 验证当前提交数据是否完整
  isEmptyItem =(item) =>{
    return !item.paramName || !item.times || !item.wordId || !item.wordId || !item.slotAskList ||!item.slotAskList.length;
  }
  changeIntention = ( value ) => {
    const { form:{ setFieldsValue }} = this.props;
    setFieldsValue({intentId: value});
  }
  changeValue = (value,record,index,type) => {
    const {tableData} = this.state
    record[type] = value
    tableData.splice(index,1,record)
    this.setState({tableData})
  }
  // 点开编辑反问的modal
  askBack = (data,record,index) => {
    this.setState({
      replyIndex: index,
      replyVisible: true,
      slotAskList: record.slotAskList ? record.slotAskList : [{uuid: uuid(10)}],
    })
  }
  // 新增反问参数
  addAsk = () => {
    const {slotAskList} = this.state
    this.setState({slotAskList: [...slotAskList,{uuid: uuid(10)}]})
  }
  // 删除反问
  deleteAsk = (index) => {
    const {slotAskList} = this.state
    if (!slotAskList.length) {
      message.warning("这是最后一个反问问题不能删除")
    }
    if (!slotAskList[index].id) {
      slotAskList.splice(index,1)
      this.setState({slotAskList})
    } else {
      Modal.confirm({
        title: '确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk:() => {
          const {dispatch} = this.props
          dispatch({
            type:'sceneDialogSetting/deleteSlotAsk',
            payload: {slotAskId: slotAskList[index].id},
          }).then(res => {
            if (res.status === "OK") {
              slotAskList.splice(index,1)
              this.setState({slotAskList})
              message.success('删除成功！')
            }
          })
        },
      });
    }
  }
  // 反问的输入框变化
  askChange = (value,item,index) => {
    Object.assign(item,{ask: value})
    const {slotAskList} = this.state
    slotAskList.splice(index,1,item)
    this.setState({slotAskList})
  }
  closeReplyModal = () => {
    this.setState({replyVisible: false})
  }
  handleReplyOK = () => {
    const {slotAskList,replyIndex,tableData} = this.state
    const isEmpty = slotAskList.some((item)=>{
      return !item.ask;
    })
    if(isEmpty){
      message.error('当前数据不完整');
      return;
    }
    tableData[replyIndex].slotAskList = slotAskList
    this.setState({tableData,replyVisible: false})
  }
  // 增加新的参数
  addNew = () => {
    const {tableData} = this.state
    this.setState({tableData: [...tableData,{uuid: uuid(10)}]})
  }
  // 删除参数
  deleteRow = (record,index) => {
    if (!record.slotId) {
      const {tableData} = this.state
      tableData.splice(index,1)
      this.setState({tableData})
    } else {
      Modal.confirm({
        title: '确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk:() => {
          const {dispatch} = this.props
          dispatch({
            type:'sceneDialogSetting/deleteSlotParam',
            payload: {slotParamId: record.id},
          }).then(res => {
            if (res.status === "OK") {
              const {tableData} = this.state
              tableData.splice(index,1)
              this.setState({tableData})
              message.success('删除成功！')
            }
          })
        },
      });
    }
    
  }

  // 显示提示语的函数
  handleShow = (res) =>{
    const { closeModal } = this.props;
    if(res && res.status==='OK'){
      closeModal();
      message.success('操作成功');
    }
  }
  // 槽点设置点击OK
  handleOnOK = () => {
    const { onHandleOk,sceneId,form: { validateFieldsAndScroll } } = this.props;
    let {tableData} = this.state
    const {editItem={}} = this.state
    validateFieldsAndScroll((err, values)=>{
      if(err) return;
      // if(editItem.id && editItem.isSet){
      //   obj.id = editItem.id;
      // }
      const isEmpty = tableData.some((item)=>{
        return this.isEmptyItem(item);
      })
      tableData = tableData.map(v => {
        const obj = {
          paramName: v.paramName,
          times:  v.times,
          wordId: v.wordId,
          isArr:  v.isArr ? '1' : '0',
        }
        const mySlotAskList = v.slotAskList.map(val => {
          const it = {
            ask: val.ask,
          }
          if (val.id && editItem.isSet) {
            it.id = val.id
          }
          return it
        })
        if (v.id && editItem.isSet) {
          obj.id = v.id
        }
        Object.assign(obj,{slotAskList: mySlotAskList})
        return obj
      })
      if(isEmpty){
        message.error('当前数据不完整');
        return;
      }
      const newSetData = {
        sceneId,
        "intentId": values.intentId,
        "reply": values.reply,
        "charName": values.name,
        slotParamList: tableData,
      }
      if (editItem.isSet) {
        newSetData.id = editItem.changeId
        newSetData.charId = editItem.id
      }
      
      let patch = 'sceneDialogSetting/insertSlot'
      if (editItem.isSet) patch = 'sceneDialogSetting/updateSlot'
      if(onHandleOk) onHandleOk({sceneSlotObject: JSON.stringify(newSetData)},this.handleShow, patch)

    })
  }
  render(){
    const { form:{getFieldDecorator},visible,closeModal, sceneDialogNode:{ intentionList=[],sceneSlotsList=[] },loading } = this.props;
    const { editItem,tableData, slotAskList, replyVisible } = this.state;
    const columns = [
      {
        title: '参数',
        dataIndex: 'paramName',
        align: 'center',
        width: 150,
        render:(data,record,index) => {
          return (
            <Input defaultValue={data} onChange={(e) => this.changeValue(e.target.value,record,index,'paramName')} />
          )
        },
      },
      {
        title: '专有名词',
        dataIndex: 'wordId',
        align: 'center',
        width: 200,
        render:(data,record,index) => {
          return (
            <CommonSelect
              onChange={(value)=>{this.changeValue(value,record,index,'wordId')}}
              value={data}
              style={{ width:'100%'}}
              optionData={{datas:sceneSlotsList,optionId:'id',optionName:'sortName'}}
            />
          )
        },
      },
      {
        title: '生命周期',
        dataIndex: 'times',
        align: 'center',
        width: 150,
        render:(data,record,index) => {
          return (
            <InputNumber defaultValue={data ? Number(data) : ''} onChange={(value) => this.changeValue(value,record,index,'times')} />
          )
        },
      },
      {
        title: '数组',
        align: 'center',
        dataIndex: 'isArr',
        width: 60,
        render:(data,record,index) => {
          return (
            <Checkbox defaultChecked={data} onChange={(e) => this.changeValue(e.target.checked,record,index,'isArr')} />
          )
        },
      },
      {
        title: '反问',
        align: 'center',
        dataIndex: 'slotAskList',
        width: 60,
        render:(data,record,index) => {
          return (
            <Icon type="edit" onClick={() => this.askBack(data,record,index)} style={{color: '#1DA57A',cursor: 'pointer'}} />
          )
        },
      },
      {
        title: '操作',
        align: 'center',
        dataIndex: 'operate',
        width: 60,
        render:(data,record,index) => {
          return (
            <Icon type="delete" onClick={() => this.deleteRow(record,index)} style={{color: '#1DA57A',cursor: 'pointer'}} />
          )
        },
      },
      
    ];
    const tableProps = {
      loading,
      rowKey:'uuid',
      noTotalPage:true,
      data:{
        list: tableData,
        pagination:false,
      },
      columns,
      pagination:false,
    }
    return (
      <Modal
        width="800px"
        maskClosable={false}
        onCancel={closeModal}
        onOk={this.handleOnOK}
        visible={visible}
        title={editItem.name?'修改填槽节点设置': '新增填槽节点'}
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
          <FormItem  {...formItemLayout} label="选择意图">
            {getFieldDecorator('intentId', {
              rules: [
                {
                  message: '请输入意图！',
                  required:true,
                },
              ],
              initialValue:editItem.intentId || '',
            })(
              <CommonSelect
                onChange={(value)=>{this.changeIntention(value)}}
                style={{ width:'100%'}}
                optionData={{datas:intentionList}}
              />
            )}
          </FormItem>
          <div className={styles.title}>参数设置</div>
          <StandardTable {...tableProps} />
          <Modal
            onCancel={this.closeReplyModal}
            onOk={this.handleReplyOK}
            visible={replyVisible}
            title='缺失该参数时进行反问'
          >
            <Row>
              <Col span={6}>反问问题：</Col>
              <Col span={16}>
                {
                  slotAskList.map((item,index) => (
                    <div key={item.uuid} className={styles.replyItem}>
                      <Input defaultValue={item.ask} onChange={(e) => this.askChange(e.target.value,item,index)} placeholder="请输入反问问题" />
                      <Icon type="delete" onClick={() => this.deleteAsk(index)} style={{fontSize: '20px',color: 'rgb(41, 141, 248)'}} />
                    </div>
                  ))
                }
                <div onClick={this.addAsk} className={styles.addAsk}>
                  <Icon type="plus" />
                  <span>新增反问问题</span>
                </div>
              </Col>
            </Row>
          </Modal>
          <CommonAddNew className="margin-bottom-10" onClick={this.addNew} />
          <div className={styles.title}>失败回复</div>
          <FormItem>
            {getFieldDecorator('reply', {
              rules: [
                {
                  message: '请输入名称！',
                  required:true,
                },
              ],
              initialValue:editItem.reply || '',
            })(
              <TextArea rows={4} placeholder="请输入失败回复" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
