/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable dot-notation */
import React from 'react';
import { Modal, Form, Input, Row, Col, Spin, message } from 'antd';
import { connect } from 'dva';
import 'codemirror/lib/codemirror.css';
import { getCommonFieldDecorator } from '../../../utils/utils';
import CommonSelect from '../../../components/CommonSelect';

/* require('codemirror/mode/clike/clike'); */

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(({ loading, sceneDialogSetting, dataDic }) => {
  return {
    dataDic,
    sceneDialogSetting,
    loading: loading.effects['sceneDialogSetting/fetchGetNodeDetail'],
  };
})
@Form.create()
class SettingFunctionModal extends React.Component {
  componentDidMount() {
    const {
      editItem = {},
      dispatch,
      dataDic: { dataDic = {} },
    } = this.props;
    if (!(dataDic['sceneFunType'] || []).length) {
      dispatch({
        type: 'dataDic/fetchFetDataDicByType',
        payload: { type: 'sceneFunType' },
      });
    }
    if (editItem.id && editItem.isSet) {
      dispatch({
        type: 'sceneDialogSetting/fetchGetNodeDetail',
        payload: { id: editItem.id },
      });
    }
  }

  handleOk = () => {
    const {
      onHandleOk,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { editItem = {} } = this.props;
      if (!(this.editItem.data || editItem.data)) {
        message.error('请填写编码');
        return;
      }
      onHandleOk &&
        onHandleOk(
          {
            ...values,
            data: this.editItem.data || editItem.data,
            id: editItem.isSet ? editItem.id : '',
          },
          this.handleShow
        );
    });
  };
  // 显示提示语的函数
  handleShow = (res) => {
    const { closeModal } = this.props;
    if (res && res.status === 'OK') {
      closeModal();
      message.success('操作成功');
    }
  };
  // 进入动态编码的函数
  handleCode = () => {
    const { editItem = {}, getId } = this.props;
    if (this.editItem.data || editItem.data) {
      this.openCodeHtml({ id: this.editItem.data || editItem.data });
    } else {
      getId(this.openCodeHtml);
    }
  };
  // 打开编码的新标签
  openCodeHtml = (data = {}) => {
    this.editItem = { ...this.editItem, data: data.id };
    if (!data.id) return;
    // 打开新的页面
    window.open(`${global.req_url}/im/webide/index.html?codeid=${data.id}`);
  };
  // 根据传入id进行操作
  getCurEditItem = () => {
    const {
      sceneDialogSetting: { curSettingNode = {} },
      editItem = {},
    } = this.props;
    if (editItem.isSet) {
      this.editItem = curSettingNode || {};
      return curSettingNode || {};
    }
    return editItem;
  };
  filterScenFunType = (arr) => {
    if (!arr.length) return [];
    return arr.filter((item) => {
      return item.isShow === '1' && item.type !== 'noUse';
    });
  };
  editItem = (this.props && this.props.editItem) || {};
  render() {
    const {
      dataDic: {
        dataDic: { sceneFunType = [] },
      },
      loading = false,
      form: { getFieldDecorator },
      visible,
      closeModal,
      ...otherProps
    } = this.props;
    const curEditItem = this.getCurEditItem();
    const showSceneFunType = this.filterScenFunType(sceneFunType);
    return (
      <Modal
        title="函数"
        onOk={this.handleOk}
        onCancel={closeModal}
        visible={visible}
        {...otherProps}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem {...formItemLayout} label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称！',
                  },
                ],
                initialValue: curEditItem.name || '',
              })(<Input placeholder="名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="语言">
              {getCommonFieldDecorator(getFieldDecorator, 'funType', {
                initialValue:
                  curEditItem.funType ||
                  (showSceneFunType.length && showSceneFunType[0].type) ||
                  '',
              })(
                <div>
                  <CommonSelect
                    defaultValue={
                      curEditItem.funType ||
                      (showSceneFunType.length && showSceneFunType[0].type) ||
                      ''
                    }
                    style={{ width: '120px' }}
                    optionData={{ datas: showSceneFunType, optionId: 'type', optionName: 'desc' }}
                  />
                  <a className="margin-left-10" onClick={this.handleCode}>
                    点击编码
                  </a>
                </div>
              )}
            </FormItem>
            <Row>
              <Col span={16} offset={4}>
                <div className="subtitle labelColor">
                  {'通过${限定符.name}获取槽位变量和内部变量'}
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    );
  }
}
export default SettingFunctionModal;
