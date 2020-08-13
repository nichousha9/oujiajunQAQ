import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import router from 'umi/router';
import { Card, Table, ConfigProvider, Button, Input, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
const { Search } = Input;
const stateToProps = ({ loading }) => ({
  loading,
});

function ApprovalTemplate(props) {
  const { loading } = props;

  // 删除分群列表
  function deleteSpecialItem() {}

  // 新增模版
  function newTemplate() {
    router.push({
      pathname: '/activityApproval/activityApproval/NewTem',
      state: {
        type: 'cancel',
      },
    });
  }

  // 获取父列表的数据
  function getColums() {
    return [
      {
        title: formatMessage({ id: 'activityApproval.approvalTemplate.ID' }),
        dataIndex: 'segmentName',
        key: 'segmentName',
        render: text => <a>{text}</a>,
      },
      {
        title: formatMessage({ id: 'activityApproval.approvalTemplate.TemName' }),
        dataIndex: 'segmentcount',
        key: 'segmentcount',
      },
      {
        title: formatMessage({ id: 'activityApproval.approvalTemplate.BusinessType' }),
        dataIndex: 'segmentTypeName',
        key: 'segmentTypeName',
      },
      {
        title: formatMessage({ id: 'activityApproval.approvalTemplate.DefaultTem' }),
        dataIndex: 'referCampaign',
        key: 'referCampaign',
      },
      {
        title: formatMessage({ id: 'activityApproval.approvalTemplate.Action' }),
        key: 'operate',
        render: (_, record) => (
          <span>
            <a>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="是否确定删除"
              onConfirm={() => deleteSpecialItem(record)}
              cancelText="取消"
              okText="确定"
            >
              <a href="#">删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
  }

  // 导航右侧菜单
  const topRightDiv = (
    <div>
      <Search
        className="filter-input"
        placeholder={formatMessage(
          { id: 'activityApproval.approvalTemplate.searchKeyWord' },
          '搜索关键词',
        )}
        size="small"
        // onSearch={value => saveSearchValue(value)}
      />
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            newTemplate();
          }}
        >
          {formatMessage(
            {
              id: 'activityApproval.approvalTemplate.newTem',
            },
            '新增模版',
          )}
        </Button>
      </ConfigProvider>
    </div>
  );

  return (
    <div className={styles.ApprovalTemplate}>
      <Card title="审核模板查询" extra={topRightDiv}>
        <Table
          loading={loading.effects['specialGroup/querySegmentDetailInfo']}
          columns={getColums()}
          // dataSource={specialGroupList}
          rowKey={record => record.segmentid}
          pagination={{
            defaultCurrent: 6,
            showQuickJumper:true,
            showSizeChanger:true,
            total:10
          }}
        />
      </Card>
    </div>
  );
}

export default connect(stateToProps)(ApprovalTemplate);
