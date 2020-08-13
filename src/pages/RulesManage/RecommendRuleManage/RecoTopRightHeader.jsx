import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Input } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
@connect(({ recoRuleManage }) => ({
  currentPage: recoRuleManage.currentPage,
  currentPageSize: recoRuleManage.currentPageSize,
  searchValue: recoRuleManage.searchValue,
}))
class RecoTopRightHeader extends Component {
  searchValueChange = e => {
    const { value } = e.target;
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeSearchValue',
      payload: value,
    });
  };

  getSearchValue = () => {
    const { dispatch, getRecoList, currentPageSize, searchValue } = this.props;
    dispatch({
      type: 'recoRuleManage/changeCurrentPage',
      payload: 1,
    });
    getRecoList(1, currentPageSize, searchValue);
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
          placeholder={formatMessage({ id: 'rulesManage.recoRule.searchCatalog' }, '搜索目录')}
          onSearch={this.getSearchValue}
          onChange={this.searchValueChange}
        />
      </div>
    );
  }
}

export default RecoTopRightHeader;
