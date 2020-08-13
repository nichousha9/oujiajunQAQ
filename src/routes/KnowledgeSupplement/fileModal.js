/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  DatePicker,
  Button,
  Card,
  Icon,
  message,
  Modal,
  Upload,
  Mention,
  Select,
} from 'antd';

// import CommonModalArea from '../../components/CommonModalArea'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};

@connect(({ addStandardQuestion, loading, dataDic, knowledgeGallery, knowledgeSupplement }) => {
  return {
    addStandardQuestion,
    dataDic: (dataDic || {}).dataDic || {},
    loading: loading.effects['addStandardQuestion/getStandardQuesDetail'],
    knowledgeGallery,
    knowledgeSupplement,
  };
})
@Form.create()
export default class FileModal extends React.Component {
  constructor(props) {
    super(props);
    const { query } = props;
    if (query) {
      localStorage.setItem('addQuestion', JSON.stringify(query));
      this.query = query;
    } else {
      this.query = JSON.parse(localStorage.getItem('addQuestion'));
    }
  }
  state = {
    uploadFileList: [],

    submitLoading: false,

    kdbid: '',

    fileId: '',

    fileUrl: '',

    fileTypeList: [],

    fileType: null,
  };
  componentDidMount() {
    this.getKdbList();
    this.getSonDicsByPcode();
  }

  onSubmit = () => {
    this.setState({ submitLoading: true });
    const {
      form: { validateFields },
      dispatch,
      closeAddQuesModal,
    } = this.props;
    const { fileId, fileUrl } = this.state;

    validateFields((errors, values) => {
      if (!errors) {
        if (!fileId || !fileUrl) {
          this.setState({ submitLoading: false });
          message.info('请上传正确格式的文件');
          return;
        }

        dispatch({
          type: 'knowledgeSupplement/DocumentParsing',
          payload: {
            fileId,
            fileUrl,
            kdbId: values.kdbId,
            fileType: values.fileType,
          },
        }).then((res) => {
          // console.log('res',res)
          if (res.status === 'OK') {
            message.success('附件上传成功，正在导入');
          } else {
            message.error('附件上传失败');
          }
        });
        this.setState({ submitLoading: false });
        closeAddQuesModal();
      }
    });
  };

  getKdbList = (kdbName) => {
    const { dispatch } = this.props;
    dispatch({ type: 'knowledgeGallery/clearList' });

    dispatch({
      type: 'knowledgeGallery/fetchKdbList',
      payload: {
        kdbName,
      },
    });
  };

  getSonDicsByPcode = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'knowledgeGallery/getSonDicsByPcode',
      payload: {
        pcode: 'word_type',
      },
    }).then((res) => {
      // console.log('res',res)
      if (res.status === 'OK') {
        this.setState({
          fileTypeList: res.data,
        });
      }
    });
  };

  savaFileInfo = ({ fileList }) => {
    let newfileList = [...fileList];
    newfileList = newfileList.slice(-1);
    newfileList.map((item) => {
      if (item.response) {
        const { data = {}, status } = item.response;
        if (status === 'FAIL') {
          // message.info(item.response.msg);
          item.status = 'error';
          item.response = `${item.response.msg},请删除后重新选择文档类型添加附件`;
        }
        const { id, fileURL } = data;
        this.setState({
          fileId: id,
          fileUrl: fileURL,
        });
      }
      return item;
    });

    this.setState({
      uploadFileList: newfileList,
    });
  };

  setKdbID = (value) => {
    this.setState({ kdbid: value });
  };

  setFileType = (value) => {
    this.setState({ fileType: value });
  };

  render() {
    const {
      closeAddQuesModal,
      visible,
      knowledgeGallery: { kdbList },
    } = this.props;
    const { submitLoading, uploadFileList, fileTypeList, fileType } = this.state;
    const { getFieldDecorator } = this.props.form;
    const props = {
      name: 'file',
      withCredentials: true,
      action: `${global.req_url}/smartim/system/attachment/upload`,
      data: {
        fileType,
      },
      fileList: uploadFileList,
      onChange: this.savaFileInfo,
      disabled: fileType === null,
    };
    const kdbArr = kdbList.filter((item) => item.id !== 0);
    return (
      <Modal
        width="800px"
        title="导入"
        visible={visible}
        onCancel={closeAddQuesModal}
        footer={[
          <Button key="back" onClick={closeAddQuesModal}>
            关闭
          </Button>,
          <Button key="submit" type="primary" loading={submitLoading} onClick={this.onSubmit}>
            保存
          </Button>,
        ]}
        onOk={this.onSubmit}
      >
        <Fragment>
          <Card bordered={false}>
            <Form>
              <FormItem {...formItemLayout} label="文档类型" hasFeedback>
                {getFieldDecorator('fileType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择文档类型',
                    },
                  ],
                })(
                  <Select onChange={this.setFileType} disabled={uploadFileList.length > 0}>
                    {fileTypeList &&
                      fileTypeList.map((item) => (
                        <Select.Option value={item.code} key={item.code}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="知识库" hasFeedback>
                {getFieldDecorator('kdbId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择知识库',
                    },
                  ],
                })(
                  <Select onChange={this.setKdbID}>
                    {kdbArr &&
                      kdbArr.map((item) => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                  </Select>
                )}
              </FormItem>

              <div style={{ marginLeft: 146 }}>
                <Upload {...props}>
                  <Button type="primary" disabled={fileType === null}>
                    <Icon type="upload" /> 附件上传
                  </Button>
                </Upload>
              </div>
            </Form>
          </Card>
        </Fragment>
      </Modal>
    );
  }
}
