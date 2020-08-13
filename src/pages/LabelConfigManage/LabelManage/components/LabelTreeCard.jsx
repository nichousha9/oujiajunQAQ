import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Card, message, Form, Modal, Button, Radio, Input } from 'antd';
import styles from '../index.less';
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

@connect(({ labelManage }) => ({
  labelCatalogData: labelManage.labelCatalogData,
  rawLabelCatalogData: labelManage.rawLabelCatalogData,
}))
@Form.create()
class LabelTreeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 添加，编辑目录的对话框
      modalTitle: '', // 对话框的标题
      isAddChild: true, // 是否为添加子目录
      isEditOrAddRoot: false, // 是否为点击编辑或点击右上角的绿色+号
      curItem: {}, // 当前选中的目录
      curOperate: null, // 要执行的操作：添加目录（add）或编辑目录（edit）
    };
  }

  componentWillMount() {
    this.getTreeData().then(() => {
      const { labelCatalogData, dispatch } = this.props;
      // 当前默认第一个目录
      const currentCatalog =
        (labelCatalogData.data && labelCatalogData.data.length && labelCatalogData.data[0]) || {};

      dispatch({
        type: 'labelManage/setCurrentCatalogId',
        payload: {
          key: (currentCatalog && currentCatalog.key && currentCatalog.key.toString()) || '',
          catalogName: (currentCatalog && currentCatalog.title) || '',
        },
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
  getTreeData = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'labelManage/getMccLabelCatalogList',
      payload: {},
    });
  };

  // 点击确定按钮
  handleAddModalOK = () => {
    const { curItem, curOperate } = this.state;
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        const { model, name, description } = values;
        if (curOperate === 'add') {
          const params = {
            // 以下三个为必须参数
            grpDesc: description,
            grpName: name,
            labelType: curItem.labelType || '',
            // 以下的为可选参数
            parentGrpId: model === 'addChild' ? curItem.key : -1,
            pathCode: model === 'addChild' ? curItem.pathCode : null,
          };
          this.addMccLabelCatalogInfo(params);
        } else if (curOperate === 'edit') {
          const params = {
            // 以下为必须参数
            grpId: curItem.key,
            parentGrpId: curItem.parentKey,
            grpDesc: description,
            grpName: name,
            statusCd: curItem.statusCd,
            pathCode: curItem.pathCode,
            labelType: curItem.labelType,
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

  // 发送添加目录的请求
  addMccLabelCatalogInfo = params => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'labelManage/addMccLabelCatalogInfo',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 重新获取数据
        this.getTreeData();

        // 关闭Modal
        this.setState({
          modalVisible: false,
        });

        message.success(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.addCatalog',
            },
            '添加目录',
          )}${formatMessage(
            {
              id: 'common.message.successfully',
            },
            '成功',
          )}!`,
        );

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
      type: 'labelManage/updateMccLabelCatalogInfo',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        // 重新获取数据
        this.getTreeData();

        // 关闭Modal
        this.setState({
          modalVisible: false,
        });

        message.success(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.editCatalog',
            },
            '编辑目录',
          )}${formatMessage(
            {
              id: 'common.message.successfully',
            },
            '成功',
          )}!`,
        );
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
      type: 'labelManage/delMccLabelCatalogInfo',
      payload: params,
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success(
          `${formatMessage(
            {
              id: 'labelConfigManage.labelManage.deleteCatalog',
            },
            '删除目录',
          )}${formatMessage(
            {
              id: 'common.message.successfully',
            },
            '成功',
          )}!`,
        );
        // 重新获取数据
        this.getTreeData();
      } else {
        // 如果发生错误，提示用户
        message.error('新增失败');
      }
    });
  };

  // 显示只能添加根目录的对话框
  addRootCatalog = () => {
    this.setState({
      modalVisible: true,
      isAddChild: false,
      isEditOrAddRoot: true,
      modalTitle: formatMessage(
        {
          id: 'labelConfigManage.labelManage.addRootCatalog',
        },
        '添加根目录',
      ),
      curOperate: 'add',
    });
    // 设置为添加根节点模式
    const { form } = this.props;

    form.setFieldsValue({ model: 'addRoot' });
  };

  // 在目录树内点击“添加”的回调函数
  addCallBack = item => {
    this.setState({
      modalVisible: true,
      curItem: item,
      isAddChild: true,
      isEditOrAddRoot: false,
      modalTitle: formatMessage(
        {
          id: 'labelConfigManage.labelManage.addCatalog',
        },
        '添加目录',
      ),
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
      modalTitle: formatMessage(
        {
          id: 'labelConfigManage.labelManage.editCatalog',
        },
        '编辑目录',
      ),
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
    const params = {
      grpId: item.key,
    };
    // 发送删除标签的请求
    this.delMccLabelCatalogInfo(params);
  };

  // 在目录树内选择某一个目录的回调函数
  onSelectCallBack = (key, catalogName) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelManage/setCurrentCatalogId',
      payload: {
        key,
        catalogName,
      },
    });
  };

  render() {
    const { modalVisible, isAddChild, isEditOrAddRoot, modalTitle } = this.state;
    const { form, labelCatalogData } = this.props;
    const { getFieldDecorator } = form;
    const defaultExpandedKeys =
      (labelCatalogData.data &&
        labelCatalogData.data.length && [labelCatalogData.data[0].key.toString()]) ||
      [];
    const treeProps = {
      defaultExpandedKeys,
      showButtons: false,
      treeData: labelCatalogData.data || [], // 当labelCatalogData为空的时候传一个空数组进去
      // add: true,
      // edit: true,
      // del: true,
      addCallBack: this.addCallBack,
      editCallBack: this.editCallBack,
      deleteCallBack: this.deleteCallBack,
      onSelectCallBack: this.onSelectCallBack,
      defaultSelectedKeys: defaultExpandedKeys,
      hideSearch: true,
    };
    // console.log(labelCatalogData);
    return (
      <Fragment>
        <Card
          size="small"
          title={formatMessage(
            {
              id: 'labelConfigManage.labelManage.labelCatalog',
            },
            '标签目录',
          )}
          className="common-card"
          // extra={
          //   // labelCatalogData.data.length !== 0 ? null : (
          //   <Icon
          //     type="plus-circle"
          //     theme="filled"
          //     style={{ color: '#36C626' }}
          //     onClick={this.addRootCatalog}
          //   />
          //   // )
          // }
        >
          <SearchTree {...treeProps} />
        </Card>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onCancel={this.handleAddModalCancel}
          footer={
            <div className={styles.modalFooter}>
              <Button type="primary" size="small" onClick={this.handleAddModalOK}>
                {formatMessage(
                  {
                    id: 'common.btn.confirm',
                  },
                  '确认',
                )}
              </Button>
              <Button size="small" onClick={this.handleAddModalCancel}>
                {formatMessage(
                  {
                    id: 'common.btn.cancel',
                  },
                  '取消',
                )}
              </Button>
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
                  <Radio value="addChild">
                    {formatMessage(
                      {
                        id: 'labelConfigManage.labelManage.addChildCatalog',
                      },
                      '添加子目录',
                    )}
                  </Radio>
                  <Radio value="addRoot">
                    {formatMessage(
                      {
                        id: 'labelConfigManage.labelManage.addRootCatalog',
                      },
                      '添加根目录',
                    )}
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item
              label={formatMessage(
                {
                  id: 'labelConfigManage.labelManage.parentCatalog',
                },
                '父级目录',
              )}
              style={{ display: isAddChild ? 'block' : 'none' }}
            >
              {getFieldDecorator('parentName', {
                rules: [],
              })(<Input disabled />)}
            </Form.Item>
            <Form.Item
              label={formatMessage(
                {
                  id: 'labelConfigManage.labelManage.CatalogName',
                },
                '目录名称',
              )}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入目录名称' }],
              })(<Input />)}
            </Form.Item>
            <Form.Item
              label={formatMessage(
                {
                  id: 'labelConfigManage.labelManage.CatalogDescription',
                },
                '目录描述',
              )}
            >
              {getFieldDecorator('description', {
                rules: [],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default LabelTreeCard;
