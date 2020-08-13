import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, message } from 'antd';
import { getResMsg } from '../../../utils/codeTransfer';
import CommonTreeSelect from '../../../components/CommonTreeSelect';
import { getOrganByUser } from '../../../services/api';

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
@connect(({ knowledgeTab }) => ({ knowledgeTab }))
export default class AddEditModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      orgScope: [],
    };
  }
  componentDidMount() {
    this.getOrganInfo();
    const { dispatch, knowledgeTab: { organByUser = [] } } = this.props;
    if (!organByUser.length) {
      dispatch({ type: 'knowledgeTab/fetchGetOrganByUser', payload: { parent: 0 } });
    }
  }
  onLoadData = treeNodeProps =>
    new Promise(resolve => {
      getOrganByUser({ parent: treeNodeProps.id ? treeNodeProps.id : treeNodeProps[0].id }).then(
        res => {
          resolve(res.data);
        }
      );
    });
  getOrganInfo = () => {
    const { editId, editItem = {} } = this.props;
    if (editId) {
      this.setState({
        orgScope: editItem.organs.map(v => {
          return {value: v.id, label: v.name}
        }),
      })
    }
  };
  handleOk = () => {
    const { orgScope } = this.state;
   
    const {
      form: { validateFieldsAndScroll },
      editId = '',
      editItem = {},
      dispatch,
      closeModal,
      onOk,
    } = this.props;
    closeModal();
    const myorgId = orgScope.map(v => v.value).join(',')
    validateFieldsAndScroll((errors, valus) => {
      if (errors) return;
      let obj = { ...valus };
      if (editId) {
        obj = {
          ...obj,
          id: editId,
        };
      }
      const node = {
        ...obj,
        ...editItem,
        orgScope: myorgId,
        cate: valus.cate.replace(/(^\s*)|(\s*$)/g, ''),
        code:'',
      };
      delete node.orgScopeInfo;
      delete node.organs;
      dispatch({ type: 'knowledgeTab/fetchSaveCate', payload: node }).then(res => {
        if (!res) return;
        if (res.status === 'OK') {
          message.success(editId ? '修改成功' : '新增成功');
          if (onOk) onOk();
          
        } else {
          message.error(getResMsg(res.msg));
        }
      });
    });
  }
  organSelectChange = (value) => {
    this.setState({orgScope: value})
  }
  render() {
    const {
      visible = false,
      knowledgeTab: { organByUser = [] },
      editItem = {},
      closeModal,
      editId = '',
      form: { getFieldDecorator },
    } = this.props;
    const { orgScope } = this.state;
    return (
      <Modal
        title={editId ? '修改知识库' : '新增知识库'}
        visible={visible}
        onCancel={closeModal}
        onOk={this.handleOk}
        maskClosable={false}
      >
        <Form>
          <FormItem {...formItemLayout} label="知识库名">
            {getFieldDecorator('cate', {
              rules: [
                {
                  required: true,
                  message: '请输入知识库名称！',
                },
                {
                  validator: (rule, value, callback) => {
                    if (value === '' || /^\s*$/g.test(value)) {
                      callback('请输入知识库名称！');
                    } else {
                      callback();
                    }
                  },
                },
              ],
              initialValue: editItem.cate,
            })(<Input placeholder="请输入目录名称" />)}
          </FormItem>
          {editItem.cate && (
            <FormItem {...formItemLayout} label="目录编码">
              {getFieldDecorator('code', {
                rules: [],
                initialValue: editItem.code,
              })(<Input readOnly />)}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="部门">
            {getFieldDecorator('orgScope', {
              rules: [
                {
                  required: false,
                  message: '请输入部门名称！',
                },
              ],
              initialValue: orgScope,
            })(
              <CommonTreeSelect
                onChange={this.organSelectChange}
                treeCheckStrictly
                defaultVal={orgScope}
                treeCheckable="true"
                loadCallBack={this.onLoadData}
                treeData={organByUser}
                nofilter="true"
                type={{ value:"id", name:"name"}}
                placeholder="请选择"
                ref={ele => {
                    this.treeRef = ele;
                  }}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
