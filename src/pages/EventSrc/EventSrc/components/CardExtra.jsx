import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Input, Select } from 'antd';
import style from '../index.less';

const { Option } = Select;

const mapStateToProps = ({ eventSrc, eventSrcComm }) => ({
  isShowDetailForm: eventSrcComm.isShowDetailForm,
  pageInfo: eventSrc.pageInfo,
});

function CardExtra(props) {
  const { dispatch, pageInfo } = props;
  const { pageSize } = pageInfo;

  // 搜索状态值暂存
  const [stateTemp, setStateTemp] = useState();

  // 处理详情表单的显示类型(新建add / 编辑edit / 查看readonly / null)
  function showDetailForm(type = 'readonly', item = {}) {
    dispatch({
      type: 'eventSrcComm/showDetailForm',
      payload: {
        type,
        item,
      },
    });
  }

  // 搜索下拉框值改变
  function onStateChange(val) {
    setStateTemp(val);
  }

  // 保存搜索值至 models
  function changeSearchVal(params) {
    dispatch({
      type: 'eventSrc/changeEventSearchVal',
      payload: params,
    });
  }

  // 改变页码
  function changePageInfo(num, size) {
    return dispatch({
      type: 'eventSrc/changePageInfo',
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
      searchStatus: stateTemp,
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
      <Select allowClear size="small" className={style.antSelect} onChange={onStateChange}>
        <Option value="1000">生效</Option>
        <Option value="1100">失效</Option>
        <Option value="1200">待生效</Option>
      </Select>
      <Input.Search onSearch={handleSearch} className={style.antSearch} size="small" />
    </div>
  );
}

export default connect(mapStateToProps)(CardExtra);
