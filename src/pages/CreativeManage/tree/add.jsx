import React, { Component } from 'react';
import { Form, Radio, Input, Button, message } from 'antd';
import { connect } from 'dva/index';
import styles from '../index.less';

const formItemLayout = {
  labelCol: {
    span: 4,
    offset: 2,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({ loading }) => ({
  loadingCopy: loading.effects['creativeIdeaManage/copyAdviceType'],
  loadingMove: loading.effects['creativeIdeaManage/changeAdviceType'],
}))
@Form.create()
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddChild: true,
      treeObj: props.treeObj,
    };
  }

  componentDidMount() {
    const { treeObj } = this.state;
    const { form } = this.props;
    form.setFieldsValue({
      parentName: treeObj && treeObj.title,
      name: '',
      description: '',
    });
  }

  // 切换是否显示父级目录
  changeAddModel = obj => {
    const { value } = obj.target;
    this.setState({
      isAddChild: value === 'addChild',
    });
  };

  // 新增
  okAdd = () => {
    const { treeObj } = this.state;
    const { dispatch, form, getData } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { model, name } = values;
        const params = {
          adviceTypeSortName: name,
          adviceCatg: treeObj.adviceCatg,
          spId: treeObj.spId,
          parentAdviceTypeSortId: model === 'addChild' ? treeObj.key : null,
          pathCode: model === 'addChild' ? treeObj.pathCode : null,
        };
        dispatch({
          type: 'creativeIdeaManage/addAdviceTypeSort',
          payload: params,
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode === 0) {
            getData();
            this.closeModalCancel();
          } else {
            // 提示用户重新输入
            message.error(res.topCont.remark);
          }
        });
      }
    });
  };

  // 关闭弹窗
  closeModalCancel = () => {
    const { closeModalCancel } = this.props;
    closeModalCancel();
  };

  render() {
    const { isAddChild } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.add}>
        <Form {...formItemLayout}>
          <Form.Item>
            {getFieldDecorator('model', {
              rules: [],
              initialValue: 'addChild',
            })(
              <Radio.Group onChange={this.changeAddModel}>
                <Radio value="addChild">新增子目录</Radio>
                <Radio value="addRoot">新增根目录</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          <Form.Item label="父级目录" style={{ display: isAddChild ? 'block' : 'none' }}>
            {getFieldDecorator('parentName', {
              rules: [],
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="目录名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入目录名称' }],
            })(<Input />)}
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.okAdd}>
            确认
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.closeModalCancel}>取消</Button>
        </div>
      </div>
    );
  }
}

export default Add;
