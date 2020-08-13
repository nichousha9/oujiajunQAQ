import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Table, Icon, Divider,Popconfirm } from 'antd';
import styles from './index.less';
const { Column } = Table;

const recommendRuleSource = [
  {
    id: 1,
    title: '热卖商品推荐',
    desc: 1000,
    ruleType: '商品标签名称',
    recommendRatio: '0.88',
    Ratio: '0.1',
    ModifiTime: '2018-12-30 14:23:377',
    state: '有效',
  },
  {
    id: 2,
    title: '首页个人推荐',
    desc: 1000,
    ruleType: '商品标签名称',
    recommendRatio: '0.18',
    Ratio: '0.1',
    ModifiTime: '2018-12-30 14:23:35',
    state: '有效1',
  },
];
class RecoRuleForLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.newRecoRuleForLabel}>
        <Table
          rowKey={record => record.id}
          dataSource={recommendRuleSource}
          pagination={false}
          footer={() => (
            <div>
              <a style={{ marginRight: 20 }}>
                <Icon type="plus" />
                {formatMessage({ id: 'rulesManage.recoRule.newOne' }, '新增')}
              </a>
            </div>
          )}
        >
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.userLabelName' }, '用户标签名称')}
            dataIndex="title"
            key="title"
            width="20%"
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.userLabelAttr' }, '用户标签属性值')}
            dataIndex="desc"
            key="desc"
            width="20%"
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.goodLabelName' }, '商品标签名称')}
            dataIndex="ruleType"
            key="ruleType"
            width="20%"
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.goodLabelAttr' }, '商品标签属性值')}
            dataIndex="recommendRatio"
            key="recommendRatio"
            width="15%"
          />
          <Column
            title={formatMessage({ id: 'rulesManage.recoRule.relevanceRate' }, '关联系数')}
            dataIndex="Ratio"
            key="Ratio"
            width="10%"
          />
          <Column
            width="15%"
            title={formatMessage({ id: 'rulesManage.recoRule.operation' }, '操作')}
            render={() => (
              <span>
                <a> {formatMessage({ id: 'rulesManage.recoRule.edit' }, '编辑')}</a>
                <Divider type="vertical" />
                <Popconfirm
                  title={formatMessage({ id: 'rulesManage.recoRule.isConfirmDel' }, '是否确定删除')}
                  okText={formatMessage({ id: 'rulesManage.recoRule.confirm' }, '确认')}
                  cancelText={formatMessage({ id: 'rulesManage.recoRule.cancel' }, '取消')}
                >
                  <a>{formatMessage({ id: 'rulesManage.recoRule.del' }, '删除')}</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default RecoRuleForLabel;
