import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Card, Input, Tag, Tooltip } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SearchTree from '@/components/SearchTree/index';
import styles from '../index.less';

const { Search } = Input;

@connect(({ commodityList }) => {
  return {
    memberProps: commodityList.memberProps,
    fold: commodityList.fold,
  };
})
class Package extends PureComponent {
  state = {
    treeData: [],
    cmdTotal: 0, // 商品数
    cmdInfo: [], // 商品信息
    pageInfo: {
      // 页面信息
      pageNum: 1,
      pageSize: 10,
    },
    fold: '-6',
    offerName: '',
    // tags: [],
  };

  componentDidMount() {
    const { fold } = this.props;
    this.setState({ fold });
    this.getTreeData();
    this.getOfferData();
  }

  getTreeData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/getMccFolderList',
      payload: {
        objType: 4,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.dealTreeData(res.svcCont.data);
      }
    });
  };

  dealTreeData = data => {
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
      // 拿到当前节点的子节点
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
    // console.log(newArr, data);
    this.setState({
      treeData: newArr,
    });
  };

  onSelectCallBack = key => {
    // console.log(key);
    this.setState({ fold: key });
    this.getOfferData();
  };

  getOfferData = params => {
    const { state } = this;
    const { props } = this;
    const { dispatch } = props;
    const fold = undefined === params || undefined === params.fold ? state.fold : params.fold;
    const pageInfo =
      undefined === params || undefined === params.pageInfo ? state.pageInfo : params.pageInfo;
    const offerName =
      undefined === params || undefined === params.offerName ? state.offerName : params.offerName;
    dispatch({
      type: 'commodityList/qryOffersInfo',
      payload: { fold, pageInfo, offerName, ...params },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        this.setState({
          cmdTotal: res.svcCont.pageInfo.total,
        });
        this.dealOfferData(res.svcCont.data);
      }
    });
  };

  dealOfferData = data => {
    // console.log(data);
    const cmdInfo = data.map(item => ({
      key: item.offerId,
      name: item.offerName,
      type: item.offerTypeName,
      expiredtime: item.offerExpDate,
    }));
    this.setState({
      cmdInfo,
    });
  };

  searchValue = value => {
    // const { nodeKey, nodePath } = this.props;
    // const obj1 = { extName: value, pageInfo, fold: nodeKey || -1, pathCode: nodePath || '-1' };
    this.setState({ offerName: value });
    this.getOfferData();
  };

  onChange = (current, pageSize) => {
    this.setState(
      {
        pageInfo: {
          pageNum: current,
          pageSize,
        },
      },
      () => {
        this.getOfferData();
      },
    );
  };

  // 删除tag
  handleClose = removedTag => {
    const { dispatch, memberProps } = this.props;
    const newtags = memberProps.filter(tag => tag !== removedTag);
    dispatch({
      type: 'commodityList/changeMemberProps',
      payload: newtags,
    });
  };

  handleAdd = tag => {
    const { dispatch, memberProps } = this.props;
    const tagId = memberProps.map(item => item.tagId);
    if (tag.tagId && tagId.indexOf(tag.tagId) === -1) {
      memberProps.push(tag);
      dispatch({
        type: 'commodityList/changeMemberProps',
        payload: memberProps,
      });
    }
  };

  render() {
    const { treeData, cmdInfo, cmdTotal } = this.state;
    const { memberProps, values } = this.props;
    // console.log(memberProps, submitData);
    const { readOnly } = values;
    const treeProps = {
      treeData, //  这是从后台获取，处理数据后赋值给state，然后从state拿到的值这个，数据就是每次展示的数据
      onSelectCallBack: this.onSelectCallBack, //  选中  回调。在这里拿到之前传入值，发起请求修改树数据，并更新数据
    };
    const columns = [
      {
        title: formatMessage({ id: 'commodityManage.name.offerName' }),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: formatMessage({ id: 'commodityManage.name.offerType' }),
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: formatMessage({ id: 'commodityManage.date.expDate' }),
        dataIndex: 'expiredtime',
        key: 'expiredtime',
      },
      {
        title: formatMessage({ id: 'common.table.action' }),
        key: 'action',
        render: record => {
          return !readOnly ? (
            <span>
              <a
                onClick={() => {
                  this.handleAdd({ tagId: record.key, tagName: record.name });
                }}
              >
                {formatMessage({ id: 'commodityManage.action.add' })}
              </a>
            </span>
          ) : (
            ''
          );
        },
      },
    ];

    return (
      <Row>
        <Col span={5}>
          <Card
            title={formatMessage({ id: 'commodityManage.name.offerFold' })}
            size="small"
            style={{ width: '100%', minHeight: '520px' }}
          >
            <SearchTree {...treeProps} size="small" />
          </Card>
        </Col>
        <Col span={19}>
          <Card
            title={formatMessage({ id: 'commodityManage.name.offerList' })}
            size="small"
            className={styles.packageCardStyle}
            style={{ width: '100%', minHeight: '520px' }}
            extra={
              <Search
                size="small"
                placeholder={formatMessage({ id: 'common.form.input' })}
                onSearch={value => this.searchValue(value)}
              />
            }
          >
            <Table
              dataSource={cmdInfo}
              columns={columns}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                defaultCurrent: 1,
                total: cmdTotal,
                onChange: this.onChange,
                onShowSizeChange: this.onChange,
                size: 'small',
                defaultPageSize: 5,
                pageSizeOptions: ['5', '10', '20'],
              }}
              scroll={{ y: 280 }}
            />
            {/* <div className={styles.paginationStyle}>
            <Pagination
              showQuickJumper
              showSizeChanger
              defaultCurrent={1}
              total={cmdTotal}
              onChange={onChange}
              onShowSizeChange={onChange}
            /> */}
            {memberProps.length > 0 ? (
              <Row>
                <Col span={3}>{formatMessage({ id: 'commodityManage.tip.chooseOffer' })}：</Col>
                <Col span={21}>
                  <div className={styles.chooseOfferDiv}>
                    {memberProps.map(tag => {
                      const isLongTag = tag.tagName.length > 20;
                      const tagElem = (
                        <Tag
                          key={tag.tagId}
                          closable={!readOnly}
                          onClose={() => this.handleClose(tag)}
                          color="blue"
                        >
                          {isLongTag ? `${tag.tagName.slice(0, 20)}...` : tag.tagName}
                        </Tag>
                      );
                      return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                          {tagElem}
                        </Tooltip>
                      ) : (
                        tagElem
                      );
                    })}
                  </div>
                </Col>
              </Row>
            ) : (
              ''
            )}
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Package;
