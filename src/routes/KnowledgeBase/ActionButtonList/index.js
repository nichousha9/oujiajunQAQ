import React from 'react';
import { Input, Popconfirm } from 'antd';
import CommonButton from '../../../components/CommonButton';
import styles from '../Knowledgebase.less';

const { Search } = Input;

export default class ActionButtonList extends React.Component {
  searChange = (e) => {
    this.searchValue = e.target.value;
  };
  searchValue;
  render() {
    const {
      loading = false,
      onSearch,
      onDelete,
      onSetAble,
      onImport,
      onNewItem,
      syncData,
      onEmpty,
    } = this.props;
    return (
      <div style={{ display: 'inline-flex', float: 'right' }}>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入问题"
          onBlur={(e) => {
            onSearch(e.target.value);
          }}
          onChange={(e) => {
            this.searChange(e);
          }}
          onSearch={(e) => {
            onSearch(e);
          }}
        />
        <CommonButton loading={loading} style={{ marginLeft: 4 }} onClick={onDelete}>
          删除
        </CommonButton>
        <CommonButton
          loading={loading}
          style={{ marginLeft: 4 }}
          onClick={() => {
            onSetAble('0');
          }}
        >
          停用
        </CommonButton>
        <CommonButton
          loading={loading}
          style={{ marginLeft: 4 }}
          onClick={() => {
            onSetAble('1');
          }}
        >
          启用
        </CommonButton>
        <CommonButton
          loading={loading}
          type="primary"
          onClick={onImport}
          htmlType="submit"
          style={{ marginLeft: 4 }}
        >
          批量导入
        </CommonButton>
        <CommonButton
          loading={loading}
          type="primary"
          onClick={onNewItem}
          htmlType="submit"
          style={{ marginLeft: 4 }}
        >
          新增
        </CommonButton>
        <CommonButton
          loading={loading}
          type="primary"
          onClick={syncData}
          htmlType="submit"
          style={{ marginLeft: 4 }}
        >
          同步数据
        </CommonButton>
        {onEmpty ? (
          <Popconfirm
            title="清空知识库无法复原，是否清空?"
            onConfirm={onEmpty}
            cancelText="取消"
            okText="确定"
          >
            <CommonButton
              loading={loading}
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 4 }}
            >
              清空
            </CommonButton>
          </Popconfirm>
        ) : null}
      </div>
    );
  }
}
