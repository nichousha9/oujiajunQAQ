import React from 'react';
import { Modal,Form ,Input,message} from 'antd';
import { connect } from'dva';
import CommonTreeSelect from '../../../components/CommonTreeSelect';
import { getResMsg } from '../../../utils/codeTransfer';


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
@connect((props) => {
  const { editOrganization} = props;
  return {editOrganization};
})
@Form.create()
export default class EditOrgModal extends React.Component{
  state = {
    // classlist: this.props.classlist || [],
  }
  areaHandleChange= (value) => {
    const { form:{ setFieldsValue} } = this.props;
    setFieldsValue({area:value});
  }
  // switchChange = (value) => {
  //   const { form:{ setFieldsValue} } = this.props;
  //   setFieldsValue({skill:value});
  //   this.setState({skill: value});
  // }
  parentChange = (value) => {
    const { form:{ setFieldsValue} } = this.props;
    setFieldsValue({parent:value});
  }
  handleOk = () =>{
    const { onOk,org = {},dispatch,form: { validateFieldsAndScroll }} = this.props;
    validateFieldsAndScroll((err, values) => {
      if(err) return;
        const obj = org.id ? { id: org.id } : {};
      dispatch({
        type:org.id ? 'editOrganization/fetchOrgUpdate':'editOrganization/fetchOrgSave',
        payload: {...obj,...values, ...{parent: values.parent || '0'}},
      }).then((res) => {
        if(res && res.status!=='OK') {
          message.error(getResMsg(res.msg));
          return;
        }
        message.success(org.id ? '修改成功' : '添加成功');
        if(onOk) onOk();
      })
    })
  }
  render(){
    const { treeData,form :{getFieldDecorator},onCancel,visible,org={}, loadCallBack} = this.props;
    // const { classlist } = this.state;
    const parentObj = {
      message: '请选择上级结构',
    }
    if(org.parent !== 0 && org.parent !=='0'){
      parentObj.required = true;
    }
    return(
      <Modal
        title={!org.id ? '新建部门': '修改部门'}
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
      >
        <div className="commonModal">
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="部门" >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入部门名称！',
                  },
                ],
                initialValue:org.name || '',
              })(<Input  placeholder="部门" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="上级结构" >
              {getFieldDecorator('parent', {
                rules: [
                  {...parentObj},
                ],
                initialValue:org.parent && org.parent !== '0' ? org.parent : null,
              })(<CommonTreeSelect loadCallBack={loadCallBack} treeDefaultExpandAll onChange={this.parentChange} treeData={treeData} nofilter="true" type={{ value:"id", name:"name"}} placeholder="上级结构" />)}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="启用技能组" >
              {getFieldDecorator('skill', {
                rules: [
                  {
                    required: true,
                    message: '请选择技能组！',
                  },
                ],
                initialValue:org.skill || false,
              })(
                <Switch defaultChecked={!!org.skill} checkedChildren="开启" unCheckedChildren="关闭" />
              )}
            </FormItem> */}
            {/* <FormItem {...formItemLayout} label="所属区域" >
              {getFieldDecorator('area', {
                rules: [],
                initialValue:org.area || '',
              })(<CommonTreeSelect onChange={this.areaHandleChange} treeData={areaList} nofilter="true" type={{ value:"regionId", name:"regionName"}} placeholder="所属区域" />)}
            </FormItem> */}
            {/* <FormItem
              {...formItemLayout}
              label="组织级别"
            >
              {getFieldDecorator('orgClass', {
                initialValue: org.orgClass,
                rules: [ {required: false, message: '请选择组织级别'} ],
              })(
                <Select>
                  { classlist.map((item)=>(<Option key={item.id} value={item.orgClass}>{item.className}</Option>)) }
                </Select>
              )}
            </FormItem> */}
          </Form>
        </div>
      </Modal>
    )
  }
}
