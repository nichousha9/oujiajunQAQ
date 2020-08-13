import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
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
class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeObj: props.treeObj,
    };
  }

  componentDidMount() {
    const { form } = this.props;
    form.setFieldsValue({
      name: '',
    });
  }

  // 新增
  okUpdate = () => {
    const { treeObj } = this.state;
    const { dispatch, form, getData } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { name } = values;
        const params = {
          adviceTypeSortName: name,
          adviceTypeSortId: treeObj.key,
          adviceCatg: treeObj.adviceCatg,
          spId: treeObj.spId,
          parentAdviceTypeSortId: treeObj.parentKey,
          pathCode: treeObj.pathCode,
        };
        dispatch({
          type: 'creativeIdeaManage/modAdviceTypeSort',
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
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.update}>
        <Form {...formItemLayout}>
          <Form.Item label="目录名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入目录名称' }],
            })(<Input />)}
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.okUpdate}>
            确认
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.closeModalCancel}>取消</Button>
        </div>
      </div>
    );
  }
}

export default Update;
