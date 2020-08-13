import React from 'react';
import {Switch, Input, Row, message, Spin, Form, Icon, InputNumber} from 'antd';
import {isEnableIntent} from '../../../../../services/sceneApiList.js'
import styles from '../index.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};
@Form.create()
export default class AddSceneIntention extends React.Component {
  state = {
    id:this.props.intention.id || '',
    name: this.props.intention.name||'',
    code: this.props.intention.code || '',
    describes: this.props.intention.describes || '',
    isBuiltin: '1',
    isEnable: this.props.intention.isEnable || '1',
    priority: this.props.intention.priority || null,
    isTrigger:this.props.intention.isTrigger || '1',
    status: '',
  };


  componentWillMount() {

  };

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillReceiveProps(nextProps) {
    const {intention} = nextProps;
    const {id = '', name = '', code = '', isEnable = '1',describes='',priority = null} = intention;
    if (id !== this.state.id ||
      name !== this.state.name ||
      code !== this.state.code ||
      isEnable !== this.state.isEnable||
      describes !== this.state.describes || 
      priority !== this.state.priority
      ) {
      this.setState({
        id, name, code, isEnable, describes,priority,
      });
    }
    if (id !== this.state.id) {
      this.props.form.resetFields()
    }
  };

  

  onIntentionChange = (value) => {
    const {id} = this.state
    if (id) {
      this.setState({isEnable: value ? '1':'0'})
      this.props.changSelectItem({
        ...this.props.intention,
        isEnable: value ? '1' : '0',
      })
      isEnableIntent({intentId: id,isEnable: value ? '1':'0'})
    }
  }

  // 提交
  handleOk = () => {
    const { form:{ validateFieldsAndScroll }} = this.props;
    validateFieldsAndScroll((error,values) => {
      if(error) return;
      const {id,isBuiltin, isTrigger, isEnable, status} = this.state;
      const {onOk, sceneId} = this.props;
      const obj = {...values,sceneId,id, isBuiltin, isTrigger, isEnable, status};
      if (onOk) onOk(obj, () => {
        message.success(id ? '修改成功' : '添加成功');
        if (!id) this.props.form.resetFields();
        // this.setState({myname: values.name})
       
      });
    })
  };


  render() {
    const {loading,form:{getFieldDecorator}} = this.props;
    const {intention:{ name='', code='',describes='',priority = null}} = this.props;
    const { isEnable } = this.state;
    return (
      <Spin spinning={loading}>
        <div className={styles.alterContainer}>
          <p className={styles.title} style={{padding:'10px'}}>基础信息</p>
          <Form  className={styles.formContainer}>
            <Row>
              <FormItem  {...formItemLayout} label="意图名称">
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请填写意图名称',
                  }],
                  initialValue: name,
                })(
                  <Input placeholder="请输入意图名称" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem  {...formItemLayout} label="意图编码">
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    message: '请输入意图编码',
                  }],
                  initialValue:code,
                })(
                  <Input placeholder="请输入意图编码" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem  {...formItemLayout} label="意图描述">
                {getFieldDecorator('describes', {
                  rules: [{
                    required: true,
                    message: '请输入意图描述',
                  }],
                  initialValue: describes,
                })(
                  <Input placeholder="请输入意图描述" />
                )}
              </FormItem>
            </Row>
            
            <Row>
              <FormItem {...formItemLayout} label="是否场景触发意图：">
                {getFieldDecorator('isTrigger', {
                  initialValue:isEnable,
                })(
                  <Switch
                    onChange={(ischecked) => {
                      this.onIntentionChange(ischecked)
                    }}
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="cross" />}
                    checked={isEnable === '1'}
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem  {...formItemLayout} label="意图优先级">
                {getFieldDecorator('priority', {
                  rules: [{
                    required: true,
                    message: '请输入意图优先级',
                  }],
                  initialValue: priority,
                })(
                  <InputNumber min={0} placeholder="请输入意图优先级" style={{width: '100%'}} />
                )}
              </FormItem>
            </Row>
          </Form>
          {/* <div className={styles.buttonContainer}>
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              保存
            </Button>
            <Button key="back" onClick={closeModal}>取消</Button>
          </div> */}
        </div>
      </Spin>
    );
  }
}
