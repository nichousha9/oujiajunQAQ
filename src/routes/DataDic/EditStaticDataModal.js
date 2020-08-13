import React from 'react';
import { connect } from 'dva';
import { Modal,Form,Input,message} from 'antd';
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

@connect(({staticData})=>({staticData}))
@Form.create()
export default class EditStaticDataModal extends React.PureComponent{
  state={
    editItem:{},
  }
  componentDidMount(){
    const { editId = '',dispatch } = this.props;
    // 获取信息
    if(editId){
      dispatch({
        type:'staticData/fetchGetCurData',
        payload:{id: editId},
      }).then((res)=>{
        if(res && res.status === 'OK'){
          this.setState({editItem: res.data})
        }
      })
    }
  }
  // 保存信息
  handleOk =() =>{
    const { form: { validateFieldsAndScroll} ,editId='',dispatch,closeModal,onOk} = this.props;
    validateFieldsAndScroll((errors,valus)=>{
      if(errors) return;
      let obj ={ ...valus};
      if(editId){
        obj = {
          ...obj,
          id:editId,
        }
      }
      dispatch({ type:'staticData/fetchSaveData',payload: obj}).then((res) =>{
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
    const { editId='',closeModal,visible=false,form:{getFieldDecorator}} = this.props;
    const { editItem={} } = this.state;
    return (
      <Modal
        visible={visible}
        onOk={this.handleOk}
        onCancel={closeModal}
        title={editId ? '修改静态数据' : '新增静态数据'}
      >
        <Form>
          <FormItem {...formItemLayout} label="数据名" >
            {getFieldDecorator('paramName', {
              rules: [
                {
                  required: true,
                  message: '请输入数据名称！',
                },
              ],
              initialValue: editItem.paramName,
            })(<Input placeholder="请输入数据名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据编码" >
            {getFieldDecorator('paramCode', {
              rules: [
                {
                  required: true,
                  message: '请输入数据编码！',
                },
              ],
              initialValue: editItem.paramCode,
            })(<Input placeholder="请输入数据编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="数据值" >
            {getFieldDecorator('paramVal', {
              rules: [
                {
                  required: true,
                  message: '请输入数据值！',
                },
              ],
              initialValue: editItem.paramVal,
            })(<Input placeholder="请输入数据值" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注" >
            {getFieldDecorator('memo', {
              initialValue: editItem.memo || '',
            })(<Input placeholder="备注" />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
