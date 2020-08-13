import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { List, Card, Popconfirm, Badge, message } from 'antd';
import CardExtra from './CardExtra';
import Iconfont from '@/components/Iconfont';
import style from '../index.less';

const mapStateToProps = ({ eventSrc, loading }) => ({
  pathCode: eventSrc.pathCode,
  eventSearchVal: eventSrc.eventSearchVal,
  pageInfo: eventSrc.pageInfo,
  eventListData: eventSrc.eventListData,
  forceGetEventsList: eventSrc.forceGetEventsList,
  listLoading: loading.effects['eventSrc/getEventsList'],
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
  const { searchStatus, searchName } = eventSearchVal;
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
      catalogType: '1',
      name: searchName,
      pageInfo: {
        pageNum,
        pageSize,
      },
      pathCode,
      statusCd: searchStatus,
    };

    dispatch({
      type: 'eventSrc/getEventsList',
      payload: { ...defaultParams, ...params },
    });
  }

  // type 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly / null)
  // item 显示的是哪一项事件
  function showDetailForm(type = 'readonly', item = {}) {
    dispatch({
      type: 'eventSrcComm/showDetailForm',
      payload: {
        type,
        item,
      },
    });
  }

  // 处理删除事件
  async function handelDeleteEvent(id) {
    const result = await dispatch({
      type: 'eventSrc/handelDeleteEvent',
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
      type: 'eventSrc/changePageInfo',
      payload: {
        pageNum: page,
        pageSize: size,
        toal: sum,
      },
    });
  }

  // 改变事件项的状态（生效：1000； 失效：1100）
  async function changeEventItemState(item, state) {
    if (item.inputType == '6000' && state == '1000') {
      // 如果是中间对象，则需要进行判断能否让其生效
      const result = await dispatch({
        type: 'eventSrc/getInputAttrListEffect',
        payload: { inputId: item.id },
      });
      if (
        !result ||
        !result.svcCont ||
        !result.svcCont.data ||
        !result.svcCont.data ||
        result.svcCont.data.list.length === 0
      ) {
        return message.error('输入属性列表为空，无法生效');
      }
    }

    const result = await dispatch({
      type: 'eventSrc/changeEventItemState',
      payload: {
        id: item.id,
        statusCd: state,
      },
    });

    if (result && result.topCont && result.topCont.resultCode == 0) {
      getEventsList();
    }
    return '';
  }

  // 获取列表数据
  useEffect(() => {
    if (forceGetEventsList) {
      // 是否需要刷新
      return getEventsList();
    }
    return false;
  }, [pathCode, searchStatus, searchName, pageNum, pageSize, forceGetEventsList]);

  return (
    <div className={style.eventList}>
      <Card size="small" title="事件管理" extra={<CardExtra />}>
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
                    changeEventItemState(item, '1000');
                  }}
                >
                  生效
                </a>,
                <a
                  disabled={item.statusCd == 1100 || item.statusCd == 1300}
                  key="activity"
                  onClick={() => {
                    changeEventItemState(item, '1100');
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
                        pathname: '/eventSrc/configDetail',
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
