import React from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Modal,
  Form,
  // notification
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree/index';
// import styles from './index.less';

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

@connect(commodityList => ({
  submitData: commodityList.submitData,
}))
@Form.create()
class Catalogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      treeData: [],
      // clickFolder: '',
      defaultSelectedKeys: [],
    };
  }

  componentWillMount() {
    this.getTreeData();
  }

  componentDidMount() {}

  componentDidUpdate() {}

  getTreeData = () => {
    const { dispatch } = this.props;
    // const { clickFolder } = this.state;
    dispatch({
      type: 'commodityList/getMccFolderList',
      payload: {
        objType: 4,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.dealData(res.svcCont.data);
        // this.onSelectCallBack(clickFolder);
      }
    });
  };

  addMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/addMccFolder',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.getTreeData();
      }
    });
  };

  updateMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/updateMccFolder',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.getTreeData();
      }
    });
  };

  delMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/CanIDelFolder',
      payload: params,
    }).then(res => {
      // if (res.svcCont.data.length !== 0) {
      //   // 删除失败
      //   notification.error({
      //     message: '删除失败',
      //     description: '该目录不能删除',
      //   });
      // } else if (res && res.topCont && res.topCont.resultCode === 0) {
      //   this.getTreeData();
      // }
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.getTreeData();
      }
    });
  };

  dealData = data => {
    const { submitData = {} } = this.props;
    const { fold } = submitData;
    const len = data.length;
    const treeArr = data.map(item => ({
      title: item.name,
      key: item.fold,
      comments: item.comments,
      pathCodeLen: item.pathCode && item.pathCode.split('.').length,
      parentKey: item.parentFold || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
    }));
    const newArr = [];
    const getChild = node => {
      // 拿到当前节点的子节点
      // if (index === len - 1) {
      //   return;
      // }
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
    // let flag = false;
    // let clickFolder='';
    for (let i = 0; i < len; i += 1) {
      if (treeArr[i].pathCodeLen === 1) {
        //   if(!flag){
        //     clickFolder = treeArr[i].key;
        //     flag = !flag;
        //   }
        newArr.push(treeArr[i]);
        treeArr[i].used = true;
        getChild(treeArr[i], i);
      }
    }
    // ------------------------------- 默认选中项 -------------------------------
    const defaultSelectedKey =
      fold || (newArr && newArr.length && newArr[0].key && newArr[0].key.toString());
    // ------------------------------- 默认选中项 -------------------------------

    // console.log(newArr, data);
    this.setState({
      treeData: newArr,
      defaultSelectedKeys: [defaultSelectedKey], //  默认选中项
      // clickFolder,
    });
    this.onSelectCallBack(defaultSelectedKey); // 默认选中项数据
  };

  addCata = () => {
    this.setState({
      addModal: true,
    });
  };

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
            objType: 4, // 对象类型，写死为2
            parentFold: curItem.key, // 父级目录
          };
          this.addMccFolder(obj);
        } else if (curOperate === 'edit') {
          const obj = {
            fold: curItem.key, // 活动目录id
            parentFold: curItem.parentId, // 父级目录
            comments, // 目录描述
            name: title, // 目录名称
            objType: 4, // 对象类型，写死为2
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

  handleSubmit = () => {};

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
    // console.log(item,'456');
    const obj = {
      comments: item.comments, // 目录描述
      name: item.title, // 目录名称
      objType: 4, // 对象类型，写死为2
      parentFold: item.parentId, // 父级目录
      fold: item.key, // 活动目录id
    };
    this.delMccFolder(obj);
  };

  onSelectCallBack = key => {
    // console.log(key);
    this.clickFolder = key;
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/changeClickFolder',
      payload: key,
    });
  };

  render() {
    const { addModal, treeData, defaultSelectedKeys } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const treeProps = {
      treeData,
      defaultSelectedKeys,
      defaultExpandedKeys: defaultSelectedKeys,
      // add: true,  // ------------------------------------------------------
      // edit: true,
      // del: true,
      // addCallBack: this.addCallBack,                     暂时不需要
      // editCallBack: this.editCallBack,
      // deleteCallBack: this.deleteCallBack,  // -------------------------
      onSelectCallBack: this.onSelectCallBack,
      hideSearch: true,
      showButtons: false, // ------------暂时去掉按钮---------------------
    };
    return (
      <Card
        title={formatMessage({ id: 'commodityManage.name.offerFold' })}
        className="common-card"
        size="small"
      >
        <SearchTree {...treeProps} />
        <Modal
          title={formatMessage({ id: 'commodityManage.name.foldInfo' })}
          visible={addModal}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.foldName' })}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'commodityManage.tip.foldNameTip' }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'commodityManage.name.foldNote' })}>
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
