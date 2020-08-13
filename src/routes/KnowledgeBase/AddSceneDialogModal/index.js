import React from 'react';
import {Modal, Button, Icon, Row, Input, message, Spin, Form} from 'antd';
import { getCommonFieldDecorator } from  '../../../utils/utils';
import CommonSwitch from '../../../components/CommonSwitch';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
@Form.create()
export default class AddSceneDialogModal extends React.Component {

  // 启用/停用
  setAble = (e) => {
    const { form:{ setFieldsValue}} = this.props;
    setFieldsValue({isEnable: e});
  };


  // 提交
  handleOk = () => {
    const { sceneId,form: { validateFieldsAndScroll } } = this.props;
    validateFieldsAndScroll((err, values)=>{
      if(err) return;
      const { onOk,editData={}} = this.props;
      // 暂时原型没有的参数先默认写死
      let obj = {
        ...values,
        isEnable: values.isEnable ? '1' :'0',
        isMain:'0',// 现在默认是0
        isBuiltin:'0', // 默认是内建
        type:'002',// 默认用户建的
        sceneId,
      };
      if(editData.id){
        obj = {...obj,id:editData.id};
      }
      if (onOk) onOk(obj, () => {
        message.success(editData.id ? '修改成功' : '添加成功');
      });
    })
  };

  render() {
    const {visible, closeModal, loading,form:{getFieldDecorator},editData = {}} = this.props;
    return (
      <Modal
        className="commonModal"
        maskClosable={false}
        visible={visible}
        title={editData.id ? '编辑对话' : '新增对话'}
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{padding: 0}}
        footer={[
          <Button key="back" onClick={closeModal}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit} style={{marginTop: 8}}>
            <Row>
              <FormItem  {...formItemLayout} label="名称">
                {getFieldDecorator('name',{
                  rules: [
                    {
                      required:true,
                      message: '请输入名称！',
                    },
                  ],
                  initialValue:editData.name || '',
                })(<Input placeholder="请输入名称" />)
                }
              </FormItem>
            </Row>
            <Row>
              <FormItem  {...formItemLayout} label="描述">
                {getFieldDecorator('descript',{
                  rules: [
                    {
                      required:true,
                      message: '请输入名称！',
                    },
                  ],
                  initialValue:editData.descript || '',
                })(<Input placeholder="请输入描述" />)
                }
              </FormItem>
            </Row>
            <Row>
              <FormItem  {...formItemLayout} label="对话编码">
                {getFieldDecorator('code',{
                  rules: [
                    {
                      required:true,
                      message: '请输入对话编码！',
                    },
                  ],
                  initialValue:editData.code || '',
                })(<Input placeholder="请输入对话编码" />)
                }
              </FormItem>
            </Row>
            <Row>
              <FormItem  {...formItemLayout} label="状态">
                {getCommonFieldDecorator(getFieldDecorator,'isEnable',
                  {
                    rules: [
                      {
                        required:true,
                        message: '请输入名称！',
                      },
                    ],
                    initialValue:editData.id ? editData.isEnable==='1' : true,
                  })
                (
                  <CommonSwitch
                    onSwitch={this.setAble}
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="cross" />}
                    isSwitch={editData.id ? editData.isEnable==='1' : true}
                  />
                )
                }
              </FormItem>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
