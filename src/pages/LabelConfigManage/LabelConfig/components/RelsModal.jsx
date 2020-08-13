import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input, Row, Col, Select, message } from 'antd';
import styles from '../index.less';
import LabelListModal from './LabelListModal';

const { Option } = Select;

const { Search } = Input;

const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
};

@connect(() => ({}))
@Form.create()
class RelsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelListModalVisible: false,
      labelType: '', // 当前想要搜索的标签的类型 商品标签/用户标签
      labelListModalTitle: '', // 当前想要搜索的标签的标题  选择商品标签/选择用户标签
      goodsValueOptions: [], // 商品标签属性值的可选项
      userValueOptions: [], // 用户标签属性值的可选项
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { curItem } = this.props;
    if (!curItem && nextProps.curItem) {
      const { dispatch } = this.props;
      // 获取商品标签值列表
      dispatch({
        type: 'labelConfig/getMccLabelValueList',
        payload: {
          labelId: nextProps.curItem.goodsLabelId,
        },
      }).then(res => {
        if (res && res.svcCont && res.svcCont.data) {
          this.setState({
            goodsValueOptions: res.svcCont.data,
          });
        } else {
          message.error('获取商品标签值列表失败！');
        }
      });

      // 获取用户标签值列表
      dispatch({
        type: 'labelConfig/getMccLabelValueList',
        payload: {
          labelId: nextProps.curItem.subsLabelId,
        },
      }).then(res => {
        if (res && res.svcCont && res.svcCont.data) {
          this.setState({
            userValueOptions: res.svcCont.data,
          });
        } else {
          message.error('获取用户标签值列表失败！');
        }
      });
    }
  }

  // 获取标签列表数据
  getLabelInfoList = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'labelConfig/getLabelInfoList',
      payload: {
        labelType: type,
        labelValueType: '2000',
      },
    });
  };

  // 显示标签列表的对话框
  handleSearchLabel = (type, title) => {
    this.setState({
      labelListModalVisible: true,
      labelType: type,
      labelListModalTitle: title,
    });

    // 获取标签列表数据
    this.getLabelInfoList(type === 'user' ? '0' : '1');
  };

  // 隐藏标签列表的对话框
  hideSearchLabelModal = () => {
    this.setState({
      labelListModalVisible: false,
      labelType: '',
    });
  };

  // 按下标签列表对话框的确定键
  handleSearchLabelOK = (rows, type) => {
    const { dispatch, form } = this.props;
    // 获取标签值列表
    dispatch({
      type: 'labelConfig/getMccLabelValueList',
      payload: {
        labelId: rows[0].labelId,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        message.success('获取标签值列表成功！');
        if (type === 'goods') {
          this.setState({
            goodsValueOptions: res.svcCont.data,
          });

          // 回填表单
          form.setFieldsValue({
            productName: rows[0].labelName,
            productId: rows[0].labelId,
          });
        } else {
          this.setState({
            userValueOptions: res.svcCont.data,
          });

          // 回填表单
          form.setFieldsValue({
            userName: rows[0].labelName,
            userId: rows[0].labelId,
          });
        }
      } else {
        message.error('获取标签值列表失败！');
      }
      this.hideSearchLabelModal();
    });
  };

  handleCheckGoods = () => {
    const { form } = this.props;
    form.validateFields(['productName']);
  };

  handleCheckUser = () => {
    const { form } = this.props;
    form.validateFields(['userName']);
  };

  // 点击确认提交按钮
  handleSubmit = () => {
    const { modalType, form, dispatch, curItem, hideModal, getRelsList } = this.props;

    if (modalType === 'create') {
      form.validateFields((error, values) => {
        if (!error) {
          dispatch({
            type: 'labelConfig/addMccLabelRelsInfo',
            payload: {
              subsLabelId: values.userId, // 用户标签的Id
              goodsLabelId: values.productId, // 商品标签的Id
              relsNum: values.relsNum, // 关联度系数
              subsLabelValueId: values.userValueId, // 用户标签值的Id
              goodsLabelValueId: values.productValueId, // 商品标签值的Id
            },
          }).then(res => {
            if (res && res.topCont && res.topCont.resultCode === 0) {
              message.success('新建标签关联度成功！');
              hideModal();
              getRelsList();
            } else {
              message.error(res.topCont.remark);
            }
          });
        }
      });
    } else {
      form.validateFields((error, values) => {
        if (!error) {
          dispatch({
            type: 'labelConfig/updateMccLabelRelsInfo',
            payload: {
              subsLabelId: values.userId, // 用户标签的Id
              goodsLabelId: values.productId, // 商品标签的Id
              relsNum: values.relsNum, // 关联度系数
              subsLabelValueId: values.userValueId, // 用户标签值的Id
              goodsLabelValueId: values.productValueId, // 商品标签值的Id
              relsId: curItem.relsId, // 关联度的Id
            },
          }).then(res => {
            if (res && res.topCont && res.topCont.resultCode === 0) {
              message.success('编辑标签关联度成功！');
              hideModal();
              getRelsList();
            } else {
              message.error(res.topCont.remark);
            }
          });
        }
      });
    }
  };

  render() {
    const { modalTitle, hideModal, modalVisible, curItem, form } = this.props;
    const {
      labelListModalVisible,
      labelType,
      labelListModalTitle,
      goodsValueOptions,
      userValueOptions,
    } = this.state;

    return (
      <Fragment>
        <Modal
          title={modalTitle}
          onCancel={hideModal}
          visible={modalVisible}
          className={styles.modal}
          width="774px"
          destroyOnClose
          footer={
            <div className={styles.modalFooter}>
              <Button size="small" type="primary" key="submit" onClick={this.handleSubmit}>
                确认
              </Button>
              <Button size="small" key="back" onClick={hideModal}>
                返回
              </Button>
            </div>
          }
        >
          <Form {...formItemLayout}>
            <Row>
              <Col span={11}>
                <Form.Item label="商品标签名称">
                  {form.getFieldDecorator('productName', {
                    rules: [
                      {
                        required: true,
                        message: '请选择商品标签名称！',
                      },
                    ],
                    initialValue: curItem ? curItem.goodsLabelName : null,
                  })(
                    <Search
                      readOnly
                      size="small"
                      // onClick={() => {
                      //   this.handleSearchLabel('goods', '选择商品标签');
                      // }}
                      onSearch={() => {
                        this.handleSearchLabel('goods', '选择商品标签');
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              {/* 商品标签ID只做表单保存使用，不作展示 */}
              <Col span={11} style={{ display: 'none' }}>
                <Form.Item label="商品标签ID">
                  {form.getFieldDecorator('productId', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    initialValue: curItem ? curItem.goodsLabelId : null,
                  })(
                    <Search
                      readOnly
                      size="small"
                      onClick={() => {
                        this.handleSearchLabel('goods', '选择商品标签');
                      }}
                      onSearch={() => {
                        this.handleSearchLabel('goods', '选择商品标签');
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={11} offset={1}>
                <Form.Item label="属性值">
                  {form.getFieldDecorator('productValueId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择商品属性值！',
                      },
                    ],
                    initialValue: curItem ? curItem.goodsLabelValueId : null,
                  })(
                    <Select size="small" onFocus={this.handleCheckGoods}>
                      {goodsValueOptions
                        ? goodsValueOptions.map(item => (
                            <Option value={item.labelValueId} key={item.labelValueId}>
                              {item.valueName}
                            </Option>
                          ))
                        : null}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label="用户标签名称">
                  {form.getFieldDecorator('userName', {
                    rules: [
                      {
                        required: true,
                        message: '请选择用户标签名称！',
                      },
                    ],
                    initialValue: curItem ? curItem.subsLabelName : null,
                  })(
                    <Search
                      readOnly
                      size="small"
                      // onClick={() => {
                      //   this.handleSearchLabel('user', '选择用户标签');
                      // }}
                      onSearch={() => {
                        this.handleSearchLabel('user', '选择用户标签');
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              {/* 用户标签ID只做表单保存使用，不作展示 */}
              <Col span={11} style={{ display: 'none' }}>
                <Form.Item label="用户标签ID">
                  {form.getFieldDecorator('userId', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                    initialValue: curItem ? curItem.subsLabelId : null,
                  })(
                    <Search
                      readOnly
                      size="small"
                      onClick={() => {
                        this.handleSearchLabel('user', '选择用户标签');
                      }}
                      onSearch={() => {
                        this.handleSearchLabel('user', '选择用户标签');
                      }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={11} offset={1}>
                <Form.Item label="属性值">
                  {form.getFieldDecorator('userValueId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择用户属性值！',
                      },
                    ],
                    initialValue: curItem ? curItem.subsLabelValueId : null,
                  })(
                    <Select size="small" onFocus={this.handleCheckUser}>
                      {userValueOptions
                        ? userValueOptions.map(item => (
                            <Option value={item.labelValueId} key={item.labelValueId}>
                              {item.valueName}
                            </Option>
                          ))
                        : null}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item label="关联系数">
                  {form.getFieldDecorator('relsNum', {
                    rules: [
                      {
                        required: true,
                        message: '请输入关联系数',
                      },
                    ],
                    initialValue: curItem ? curItem.relsNum : null,
                  })(<Input size="small" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <LabelListModal
          hideModal={this.hideSearchLabelModal}
          modalVisible={labelListModalVisible}
          modalTitle={labelListModalTitle}
          modalType={labelType}
          handleOK={this.handleSearchLabelOK}
        />
      </Fragment>
    );
  }
}

export default RelsModal;
