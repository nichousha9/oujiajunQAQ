import React from 'react';
import { connect } from 'dva';
import { Button, Input } from 'antd';
import style from '../index.less';

const mapStateToProps = ({ eventManage, eventManageComm }) => ({
  isShowDetailForm: eventManageComm.isShowDetailForm,
  pageInfo: eventManage.pageInfo,
});

function CardExtra(props) {
  const { dispatch, pageInfo } = props;
  const { pageSize } = pageInfo;

  // 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly / null)
  function showDetailForm(type = 'readonly', item = {}) {
    dispatch({
      type: 'eventManageComm/showDetailForm',
      payload: {
        type,
        item,
      },
    });
  }

  // 保存搜索值至 models
  function changeSearchVal(params) {
    dispatch({
      type: 'eventManage/changeEventSearchVal',
      payload: params,
    });
  }

  // 改变页码
  function changePageInfo(num, size) {
    return dispatch({
      type: 'eventManage/changePageInfo',
      payload: {
        pageNum: num,
        pageSize: size,
      },
    });
  }

  // 处理搜索
  function handleSearch(val) {
    // 改变页码
    changePageInfo(1, pageSize);

    // 保存搜索值至 models
    changeSearchVal({
      searchName: val,
    });
  }

  return (
    <div className={style.cardExtra}>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          showDetailForm('add');
        }}
      >
        新增
      </Button>
      <Input.Search onSearch={handleSearch} className={style.antSearch} size="small" />
    </div>
  );
}

export default connect(mapStateToProps)(CardExtra);
