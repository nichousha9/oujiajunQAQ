import React, { Component } from 'react';
import { Form, Input, Table, Modal, Button, Select, Spin, message } from 'antd';
import { connect } from 'dva';
import NoteRelList from './common/noteRelList';
import styles from '../../index.less';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

@connect(({ common }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
}))
@Form.create()
class HtmlCreative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      channelList: [],
      templateTable: {
        action: 'DEFAULT',
        adviceType: '',
        defLangId: '',
        defLangName: '默认',
        language: '',
        senderParam: '',
        msgDefine: '',
        subjectDefine: '',
        _id_: '',
      },
    };
    this.columns = [
      {
        title: '语言',
        dataIndex: 'defLangName',
      },
      {
        title: '模板内容',
        textWrap: 'ellipsis',
        dataIndex: 'msgDefine',
      },
      {
        title: '操作',
        render: () => {
          return <a onClick={this.handleEditTemplate}>编辑</a>;
        },
      },
    ];
  }

  componentDidMount() {
    const { isEdit } = this.props;
    this.getSpecCode();
    this.getChannelList();
    if (isEdit) {
      this.editFunc();
    }
  }

  // 获取字典数值
  getSpecCode() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'IS_ENGINE',
      },
    });
  }

  getChannelList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryTargetChannel',
      payload: {
        creativeType: '3',
        pageInfo: { pageNum: '1', pageSize: '1000' },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          channelList: res.svcCont.data,
        });
      } else {
        message.error('获取渠道列表失败');
      }
    });
  };

  // 编辑模式回填
  editFunc = () => {
    const { templateTable } = this.state;
    const { dispatch, form, updateParam } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: `creativeIdeaManage/qryMccAdviceType`,
      payload: {
        adviceType: updateParam.adviceType,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const resultData = res.svcCont.data[0];
        form.setFieldsValue({
          adviceTypeName: resultData.adviceTypeName,
          stdCode: resultData.stdCode,
          channelId: String(resultData.channelId),
          srcNbr: resultData.srcNbr,
          comments: resultData.comments,
        });
        this.setState({
          templateTable: {
            ...templateTable,
            msgDefine: resultData.msgDefine,
            subjectDefine: resultData.subjectDefine,
          },
        });
      } else {
        message.error('获取关联列表失败');
      }
      this.setState({
        loading: false,
      });
    });
  };

  handleEditTemplate = () => {
    const { form } = this.props;
    if (!form.getFieldValue('channelId')) {
      message.warning('请先选择渠道！');
      return;
    }
    this.setState({
      visible: true,
    });
  };

  // 回填模板表格
  handleCancel = value => {
    const { templateTable } = this.state;
    this.setState({
      templateTable: {
        ...templateTable,
        msgDefine: value,
      },
      visible: false,
    });
  };

  // 增加/修改 文本创意
  createData = () => {
    const { templateTable } = this.state;
    const { dispatch, form, node = {}, updateParam = {} } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'creativeIdeaManage/operatorAdviceType',
          payload: {
            templateInfoType: '3',
            msgDefine: templateTable.msgDefine,
            adviceTypeLangs: [templateTable],
            subjectDefine: templateTable.subjectDefine,
            adviceCatg: node.adviceCatg,
            adviceTypeSortId: node.key,
            creativeInfoId: updateParam.creativeInfoId,
            adviceType: updateParam.adviceType,
            ...values,
          },
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode === 0) {
            message.success('保存成功！');
            this.txtHandleCancel();
          } else {
            message.error(res.topCont && res.topCont.remark);
          }
        });
      }
    });
  };

  txtHandleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  render() {
    const { visible, loading, channelList, templateTable } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.htmlCreative}>
        <h3>基本信息</h3>
        <Spin spinning={loading}>
          <div>
            <Form {...formItemLayout}>
              <div className={styles.htmlForm}>
                <Form.Item label="创意名称">
                  {getFieldDecorator('adviceTypeName', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item label="编码">
                  {getFieldDecorator('stdCode', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item label="渠道">
                  {getFieldDecorator('channelId', {
                    rules: [{ required: true, message: '请选择渠道类型' }],
                    initialValue: '',
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择渠道类型">
                      {channelList.map(each => (
                        <Option value={String(each.channelId)} key={each.channelId}>
                          {each.channelName}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
                <Form.Item label="服务号码">
                  {getFieldDecorator('srcNbr', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item label="描述">
                  {getFieldDecorator('comments', {
                    rules: [{ message: '请输入' }],
                    initialValue: '',
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </div>
            </Form>
          </div>
          <h3>模板信息</h3>
          <Table dataSource={[templateTable]} columns={this.columns} pagination={false} />
          <Modal title="标签列表" width="60%" visible={visible} footer={false}>
            <NoteRelList handleCancel={this.handleCancel} template={templateTable} />
          </Modal>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={this.createData}>
              确认
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={this.txtHandleCancel}>取消</Button>
          </div>
        </Spin>
      </div>
    );
  }
}

export default HtmlCreative;
