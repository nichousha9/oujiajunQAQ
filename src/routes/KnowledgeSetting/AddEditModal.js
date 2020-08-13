import React from 'react';
import { connect } from 'dva';
import { Modal,Form,Input ,message} from 'antd';
import { getResMsg } from '../../utils/codeTransfer';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
@connect(({knowledgeTreeSetting}) =>({knowledgeTreeSetting}))
@Form.create()
export default class AddEditModal extends React.PureComponent{
  handleOk =() =>{
    const { form: { validateFieldsAndScroll} ,editId='',editItem={},dispatch,closeModal,onOk} = this.props;
    validateFieldsAndScroll((errors,valus)=>{
      if(errors) return;
      let obj ={ ...valus};
      if(editId){
        obj = {
          ...obj,
          id:editId,
        }
      }
      dispatch({ type:'knowledgeTreeSetting/fetchSaveCate',payload: {...obj,...editItem}}).then((res) =>{
        if(!res) return;
        if(res.status === 'OK'){
          message.success(editId ? '修改成功': '新增成功');
          if(closeModal) closeModal();
          // 修改，新建成功过后的操作
          if(onOk) onOk();
        }else{
          message.error(getResMsg(res.msg));
        }
      })
    })
  }
  render(){
    const { visible= false,editItem={},closeModal,editId='',form:{getFieldDecorator}} = this.props;
    return (
      <Modal
        title={editId ? '修改目录' : '新增目录'}
        visible={visible}
        onCancel={closeModal}
        onOk={this.handleOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="目录名称" >
            {getFieldDecorator('cate', {
              rules: [
                {
                  required: true,
                  message: '请输入目录名称！',
                },
              ],
              initialValue: editItem.cate,
            })(<Input placeholder="请输入目录名称" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
