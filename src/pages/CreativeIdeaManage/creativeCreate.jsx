/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Popconfirm,
  Upload,
  Button,
  Form,
  Table,
  Select,
  message,
  Icon,
  TreeSelect,
} from 'antd';

import { connect } from 'dva';
import styles from './index.less';
import TemplateModal from './templateModal';
import TagModal from './tagModal';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
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

@connect(({ loading, creativeIdeaManage, common }) => ({
  loading: loading.effects['creativeIdeaManage/operatorAdviceType'],
  childTableLoading: loading.effects['creativeIdeaManage/getLabelDatasByInfo'],
  creativeIdeaManage,
  attrSpecCodeList: common.attrSpecCodeList,
}))
@Form.create()
class CreativeCreate extends Component {
  constructor(props) {
    super(props);
    const { isEdit, isDetail } = props;
    const {
      creativeIdeaManage: { editData },
    } = this.props;

    const defaultTemplate = {
      action: 'DEFAULT',
      adviceType: '',
      defLangId: '',
      defLangName: '默认',
      language: '',
      senderParam: '',
      msgDefine: '',
      subjectDefine: '',
      _id_: '',
    };
    if (isEdit || isDetail) {
      // 回显表格数据用的
      defaultTemplate.msgDefine = (editData && editData.msgDefine) || '';
      defaultTemplate.subjectDefine = (editData && editData.subjectDefine) || '';
    }
    this.state = {
      channelArr: [],
      defaultTemplate,
      templateModalVisible: false,
      subModalVisible: false, // 标签列表的弹出框
      imageUrl: '',
      //   editTagList: [], // 编辑图文创意的已有的标签列表
      relLabelList: [], // 要传给服务器的标签列表 编辑和新增最后都传这个
      labelPageInfo: { pageSize: 5, totalRow: 0 },
      curTagRelId: null, // 当前正在操作的标签ID
      treeData: [],
    };
    this.imgServer = '';
  }

