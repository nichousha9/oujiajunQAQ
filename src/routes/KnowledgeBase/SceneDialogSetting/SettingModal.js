import React from 'react';
import { connect } from 'dva';
import { Modal,Spin,Form ,message,Input} from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
@Form.create()
@connect(({sceneDialogSetting})=>({sceneDialogSetting}))
export default class SettingModal extends React.PureComponent{
  componentDidMount(){
    // const { editItem={},dispatch } = this.props;
    // if(editItem.id && editItem.isSet){
    //   dispatch({
    //     type:'sceneDialogSetting/fetchGetNodeDetail',
    //     payload:{id:editItem.id},
    //   })
    // }
  }

  getCurEditItem =() => {
    const {sceneDialogSetting:{ curSettingNode={} },editItem={}} = this.props;
    if(editItem.isSet){
      return curSettingNode || {};
    }
    return editItem;
  }

  // 显示提示语的函数
  handleShow = (res) =>{
    const { closeModal } = this.props;
    if(res && res.status==='OK'){
      closeModal();
      message.success('操作成功');
    }
  }
  
  handleOk =() =>{
    const { onHandleOk,form: { validateFieldsAndScroll }, sceneId } = this.props;
    validateFieldsAndScroll((err, values)=>{
      if(err) return;
      const { editItem={} } = this.props;
      const obj = {};
      if(editItem.isSet && editItem.id){
        obj.id = editItem.id;
      }
      const patch = 'sceneDialogSetting/saveStartAndEndChatFlow'
      const params = {
        Name: values.name,
        type: editItem.shape,
        sceneId,
        Id: editItem.isSet ? editItem.id : '',
      }
      if (onHandleOk) onHandleOk(params,this.handleShow,patch)
    })
  }
  render(){
    const { loading = false,form:{getFieldDecorator},visible,closeModal,editItem } = this.props;
    const curEditItem = this.getCurEditItem();
    return(
      <Modal
        title={editItem.isSet ? '修改设置':'新建设置'}
        onOk={this.handleOk}
        onCancel={closeModal}
        visible={visible}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem  {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required:true,
                    message: '请输入名称！',
                  },
                ],
                initialValue:curEditItem.name || editItem.name || '',
              })(<Input  placeholder="名称" />)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    )
  }
}
