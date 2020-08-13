import React from 'react';
import { connect } from 'dva';
import { Form, Table, Card, Button, Icon, Tooltip, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import AdvanceForm from './components/AdvanceForm';
import ExpandedRow from './components/ExpandedRow';

import styles from './index.less';

@connect(({ cacheManage, loading }) => ({
  cacheList: cacheManage.cacheList,
  pageInfo: cacheManage.pageInfo,
  cacheListLoading:
    loading.effects['cacheManage/qryCachePage'] ||
    loading.effects['cacheManage/qryAttrSpecAllInCache'] ||
    loading.effects['cacheManage/delKeyFromCache'],
}))
@Form.create()
class CacheManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdvance: false,
    };
  }

  componentDidMount() {
    this.qryCacheList();
  }

  toggleAdvanced = () => {
    this.setState(preState => ({ showAdvance: !preState.showAdvance }));
  };

  handleTableChange = async (pageNum, pageSize) => {
    const { form, dispatch, pageInfo } = this.props;
    const fieldsValue = form.getFieldsValue();
    await dispatch({
      type: 'cacheManage/getCachePageInfo',
      payload: { ...pageInfo, pageNum, pageSize },
    });

    this.qryCacheList(fieldsValue);
  };

  handleSearch = async () => {
    const { form, dispatch, pageInfo } = this.props;
    await dispatch({
      type: 'cacheManage/getCachePageInfo',
      payload: { ...pageInfo, pageNum: 1 },
    });

    const fieldValues = form.getFieldsValue();
    await this.qryCacheList(fieldValues);
  };

  qryCacheList = async (params = {}) => {
    const { dispatch } = this.props;
    const { attrSpecType, attrSpecCode } = params;
    const payload = {
      attrSpecType: attrSpecType || '1000',
      attrSpecCode: attrSpecCode || '*',
    };

    await dispatch({
      type: 'cacheManage/qryCachePage',
      payload,
    });
  };

  deleteCache = async record => {
    const { dispatch, form, pageInfo } = this.props;
    const fieldValues = form.getFieldsValue();
    const { attrSpecType } = fieldValues;
    dispatch({
      type: 'cacheManage/delKeyFromCache',
      payload: {
        attrSpecCode: record.key,
        attrSpecType: attrSpecType || '1000',
      },
      callback: async () => {
        await dispatch({
          type: 'cacheManage/getCachePageInfo',
          payload: { ...pageInfo, pageNum: 1 },
        });

        await this.qryCacheList(fieldValues);

        // this.resetForm();
      },
    });
  };

  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { form, pageInfo, cacheListLoading, cacheList } = this.props;
    const { showAdvance } = this.state;
    const { getFieldDecorator } = form;

    const advanceProps = {
      form,
      qryCacheList: this.qryCacheList,
      resetForm: this.resetForm,
      handleSearch: this.handleSearch,
    };

    const columns = [
      {
        title: formatMessage({ id: 'cacheManage.key' }, '关键'),
        dataIndex: 'key',
        width: 200,
        render: text =>
          text ? (
            <div className="tableCol">
              <Tooltip placement="topLeft" title={text}>
                {text.length > 30 ? `${text.slice(0, 30)}...` : text}
              </Tooltip>
            </div>
          ) : (
            '--'
          ),
      },
      {
        title: formatMessage({ id: 'cacheManage.value' }, '值'),
        dataIndex: 'value',
        width: 500,
        render: text =>
          text ? (
            <div className="tableCol">
              <Tooltip placement="topLeft" title={text}>
                {text.length > 50 ? `${text.slice(0, 50)}...` : text}
              </Tooltip>
            </div>
          ) : (
            '--'
          ),
      },
      {
        title: formatMessage({ id: 'common.table.action' }, '操作'),
        dataIndex: '',
        width: 200,
        render: (text, record) => {
          return (
            <Button
              className={styles.linkBtn}
              type="link"
              onClick={() => {
                this.deleteCache(record);
              }}
            >
              {formatMessage({ id: 'common.table.action.delete' }, '删除')}
            </Button>
          );
        },
      },
    ];

    const { pageNum, pageSize, total } = pageInfo;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['5', '10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    return (
      <Card
        className={styles.cacheManagePage}
        size="small"
        title={formatMessage(
          {
            id: 'menu.cacheManage',
          },
          '缓存数据管理',
        )}
        extra={
          <div className={styles.advancedFilterBlock}>
            <Form.Item className={styles.codeInput}>
              {getFieldDecorator('attrSpecCode', {
                rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
              })(
                <Input.Search
                  size="small"
                  allowClear
                  maxLength={21}
                  placeholder={formatMessage(
                    {
                      id: 'cacheManage.cacheKeyPlaceholder',
                    },
                    '请输入编码',
                  )}
                  onSearch={this.handleSearch}
                />,
              )}
            </Form.Item>
            <Button size="small" type="link" onClick={this.toggleAdvanced}>
              {formatMessage(
                {
                  id: 'common.btn.AdvancedFilter',
                },
                '高级筛选',
              )}
              <Icon type={showAdvance ? 'up' : 'down'} />
            </Button>
          </div>
        }
      >
        {showAdvance ? (
          <Form>
            <AdvanceForm {...advanceProps} />
          </Form>
        ) : null}
        <Table
          rowKey={(_, index) => index}
          dataSource={cacheList}
          columns={columns}
          pagination={paginationProps}
          expandedRowRender={record => <ExpandedRow record={record} />}
          loading={cacheListLoading}
          expandRowByClick
          scroll={{ x: 900 }}
        />
      </Card>
    );
  }
}

export default CacheManage;
