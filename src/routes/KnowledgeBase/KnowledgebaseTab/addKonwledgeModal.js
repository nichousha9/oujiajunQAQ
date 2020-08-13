/* eslint-disable import/first */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Modal, Button,DatePicker,Input,Form,message  } from 'antd';
import CommonEditor from '../../../components/CommonEditor';
import CommonTreeSelect from "../../../components/CommonTreeSelect";
import moment from 'moment';
import {getMonmentByms} from "../../../utils/utils";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
@Form.create()
export default class AddKonwledgeModal extends React.Component{
  onOk = () => {
    const { closeModal } = this.props;
    if(closeModal) closeModal(); // 在父级关闭掉Modal
    // 操作添加
  }
  editorChange = (content) => {
    const { form:{ setFieldsValue }} = this.props;
    setFieldsValue({ content});
  }
  handleOk = () => {
    const { kdbid,curData, onOk, form:{ getFieldsValue, validateFields }} = this.props;
    validateFields((errors) => {
      if(errors) return;
      const temp = getFieldsValue();
      temp.begintime = moment(new Date(temp.time[0]._d)).format('YYYY-MM-DD HH:mm:ss');
      temp.endtime = moment(new Date(temp.time[1]._d)).format('YYYY-MM-DD HH:mm:ss');
      temp.kdbid = kdbid;
      if(curData.id){
        temp.id = curData.id;
      }
      delete temp.time;
      onOk(temp,() => {
        message.success(curData.id ? '修改成功' : '添加成功');
      })
    });
  }
  render(){
    const { curData,visible, closeModal,treeData, form : {getFieldDecorator}} = this.props;
    return (
      <Modal
        maskClosable={false}
        visible={visible}
        title={curData.id ? '修改知识点' : "新增知识点"}
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{padding:0}}
        footer={[
          <Button key="back" onClick={closeModal}>取消</Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            提交
          </Button>,
        ]}
      >
        <Form onSubmit={this.handleSubmit}  style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} hasFeedback label="标题">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请输入标题',
                },
              ],
              initialValue : curData.title || '',
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...formItemLayout} hasFeedback label="内容">
            {getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: '请输入标题',
                },
              ],
              initialValue : curData.content || '',
            })(<CommonEditor defaultValue={curData.content} onChangeCallBack={this.editorChange} />)
            }
          </FormItem>
          <FormItem {...formItemLayout}  label="时效">
            <div>
              {getFieldDecorator('time', {
                rules: [
                  {
                    required: true,
                    message: '请选择开始结束时间',
                  },
                ],
              })(
                <RangePicker
                  format="YYYY/MM/DD"
                  hasFeedback
                  defaultValue={[getMonmentByms(curData.begintime ),getMonmentByms(curData.endtime)]}
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </div>
          </FormItem>
          <FormItem {...formItemLayout}  label="分类">
            <div>
              {getFieldDecorator('catecodeid', {
                rules: [
                  {
                    required: true,
                    message: '分类',
                  },
                ],
                initialValue : curData.catecodeid|| '',
              })(
                <CommonTreeSelect treeData={treeData} />
              )}
            </div>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
