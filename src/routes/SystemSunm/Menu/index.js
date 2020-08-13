import React from 'react';
import classnames from 'classnames';
import { message, Button,Spin, Form, Input, TreeSelect } from 'antd';
import CommonTree from '../../../components/CommonTree';
import {allAuthList} from '../../../services/systemSum';
import {addMenu, updateMenu, deleteMenu} from '../../../services/menu'
import style from './index.less';

const {TreeNode} = TreeSelect
@Form.create()

export default class Menu extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      orgLoading: false,
      submitting: false,
      organList:[],
      curOrg:{}, // 当前选中的部门
      editor: false,
    }
  }
  componentDidMount(){
    this.getMenus()
  }

  onSelectCallBack =(data) => {
    if(JSON.stringify(data)!==JSON.stringify(this.state.curOrg)){
      this.props.form.resetFields()
      this.setState({curOrg:data, editor: true});
    }
  }


  // 取消编辑
  onCancel = () => {
    this.props.form.resetFields()
    this.setState({
      curOrg: {},
      editor: false,
    })
  }

  getMenus = () => {
    this.setState({orgLoading: true})
    allAuthList().then(res => {
      if (res.status === 'OK') {
        this.setState({organList: res.data.list,orgLoading: false})
      }
    })
  }

  getTreeNode = (data = []) => {
    return data.map((item) => {
      if (item && item.children && item.children.length) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id}>
            {this.getTreeNode(item.children)}
          </TreeNode>
        )
      } else {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id} />
        )
      }
    })
  }

  // 加载下级菜单
  loadCallBack = treeNodeProps => new Promise((resolve) => {
    allAuthList({authId: treeNodeProps.id}).then(res => {
      resolve(res.data.list)
    })
  })


  // 删除节点
  handleDeleteNode = (val) => {
    deleteMenu({id: val.id}).then(res => {
      if (res && res.status === 'OK'){
        message.success('删除成功！')
        this.getMenus()
      }
    })
  }


  // 提交表单数据
  handleSubmit = () => {
    const {editor,curOrg} = this.state
    this.props.form.validateFields((err,values) => {
      if (!err) {
        this.setState({submitting: true})
        const params = {
          ...values,
          sortindex: values.sortindex || values.sortindex === '0' ? Number(values.sortindex) : null,
          // menutype: 'left',
        }
        if(!editor) {
          addMenu(params).then(res => {
            if (res && res.status === 'OK') {
              this.getMenus()
              this.onCancel()
            } else if (res && res.msg) {
              message.warning(res.msg)
            }
            this.setState({submitting: false})
          })
        } else {
          params.id = curOrg.id
          updateMenu(params).then(res => {
            if (res && res.status === 'OK') {
              this.getMenus()
              this.onCancel()
            } else if (res && res.msg) {
              message.warning(res.msg)
            }
            this.setState({submitting: false})
          })
        }
      }
    })
  }

  render(){
    // const {orgLoading}  = this.props;
    const { getFieldDecorator } = this.props.form;
    const {organList,curOrg={},orgLoading, submitting } = this.state;
    const treeProps = {
      act: true,
      treeData:organList,
      checkable:false,
      isMenu: true,
      labelObj: {id: 'id'},
      selectedKeys:[curOrg.id],
      editCallBack: this.onCancel,
      loadCallBack: this.loadCallBack,
      onSelectCallBack:this.onSelectCallBack,
      handleDeleteNode:this.handleDeleteNode,
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 16 },
      },
    };

    const clientHeight = (window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight) - 165;
    return (
      <div className={classnames("bgWhite",'border',style.menu)} >
        <Spin spinning={orgLoading}>
          <div className={classnames(style.orgLeft)} style={{overflow:'auto',height:clientHeight}}>
            <div className="title border-bottom">权限菜单</div>
            {!orgLoading && <CommonTree {...treeProps} />}
          </div>
        </Spin>
        <div className={classnames('border-left',style.orgRight)}>
          <div className={style.formContainer}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item
                {...formItemLayout}
                label="菜单名称"
              >
                {getFieldDecorator('name', {
                  rules: [{  required: true, message: '请输入菜单名称!' }],
                  initialValue: curOrg.name,
                })(
                  <Input placeholder="请输入菜单名称" />
                )}
              </Form.Item>
              <Form.Item
                // <Cascader fieldNames={{ label: 'name', value: 'id' }} options={organList} placeholder="请选择上级菜单" />
                {...formItemLayout}
                label="上级菜单"
              >
                {getFieldDecorator('parentid', {
                  initialValue: curOrg.parentid && curOrg.parentid !== '0' ? curOrg.parentid : null,
                })(
                  <TreeSelect 
                    treeDefaultExpandAll
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择上级菜单"
                  >
                    {
                      this.getTreeNode(organList)
                    }
                  </TreeSelect>
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="菜单URL"
              >
                {getFieldDecorator('url', {
                  rules: [{  required: true, message: '请输入菜单URL!' }],
                  initialValue: curOrg.url,
                })(
                  <Input placeholder="请输入菜单URL" />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="菜单图标"
              >
                {getFieldDecorator('iconstr', {
                  initialValue: curOrg.iconstr || '',
                })(
                  <Input placeholder="请输入菜单图标" />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="菜单等级"
              >
                {getFieldDecorator('mlevel', {
                  rules: [{ required: true, message: '请选择菜单等级!' }],
                  initialValue: curOrg.mlevel,
                })(
                  <Input type="number" />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="菜单排序"
              >
                {getFieldDecorator('sortindex', {
                  rules: [{ required: true, message: '请选择菜单排序!' }],
                  initialValue: curOrg.sortindex,
                })(
                  <Input type="number" />
                )}
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                label="菜单说明"
              >
                {getFieldDecorator('description', {
                  initialValue: curOrg.description || '',
                })(
                  <Input.TextArea rows={4} placeholder="请输入菜单说明" />
                )}
              </Form.Item>
              <Form.Item wrapperCol={{xs: { span: 8, offset: 16 },sm: { span: 8, offset: 16 }}} style={{ marginTop: 32 }}>
                <Button style={{ marginRight: 8 }} onClick={this.onCancel}>取消</Button>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}