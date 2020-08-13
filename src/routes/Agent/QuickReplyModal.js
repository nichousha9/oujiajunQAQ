/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/sort-comp */
import React from 'react';
import { Modal, Row, Col, Menu, Icon, message, Popover, Tooltip } from 'antd';
import styles from './Agent.less';

const MenuItem = Menu.Item;

export default class QuickReplyModal extends React.PureComponent {
  constructor(props) {
    super(props);
    const currQuickType = ((props.quickTypeList || [])[0] || {}).id || '';
    this.state = {
      currQuickType, // 当前默认选中的快速回复的类型
      currEditType: '', // 当前修改的快速回复的类型
      addQuickType: false, // 当前是否添加分类，
      addQuickReply: false, // 添加快速回复的标志
      currEditReply: '', // 当前修改的快速回复
    };
  }

  changeQuickType = (cate) => {
    this.setState({ currQuickType: cate.id });
  };
  setNewQuickType = (deleteId, newList) => {
    const { currQuickType } = this.state;
    const newID =
      deleteId === currQuickType ? (newList.length ? newList[0].id : '') : currQuickType;
    if (newID !== deleteId) {
      this.setState({ currQuickType: newID });
    }
  };
  // 关掉当前的添加分类
  closeAddQuickType = () => {
    this.setState({ addQuickType: false });
  };
  handleEditQuickType = (cate, value) => {
    if (value) {
      const { editQuickType } = this.props;
      if (editQuickType) {
        editQuickType(cate, value);
        this.setState({ currEditType: '' });
      }
    }
  };
  handleAddQuickType = (value) => {
    if (!value.trim()) {
      message.error('名称不能为空');
      return;
    }
    const { addQuickType } = this.props;
    if (!addQuickType) return;
    addQuickType(value);
    this.closeAddQuickType();
  };
  showTooltip = (text, len = 10) => {
    if (!text) return '';
    if (text.length <= len) return text;
    return <Tooltip title={text}>{`${text.substring(0, len)}...`}</Tooltip>;
  };
  addQuickTypeInput = {}; // 快速回复分类的input
  quickReplyContent = {}; // 快速回复的input
  editQuickReplyContent = {}; // 快速回复的input
  render() {
    const {
      quickTypeList = [],
      quickReplyList = [],
      visible,
      onCancle,
      handleDeleteQuickType,
      clientHeight,
      handleAddQuickReply,
      handleEditQuickReply,
      handleDeleteQuickReply,
    } = this.props;
    const {
      currQuickType = '',
      currEditType = '',
      addQuickType = false,
      addQuickReply = false,
      currEditReply,
    } = this.state;
    return (
      <Modal title="快速词管理" visible={visible} onOk={onCancle} onCancel={onCancle} width="80%">
        <Row className={styles.quickDialog}>
          <Col md={6} sm={24} style={{ maxHeight: clientHeight - 250, overflow: 'auto' }}>
            <Menu
              selectedKeys={[currQuickType]}
              onSelect={this.menuSelect}
              mode="inline"
              theme="light"
            >
              {quickTypeList.map((cate) => {
                return (
                  <MenuItem key={cate.id} style={{ display: 'flex', alignItems: 'center' }}>
                    {currEditType === cate.id && (
                      <input
                        autoFocus
                        onBlur={(e) => {
                          this.handleEditQuickType(cate, e.target.value);
                        }}
                        onKeyUp={(e) => {
                          if (e.keyCode === 13 && e.target.value)
                            this.handleEditQuickType(cate, e.target.value);
                        }}
                        defaultValue={cate.name}
                        placeholder="请输入"
                        className="ant-input"
                      />
                    )}
                    {currEditType !== cate.id && (
                      <span
                        onClick={() => {
                          this.changeQuickType(cate);
                        }}
                        style={{ flex: 1 }}
                      >
                        {this.showTooltip(cate.name)}
                      </span>
                    )}
                    <Icon
                      onClick={() => {
                        this.setState({ currEditType: cate.id });
                      }}
                      type="edit"
                      style={{ padding: '5px' }}
                    />
                    <Icon
                      onClick={() => {
                        handleDeleteQuickType(cate, this.setNewQuickType);
                      }}
                      type="delete"
                      style={{ padding: '5px 5px 5px 0' }}
                    />
                  </MenuItem>
                );
              })}
            </Menu>
            {/* 添加分类 */}
            {!!addQuickType && (
              <div>
                <div style={{ padding: '5px 15px' }}>
                  <input
                    autoFocus
                    onKeyUp={(e) => {
                      if (e.keyCode === 13 && e.target.value)
                        this.handleAddQuickType(e.target.value);
                    }}
                    onBlur={(e) => {
                      this.handleAddQuickType(e.target.value);
                    }}
                    ref={(ele) => {
                      this.addQuickTypeInput = ele;
                    }}
                    placeholder="请输入"
                    className="ant-input"
                  />
                </div>
                <div style={{ padding: '5px 5px 5px 24px' }}>
                  <a
                    onClick={() => {
                      this.handleAddQuickType(this.addQuickTypeInput.value);
                    }}
                  >
                    <Icon type="check-circle-o" style={{ marginRight: 5 }} />
                    保存
                  </a>
                  <span
                    onClick={this.closeAddQuickType}
                    style={{ margin: '0 10px', cursor: 'pointer' }}
                  >
                    <Icon type="close-circle-o" style={{ marginRight: 5 }} />
                    取消
                  </span>
                </div>
              </div>
            )}
            {!addQuickType && (
              <div
                onClick={() => {
                  this.setState({ addQuickType: true });
                }}
                style={{ padding: '5px 5px 5px 24px' }}
              >
                <a>
                  <Icon type="plus-circle-o" style={{ marginRight: 5 }} />
                  添加分类
                </a>
              </div>
            )}
          </Col>
          <Col md={18} sm={24} style={{ maxHeight: clientHeight - 250, overflow: 'auto' }}>
            <div className={styles.quickList}>
              <div className={styles.header}>
                <div className={styles.title}>快速词</div>
                <div>
                  {currQuickType ? (
                    <a
                      onClick={() => {
                        this.setState({ addQuickReply: true });
                      }}
                    >
                      <Icon type="plus-circle-o" style={{ marginRight: 5 }} />
                      添加
                    </a>
                  ) : (
                    <span>
                      {' '}
                      <Icon type="plus-circle-o" style={{ marginRight: 5 }} />
                      添加
                    </span>
                  )}
                </div>
              </div>
              {addQuickReply && (
                <div className={styles.item}>
                  <div style={{ marginLeft: 10 }} className={styles.content}>
                    <input
                      ref={(ele) => {
                        this.quickReplyContent = ele;
                      }}
                      placeholder="请输入内容"
                      className="ant-input"
                    />
                  </div>
                  <a
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      handleAddQuickReply(this.quickReplyContent.value, currQuickType, () => {
                        this.setState({ addQuickReply: false });
                      });
                    }}
                  >
                    <Icon type="check-circle-o" style={{ marginRight: 5 }} />
                    保存
                  </a>
                  <span
                    style={{ cursor: 'pointer', marginLeft: 10 }}
                    onClick={() => {
                      this.setState({ addQuickReply: false });
                    }}
                  >
                    <Icon type="close-circle-o" style={{ marginRight: 5 }} />
                    取消
                  </span>
                </div>
              )}
              {quickReplyList
                .filter((item) => item.cate === currQuickType)
                .map((item) =>
                  currEditReply === item.id ? (
                    <div key={item.id} className={styles.item}>
                      <div style={{ marginLeft: 10 }} className={styles.content}>
                        <input
                          ref={(ele) => {
                            this.editQuickReplyContent = ele;
                          }}
                          defaultValue={item.content}
                          placeholder="请输入内容"
                          className="ant-input"
                        />
                      </div>
                      <a
                        style={{ marginLeft: 10 }}
                        onClick={() => {
                          handleEditQuickReply(item, this.editQuickReplyContent.value, () => {
                            this.setState({ currEditReply: '' });
                          });
                        }}
                      >
                        <Icon type="check-circle-o" style={{ marginRight: 5 }} />
                        保存
                      </a>
                      <span
                        style={{ cursor: 'pointer', marginLeft: 10 }}
                        onClick={() => {
                          this.setState({ currEditReply: '' });
                        }}
                      >
                        <Icon type="close-circle-o" style={{ marginRight: 5 }} />
                        取消
                      </span>
                    </div>
                  ) : (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.content}>
                        {item.content && item.content.length > 28 ? (
                          <Popover
                            content={item.content}
                            overlayStyle={{ maxWidth: 500, wordBreak: 'break-all', padding: 10 }}
                          >
                            {item.title.substring(0, 28)}...
                          </Popover>
                        ) : (
                          `${item.title}`
                        )}
                      </div>
                      <Icon
                        onClick={() => {
                          this.setState({ currEditReply: item.id });
                        }}
                        type="edit"
                        style={{ padding: '5px', cursor: 'pointer' }}
                      />
                      <Icon
                        onClick={() => {
                          handleDeleteQuickReply(item);
                        }}
                        type="delete"
                        style={{ padding: '5px', cursor: 'pointer' }}
                      />
                    </div>
                  )
                )}
            </div>
          </Col>
        </Row>
      </Modal>
    );
  }
}
