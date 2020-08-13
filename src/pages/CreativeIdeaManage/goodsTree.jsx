import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
// import { formatMessage } from 'umi-plugin-react/locale';
import { Card, Icon, message, Form, Modal, Button, Radio, Input } from 'antd';
import styles from './index.less';
import SearchTree from '@/components/SearchTree/index';

const formItemLayout = {
  labelCol: {
    span: 4,
    offset: 2,
  },
  wrapperCol: {
    span: 16,
  },
};

@connect(() => ({}))
@Form.create()
class GoodsTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 添加，编辑目录的对话框
      modalTitle: '', // 对话框的标题
      isAddChild: true, // 是否为添加子目录
      isEditOrAddRoot: false, // 是否为点击编辑或点击右上角的绿色+号
      curItem: {}, // 当前选中的目录
      curOperate: null, // 要执行的操作：添加目录（add）或编辑目录（edit）
      treeData: [],
      returnedTreeData: [],
      confirmDeleteModalVisible: false, // 是否确认删除目录的对话框
      defaultTreeNodes: [],
    };
  }

  componentWillMount() {
    this.getTreeData(firstFold => {
      if (!firstFold) return;
      const { setCurTreeNode } = this.props;
      setCurTreeNode(firstFold);
      this.setState({
        defaultTreeNodes: [String(firstFold.id)],
      });
    });
  }

  // 切换是否显示父级目录
  changeAddModel = obj => {
    const { value } = obj.target;
    if (value === 'addChild') {
      this.setState({
        isAddChild: true,
      });
    } else {
      this.setState({
        isAddChild: false,
      });
    }
  };

  // 获取树状目录的数据
  // getTreeData = cb => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'creativeIdeaManage/queryMccFolderList',
  //     payload: {
  //       fold: -6,
  //       objType: '4',
  //     },
  //   }).then(res => {
  //     if (res && res.topCont && res.topCont.resultCode === 0) {
  //       // const rootElement = res.svcCont.data.find(tree => tree.pathCode.indexOf('.') === -1);
  //       this.handleTreeData(res.svcCont.data);
  //       this.setState({
  //         returnedTreeData: res.svcCont.data,
  //         //   defaultSelectedKeys: rootElement ? [String(rootElement.adviceTypeSortId)] : [],
  //       });
  //       cb(res.svcCont.data.length ? res.svcCont.data[0] : undefined);
  //     }
  //   });
  // };

  // 处理返回的目录数组
  handleTreeData = data => {
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.name,
      key: item.fold,
      comments: item.comments,
      pathCodeLen: item.pathCode.split('.').length,
      parentKey: item.parentFold || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
    }));
    const newArr = [];

    const getChild = node => {
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

  // 点击确定按钮
  handleAddModalOK = () => {
    const { curItem, curOperate } = this.state;
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { model, name } = values;
        if (curOperate === 'add') {
          const params = {
            // 以下三个为必须参数
            // grpDesc: description,
            adviceTypeSortName: name,
            adviceCatg: curItem.adviceCatg,
            spId: curItem.spId,
            parentAdviceTypeSortId: model === 'addChild' ? curItem.key : null,
            pathCode: model === 'addChild' ? curItem.pathCode : null,
          };
          this.addMccLabelCatalogInfo(params);
        } else if (curOperate === 'edit') {
          const params = {
            // 以下为必须参数
            adviceTypeSortName: name,
            adviceTypeSortId: curItem.key,
            adviceCatg: curItem.adviceCatg,
            spId: curItem.spId,
            parentAdviceTypeSortId: curItem.parentKey,
            pathCode: curItem.pathCode,
          };
          this.updateMccLabelCatalogInfo(params);
        }
      }
    });
  };

  // 隐藏添加、编辑标签对话框
  handleAddModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
    const { form } = this.props;
    form.resetFields();
  };

  // 点击确认删除按钮
  handleConfirmDeleteModalOK = () => {
    const { curItem } = this.state;
    const params = {
      adviceTypeSortId: curItem.key,
    };
    this.delMccLabelCatalogInfo(params);
  };

  // 隐藏确认删除对话框
  handleConfirmDeleteModalCancel = () => {
    this.setState({
      confirmDeleteModalVisible: false,
    });
  };

  // 发送添加目录的请求
  addMccLabelCatalogInfo = params => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'creativeIdeaManage/addAdviceTypeSort',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 重新获取数据
        this.getTreeData();

        // 关闭Modal
        this.setState({
          modalVisible: false,
        });

        // 提交后清空表单
        form.resetFields();
      } else {
        // 提示用户重新输入
        message.error(res.topCont.remark);
      }
    });
  };

  // 发送更新编辑后的目录的请求
  updateMccLabelCatalogInfo = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/modAdviceTypeSort',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 重新获取数据
        this.getTreeData();

        // 关闭Modal
        this.setState({
          modalVisible: false,
        });
      } else {
        // 提示用户重新输入
        message.error(res.topCont.remark);
      }
    });
  };

  // 发送确认删除目录的请求
  delMccLabelCatalogInfo = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'creativeIdeaManage/delAdviceTypeSort',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 重新获取数据
        this.getTreeData();
        message.success('话术目录删除成功');
        // 关闭Modal
        this.setState({
          confirmDeleteModalVisible: false,
        });
      } else {
        // 提示用户重新输入
        message.error(res.topCont.remark);
      }
    });
  };

  // 在目录树内点击“添加”的回调函数
  addCallBack = item => {
    this.setState({
      modalVisible: true,
      curItem: item,
      isAddChild: true,
      isEditOrAddRoot: false,
      modalTitle: '添加目录',
      curOperate: 'add',
    });
    const { form } = this.props;
    form.setFieldsValue({
      parentName: item.title, // 新建子目录时，自己就是父亲
    });
  };

  // 在目录树内点击“编辑”的回调函数
  editCallBack = item => {
    this.setState({
      modalVisible: true,
      curItem: item,
      isAddChild: false,
      isEditOrAddRoot: true,
      modalTitle: '编辑目录',
      curOperate: 'edit',
    });
    const { form } = this.props;
    form.setFieldsValue({
      parentName: '',
      name: item.title,
      description: item.comments,
    });
  };

  // 在目录树内点击“删除”的回调函数
  deleteCallBack = item => {
    this.setState({
      confirmDeleteModalVisible: true,
      curItem: item,
    });
  };

  // 获取pathCode
  getNode = key => {
    const { returnedTreeData } = this.state;
    const thisTree = returnedTreeData.find(tree => Number(tree.id) === Number(key));
    return thisTree;
  };

  // 在目录树内选择某一个目录的回调函数
  onSelectCallBack = key => {
    const node = this.getNode(key);
    const { setCurTreeNode } = this.props;
    setCurTreeNode(node);
  };

  render() {
    const {
      modalVisible,
      treeData,
      isAddChild,
      isEditOrAddRoot,
      modalTitle,
      confirmDeleteModalVisible,
      defaultTreeNodes,
      //   defaultSelectedKeys,
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const treeProps = {
      treeData,
      hideSearch: true,
      showButtons: false,
      onSelectCallBack: this.onSelectCallBack,
      selectedKeys: defaultTreeNodes,
    };

    return (
      <Fragment>
        <Card
          bordered={false}
          size="small"
          title="产品目录"
          headStyle={{ fontWeight: 'bold', height: '41px' }}
        >
          <SearchTree {...treeProps} />
        </Card>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.handleAddModalCancel}
          /* eslint-disable  react/jsx-wrap-multilines  */
          footer={
            <div className={styles.modalFooter}>
              <Button type="primary" onClick={this.handleAddModalOK}>
                确认
              </Button>
              <Button onClick={this.handleAddModalCancel}>取消</Button>
            </div>
          }
        >
          <Form {...formItemLayout}>
            <Form.Item
              wrapperCol={{ span: 12, offset: 6 }}
              style={{ display: isEditOrAddRoot ? 'none' : 'block' }}
            >
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
            {/* <Form.Item label="目录描述">
              {getFieldDecorator('description', {
                rules: [],
              })(<Input />)}
            </Form.Item> */}
          </Form>
        </Modal>
        <Modal
          title={
            <Fragment>
              <Icon type="info-circle" theme="filled" style={{ marginRight: '5px' }} />
              确认
            </Fragment>
          }
          visible={confirmDeleteModalVisible}
          width="348px"
          centered
          onCancel={this.handleConfirmDeleteModalCancel}
          /* eslint-disable  react/jsx-wrap-multilines  */
          footer={
            <div className={styles.modalFooter}>
              <Button type="primary" onClick={this.handleConfirmDeleteModalOK}>
                确认
              </Button>
              <Button onClick={this.handleConfirmDeleteModalCancel}>取消</Button>
            </div>
          }
        >
          确认是否删除当前标签目录？
        </Modal>
      </Fragment>
    );
  }
}

export default GoodsTree;
