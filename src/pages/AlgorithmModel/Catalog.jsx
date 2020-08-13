import React from 'react';
import { Card, Modal, Form, Input, message, Icon } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree';

@connect(({ loading })=>({
  confirmLoading:
    loading.effects['algorithmModel/addAlgorithmFoldEffect'] ||
    loading.effects['algorithmModel/updateAlgorithmFoldEffect'],
}))
@Form.create()
class Catalog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      algorithmCatalog: [],
      defaultSelectedKeys: [],
      catalogModalVisible: false,
      action: '', // 目录操作 add or update
      currentCatalog: {}, // 当前操作目录
      hasFoldFlag: true,
    }
  }

  async componentDidMount() {
    await this.qryHasFold();
    this.qryCatalog();
  }

  qryHasFold = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'algorithmModel/qryHasFoldEffect',
      payload: {},
      callback: svcCont => {
        this.setState({
          hasFoldFlag: svcCont.data === '1'
        });
      }
    });
  }

  qryCatalog = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'algorithmModel/qryAlgorithmFoldListEffect',
      payload: {},
      callback: svcCont => {
        const algorithmCatalog = this.dealCatalog(svcCont.data);
        this.setState({
          algorithmCatalog,
          defaultSelectedKeys: [algorithmCatalog && algorithmCatalog[0] && String(algorithmCatalog[0].key)],
        });

        if(algorithmCatalog[0]) {
          this.saveCurrentCatalogBasicInfo(algorithmCatalog[0])
        }
      }
    });
  }

  // 保存当前选中目录基础信息
  saveCurrentCatalogBasicInfo = ({ key, title }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'algorithmModel/getCurrentCatalogBasicInfo',
      payload: {
        key,
        title,
      }
    });
  }

  dealCatalog = originCatalog => {
    const len = originCatalog.length;
    const tempCatalog = originCatalog.map(catalogItem => ({
      title: catalogItem.name,
      key: catalogItem.id,
      comments: catalogItem.comments || '',
      pathCodeLen: catalogItem && catalogItem.pathCode ? catalogItem.pathCode.split('.').length:0,
      parentKey: catalogItem.parentFold || '',
      children: [],
      used: false,
      curOperate: '',
      curItem: {},
      pathCode: catalogItem.pathCode,
      status: catalogItem.status,
    }));

    const targetCatalog = [];
     // 拿到当前节点的子节点
    const getChild = (node, index) => {
      // 递归结束
      if (index === len - 1) {
        return;
      }
      for (let i = 0; i < len; i += 1) {
        // 如果当前节点的路径长度大于 node 且 parentKey = node.key 那么它就是 node 的子元素
        if (
          tempCatalog[i].pathCodeLen > node.pathCodeLen &&
          tempCatalog[i].parentKey === node.key &&
          !tempCatalog[i].used
        ) {
          node.children.push(tempCatalog[i]);
          tempCatalog[i].used = true;
          getChild(tempCatalog[i], i);
        }
      }
    };
    for (let i = 0; i < len; i += 1) {
      if (tempCatalog[i].pathCodeLen === 1) {
        targetCatalog.push(tempCatalog[i]);
        tempCatalog[i].used = true;
        getChild(tempCatalog[i], i);
      }
    }
    return targetCatalog;
  }

  getParentNode = pathCode => {
    const { algorithmCatalog } = this.state;
    // 当前目录节点的层次
    const level = pathCode.split('.');
    // 找到父节点
    let parent = algorithmCatalog.find(catalog => catalog.pathCode === level[0]);
    for(let i = 1; i < level.length - 1; i+=1) {
      const tempPathCode = level.slice(0, i+1).join('.');
      parent = parent.children.find(catalog => catalog.pathCode === tempPathCode);
    }
    return parent;
  }

  // 目录增删改
  addCallBack = catalogItem => {
    this.setState({
      catalogModalVisible: true,
      action: 'add',
      currentCatalog: catalogItem,
    }, () => {
      const { form } = this.props;
      form.setFieldsValue({
        parentName: catalogItem.title,
      });
    });
  }

  editCallBack = catalogItem => {
    this.setState({
      catalogModalVisible: true,
      action: 'update',
      currentCatalog: catalogItem,
    }, () => {
      const { form } = this.props;
      let parent;
      if(catalogItem.parentKey !== -1) {
        parent = this.getParentNode(catalogItem.pathCode);
      }
      form.setFieldsValue({
        name: catalogItem.title,
        parentName: parent && parent.title || '',
        comments: catalogItem.comments,
      });
    });
  }

  deleteCallBack = catalogItem => {
    const { dispatch } = this.props;
    dispatch({
      type: 'algorithmModel/judgeCanCatalogDeleteEffect',
      payload: {
        fold: catalogItem.key,
      },
      callback: svcCont => {
        if(svcCont.data > 0) {
          message.error(formatMessage({ id: 'algorithmModel.judgeDeleteCatalogInfo' }));
        } else {
          dispatch({
            type: 'algorithmModel/deleteAlgorithmFoldEffect',
            payload: {
              fold: catalogItem.key,
            },
            callback: () => {
              this.qryCatalog();
              this.qryHasFold();
            }
          });
        }
      }
    });
  }

  onSelectCallBack = (key, title) => {
    this.saveCurrentCatalogBasicInfo({key, title});
  }

  handleModalOk = () => {
    const { action, currentCatalog } = this.state;
    const { dispatch } = this.props;
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      if(action === 'add') {
        dispatch({
          type: 'algorithmModel/addAlgorithmFoldEffect',
          payload: {
            ...values,
            parentFold: currentCatalog.key,
          },
          callback: () => {
            this.closeCatalogModal();
            this.qryCatalog();
            this.qryHasFold();
          }
        });
  
      } else if(action === 'update') {
        const { parentKey: parentFold, status, key } = currentCatalog;
        dispatch({
          type: 'algorithmModel/updateAlgorithmFoldEffect',
          payload: {
           ...values,
           parentFold,
           status,
           fold: key,
          },
          callback: () => {
            this.closeCatalogModal();
            this.qryCatalog();
          }
        });
      }
    });
  }

  handleModalCancel = () => {
    this.closeCatalogModal();
  }

  // 关闭Modal, 重置状态
  closeCatalogModal = () => {
    const { form } = this.props;
    this.setState({
      catalogModalVisible: false,
      action: '',
    }, () => {
      form.resetFields();
    });
  }

  render() {
    const { algorithmCatalog, defaultSelectedKeys, catalogModalVisible, hasFoldFlag } = this.state;
    const { form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;

    const treeProps = {
      defaultSelectedKeys,
      defaultExpandedKeys: defaultSelectedKeys,
      treeData: algorithmCatalog,
      add: true,
      edit: true,
      del: true,
      addCallBack: this.addCallBack,
      editCallBack: this.editCallBack,
      deleteCallBack: this.deleteCallBack,
      onSelectCallBack: this.onSelectCallBack,
    }

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

    return (
      <Card
        size="small"
        className="common-card"
        title={formatMessage({ id: 'algorithmModel.catalog' })}
        extra={
          !hasFoldFlag ? (
            <Icon type="plus-circle" onClick={this.addCallBack}>
              {formatMessage({ id: 'common.btn.add' })}
            </Icon>
          ) : null
        }
      >
        <SearchTree {...treeProps} />
        <Modal
          title={formatMessage({
            id: 'algorithmModel.algorithmCatalogInfo',
          })}
          visible={catalogModalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          confirmLoading={confirmLoading}
        >
          <Form {...formItemLayout}>
            <Form.Item
              label={formatMessage({
                id: 'algorithmModel.catalogName',
              })}
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'common.form.required',
                    }),
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({
                id: 'algorithmModel.parentCatalog',
              })}
            >
              {getFieldDecorator('parentName')(<Input disabled />)}
            </Form.Item>
            <Form.Item
              label={formatMessage({
                id: 'algorithmModel.description',
              })}
            >
              {getFieldDecorator('comments')(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  }
}

export default Catalog;
