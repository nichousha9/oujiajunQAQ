import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Input } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
@connect(({ rulesManage }) => ({
  currentPage: rulesManage.currentPage,
  currentPageSize: rulesManage.currentPageSize,
  searchValue: rulesManage.searchValue,
}))
class topRightHeader extends Component {
  searchValueChange = e => {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'rulesManage/changeSearchValue',
      payload: value,
    });
  };

  getSearchValue = () => {
    const { dispatch, getRuleListSource, currentPageSize, searchValue } = this.props;
    dispatch({
      type: 'rulesManage/changeCurrentPage',
      payload: 1,
    });
    getRuleListSource(1, currentPageSize, searchValue);
  };

  render() {
    const { showNewRulesModal, title } = this.props;
    return (
      <div className={styles.topRightDiv}>
        <Button
          size="small"
          onClick={() => {
            showNewRulesModal('add');
          }}
          type="primary"
        >
          {title}
        </Button>
        <Input.Search
          size="small"
          placeholder={
            formatMessage({ id: 'rulesManage.rulesInfo.searchCatalog' }, '搜索目录')
          }
          onSearch={this.getSearchValue}
          onChange={this.searchValueChange}
        />
      </div>
    );
  }
}

export default topRightHeader;
