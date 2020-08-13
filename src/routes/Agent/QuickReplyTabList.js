/* eslint-disable react/sort-comp */
import React from 'react';
import { connect } from 'dva';
import { Icon, Popover, message, Modal } from 'antd';
import classnames from 'classnames';
import QuickReplyModal from './QuickReplyModal';
import styles from './Agent.less';
import { getResMsg } from '../../utils/codeTransfer';

@connect(({ agentQuickReply }) => ({ agentQuickReply }))
export default class QuickReplyTabList extends React.PureComponent {
  state = {
    quickReplyList: [], // 快速回复的列表
    quickTypeList: [], // 快速回复类型
    visible: false, // 快速回复Modal
    currQuickType: '', // 快速回复选中的类型
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // 获取快速回复的数据
    dispatch({ type: 'agentQuickReply/fetchGetRelateQuesList' });
  }
  componentWillReceiveProps(nextProps) {
    const {
      agentQuickReply: { quickReplyList = [], quickTypeList = [] },
    } = nextProps;
    const {
      agentQuickReply: {
        quickReplyList: oldQuickReplyList = [],
        quickTypeList: oldQuickTypeList = [],
      },
    } = this.props;
    if (
      JSON.stringify(quickReplyList) !== JSON.stringify(oldQuickReplyList) ||
      JSON.stringify(quickTypeList) !== JSON.stringify(oldQuickTypeList)
    ) {
      this.setState({
        quickReplyList,
        quickTypeList,
        currQuickType: quickTypeList.length ? quickTypeList[0].id : '',
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'agentQuickReply/clearState' });
  }
  // 添加快速回复类型
  handleAddQuickType = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agentQuickReply/fetchAddQuickType',
      payload: {
        name: value,
        parentid: 0,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        const newType = res.data;
        const { quickTypeList } = this.state;
        this.setState({
          quickTypeList: [...quickTypeList, { ...newType, replys: [] }],
        });
        message.success('添加成功');
      }
    });
  };
  // 删除快速分类的
  handleDeleteQuickType = (type, callBack) => {
    if (!type.id) return;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      content: '确认将删除该分类以及该分类下的所有快速词',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.handleDoDelete(type, callBack);
      },
    });
  };
  // 选择新的currQuickType
  getCurrQuickType = (deleteId, currQuickType, newList) => {
    return deleteId === currQuickType ? (newList.length ? newList[0].id : '') : currQuickType;
  };
  handleDoDelete = (type, callBack) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agentQuickReply/fetchDeleteQuickType',
      payload: {
        id: type.id,
      },
    }).then((res) => {
      if (res && res.status !== 'OK') {
        message.error(getResMsg(res.status));
        return;
      }
      if (res && res.status === 'OK') {
        const { quickTypeList = [], currQuickType } = this.state;
        const newList = quickTypeList.filter((item) => {
          return item.id !== type.id;
        });
        const newCurQuickType = this.getCurrQuickType(type.id, currQuickType, newList);
        if (callBack) {
          callBack(type.id, newList);
        }
        this.setState({ quickTypeList: newList, currQuickType: newCurQuickType });
        message.success('删除成功');
      }
    });
  };
  // 修改快速回复类型
  handleEditQuickType = (cate, name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'agentQuickReply/fetchEditQuickType',
      payload: {
        id: cate.id,
        name,
      },
    }).then((res) => {
      if (res && res.status === 'OK') {
        const { quickTypeList } = this.state;
        const newList = quickTypeList.map((item) => {
          if (item.id === cate.id) {
            return {
              ...item,
              name,
            };
          }
          return item;
        });
        this.setState({ quickTypeList: newList });
        message.success('修改成功');
      }
    });
  };
  // 添加快速回复
  handleAddQuickReply = (content, currQuickType, callBack) => {
    if (!content) {
      message.error('快速词内容不能为空');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'agentQuickReply/fetchAddQuickReply',
      payload: {
        content,
        title: content,
        cate: currQuickType,
      },
    }).then((res) => {
      if (!res) return;
      if (res.status !== 'OK') {
        message.error(getResMsg(res.status));
      }
      if (res.status === 'OK') {
        const { quickReplyList, quickTypeList } = this.state;
        const newTypeLis = quickTypeList.map((list) => {
          if (list.id === currQuickType) {
            const replys = list.replys || [];
            return {
              ...list,
              replys: [...replys, res.data],
            };
          }
          return list;
        });
        callBack();
        this.setState({
          quickReplyList: [...quickReplyList, res.data],
          quickTypeList: newTypeLis,
        });
      }
    });
  };
  // 修改快速回复
  handleEditQuickReply = (item, content, callBack) => {
    if (!content) return message.error('快速词内容不能为空');
    const { dispatch } = this.props;
    dispatch({
      type: 'agentQuickReply/fetchEditQuickReply',
      payload: {
        id: item.id,
        title: content,
        content,
      },
    }).then((res) => {
      if (!res) return;
      if (res.status !== 'OK') {
        message.error(getResMsg(res.status));
        return;
      }
      const { quickReplyList } = this.state;
      const newList = quickReplyList.map((reply) => {
        if (reply.id === item.id) {
          return {
            ...reply,
            content,
            title: content,
          };
        }
        return reply;
      });
      if (callBack) callBack();
      message.success('修改成功');
      this.setState({ quickReplyList: newList });
    });
  };
  // 删除
  handleDeleteQuickReply = (item) => {
    const { dispatch } = this.props;
    const that = this;
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'agentQuickReply/fetchDeleteQuickReply',
          payload: { id: item.id },
        }).then((res) => {
          if (!res) return;
          if (res.status !== 'OK') {
            message.error(getResMsg(res.status));
            return;
          }
          message.success('删除成功');
          const { quickReplyList = [], quickTypeList = [] } = that.state;
          const newTypeList = quickTypeList.map((type) => {
            if (type.id === item.cate) {
              const replys = type.replys || [];
              const newReply = replys.filter((re) => {
                return re.id !== item.id;
              });
              return {
                ...type,
                replys: newReply,
              };
            }
            return type;
          });
          const newList = quickReplyList.filter((list) => {
            return list.id !== item.id;
          });
          that.setState({ quickReplyList: newList, quickTypeList: newTypeList });
        });
      },
    });
  };
  render() {
    const { clientHeight, sendMessage } = this.props;
    const { quickTypeList = [], visible, currQuickType, quickReplyList = [] } = this.state;
    return (
      <div style={{ padding: '0 20px' }}>
        <div
          onClick={() => {
            this.setState({ visible: true });
          }}
          className={styles.quickReply}
        >
          <div>
            <span className={classnames(styles.title, 'font14', 'bold')}>快速词管理</span>
            <span className={styles.arrow}>
              <Icon type="right" />
            </span>
          </div>
        </div>
        <div style={{ overflow: 'auto', height: clientHeight - 220 }}>
          {quickTypeList.map((cate) => (
            <div key={cate.id}>
              <div
                onClick={() => {
                  this.setState({ currQuickType: currQuickType === cate.id ? '' : cate.id });
                }}
                className={styles.searchCount}
              >
                {cate.name}({(cate.replys && cate.replys.length) || '0'}){' '}
              </div>
              <div style={currQuickType === cate.id ? { display: 'block' } : { display: 'none' }}>
                {quickReplyList
                  .filter((item) => item.cate === cate.id)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        sendMessage(item.content);
                      }}
                      className={styles.searchResult}
                    >
                      {item.content && item.content.length > 15 ? (
                        <Popover
                          content={item.content}
                          overlayStyle={{ maxWidth: 300, wordBreak: 'break-all', padding: 10 }}
                        >
                          {index + 1}.{item.content.substring(0, 15)}...
                        </Popover>
                      ) : (
                        `${index + 1}.${item.content}`
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {!!visible && (
          <QuickReplyModal
            clientHeight={clientHeight}
            quickTypeList={quickTypeList}
            quickReplyList={quickReplyList}
            onCancle={() => {
              this.setState({ visible: false });
            }}
            visible={visible}
            handleDeleteQuickType={this.handleDeleteQuickType}
            addQuickType={this.handleAddQuickType}
            editQuickType={this.handleEditQuickType}
            handleAddQuickReply={this.handleAddQuickReply}
            handleEditQuickReply={this.handleEditQuickReply}
            handleDeleteQuickReply={this.handleDeleteQuickReply}
          />
        )}
      </div>
    );
  }
}
