import React from 'react';
import { connect } from 'dva';
import { Card, Input, Modal, Form } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree';

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

  componentWillMount() {
    this.getTreeData({ setDefault: true });
  }

  componentDidUpdate() {}

  getTreeData = options => {
    const { dispatch, getNodeInfo } = this.props;
    dispatch({
      type: 'eventSrc/getTreeList',
      payload: {
        // id: -1,
        statusCd: '1000',
        catalogType: '1',
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const newArr = this.dealData(res.svcCont.data);
        const defaultSelectedKey =
          newArr && newArr.length && newArr[0].key && newArr[0].key.toString();
        const pathCode = newArr && newArr.length && newArr[0].pathCode;
        if (options && options.setDefault) {
          this.setState({
            treeData: newArr,
            returnData: res.svcCont.data,
            defaultSelectedKeys: [defaultSelectedKey],
          });
          getNodeInfo(pathCode);
        } else {
          this.setState({
            treeData: newArr,
            returnData: res.svcCont.data,
          });
        }
      }
    });
  };

  addMccFolder = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'eventSrc/addMccFolder',
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
      type: 'eventSrc/updateMccFolder',
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
      type: 'eventSrc/delMccFolder',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.getTreeData();
      }
    });
  };

  dealData = data => {
    const treeArr = data.map(item => ({
      title: item.name,
      key: item.id,
      comments: item.comments,
      pathCodeArr: item.pathCode.split('.'),
      parentKey: item.parentId || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
      pathCode: item.pathCode,
    }));

    // 过滤脏数据
    // treeArr = treeArr.filter((item) => {
    //   return !Number.isNaN(Number(item.pathCodeArr[0], 10)) &&
    //          item.key == item.pathCodeArr[item.pathCodeArr.length-1]
    // })
    const len = treeArr.length;
    const newArr = [];
    const getChild = node => {
      // 拿到当前节点的子节点

      // 递归出口,
      // if (index === len - 1) {
      //   return;
      // }

      for (let i = 0; i < len; i += 1) {
        // 遍历所有元素，找到其父节点key === 参数node节点key，这个就是node节点的子节点
        if (treeArr[i].parentKey === node.key && !treeArr[i].used) {
          node.children.push(treeArr[i]);
          treeArr[i].used = true;
          getChild(treeArr[i]);
        }
      }
    };
    for (let i = 0; i < len; i += 1) {
      if (treeArr[i].pathCodeArr.length === 2) {
        newArr.push(treeArr[i]);
        treeArr[i].used = true;
        getChild(treeArr[i]);
      }
    }
    return newArr;
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
            description: comments, // 目录描述
            name: title, // 目录名称
            catalogType: '1', // 对象类型，写死为1
            parentId: Number(curItem.key), // 父级目录
            pathCode: curItem.pathCode,
            userId: 100, // 写死 100
            simpleName: '',
            tableName: '',
            createTime: moment().format('YYYY-MM-DD hh:mm:ss'),
            code: '',
            orderby: 96,
          };
          this.addMccFolder(obj);
        } else if (curOperate === 'edit') {
          const obj = {
            id: String(curItem.key),
            description: comments, // 目录描述
            name: title, // 目录名称
            catalogType: '1', // 对象类型，写死为1
            parentId: Number(curItem.parentId), // 父级目录
            pathCode: curItem.pathCode,
            userId: 100, // 写死 100
            simpleName: '',
            tableName: '',
            code: '',
            createTime: moment().format('YYYY-MM-DD hh:mm:ss'),
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
      id: item.key, // 活动目录id
    };
    this.delMccFolder(obj);
  };

  getPathCode = key => {
    const { returnData } = this.state;
    let pathcode = '';
    returnData.forEach(item => {
      if (String(item.id) === String(key)) {
        pathcode = `${pathcode}${item.pathCode}`;
      }
    });
    return pathcode;
  };

  onSelectCallBack = key => {
    const { getNodeInfo } = this.props;
    const pathCode = this.getPathCode(key);
    getNodeInfo(pathCode);
  };

  render() {
    const { addModal, treeData, defaultSelectedKeys } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const treeProps = {
      defaultSelectedKeys,
      treeData,
      add: true,
      edit: true,
      del: true,
      addCallBack: this.addCallBack,
      editCallBack: this.editCallBack,
      deleteCallBack: this.deleteCallBack,
      onSelectCallBack: this.onSelectCallBack,
    };
    return (
      <Card title="事件目录" size="small" className="common-card">
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
