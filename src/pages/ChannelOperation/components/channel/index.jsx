import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import ChannelList from './ChannelList';
import ChannelForm from './ChannelForm';

@connect(({ channelList, operationBitList, loading, common }) => ({
  ...common,
  dataSource: channelList.dataSource,
  showAdvancedFilterInput: channelList.showAdvancedFilterInput,
  pageSize: channelList.pageSize,
  currentPage: channelList.currentPage,
  dataTotal: channelList.dataTotal,
  currentShowOperationOfChannel: channelList.currentShowOperationOfChannel,
  operationCurrentPage: operationBitList.currentPage,
  operationPageSize: operationBitList.pageSize,
  searchInputOfName: channelList.searchInputOfName,
  searchInputOfCode: channelList.searchInputOfCode,
  searchOfCode: channelList.searchOfCode,
  formType: channelList.formType,
  stateToInfo: channelList.stateToInfo,
  isLoading: loading,
}))
class Channel extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'ORDER_CREATE_TYPE',
      },
    });
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'CHANNEL_PROCESS_TYPE',
      },
    });

    // attrSpecCodeList;
    // 获取列表数据
    this.getChannelListData();
  }

  componentWillUnmount() {
    // 初始化 models
    const { dispatch } = this.props;
    dispatch({
      type: 'channelList/initChannelState',
    });
  }

  // 获取渠道列表数据
  getChannelListData = params => {
    const { dispatch, pageSize, currentPage, searchInputOfName, searchOfCode } = this.props;
    // 默认参数
    const defaultParams = {
      channelId: '',
      channelName: String(searchInputOfName) || '',
      channelCode: String(searchOfCode) || '',
      state: '',
      pageInfo: {
        pageNum: currentPage,
        pageSize,
      },
    };
    dispatch({
      type: 'channelList/getDataSourceEffect',
      payload: { ...defaultParams, ...params },
    });
  };

  // 获取渠道项详情
  getListItemDetailsById = id => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'channelList/getChannelItemDetailsEffect',
      payload: {
        channelId: String(id),
      },
    });
  };

  // 改变 pageSize
  changePageSize = pageSize => {
    const { dispatch } = this.props;

    dispatch({
      type: 'channelList/changePageSize',
      payload: pageSize,
    });
  };

  // antd 改变每页数据条数触发的事件
  onShowSizeChange = (current, pageSize) => {
    // 改变每页显示条数 pageSize
    this.changePageSize(pageSize);

    // 获取对应 页码，对应 pageSzie 的数据
    this.getChannelListData({
      pageInfo: {
        pageNum: current,
        pageSize,
      },
    });
  };

  // 改变 “渠道名称输入框的值”
  changeSearchInputOfName = value => {
    const { dispatch } = this.props;

    dispatch({
      type: 'channelList/changeSearchInputOfName',
      payload: value,
    });
  };

  // 改变“渠道编码输入框”的值
  changeSearchInputOfCode = value => {
    const { dispatch } = this.props;

    dispatch({
      type: 'channelList/changeSearchInputOfCode',
      payload: value,
    });
  };

  // 改变渠道编码搜索值
  changeSearchOfCode = value => {
    const { dispatch } = this.props;

    dispatch({
      type: 'channelList/changeSearchOfCode',
      payload: value,
    });
  };

  // 删除渠道项
  handleDeleteChannel = async channelId => {
    const { dispatch } = this.props;

    dispatch({
      type: 'channelList/changeCurrentShowOperationOfChannel',
      payload: null,
    });

    await dispatch({
      type: 'channelList/handleDeleteChannelEffect',
      payload: {
        channelId,
      },
    });

    // 重新取获渠道最新数据
    this.getChannelListData();
    // 重新获取对应运营位最新数据
    // this.getOperationList(channelId);
  };

  // 列表项状态码转文字描述
  handleStateToInfo = state => {
    const { stateToInfo } = this.props;

    // 返回对应的描述
    return stateToInfo[state];
  };

  // 切换高级筛选输入框的显示与否
  handleShowAdvanceFilterInput = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'channelList/handleAdvanceFilterInput',
    });
  };

  // 点击渠道项展示对应的运营位列表
  handleShowOperationListById = item => {
    const { dispatch, currentShowOperationOfChannel } = this.props;
    let { channelId } = item;

    // 如果旧的点击项与新的点击项是同一项，则隐藏该点击项
    if (currentShowOperationOfChannel === channelId) {
      channelId = null;
    }

    // 初始化 运营位 models
    dispatch({
      type: 'operationBitList/initOperationState',
    });

    // 改变应该展示运的营位列表
    dispatch({
      type: 'channelList/changeCurrentShowOperationOfChannel',
      payload: channelId,
    });

    if (channelId !== null) {
      // 获取运营位列表数据
      // this.getOperationList(channelId);
    }
  };

  // 根据渠道 id 获取运营位列表
  // getOperationList = channelId => {
  //   const { dispatch, operationCurrentPage, operationPageSize } = this.props;
  //   dispatch({
  //     type: 'operationBitList/getListDataByChannelIdEffect',
  //     payload: {
  //       channelId: String(channelId),
  //       adviceChannelName: '',
  //       adviceChannelCode: '',
  //       state: '1',
  //       pageInfo: {
  //         pageNum: operationCurrentPage,
  //         pageSize: operationPageSize,
  //       },
  //     },
  //   });
  // };

  // 显示渠道项表单
  handleShowListItemForm = async (operate, item) => {
    const { dispatch } = this.props;

    if (operate !== 'add') {
      // 如果不是新增渠道项，先获取渠道项详情
      await this.getListItemDetailsById(item.channelId);
    }

    // 等待数据获取到后，显示表单
    dispatch({
      type: 'channelList/handleFormShow',
      payload: operate,
    });
  };

  render() {
    const {
      dataSource,
      showAdvancedFilterInput,
      pageSize,
      dataTotal,
      currentShowOperationOfChannel,
      currentPage,
      searchInputOfName,
      searchInputOfCode,
      searchOfCode,
      isLoading,
      formType,
      attrSpecCodeList: { CHANNEL_PROCESS_TYPE, ORDER_CREATE_TYPE },
    } = this.props;
    return (
      <Fragment>
        <ChannelList
          dataSource={dataSource}
          getChannelListData={this.getChannelListData}
          showAdvancedFilterInput={showAdvancedFilterInput}
          pagination={{
            current: currentPage,
            pageSize,
            total: dataTotal,
            pageSizeOptions: ['5', '10', '20', '30', '40'],
            defaultCurrent: currentPage,
            onShowSizeChange: this.onShowSizeChange,
          }}
          orderListType={CHANNEL_PROCESS_TYPE || []}
          orderList={ORDER_CREATE_TYPE || []}
          currentShowOperationOfChannel={currentShowOperationOfChannel}
          handleShowAdvanceFilterInput={this.handleShowAdvanceFilterInput}
          handleShowOperationListById={this.handleShowOperationListById}
          handleShowListItemForm={this.handleShowListItemForm}
          searchInputOfName={searchInputOfName}
          searchInputOfCode={searchInputOfCode}
          searchOfCode={searchOfCode}
          changeSearchInputOfName={this.changeSearchInputOfName}
          changeSearchInputOfCode={this.changeSearchInputOfCode}
          changeSearchOfCode={this.changeSearchOfCode}
          pageSize={pageSize}
          handleDeleteChannel={this.handleDeleteChannel}
          handleStateToInfo={this.handleStateToInfo}
          isLoading={isLoading}
        />
        {formType ? <ChannelForm isLoading={isLoading} /> : null}
      </Fragment>
    );
  }
}

export default Channel;
