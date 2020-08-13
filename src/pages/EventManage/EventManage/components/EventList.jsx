import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { List, Card, Popconfirm, Badge, message } from 'antd';
import CardExtra from './CardExtra';
import Iconfont from '@/components/Iconfont';
import style from '../index.less';

const mapStateToProps = ({ eventManage, loading }) => ({
  pathCode: eventManage.pathCode,
  eventSearchVal: eventManage.eventSearchVal,
  pageInfo: eventManage.pageInfo,
  eventListData: eventManage.eventListData,
  forceGetEventsList: eventManage.forceGetEventsList,
  listLoading: loading.effects['eventManage/getEventsList'],
});

function EventList(props) {
  const {
    dispatch,
    pathCode,
    eventSearchVal = {},
    pageInfo = {},
    eventListData,
    forceGetEventsList,
    listLoading,
  } = props;
  const { searchName } = eventSearchVal;
  const { pageNum, pageSize, total } = pageInfo;

  // 状态映射
  const stateCodeToName = {
    '1000': {
      name: '生效',
      icon: 'success',
    },
    '1100': {
      name: '失效',
      icon: 'error',
    },
    '1200': {
      name: '待生效',
      icon: 'warning',
    },
    '1300': {
      name: '已删除',
      icon: 'default',
    },
  };

  // 获取事件列表数据
  function getEventsList(params) {
    const defaultParams = {
      catalogType: '2',
      name: searchName,
      pageInfo: {
        pageNum,
        pageSize,
      },
      pathCode,
    };

    dispatch({
      type: 'eventManage/getEventsList',
      payload: { ...defaultParams, ...params },
    });
  }

  // type 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly / null)
  // item 显示的是哪一项事件
  function showDetailForm(type = 'readonly', item = {}) {
    dispatch({
      type: 'eventManageComm/showDetailForm',
      payload: {
        type,
        item,
      },
    });
  }

  // 处理删除事件
  async function handelDeleteEvent(id) {
    const result = await dispatch({
      type: 'eventManage/handelDeleteEvent',
      payload: {
        id,
      },
    });

    if (result && result.topCont && result.topCont.resultCode == 0) {
      getEventsList();
    }
  }

  // 改变页码信息
  function changePageInfo(page = pageNum, size = pageSize, sum = total) {
    dispatch({
      type: 'eventManage/changePageInfo',
      payload: {
        pageNum: page,
        pageSize: size,
        toal: sum,
      },
    });
  }

  // 改变事件项的状态（生效：1000； 失效：1100）
  async function changeEventItemState(id, state) {
    const result = await dispatch({
      type: 'eventManage/changeEventItemState',
      payload: {
        id,
        statusCd: state,
      },
    });

    if (result && result.topCont && result.topCont.resultCode == 0) {
      getEventsList();
    } else {
      message.error(
        (result && result.topCont && result.topCont && result.topCont.remark) || '未知错误',
      );
    }
  }

  // 获取列表数据
  useEffect(() => {
    if (forceGetEventsList) {
      // 是否需要刷新
      return getEventsList();
    }
    return false;
  }, [pathCode, searchName, pageNum, pageSize, forceGetEventsList]);

  return (
    <div className={style.eventList}>
      <Card size="small" title="事件列表" extra={<CardExtra />}>
        <List
          loading={listLoading}
          pagination={{
            current: pageNum,
            pageSize,
            pageSizeOptions: ['10', '20', '30', '40'],
            showQuickJumper: true,
            showSizeChanger: true,
            total,
            onChange: changePageInfo,
            onShowSizeChange: changePageInfo,
          }}
          dataSource={eventListData}
          renderItem={item => (
            <List.Item
              actions={[
                <a
                  disabled={item.statusCd != 1200}
                  key="edit"
                  onClick={() => {
                    if (item.statusCd != 1200) return;
                    showDetailForm('edit', item);
                  }}
                >
                  编辑
                </a>,
                <a
                  disabled={item.statusCd != 1200}
                  key="activity"
                  onClick={() => {
                    changeEventItemState(item.id, '1000');
                  }}
                >
                  生效
                </a>,
                <a
                  disabled={item.statusCd == 1100 || item.statusCd == 1300}
                  key="activity"
                  onClick={() => {
                    changeEventItemState(item.id, '1100');
                  }}
                >
                  失效
                </a>,
                <Popconfirm
                  title="确定删除？"
                  onConfirm={() => {
                    handelDeleteEvent(item.id);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a disabled={item.statusCd != 1200} key="delete">
                    删除
                  </a>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className="left-lmg">
                    <Iconfont type="iconhuodong" />
                  </div>
                }
                title={
                  <a
                    className={style.eventNameLink}
                    onClick={() => {
                      showDetailForm('readonly', item);
                      router.push({
                        pathname: '/eventManage/configDetail',
                      });
                    }}
                  >
                    {item.name}
                  </a>
                }
                description={item.description}
              />
              <List.Item.Meta title="事件编码" description={item.code} />
              <List.Item.Meta
                title="状态"
                description={
                  <Fragment>
                    <Badge
                      status={stateCodeToName[item.statusCd] && stateCodeToName[item.statusCd].icon}
                    />
                    {stateCodeToName[item.statusCd] && stateCodeToName[item.statusCd].name}
                  </Fragment>
                }
              />
              <List.Item.Meta title="创建时间" description={item.createTime} />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default connect(mapStateToProps)(EventList);