  componentDidMount() {
    const { defaultTemplate } = this.state;
    const { curCreateType, isEdit, isDetail, form, curTreeNode, creativeRecord } = this.props;
    // this.setState({ defaultTemplate.msgDefine : creativeRecord.adviceText })

    this.getTreeData();
    if (curCreateType === 1) {
      // 当是图文创意的时候 需要获取标签列表
      this.getSpecCode();
      if (isEdit || isDetail) {
        this.getLabelDatasByInfo();
      }
    }
    this.getChannelOfType();
    this.setState({
      defaultTemplate: {
        ...defaultTemplate,
        msgDefine: creativeRecord.adviceText,
        _id_: `jqg${Math.floor(Math.random() * 1000)}`,
      },
    });

    let typeTitle;
    if (creativeRecord.hasOwnProperty('adviceId')) {
      if (creativeRecord.adviceType === '1') {
        typeTitle = '图片话术';
      } else if (creativeRecord.adviceType === '2') {
        typeTitle = '文本话术';
      } else if (creativeRecord.adviceType === '3') {
        typeTitle = 'HTML话术';
      }
      form.setFieldsValue({
        curCreateType: typeTitle,
      });
    } else {
      if (curCreateType === '1') {
        typeTitle = '图片话术';
      } else if (curCreateType === '2') {
        typeTitle = '文本话术';
      } else if (curCreateType === '3') {
        typeTitle = 'HTML话术';
      }
      form.setFieldsValue({
        curCreateType: typeTitle,
      });
    }

    form.setFieldsValue({
      folderId: curTreeNode.folderId,
      curCreateType: typeTitle,
      adviceText: creativeRecord.adviceText,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      creativeIdeaManage: { editData },
    } = this.props;
    const { msgDefine, subjectDefine } = editData;
    const {
      msgDefine: pMsgDefine,
      subjectDefine: pSubjectDefine,
    } = prevProps.creativeIdeaManage.editData;
    if (msgDefine !== pMsgDefine || subjectDefine !== pSubjectDefine) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        defaultTemplate: {
          action: 'DEFAULT',
          adviceType: '',
          defLangId: '',
          defLangName: '默认',
          language: '',
          senderParam: '',
          msgDefine: (editData && editData.msgDefine) || '',
          subjectDefine: (editData && editData.subjectDefine) || '',
          _id_: '',
        },
      });
    }
  }

  // 获取字典数值
  getSpecCode() {
    const { attrSpecCodeList, dispatch } = this.props;
    if (!attrSpecCodeList.IS_ENGINE) {
      dispatch({
        type: 'common/qryAttrValueByCode',
        payload: {
          attrSpecCode: 'IS_ENGINE',
        },
      });
    }
  }

  // 获取树状目录的数据
  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryMessageFolder',
      payload: {},
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // const rootElement = res.svcCont.data.find(tree => tree.pathCode.indexOf('.') === -1);
        this.handleTreeData(res.svcCont.data);
      }
    });
  };

  // 处理返回的目录数组
  handleTreeData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.folderName, // 目录的名称
      key: item.folderId, // 目录的ID
      comments: item.folderName, // 目录的描述
      pathCode: item.pathCode,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentFolderId, // 父目录的ID
      children: [],
      used: false,
      statusCd: item.statusCd, // 目录的状态
      curItem: {}, // 当前选择的目录
      labelType: item.labelType,
      adviceCatg: item.adviceCatg,
      spId: item.spId,
    }));
    const newArr = [];
    const getChild = (node, index) => {
      // 拿到当前节点的子节点
      if (index === len - 1) {
        return;
      }
      for (let i = 0; i < len; i += 1) {
        // 如果当前节点的路径长度大于 node 且 parentKey = node.key 那么它就是 node 的子元素
        if (
          treeArr[i].pathCodeLen > node.pathCodeLen &&
          treeArr[i].parentKey === node.key &&
          !treeArr[i].used
        ) {
          node.children.push(treeArr[i]);
          treeArr[i].used = true;
          getChild(treeArr[i], i);
        }
      }
    };
    for (let i = 0; i < len; i += 1) {
      if (treeArr[i].pathCodeLen === 1) {
        newArr.push(treeArr[i]);
        treeArr[i].used = true;
        getChild(treeArr[i], i);
      }
    }

    this.setState({
      treeData: newArr,
    });
  };

  // 获取编辑图文创意的标签列表
  getLabelDatasByInfo = () => {
    const { dispatch, creativeRecord } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryProLabelRelData',
      payload: {
        objectId: creativeRecord.creativeInfoId,
        objectType: '01',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        const relLabelList = res.svcCont.data.map(item => {
          const optionValue = item.optionData.find(e => e.labelValueId === item.labelValueId);
          const param = {
            labelId: item.labelId,
            labelName: item.labelName,
            options: item.optionData,
            labelValueType: item.labelValueType,
            LABEL_CODE: item.labelName,
            isAdd: true,
          };
          param[`LABEL_VALUE${item.relId}`] =
            item.labelValueType === '2000' ? optionValue.labelValueId : item.labelValue;
          param[`LABEL_CODE${item.relId}`] = item.labelName;
          return { ...item, ...param };
        });
        this.setState({
          relLabelList,
        });
      } else {
        message.error('获取关联列表失败');
      }
    });
  };

  getChannelOfType = () => {
    // 1.图文 2.文字 3.html
    const { dispatch, curCreateType } = this.props;
    dispatch({
      type: 'creativeIdeaManage/qryTargetChannel',
      payload: {
        creativeType: curCreateType,
        pageInfo: { pageNum: '1', pageSize: '1000' },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 设置 state
        this.setState({
          channelArr: res.svcCont.data,
        });
      }
    });
  };

  setCreateType = type => {
    const { setCreateType } = this.props;
    if (setCreateType) {
      setCreateType(type);
    }
  };

  clearRecordOrEdit = () => {
    const { defaultTemplate } = this.state;
    const { restoreCreativeRecord, dispatch } = this.props;
    restoreCreativeRecord(defaultTemplate);
    dispatch({
      type: 'creativeIdeaManage/setEidtData',
      payload: {},
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      curCreateType,
      form,
      curTreeNode,
      creativeRecord,
      isEdit,
      creativeIdeaManage: { editData },
    } = this.props;
    if (curCreateType == '1') {
      const { relLabelList } = this.state;
      const relList = [];
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        relLabelList.forEach(item => {
          relList.push({
            labelId: item.labelId,
            labelName: item.labelName, // 标签名称
            labelValue: values[`LABEL_CODE${item.relId}`], // 标签值
            labelValueId: values[`LABEL_VALUE${item.relId}`], // 标签值id
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
              adviceTypeSortId: curTreeNode.adviceTypeSortId,
              channelId: values.channelId, // 渠道id
              creativeInfoCode: values.creativeInfoCode, // 创意编码
              creativeInfoName: values.creativeInfoName, // 创意名称
              creativeInfoId: creativeRecord.creativeInfoId,
              imgSize: '', // 图片尺寸
              isEngine: values.isEngine, //
              templateInfoId: '', // 临时信息id
              templateInfoType: '1', // 临时信息类型
              thumbUrl: this.imgServer,
              // ...values
            },
            relLabelList: relList,
          },
        }).then(res => {
          if (res && res.topCont && res.topCont.resultCode === 0) {
            // 设置 state
            message.success('保存成功！');
            this.handleCancel();
          } else {
            message.error('保存失败！');
          }
        });
      });
      this.clearRecordOrEdit();
    } else {
      const { defaultTemplate } = this.state;
      form.validateFields((err, values) => {
        const { adviceText } = values;
        console.log(creativeRecord.adviceId);
        if (defaultTemplate.msgDefine) {
          if (!err) {
            dispatch({
              type: `creativeIdeaManage/${
                isEdit ? 'operatorAdviceTypeEdit' : 'operatorAdviceType'
              }`,
              payload: {
                adviceType: curCreateType,
                // msgDefine: defaultTemplate.msgDefine,
                adviceTypeLangs: [defaultTemplate],
                // subjectDefine: defaultTemplate.subjectDefine,
                adviceCatg: curTreeNode.adviceCatg,
                adviceTypeSortId: curTreeNode.adviceTypeSortId,
                creativeInfoId: creativeRecord.creativeInfoId,
                adviceId: creativeRecord.adviceId,
                folderId: values.folderId,

                ...values,
                adviceText: defaultTemplate.msgDefine,
              },
            }).then(res => {
              if (res && res.topCont && res.topCont.resultCode === 0) {
                // 设置 state
                message.success('保存成功！');
                this.handleCancel();
                this.clearRecordOrEdit();
              } else {
                message.info(res && res.topCont && res.topCont.remark);
              }
            });
          }
        } else {
          message.info('请输入话术内容');
        }
      });
    }
  };

  handleCancel = () => {
    const { setCreateType, changeEdit, changeDetail } = this.props;
    if (setCreateType) {
      setCreateType('');
      changeEdit(false);
      changeDetail(false);
    }
    this.clearRecordOrEdit();
  };

  handleEditTemplate = () => {
    const { form } = this.props;
    if (!form.getFieldValue('channelId')) {
      message.warning('请先选择渠道！');
      return;
    }
    this.setState({
      templateModalVisible: true,
    });
  };

  getMsgDefine = (msgDefine, subjectDefine) => {
    const { defaultTemplate } = this.state;
    console.log(defaultTemplate, msgDefine, '这是：', subjectDefine);
    const newValues = { ...defaultTemplate, msgDefine, subjectDefine };
    console.log('改变', newValues);
    this.setState({
      defaultTemplate: newValues,
    });
  };

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  addTag = () => {
    const { relLabelList } = this.state;
    const newTag = {
      relId: `TAG_${Math.floor(Math.random() * 10000000)}`,
      options: [], // 不管是不是枚举类型 先占个坑总是没错的
      isAdd: true,
    };
    this.setState({
      relLabelList: [newTag, ...relLabelList],
    });
  };

  deleteTag = record => {
    const { relLabelList } = this.state;
    const newList = relLabelList.filter(e => e.relId !== record.relId);
    this.setState({
      relLabelList: newList,
    });
  };

  // 把选的标签塞到对应标签数组里
  setTagDataAndGetData = data => {
    const { curTagRelId, relLabelList } = this.state;
    const { dispatch } = this.props;
    const curItem = relLabelList.find(e => e.relId === curTagRelId);
    if (!curItem) return;
    const curItemIndex = relLabelList.findIndex(e => e.relId === curTagRelId);
    if (data.labelValueType === '2000') {
      // 如果是枚举型 就要去服务器取枚举数据
      dispatch({
        type: 'creativeIdeaManage/getValidLabelValueByLabelId',
        payload: {
          labelId: data.labelId,
        },
      }).then(res => {
        if (res && res.topCont && res.topCont.resultCode === 0) {
          relLabelList[curItemIndex] = {
            ...curItem,
            ...data,
            options: res.svcCont.data,
          };
          this.setState({
            relLabelList,
          });
        }
      });
    } else {
      relLabelList[curItemIndex] = {
        ...curItem,
        ...data,
      };
      this.setState({
        relLabelList,
      });
    }
  };

  onChange = info => {
    const { creativeRecord } = this.props;
    if (info.file.status === 'done') {
      message.success(`${info.file.name} `);
      try {
        this.imgServer = info.file.response.svcCont.data.fileLocation;
      } catch (e) {
        this.imgServer = '';
      }
      getBase64(info.file.originFileObj, imageUrl => {
        creativeRecord.thumbUrl = this.imgServer;
        this.setState({
          imageUrl,
        });
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    const {
      channelArr,
      defaultTemplate,
      templateModalVisible,
      labelPageInfo,
      subModalVisible,
      relLabelList,
      // returnedTreeData,
      treeData,
    } = this.state;

    let { imageUrl } = this.state;
    const {
      form,
      loading,
      childTableLoading,
      curCreateType,
      isEdit,
      attrSpecCodeList = {},
      creativeRecord,
      isDetail,
    } = this.props;

    let {
      creativeIdeaManage: { editData },
    } = this.props;
    if (curCreateType === '1' && (isEdit || isDetail)) {
      editData = creativeRecord;
      imageUrl = creativeRecord.thumbUrl;
      this.imageUrl = imageUrl; // 本地上传图片的url
      this.imgServer = imageUrl; // 编辑模式的服务器url
    }

    const { getFieldDecorator } = form;
    const IS_ENGINE = attrSpecCodeList.IS_ENGINE || [];
    const topRightDiv = (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isDetail ? null : (
          <Button
            type="primary"
            loading={loading}
            onClick={this.handleSubmit}
            style={{ marginRight: '10px' }}
          >
            保存
          </Button>
        )}
        <Button onClick={this.handleCancel}>取消</Button>
      </div>
    );
    const channelId = form.getFieldValue('channelId');
    const isEmail = curCreateType === '3' && channelId == 138;
    const getTitle = () => {
      if (isEdit) return <span style={{ fontWeight: 'bold' }}>话术编辑</span>;
      if (isDetail) return <span style={{ fontWeight: 'bold' }}>话术详情</span>;
      let text = '';
      switch (curCreateType) {
        case '1':
          text = '新增图片话术';
          break;
        case '2':
          text = '新增文本话术';
          break;
        case '3':
          text = '新增HTML话术';
          break;
        default:
          text = '未知';
          break;
      }
      return <span style={{ fontWeight: 'bold' }}>{text}</span>;
    };
    const columns = [
      {
        title: '语言',
        dataIndex: 'defLangName',
      },
      {
        title: '模板内容',
        dataIndex: 'msgDefine',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <React.Fragment>
              <a
                onClick={() => {
                  this.handleEditTemplate(record);
                }}
                disabled={isDetail}
              >
                编辑
              </a>
            </React.Fragment>
          );
        },
      },
    ];
    const list = [defaultTemplate];

    const uploadButton = (
      <div className={styles.upload}>
        <Icon type="plus" />
        <div className={styles.uploadText}>话术选择</div>
      </div>
    );
    const labelPaginationInfo = {
      pageSize: labelPageInfo.pageSize || 10,
      total: labelPageInfo.totalRow || 0,
      onChange: this.getChildData,
      showQuickJumper: true,
      defaultCurrent: 1,
      size: 'small',
    };

    // const columns2 = [
    //   {
    //     title: '标签',
    //     dataIndex: 'LABEL_CODE',
    //     key: 'LABEL_CODE',
    //     width: 400,
    //     render: (text, record) => {
    //       return record.isAdd ? (
    //         <Form.Item label="" className={styles.tableLabel} wrapperCol={24}>
    //           {getFieldDecorator(`LABEL_CODE${record.relId}`, {
    //             initialValue: record.LABEL_CODE,
    //             rules: [
    //               {
    //                 required: true,
    //                 message: '必选项!',
    //               },
    //             ],
    //           })(
    //             <Input
    //               addonAfter={
    //                 <span
    //                   style={{ cursor: 'pointer' }}
    //                   onClick={() => {
    //                     this.setState({ subModalVisible: true, curTagRelId: record.relId });
    //                   }}
    //                 >
    //                   选择
    //                 </span>
    //               }
    //               placeholder="选择标签"
    //               readOnly
    //             />,
    //           )}
    //         </Form.Item>
    //       ) : (
    //         text
    //       );
    //     },
    //   },
    //   {
    //     title: '标签属性',
    //     dataIndex: 'stopProductionType',
    //     key: 'stopProductionType',
    //     render: (text, record) => {
    //       return record.isAdd ? (
    //         <Form.Item label="" className={styles.tableLabel}>
    //           {getFieldDecorator(`LABEL_VALUE${record.relId}`, {
    //             initialValue:
    //               record.labelValueType === '2000' ? record.labelValueId : record.labelValue,
    //             rules: [
    //               {
    //                 required: true,
    //                 message: record.labelValueType === '2000' ? '必选项!' : '必填项!',
    //               },
    //             ],
    //           })(
    //             record.labelValueType === '2000' ? (
    //               <Select
    //                 defaultValue={record.labelValueId}
    //                 style={{ width: '100%' }}
    //                 placeholder="请选择"
    //               >
    //                 {record.options.map(each => (
    //                   <Option value={each.labelValueId} key={each.labelValueId}>
    //                     {each.valueName}
    //                   </Option>
    //                 ))}
    //               </Select>
    //             ) : (
    //               <Input placeholder="请输入" />
    //             ),
    //           )}
    //         </Form.Item>
    //       ) : (
    //         text
    //       );
    //     },
    //   },
    //   {
    //     title: '操作',
    //     key: 'action',
    //     render: (text, record) => (
    //       <Popconfirm
    //         placement="topRight"
    //         onConfirm={() => {
    //           this.deleteTag(record);
    //         }}
    //         title="确认删除？"
    //       >
    //         <a>删除</a>
    //       </Popconfirm>
    //     ),
    //   },
    // ];
    const props = {
      name: 'file',
      showUploadList: false,
      action: '/mccm-service/mccm/dmt/UploadImageController/saveImageFile',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.onChange,
    };

    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title} value={item.key}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} value={item.key} />;
      });

    return (
      <Card title={getTitle()} extra={topRightDiv}>
        {/* <div className={styles.title}>基本信息</div> */}
        <Form {...formItemLayout}>
          <Row>
            <Col span={8}>
              <Form.Item label="话术名称">
                {getFieldDecorator(curCreateType == '1' ? 'creativeInfoName' : 'adviceName', {
                  rules: [
                    { required: true, message: '请输入话术名称' },
                    { max: 20, message: '请不要大于20个字符' },
                  ],
                  initialValue:
                    curCreateType == '1'
                      ? editData.creativeInfoName
                      : creativeRecord.adviceName || undefined,
                })(<Input placeholder="请输入" maxLength={21} disabled={isDetail} />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="渠道">
                {getFieldDecorator('channelId', {
                  rules: [{ required: true, message: '请选择渠道类型' }],
                  initialValue: creativeRecord.channelId
                    ? String(creativeRecord.channelId)
                    : undefined,
                })(
                  <Select
                    // defaultValue={creativeRecord.channelId}
                    style={{ width: '100%' }}
                    placeholder="请选择渠道类型"
                    disabled={isDetail}
                    // disabled={curCreateType === '1'}
                  >
                    {channelArr.map(each => (
                      <Option value={String(each.channelId)} key={each.channelId}>
                        {each.channelName}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {curCreateType == '1' ? (
              <Col span={8}>
                <Form.Item label="创意模板">
                  {getFieldDecorator('isEngine', {
                    rules: [
                      { required: true, message: '请选择创意模板' },
                      { max: 20, message: '内容请控制在20个字符以内' },
                    ],
                    initialValue: '0',
                  })(
                    <Select style={{ width: '100%' }} placeholder="请选择" maxLength={21}>
                      {IS_ENGINE.map(each => (
                        <Option key={each.attrValueCode}>{each.attrValueName}</Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            ) : (
              <Fragment>
                {/* <Col span={8}>
                  <Form.Item label={isEmail ? '发送方邮箱' : '服务号码'}>
                    {getFieldDecorator('srcNbr', {
                      rules: [
                        {
                          required: true,
                          message: isEmail ? '请输入发送方邮箱' : '请输入服务号码',
                        },
                      ],
                      initialValue: editData.srcNbr || undefined,
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col> */}

                <Col span={8}>
                  <Form.Item label="目录">
                    {getFieldDecorator('folderId', {
                      initialValue: creativeRecord.folderId
                        ? String(creativeRecord.folderId)
                        : undefined,
                    })(
                      <TreeSelect
                        disabled={isDetail}
                        showSearch
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="请选择目录"
                        allowClear
                        maxLength={21}
                        treeDefaultExpandAll
                        onChange={this.onChangeTree}
                      >
                        {loop(treeData)}
                      </TreeSelect>,
                    )}
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="类型">
                    {getFieldDecorator('curCreateType', {
                      rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
                    })(<Input disabled maxLength={21} />)}
                  </Form.Item>
                </Col>
              </Fragment>
            )}
          </Row>
          <Row style={{ marginLeft: 20 }}>
            {/* <Form.Item label="类型">
                    {getFieldDecorator('curCreateType', {})(<Input disabled />)}
                  </Form.Item> */}
            <Form.Item label="话术内容" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} required>
              {/* {getFieldDecorator('adviceText', {
                rules: [{ required: true, message: '请输入话术内容' }],
              })( */}
              <TextArea
                disabled={isDetail}
                maxLength={100}
                onClick={this.handleEditTemplate}
                value={defaultTemplate.msgDefine}
                defaultValue={
                  JSON.stringify(creativeRecord) !== '{}'
                    ? String(creativeRecord.adviceText)
                    : undefined
                }
              />
              ,{/* )} */}
            </Form.Item>
          </Row>

          {/* {curCreateType == '1' ? (
            <Fragment>
              <div className={styles.title}>话术图片</div>
              <Row>
                <Col span={8}>
                  <Upload {...props}>
                    {imageUrl ? (
                      <img className={styles.creativePic} src={imageUrl} alt="avatar" />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Col>
              </Row>
              <div className={styles.title}>标签关联属性</div>
              <div className={styles.buttonContainer}>
                <Button
                  type="primary"
                  size="small"
                  onClick={this.addTag}
                  className={styles.addButton}
                >
                  <Icon type="plus" />
                  新增
                </Button>
              </div>
              <Table
                rowKey={record => record.relId}
                dataSource={relLabelList}
                columns={columns2}
                pagination={labelPaginationInfo}
                loading={childTableLoading}
                rowClassName={this.setClassName}
              />
              <TagModal
                visible={subModalVisible}
                changeVisible={v => {
                  this.setState({
                    subModalVisible: v,
                  });
                }}
                setTagData={this.setTagDataAndGetData}
              />
            </Fragment>
          ) : (
            <Fragment>
              {/* <div className={styles.title}>模板信息</div> */}
          {/* <Table columns={columns} dataSource={list} rowKey="_id_" />
              <TemplateModal
                isEmail={isEmail}
                editData={editData}
                visible={templateModalVisible}
                changeVisible={visible => {
                  this.setState({
                    templateModalVisible: visible,
                  });
                }}
                getMsgDefine={this.getMsgDefine}
              />
            </Fragment>
          )} */}
          <TemplateModal
            isEmail={isEmail}
            editData={defaultTemplate}
            visible={templateModalVisible}
            changeVisible={visible => {
              this.setState({
                templateModalVisible: visible,
              });
            }}
            getMsgDefine={this.getMsgDefine}
          />
        </Form>
      </Card>
    );
  }
}

export default CreativeCreate;
