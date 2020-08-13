/* eslint-disable no-console */
import React, { Component } from 'react';
import { Row, Col, Input, Form, Menu, Select, message, Modal } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { connect } from 'dva';
import styles from './index.less';
import ParamModal from './paramModal';

const { TextArea } = Input;
const { Option } = Select;
@connect(({ loading }) => ({
  loading: loading.effects['creativeIdeaManage/qryCreativeInfoList'],
  loadingAsso: loading.effects['creativeIdeaManage/qryOffersInfo'],
}))
@Form.create()
class TemplateModal extends Component {
  reactQuillRef = {};

  quillRef = {};

  constructor(props) {
    super(props);
    this.state = {
      paramModalVisible: false,
      currentMenu: '规则',
      macroArr: [],
      editorText: '',
    };
    this.modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['clean'],
      ],
    };
    this.formats = [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'indent',
    ];
  }

  componentDidMount() {
    const { isEmail } = this.props;
    if (isEmail) this.attachQuillRefs();
    this.qryMacroList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      editData: { msgDefine },
      isEmail,
    } = nextProps;

    // const {
    //   editData: { msgDefine: prevMsgDefine },
    // } = this.props;
    if (isEmail && msgDefine) {
      this.setState({
        editorText: msgDefine,
      });
    }
  }

  componentDidUpdate() {
    const {
      isEmail,
      form: { resetFields, getFieldValue },
    } = this.props;
    const macro = getFieldValue('macro');
    if (macro !== undefined) {
      resetFields('macro', []);
    }

    if (isEmail) this.attachQuillRefs();
  }

  attachQuillRefs = () => {
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    this.quillRef = this.reactQuillRef.getEditor();
  };

  handleModalSubmit = () => {
    const {
      getMsgDefine,
      form: { getFieldValue, validateFields },
      isEmail,
      changeVisible,
    } = this.props;
    const { editorText } = this.state;
    const msgDefine = isEmail ? editorText : getFieldValue('msgDefine');
    const subjectDefine = getFieldValue('subjectDefine') || '';
    if (isEmail && !editorText) {
      message.warn('请输入模板定义！');
      return;
    }
    validateFields(err => {
      if (!err) {
        console.log('保存', msgDefine, subjectDefine);
        if (getMsgDefine) getMsgDefine(msgDefine, subjectDefine);
        if (changeVisible) changeVisible(false);
      }
    });
  };

  handleModalCancel = () => {
    const { changeVisible } = this.props;
    if (changeVisible) changeVisible(false);
  };

  handleMenuClick = e => {
    this.setState({
      currentMenu: e.key,
    });
  };

  handleEditorChange = editorText => {
    console.log(editorText);
    this.setState({
      editorText,
    });
  };

  pasteEditor = e => {
    const { editorText } = this.state;
    const text = `\${${e}}`;
    const aText = (editorText || '') + text;
    console.log(text, aText);
    this.setState({
      editorText: aText,
    });
  };

  qryMacroList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryMacroList',
      payload: {},
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        this.setState({
          macroArr: res.svcCont.data,
        });
      }
    });
  };

  openParamModal = () => {
    this.setState({
      paramModalVisible: true,
    });
  };

  addRef = el => {
    this.reactQuillRef = el;
  };

  pasteCode = e => {
    console.log(e)
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const text = `\${${e}}`;
    const aText = (getFieldValue('msgDefine') || '') + text;

    setFieldsValue({ msgDefine: aText });
  };

  render() {
    const { paramModalVisible, currentMenu, macroArr, editorText } = this.state;
    const { form, visible, isEmail, editData } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title={isEmail ? '邮件配置' : '短信配置'}
        visible={visible}
        width={840}
        onOk={this.handleModalSubmit}
        onCancel={this.handleModalCancel}
        okText="保存"
      >
        <Menu onClick={this.handleMenuClick} selectedKeys={[currentMenu]} mode="horizontal">
          <Menu.Item key="规则">规则</Menu.Item>
        </Menu>
        <Form style={{ marginTop: '20px', display: currentMenu === '规则' ? 'block' : 'none' }}>
          <Row>
            <Col span={12}>
              <Form.Item label="宏列表" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                {getFieldDecorator('macro')(
                  <Select
                    showSearch
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="请选择宏列表"
                    onChange={isEmail ? this.pasteEditor : this.pasteCode}
                  >
                    {macroArr.map(each => (
                      <Option key={each.macroCode}>{each.macroName}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '39px',
                  paddingLeft: '25px',
                }}
              >
                参数列表：
                <a onClick={this.openParamModal}>添加</a>
              </div>
            </Col>
            {isEmail && (
              <Col span={24}>
                <Form.Item label="标题" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  {getFieldDecorator('subjectDefine', {
                    rules: [{ required: true, message: '请输入标题' }],
                    initialValue: editData.subjectDefine || undefined,
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              {isEmail ? (
                <Row>
                  <Col span={3} className={styles.editorTitle}>
                    模板定义：
                  </Col>
                  <Col span={21} className={styles.editorWrapper}>
                    <ReactQuill
                      ref={this.addRef}
                      theme="snow"
                      modules={this.modules}
                      formats={this.formats}
                      value={editorText}
                      onChange={this.handleEditorChange}
                      style={{ height: '85%' }}
                    />
                  </Col>
                </Row>
              ) : (
                <Form.Item label="模板定义" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                  {getFieldDecorator('msgDefine', {
                    rules: [{ required: true, message: '请输入模板代码' },{ max: 250, message: '内容请控制在250个字符以内' }],
                    initialValue: editData.msgDefine || undefined,
                  })(<TextArea placeholder="请输入" autosize={{ minRows: 6 }} maxLength={251} />)}
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>

        <ParamModal
          visible={paramModalVisible}
          changeVisible={v => {
            this.setState({
              paramModalVisible: v,
            });
          }}
          setParamCode={isEmail ? this.pasteEditor : this.pasteCode}
        />
      </Modal>
    );
  }
}

export default TemplateModal;
