import React from 'react';
import { connect } from 'dva';
import { Card, Input, Modal, Form } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree/index';
import { formatTree } from '@/utils/formatData';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@connect(() => ({}))
@Form.create()
class Catalogue extends React.Component {
  objType = 5; // 审批目录的类型（区别于活动）

  constructor(props) {
    super(props);
    this.state = {
      addModal: false, // 编辑目录弹窗
      treeData: [], // 目录列表
      returnData: [], // 后端返回目录数据
      defaultSelectedKeys: [],
    };
  }

  componentWillMount() {
    this.getTreeData({ setDefault: true });
  }

  // 获取目录列表
  getTreeData = options => {
    const { dispatch, getNodeInfo } = this.props;
    dispatch({
      type: 'approveList/getMccFolderList',
      payload: {
        objType: this.objType,
      },
      success: (svcCont) => {
        const { data } = svcCont;
        const newArr = formatTree(data, 'parentFold', 'fold');
        const defaultSelectedKey =
          newArr && newArr.length && newArr[0].key && newArr[0].key.toString();
        const pathCode = newArr && newArr.length && newArr[0].pathCode;
        if (options && options.setDefault) {
          this.setState({
            treeData: newArr,
            returnData: data,
            defaultSelectedKeys: [defaultSelectedKey],
          });
          getNodeInfo(defaultSelectedKey, pathCode);
        } else {
          this.setState({
            treeData: newArr,
            returnData: data,
          });
        }
      }
    });
  };

  // 添加目录
  addMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/addMccFolder',
      payload: params,
      success: () => {
        this.getTreeData();
      }
    });
  };

  // 修改目录
  updateMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/updateMccFolder',
      payload: params,
      success: () => {
        this.getTreeData();
      }
    });
  };

  // 删除目录
  delMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approveList/delMccFolder',
      payload: params,
      success: () => {
        this.getTreeData();
      }
    });
  };

  // 添加目录
  addCata = () => {
    this.setState({
      addModal: true,
    });
  };

  // 保存目录信息
  handleModalOk = () => {
    const { form } = this.props;
    const { curOperate, curItem } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          addModal: false,
        });
        const { title, comments } = values;
        if (curOperate === 'add') {
          const obj = {
            comments, // 目录描述
            name: title, // 目录名称
            objType: this.objType, // 对象类型
            parentFold: curItem.key, // 父级目录
          };
          this.addMccFolder(obj);
        } else if (curOperate === 'edit') {
          const obj = {
            comments, // 目录描述
            name: title, // 目录名称
            objType: this.objType, // 对象类型
            parentFold: curItem.parentId, // 父级目录
            fold: curItem.key, // 活动目录id
          };
          this.updateMccFolder(obj);
        }
      }
    });
  };

  handleModalCancel = () => {
    this.setState({
      addModal: false,
    });
  };

  addCallBack = item => {
    this.setState({
      addModal: true,
      curOperate: 'add',
      curItem: item,
    });
    const { form } = this.props;
    form.resetFields();
  };

  editCallBack = item => {
    this.setState({
      addModal: true,
      curOperate: 'edit',
      curItem: item,
    });
    const { form } = this.props;
    form.setFieldsValue({
      title: item.title,
      comments: item.comments || '',
    });
  };

  deleteCallBack = item => {
    const obj = {
      comments: item.comments, // 目录描述
      name: item.title, // 目录名称
      objType: this.objType, // 对象类型
      parentFold: item.parentId, // 父级目录
      fold: item.key, // 活动目录id
    };
    this.delMccFolder(obj);
  };

  // 获取选中目录信息
  getPathCode = key => {
    const { returnData } = this.state;
    let pathcode = '';
    returnData.forEach(item => {
      if (String(item.fold) === String(key)) {
        pathcode = `${pathcode}${item.pathCode}`;
      }
    });
    return pathcode;
  };

  // 选中目录回调
  onSelectCallBack = key => {
    const { getNodeInfo } = this.props;
    const pathCode = this.getPathCode(key);
    getNodeInfo(key, pathCode);
  };

  render() {
    const { addModal, treeData, defaultSelectedKeys } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const treeProps = {
      defaultSelectedKeys,
      defaultExpandedKeys: defaultSelectedKeys,
      treeData,
      add: true,
      edit: true,
      del: true,
      addCallBack: this.addCallBack,
      editCallBack: this.editCallBack,
      deleteCallBack: this.deleteCallBack,
      onSelectCallBack: this.onSelectCallBack,
      tooltip: 'comments'
    };
    return (
      <Card
        title={formatMessage({
          id: 'approve.list.treeTitle',
        })}
        size="small"
        className="common-card"
      >
        {treeData && treeData.length > 0 && <SearchTree {...treeProps} />}
        <Modal
          title={formatMessage({
            id: 'common.ctgModal.ctgModalName',
          })}
          visible={addModal}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Form {...formItemLayout}>
            <Form.Item
              label={formatMessage({
                id: 'common.ctgModal.ctgModalName',
              })}
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'common.form.input',
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({
                id: 'common.ctgModal.ctgComments',
              })}
            >
              {getFieldDecorator('comments', {
                rules: [],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default Catalogue;
