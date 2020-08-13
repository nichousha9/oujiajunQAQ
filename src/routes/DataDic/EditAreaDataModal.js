import React from 'react';
import { connect } from 'dva';
import { Modal,Form,Input,message } from 'antd';
import { getResMsg } from '../../utils/codeTransfer';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
const FormItem = Form.Item;
@connect(({areaDataManager})=>({areaDataManager}))
@Form.create()

export default class EditAreaDataModal extends React.PureComponent{
  handleOk = ()=>{
    const { form: { validateFieldsAndScroll} ,editId='',dispatch,closeModal,onOk,parentId} = this.props;
    validateFieldsAndScroll((errors,valus)=>{
      if(errors) return;
      let obj ={ ...valus};
      if(editId){
        obj = {
          ...obj,
          regionid:editId,
        }
      }
      dispatch({ type:'areaDataManager/fetchSaveRegion',payload: { ...obj,parentid:parentId}}).then((res) =>{
        if(!res) return;
        if(res.status === 'OK'){
          message.success(editId ? '修改成功': '新增成功');
          if(closeModal) closeModal();
          if(onOk) onOk();
        }else{
          message.error(getResMsg(res.msg));
        }
      })
    })
  }
  render(){
    const { visible= false,closeModal,editId,editItem={},form:{getFieldDecorator}} = this.props;
    return(
      <Modal
        width="700px"
        visible={visible}
        onOk={this.handleOk}
        onCancel={closeModal}
        title={editId ? '修改地区' : '新增地区'}
      >
        <Form>
          <FormItem {...formItemLayout} label="地区名称" >
            {getFieldDecorator('regionname', {
              rules: [
                {
                  required: true,
                  message: '请输入地区名称！',
                },
              ],
              initialValue: editItem.regionname,
            })(<Input placeholder="请输入地区名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="地区备注" >
            {getFieldDecorator('regiondesc', {
              initialValue: editItem.regiondesc,
            })(<Input placeholder="备注" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
