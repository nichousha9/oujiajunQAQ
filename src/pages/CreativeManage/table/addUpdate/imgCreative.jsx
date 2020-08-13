import React, { Component } from 'react';
import { Form, Input, Select, Upload, Icon, message, Button, Table, Popconfirm, Modal } from 'antd';
import { connect } from 'dva';
import styles from '../../index.less';
import RelList from './common/relList';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const uploadButton = (
  <div className={styles.upload}>
    <Icon type="plus" />
    <div className={styles.uploadText}>创意选择</div>
  </div>
);

@connect(({ common }) => ({
  attrSpecCodeList: common.attrSpecCodeList,
}))
@Form.create()
class ImgCreative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: props.isEdit ? props.updateParam.thumbUrl : '',
      channelList: [],
      dataSource: [],
      visible: false, // 标签列表弹窗
      curTagRelId: 0, // 标签关联id
      loading: false,
    };
    this.imgServer = ''; // 图片url
    this.columns = [
      {
        title: '标签',
        dataIndex: 'labelName',
        key: 'labelName',
        render: (text, record) => {
          return (
            <Input
              addonAfter={
                <span onClick={() => this.setState({ visible: true, curTagRelId: record.relId })}>
                  选择
                </span>
              }
              placeholder="选择标签"
              value={text}
            />
          );
        },
      },
      {
        title: '标签属性',
        dataIndex: 'labelValueId',
        key: 'labelValueId',
        render: (value, record) => {
          return record.labelValueType === '2000' ? (
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              value={value}
              loading={record.loading}
              onChange={this.changeRelSelectValue}
            >
              {record.options.map(each => (
                <Option id={record.relId} value={each.labelValueId} key={each.labelValueId}>
                  {each.valueName}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              placeholder="请输入"
              id={record.relId}
              value={value}
              onChange={this.changeRelValue}
            />
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Popconfirm
            placement="topRight"
            onConfirm={() => {
              this.deleteTag(record);
            }}
            title="确认删除？"
          >
            <a>删除</a>
          </Popconfirm>
        ),
      },
    ];
  }

  componentDidMount() {
    const { isEdit } = this.props;
    this.getSpecCode();
    this.getChannel();
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

  // 获取渠道
  getChannel() {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryTargetChannel',
      payload: {
        pageInfo: { pageNum: '1', pageSize: '1000' },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          channelList: res.svcCont.data,
        });
      } else {
        message.error('获取channel失败');
      }
    });
  }

  // 编辑模式回填
  editFunc = () => {
    const { dispatch, form, updateParam } = this.props;
    form.setFieldsValue({
      creativeInfoName: updateParam.creativeInfoName,
      creativeInfoCode: updateParam.creativeInfoCode,
      channelId: updateParam.channelId,
      isEngine: updateParam.isEngine,
    });
    this.imgServer = updateParam.thumbUrl;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'creativeIdeaManage/qryProLabelRelData',
      payload: {
        objectId: updateParam.creativeInfoId,
        objectType: '01',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const newData = res.svcCont.data.map(item => {
          const obj = {};
          obj.labelId = item.labelId;
          obj.labelName = item.labelName;
          obj.LABEL_CODE = item.labelValue;
          obj.labelValueType = item.labelValueType;
          obj.options = item.optionData;
          return { ...item, ...obj };
        });
        this.setState({
          dataSource: newData,
          loading: false,
        });
      } else {
        message.error('获取关联列表失败');
      }
    });
  };

  // 上传图片
  onChange = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} `);
      try {
        this.imgServer = info.file.response.svcCont.data.fileLocation;
      } catch (e) {
        this.imgServer = '';
      }
      getBase64(info.file.originFileObj, imageUrl => {
        this.setState({
          imageUrl,
        });
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // 增加/修改 图片创意
  createData = () => {
    const { dataSource } = this.state;
    const { dispatch, form, node, isEdit, updateParam = {} } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const relLabelList = [];
        dataSource.forEach(item => {
          relLabelList.push({
            labelId: item.labelId,
            labelName: item.labelName, // 标签名称
            labelValue: item.LABEL_CODE, // 标签值
            labelValueId: item.labelValueId, // 标签值id
            labelValueType: item.labelValueType, // 标签值类型
            objectId: '', // 对象id
            objectType: '01', // 对象类型
            relId: item.relId,
          });
        });
        dispatch({
          type: isEdit
            ? 'creativeIdeaManage/editCreativeInfo'
            : 'creativeIdeaManage/addCreativeInfo',
          payload: {
            creativeInfo: {
              adviceTypeSortId: node && node.key,
              channelId: values.channelId, // 渠道id
              creativeInfoCode: values.creativeInfoCode, // 创意编码
              creativeInfoName: values.creativeInfoName, // 创意名称
              creativeInfoId: updateParam.creativeInfoId,
              imgSize: '', // 图片尺寸
              isEngine: values.isEngine, //
              templateInfoId: '', // 临时信息id
              templateInfoType: '1', // 临时信息类型
              thumbUrl: this.imgServer,
            },
            relLabelList,
          },
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode === 0) {
            message.success('保存成功！');
            this.handleCancel();
          } else {
            message.error(res.topCont && res.topCont.remark);
          }
        });
      }
    });
  };

  // 选择标签
  selectRel = (rel, relId) => {
    let { dataSource } = this.state;
    const { dispatch } = this.props;
    dataSource = dataSource.map(item => {
      let obj = {};
      if (item.relId === relId) {
        obj = rel;
        obj.labelValueId = '';
        if (rel.labelValueType === '2000') {
          obj.loading = true;
        }
      }
      return { ...item, ...obj };
    });
    this.setState({
      dataSource,
    });
    // 获取select类型的字典值
    if (rel.labelValueType === '2000') {
      dispatch({
        type: 'creativeIdeaManage/getValidLabelValueByLabelId',
        payload: {
          labelId: rel.labelId,
        },
      }).then(res => {
        if (res && res.topCont && res.topCont.resultCode === 0) {
          dataSource = dataSource.map(item => {
            const obj = {};
            if (item.relId === relId) {
              obj.options = res.svcCont.data;
            }
            obj.loading = false;
            return { ...item, ...obj };
          });
          this.setState({
            dataSource,
          });
        } else {
          message.error('获取标签字典失败');
        }
      });
    }
  };

  // 修改标签的值 -> 文本框
  changeRelValue = e => {
    const { value } = e.target;
    const id = e.target.getAttribute('id');
    let { dataSource } = this.state;
    dataSource = dataSource.map(item => {
      const obj = {};
      if (String(item.relId) === id) {
        obj.labelValueId = value;
      }
      return { ...item, ...obj };
    });
    this.setState({
      dataSource,
    });
  };

  // 修改标签的值 -> 下拉框
  changeRelSelectValue = (value, node) => {
    let { dataSource } = this.state;
    dataSource = dataSource.map(item => {
      const obj = {};
      if (item.relId === node.props.id) {
        obj.labelValueId = value;
      }
      return { ...item, ...obj };
    });
    this.setState({
      dataSource,
    });
  };

  // 删除标签
  deleteTag = record => {
    const { dataSource } = this.state;
    const newList = dataSource.filter(e => e.relId !== record.relId);
    this.setState({
      dataSource: newList,
    });
  };

  // 增加标签
  addTag = () => {
    const { dataSource } = this.state;
    const newTag = {
      relId: dataSource.length,
      options: [],
      isAdd: true,
    };
    this.setState({
      dataSource: [newTag, ...dataSource],
    });
  };

  // 关闭弹窗
  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  // 关闭标签弹窗
  handleRelCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { imageUrl, channelList, dataSource, visible, curTagRelId, loading } = this.state;
    const {
      form: { getFieldDecorator },
      attrSpecCodeList: { IS_ENGINE = [] },
    } = this.props;

    const props = {
      name: 'file',
      showUploadList: false,
      action: '/mccm-service/mccm/dmt/UploadImageController/saveImageFile',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.onChange,
    };

    return (
      <div className={styles.imgCreative}>
        <h3>基本信息</h3>
        <div>
          <Form {...formItemLayout}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              <Form.Item label="创意名称">
                {getFieldDecorator('creativeInfoName', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: '',
                })(<Input placeholder="请输入" />)}
              </Form.Item>
              <Form.Item label="编码">
                {getFieldDecorator('creativeInfoCode', {
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
                      <Option key={each.channelId}>{each.channelName}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="创意模板">
                {getFieldDecorator('isEngine', {
                  rules: [{ required: true, message: '请选择创意模板' }],
                  initialValue: '0',
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择创意模板">
                    {Array.isArray(IS_ENGINE)
                      ? IS_ENGINE.map(e => <Option key={e.attrValueCode}>{e.attrValueName}</Option>)
                      : ''}
                  </Select>,
                )}
              </Form.Item>
            </div>
          </Form>
        </div>
        <h3>创意图片</h3>
        <Upload {...props}>{imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}</Upload>
        <h3>标签关联属性</h3>
        <div style={{ textAlign: 'right', marginBottom: '7px' }}>
          <Button type="primary" size="small" onClick={this.addTag}>
            <Icon type="plus" />
            新增
          </Button>
        </div>
        <Table
          dataSource={dataSource}
          columns={this.columns}
          pagination={false}
          loading={loading}
        />
        <Modal
          title="标签列表"
          width="60%"
          visible={visible}
          footer={false}
          onCancel={this.handleRelCancel}
        >
          <RelList
            curTagRelId={curTagRelId}
            handleCancel={this.handleRelCancel}
            selectRel={this.selectRel}
          />
        </Modal>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.createData}>
            确认
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.handleCancel}>取消</Button>
        </div>
      </div>
    );
  }
}

export default ImgCreative;
