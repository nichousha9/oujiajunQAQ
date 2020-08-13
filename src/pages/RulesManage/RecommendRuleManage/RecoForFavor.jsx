import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Popconfirm, Table, Input, Icon, Tooltip, Divider, Pagination } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Column } = Table;
@connect(({ recoRuleManage, loading }) => ({
  loading,
  recoRuleFavorList: recoRuleManage.recoRuleFavorList,
  recoListType: recoRuleManage.recoListType,
  recoListClickItem: recoRuleManage.recoListClickItem,
  forbidAddBtn: recoRuleManage.forbidAddBtn,
  forbidAddMoreBtn: recoRuleManage.forbidAddMoreBtn,
  recoListTotal: recoRuleManage.recoListTotal,
  recoListCurPage: recoRuleManage.recoListCurPage,
  recoListCurPageSize: recoRuleManage.recoListCurPageSize,
}))
class RecoRuleForCustom extends Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'recoRuleManage/changeAddBtnType',
      payload: false,
    });
    dispatch({
      type: 'recoRuleManage/changeAddMoreType',
      payload: false,
    });
  }

  render() {
    const {
      recoRuleFavorList,
      showBatchImportModal,
      recoListType,
      addGoodItem,
      deleteRule,
      editGoodItem,
      changeSearchName,
      searchListData,
      downLoadTem,
      forbidAddBtn,
      forbidAddMoreBtn,
      recoListTotal,
      recoListCurPage,
      recoListCurPageSize,
      pageChange,
      pageSizeChange,
      loading,
      handleShowListData,
      delSearchVal,
      searchValue,
    } = this.props;
    return (
      <div className={styles.newRecoRuleForCustom}>
        <header className={styles.recoCustomHead}>
          <span>{formatMessage({ id: 'rulesManage.recoRule.goodName' }, '商品名称')}：</span>
          <Input size="small" value={searchValue} onChange={changeSearchName} />
          <React.Fragment>
            <Button type="primary" size="small" className={styles.search} onClick={searchListData}>
              {formatMessage({ id: 'rulesManage.recoRule.search' }, '查询')}
            </Button>
            <Button size="small" onClick={delSearchVal}>
              {formatMessage({ id: 'rulesManage.recoRule.restore' }, '重置')}
            </Button>
          </React.Fragment>
        </header>
        <Table
          loading={loading.effects['recoRuleManage/getRuleClickList']}
          className={recoListType == 'viewRule' ? styles.IsViewRule : ''}
          rowKey={record => {
            return record.rcmRate * (Math.random() * 100);
          }}
          dataSource={
            recoListType === 'addRule'
              ? handleShowListData().slice(
                  (recoListCurPage - 1) * recoListCurPageSize,
                  (recoListCurPage - 1) * recoListCurPageSize + recoListCurPageSize,
                )
              : handleShowListData()
          }
          value={recoRuleFavorList}
          pagination={false}
          footer={() => (
            <div className={styles.listFooter}>
              <div className={styles.leftWrapper}>
                <a
                  disabled={forbidAddBtn && recoListType === 'addRule'}
                  onClick={() => {
                    addGoodItem('add');
                  }}
                >
                  <Icon type="plus" />
                  {formatMessage({ id: 'rulesManage.recoRule.newOne' }, '新增')}
                </a>
                <a
                  style={{ marginRight: 20, marginLeft: 20 }}
                  disabled={forbidAddMoreBtn && recoListType === 'addRule'}
                  onClick={showBatchImportModal}
                >
                  <Icon type="import" />
                  {formatMessage({ id: 'rulesManage.recoRule.batchImport' }, '批量导入')}
                </a>
                <a onClick={downLoadTem}>
                  <Icon type="download" />
                  {formatMessage({ id: 'rulesManage.recoRule.templateDown' }, '模版下载')}
                </a>
              </div>
              <Pagination
                showQuickJumper
                showSizeChanger
                defaultPageSize={5}
                defaultCurrent={1}
                total={recoListType === 'addRule' ? handleShowListData().length : recoListTotal}
                current={recoListCurPage}
                size="small"
                className={styles.goodListPagination}
                onChange={pageChange}
                onShowSizeChange={pageSizeChange}
                pageSizeOptions={['5', '10', '20', '30', '40']}
              />
            </div>
          )}
        >
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.userID' }, '会员ID')}
            dataIndex="subsId"
            key="subsId"
            width="15%"
            render={text => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            )}
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.userName' }, '会员名称')}
            dataIndex="userName"
            key="userName"
            width="15%"
            render={text => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            )}
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.userNum' }, '会员号码')}
            dataIndex="subsName"
            key="subsName"
            width="15%"
            render={text => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            )}
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.goodName' }, '商品名称')}
            dataIndex="goodsObjectName"
            key="goodsObjectName"
            width="15%"
            render={text => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            )}
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.goodId' }, '商品ID')}
            dataIndex="goodsObjectId"
            key="goodsObjectId"
            width="15%"
            render={text => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            )}
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.rcmRate' }, '推荐系数')}
            dataIndex="rcmRate"
            key="rcmRate"
            width="15%"
            render={text => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            )}
          />
          {recoListType !== 'viewRule' ? (
            <Column
              width="10%"
              title={formatMessage({ id: 'rulesManage.recoRule.operation' }, '操作')}
              render={(text, record, index) => (
                <span>
                  <a
                    onClick={() => {
                      editGoodItem('edit', record, index);
                    }}
                  >
                    {formatMessage({ id: 'rulesManage.recoRule.edit' }, '编辑')}
                  </a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title={formatMessage(
                      { id: 'rulesManage.recoRule.isConfirmDel' },
                      '是否确定删除',
                    )}
                    okText={formatMessage({ id: 'rulesManage.recoRule.confirm' }, '确认')}
                    cancelText={formatMessage({ id: 'rulesManage.recoRule.cancel' }, '取消')}
                    onConfirm={() => deleteRule('del', record, index)}
                  >
                    <a>{formatMessage({ id: 'rulesManage.recoRule.del' }, '删除')}</a>
                  </Popconfirm>
                </span>
              )}
            />
          ) : (
            ''
          )}
        </Table>
      </div>
    );
  }
}

export default RecoRuleForCustom;
