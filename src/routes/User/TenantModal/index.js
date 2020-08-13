/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable import/first */
import React from 'react';
import { Modal, Button, message, Form, Input, Checkbox } from 'antd';
import CommonUpload from '../../../components/CommonUpload';

import { getTenantRel } from '../../../services/user';
import { connect } from 'dva';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};
const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 14, offset: 5 },
  },
};

@Form.create()
@connect((props) => {
  const { loading, tenantModal } = props;
  return {
    tenantModal,
    submitting: loading.effects['tenantModal/updateUserOwer'],
    adding: loading.effects['tenantModal/addUserOwer'],
  };
})
export default class TenantModal extends React.Component {
  state = {
    picFile: {}, // 上传的图片文件
    skillGroup: {}, // 技能组
  };
  componentDidMount() {
    const { curTenant } = this.props;
    // this.props.dispatch({
    //     type: 'tenantModal/getTenantRel',
    //     payload:{
    //          tenantid: curTenant.id || '',
    //     }
    // });
    if (curTenant.id) {
      getTenantRel({ tenantid: curTenant.id }).then((res) => {
        if (res.status === 'OK') {
          this.setState({
            skillGroup: res.data,
          });
        } else {
          message.console.error('获取技能组异常，请稍后重试');
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { onOk } = this.props;
    if (
      (this.props.submitting && !nextProps.submitting) ||
      (this.props.adding && !nextProps.adding)
    ) {
      onOk(nextProps.tenantModal.status);
      if (nextProps.tenantModal.status === 'OK') {
        this.props.closeModal();
      } else {
        message.error('操作失败，请重试！');
      }
    }
  }
  onProcess = (picFile) => {
    if (picFile && picFile[picFile.length - 1]) {
      this.setState({ picFile: picFile[picFile.length - 1] });
    }
  };
  handleOk = () => {
    const { curTenant, form } = this.props;
    const { picFile, skillGroup } = this.state;
    // 遍历当前的文件
    const isloading = picFile.status === 'uploading';
    if (isloading) {
      message.error('图片正在上传中');
      return;
    }
    // 拼接选中技能组ID
    // const { skillGroup } = this.props.tenantModal;
    let checkIDs = '';
    if (skillGroup.allSkillsCanAdd) {
      skillGroup.allSkillsCanAdd.map((skill) => {
        if (skill.checked) {
          if (checkIDs === '') {
            checkIDs = skill.id;
          } else {
            checkIDs = `${checkIDs},${skill.id}`;
          }
        }
      });
    }
    const tenantname = form.getFieldValue('tenantname');
    // 判断是更新还是新增
    let oper = 'tenantModal/updateUserOwer';
    if (this.props.operType === 'new') {
      oper = 'tenantModal/addUserOwer';
    }
    this.props.dispatch({
      type: oper,
      payload: {
        id: curTenant.id,
        tenantname,
        tenantlogo: picFile.response ? picFile.response.data.id : '', // 图片附件ID
        remark: '', // 描述
        skillids: checkIDs, // 技能组ID
      },
    });
  };
  // 组装技能组
  renderSkillGroup = () => {
    const { skillGroup } = this.state;
    const checkGroup = [];
    if (skillGroup.allSkillsCanAdd) {
      skillGroup.allSkillsCanAdd.map((skill, index) => {
        skillGroup.tenantSkillRel.map((checkedSkill) => {
          if (checkedSkill.skillid === skill.id) {
            skill.checked = true;
          }
        });
        checkGroup.push(
          <Checkbox
            defaultChecked={skill.checked}
            onChange={(e) => this.onChange(e, index)}
            key={`checkGroup${index}`}
            style={{ display: 'block', marginLeft: '8px' }}
          >
            {skill.name}
          </Checkbox>
        );
      });
    }
    return checkGroup;
  };
  // 勾选事件
  onChange = (e, index) => {
    const { skillGroup } = this.state;
    skillGroup.allSkillsCanAdd[index].checked = e.target.checked;
  };

  // 租户图片
  renderPictrue = (picFile, curTenant) => {
    if (picFile && picFile.response && picFile.response.data) {
      return <img style={{ width: 250, height: 140 }} src={picFile.response.data.url} />;
    } else if (curTenant && curTenant.logourl) {
      return <img style={{ width: 250, height: 140 }} src={curTenant.logourl} />;
    }
  };
  render() {
    const { visible, closeModal, operType, curTenant } = this.props;
    const { picFile } = this.state;
    const { getFieldDecorator } = this.props.form;

    let title = '租户编辑';
    // 新增
    if (operType === 'new') {
      title = '租户创建';
    }
    const upprops = {
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      importProps: this.props.importProps,
      onProcess: this.onProcess,
      multiple: false,
      action_url: '/smartim/system/attachment/upload',
      compo: <Button> 上传图片 </Button>,
      fileType: /(\.jpg|\.png|\.jpeg)$/,
    };
    return (
      <Modal
        className="mutilImPortModal"
        visible={visible}
        title={title}
        onOk={this.handleOk}
        onCancel={closeModal}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button key="back" onClick={closeModal}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleOk}>
            保存
          </Button>,
        ]}
      >
        <div style={{ padding: 20, paddingLeft: 40 }}>
          <div style={{ overflow: 'hidden', width: '100%', marginTop: 10 }}>
            <Form hideRequiredMark style={{ marginTop: 8, maxHeight: 500 }}>
              <FormItem {...formItemLayout} hasFeedback label="名称">
                {getFieldDecorator('tenantname', {
                  rules: [
                    {
                      required: true,
                      message: '请输入租户名称',
                    },
                  ],
                  initialValue: curTenant.tenantname,
                })(<Input placeholder="请输入" />)}
              </FormItem>
              <FormItem {...formItemLayout} hasFeedback label="logo" style={{ marginBottom: 0 }}>
                <div style={{ display: 'inline-flex', width: '100%' }}>
                  <CommonUpload {...upprops} />
                  <div
                    className="modal_tips"
                    style={{ fontSize: 12, lineHeight: '14px', paddingLeft: 6 }}
                  >
                    支持jpg/png/jpeg格式图片，建议格式 1280*720，文件不得大于2M
                  </div>
                </div>
              </FormItem>
              <FormItem {...submitFormLayout} hasFeedback>
                {this.renderPictrue(picFile, curTenant)}
              </FormItem>
              <FormItem {...formItemLayout} hasFeedback label="选择技能组">
                <div>{this.renderSkillGroup()}</div>
              </FormItem>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}
