/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'dva';
import { Card, Input, Modal, Form } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from './components/SearchTree/index';

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
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      treeData: [],
      returnData: [],
      defaultSelectedKeys: [],
    };
  }

  // componentWillMount() {
  //   console.log(1);
  //   this.getTreeData({ setDefault: true });
  // }

  componentDidMount() {
    this.getTreeData({ setDefault: true });
  }

  componentDidUpdate() {}

  getTreeData = options => {
    const { dispatch, getNodeInfo } = this.props;
    dispatch({
      type: 'marketingActivityList/getMccFolderList',
      payload: {
        // fold: -1,
        // objType: 2,
      },
      callback: res => {
        if (res && res.topCont && res.topCont.resultCode === 0) {
          // const newArr = this.dealData(res.svcCont.data);
          // console.log(newArr)
          const defaultSelectedKey = res.svcCont.data[0].busiCode;
          // const pathCode = newArr && newArr.length && newArr[0].pathCode;
          // const folderName = newArr && newArr.length && newArr[0].title;
          // // console.log(defaultSelectedKey, newArr, folderName);
          // if (options && options.setDefault) {
          this.setState({
            treeData: res.svcCont.data,
            returnData: res.svcCont.data,
            defaultSelectedKeys: [defaultSelectedKey],
          });
          //   getNodeInfo(defaultSelectedKey, pathCode, folderName);
          // } else {
          //   this.setState({
          //     treeData: newArr,
          //     returnData: res.svcCont.data,
          //   });
          // }
        }
      },
    });
  };

  addMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'marketingActivityList/addMccFolder',
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
      type: 'marketingActivityList/updateMccFolder',
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
      type: 'marketingActivityList/delMccFolder',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.getTreeData();
      }
    });
  };

  // dealData = data => {
  //   console.log(data);
  //   const len = data.length;
  //   const treeArr = data.map(item => ({
  //     title: item.busiName,
  //     key: item.busiCode,
  //     comments: item.comments,
  //     // pathCodeLen: item.pathCode.split('.').length,
  //     parentKey: item.parentFold || '',
  //     children: item.childTypes,
  //     used: false,
  //     curOperate: '',
  //     curItem: {},
  //     pathCode: item.pathCode,
  //   }));
  //   console.log(treeArr);
  //   const newArr = [];
  //   const getChild = (node, index) => {
  //     // 拿到当前节点的子节点
  //     if (index === len - 1) {
  //       return;
  //     }
  //     for (let i = 0; i < len; i += 1) {
  //       // 如果当前节点的路径长度大于 node 且 parentKey = node.key 那么它就是 node 的子元素
  //       if (
  //         treeArr[i].pathCodeLen > node.pathCodeLen &&
  //         treeArr[i].parentKey === node.key &&
  //         !treeArr[i].used
  //       ) {
  //         node.children.push(treeArr[i]);
  //         treeArr[i].used = true;
  //         getChild(treeArr[i], i);
  //       }
  //     }
  //   };
  //   for (let i = 0; i < len; i += 1) {
  //     if (treeArr[i].pathCodeLen === 1) {
  //       newArr.push(treeArr[i]);
  //       treeArr[i].used = true;
  //       getChild(treeArr[i], i);
  //     }
  //   }
  //   console.log(newArr);
  //   return newArr;
  // };

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
            objType: 2, // 对象类型，写死为2
            parentFold: curItem.key ? curItem.key : -1, // 父级目录
          };
          this.addMccFolder(obj);
        } else if (curOperate === 'edit') {
          const obj = {
            comments, // 目录描述
            name: title, // 目录名称
            objType: 2, // 对象类型，写死为2
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
    const obj = {
      comments: item.comments, // 目录描述
      name: item.title, // 目录名称
      objType: 2, // 对象类型，写死为2
      parentFold: item.parentId, // 父级目录
      fold: item.key, // 活动目录id
    };
    this.delMccFolder(obj);
  };

  // 查询选中目录信息
  getPathCode = key => {
    const { returnData } = this.state;
    let pathcode = '';
    let folderName = '';
    returnData.forEach(item => {
      if (String(item.fold) === String(key)) {
        pathcode = item.pathCode;
        folderName = item.name;
      }
    });
    return { pathcode, folderName };
  };

  // 选中目录回调
  onSelectCallBack = (key, parentCode) => {
    const { getNodeInfo } = this.props;
    const { pathCode, folderName } = this.getPathCode(key);
    getNodeInfo(key, pathCode, folderName, parentCode);
  };

  render() {
    const { addModal, treeData, defaultSelectedKeys } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const treeProps = {
      defaultSelectedKeys,
      treeData,
      // add: true,
      // edit: true,
      // del: true,
      showButtons: false,
      hideSearch: true,
      addCallBack: this.addCallBack,
      editCallBack: this.editCallBack,
      deleteCallBack: this.deleteCallBack,
      onSelectCallBack: this.onSelectCallBack,
    };
    return (
      <Card
        title={formatMessage({
          id: 'activityConfigManage.marketingActivityList.treeTitle',
        })}
        size="small"
        className="common-card"
        // extra={
        //   <a
        //     onClick={() => {
        //       this.setState({
        //         addModal: true,
        //         curOperate: 'add',
        //         curItem: {},
        //       });
        //     }}
        //   >
        //     添加
        //   </a>
        // }
      >
        {treeData && treeData.length > 0 && <SearchTree {...treeProps} />}
        <Modal
          title={formatMessage({
            id: 'activityConfigManage.marketingActivityList.ctgModalName',
          })}
          visible={addModal}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item
              label={formatMessage({
                id: 'activityConfigManage.marketingActivityList.ctgName',
              })}
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'activityConfigManage.marketingActivityList.required',
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({
                id: 'activityConfigManage.marketingActivityList.ctgComments',
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
