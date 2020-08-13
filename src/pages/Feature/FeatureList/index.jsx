import React from 'react';
import { connect } from 'dva';
import { List, Popconfirm, Pagination, Row, Col, Badge, Card, Button, Form, Icon, Select, Input } from 'antd';
import Link from 'umi/link';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont';

const { Search } = Input;
const { Option } = Select;

@connect(({ common, loading }) => ({
  effictiveState: common.attrSpecCodeList.EFFICTIVE_STATE,
  loading: loading.effects['featureList/qryFeatureViewList'],
}))
@Form.create()

class FeatureList extends React.Component {
  status = {
    '0': formatMessage({ id: 'feature.toEffective'}), // '待生效',
    '1': formatMessage({ id: 'feature.effictive'}), // '生效',
    '2': formatMessage({ id: 'feature.disable'}), // '失效',
  }

  statusColor = {
    '0': 'default',
    '1': 'success',
    '2': 'error',
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [], // 特征列表
      pageNum: 1,
      pageSize: 10,
      pageInfo: {}, // 后端的返回
      advancedFilterShow: false, // 高级筛选
      schemaName: ''
    }
  }

  componentDidMount () {
    this.getSpecCode();
    this.fetchList();
  }

  
  // 获取选择类型
  getSpecCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode: 'EFFICTIVE_STATE',
      },
    });
  };

  // 获取数据
  fetchList = () => {
    const { dispatch, form } = this.props;
    const { pageNum, pageSize, schemaName } = this.state;
    dispatch({
      type: 'featureList/qryFeatureViewList',
      payload: {
        pageInfo: {
          pageNum,
          pageSize,
        },
        schemaCode: form.getFieldValue('schemaCode'),
        schemaName,
        status: form.getFieldValue('status'),
      },
      success: (svcCont) => {
        const { data, pageInfo } = svcCont;
        this.setState({
          data,
          pageInfo: {
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total
          }
        })
      }
    })
  }

  
  getSearchValue = e => {
    this.setState({
      schemaName: e.target.value,
    });
  };

  // 展开收起高级筛选
  showAdvancedFilter = () => {
    this.setState(({advancedFilterShow}) => {
      return {
        advancedFilterShow: !advancedFilterShow
      }
    })
  }

  // 重置
  resetForm = () => {
    const { form } = this.props;
    form.resetFields();
    this.fetchList();
  };

  // 页码改变
  onPageChange = e => {
    this.setState(
      {
        pageNum: e,
      },
      () => {
        this.fetchList();
      },
    );
  };

  // 页数改变
  onShowSizeChange = (cur, size) => {
    this.setState(
      {
        pageNum: cur,
        pageSize: size,
      },
      () => {
        this.fetchList();
      },
    );
  };

  // 使失效
  delFeature = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureList/delFeatureView',
      payload: {
        operType: 'delete',
        schemaId: record.schemaId
      },
      success: () => {
        this.fetchList();
      }
    })
  }

  // 使生效
  effictiveFeature = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'featureList/effictiveFeatureView',
      payload: {
        schemaId: record.schemaId,
        schemaName: record.schemaName
      },
      success: () => {
        this.fetchList();
      }
    })
  }

  render() {
    const { loading, form, effictiveState } = this.props;
    const { getFieldDecorator } = form;
    const { data, pageInfo, advancedFilterShow } = this.state;
    const topRightDiv = (
      <div>
        <Button type='primary' size='small'>
          <Link to='/feature/detail'>{formatMessage({ id: 'common.table.status.new' })}</Link>
        </Button>
        <Search
          size='small'
          placeholder={formatMessage({
            id: 'feature.templateInputName',
          })}
          onSearch={this.fetchList}
          onChange={value => this.getSearchValue(value)}
          className='filter-input'
        />
        <a className='dropdown-style' onClick={this.showAdvancedFilter}>
          {formatMessage({
            id: 'common.btn.AdvancedFilter',
          })}
          {!advancedFilterShow ? <Icon type='down' /> : <Icon type='up' />}
        </a>
      </div>
    );
    return (
      <Card
        size='small'
        title='特征视图'
        extra={topRightDiv}
      >
        {
          advancedFilterShow ? (
            <div className='show-advanced-div'>
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                className='formStyle'
              >
                <Row className='row-bottom-line'>
                  <Col span={8}>
                    <Form.Item
                      label={formatMessage({ id: 'feature.featureCode' })}
                    >
                      {getFieldDecorator('schemaCode', {})(
                        <Input size='small' />,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label={formatMessage({ id: 'feature.featureState' })}
                    >
                      {getFieldDecorator('status', {
                        initialValue: '1'
                      })(
                        <Select
                          size='small'
                        >
                          {effictiveState && effictiveState.map(item => (
                            <Option key={item.attrValueCode} value={item.attrValueCode}>
                              {item.attrValueName}
                            </Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                <Col span={8}>
                  <div style={{ marginTop: 6 }}>
                    <Button
                      style={{ float: 'right', marginLeft: '6px' }}
                      size='small'
                      onClick={this.resetForm}
                    >
                      {formatMessage({
                        id: 'common.btn.reset',
                      })}
                    </Button>
                    <Button
                      type='primary'
                      onClick={this.fetchList}
                      size='small'
                      style={{ float: 'right' }}
                    >
                      {formatMessage({
                        id: 'common.btn.toSearch',
                      })}
                    </Button>
                  </div>
                </Col>
                </Row>
              </Form>
            </div>
          ) : null
        }
        <List
          itemLayout='horizontal'
          dataSource={data}
          loading={loading}
          className='common-list'
          renderItem={item => (
            <List.Item
              actions={[
                ...(item.status != '2'
                  ? [
                    <Link to={`/feature/detail?schemaId=${item.schemaId}`}>
                      {formatMessage({
                        id: 'common.table.action.edit',
                      })}
                    </Link>,
                    <Popconfirm
                      title={formatMessage({
                        id: 'feature.confirmDeletionOfSelectedData',
                      })}
                      onConfirm={() => {
                        this.delFeature(item);
                      }}
                    >
                      <a>{formatMessage({ id: 'feature.disable' })}</a>
                    </Popconfirm>,
                  ]
                  : [
                    <Popconfirm
                      title={formatMessage({
                        id: 'feature.confirmUpdatingSelectedDataToEffective',
                      })}
                      onConfirm={() => {
                        this.effictiveFeature(item);
                      }}
                    >
                      <a>{formatMessage({ id: 'feature.effictive' })}</a>
                    </Popconfirm>
                  ])
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className='left-lmg'>
                    <Iconfont type='iconicon' />
                  </div>
                }
              />
              <Row type='flex' className='list-row-style'>
                <Col span={10}>
                  <div className='light-color'>
                    {formatMessage({ id: 'feature.featureName' })}
                  </div>
                  <div className='deep-color text-ellipsis'>
                    <Link to={`/feature/detail?schemaId=${item.schemaId}&type=view`}>
                      {item.schemaName}
                    </Link>
                  </div>
                </Col>
                <Col span={8}>
                  <div className='light-color'>
                    {formatMessage({ id: 'feature.featureCode' })}
                  </div>
                  <div className='deep-color text-ellipsis'>{item.schemaCode}</div>
                </Col>
                <Col span={6}>
                  <div className='light-color'>
                    {formatMessage({
                      id: 'feature.featureState',
                    })}
                  </div>
                  <div className='deep-color'>
                    <Badge status={this.statusColor[item.status]} text={this.status[item.status]} />
                  </div>
                </Col>
              </Row>
            </List.Item>
          )}
        />
        {pageInfo.total > 0 && (
          <div className='pagination-style'>
            <Pagination
              showQuickJumper
              showSizeChanger
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={1}
              current={pageInfo.pageNum}
              total={pageInfo.total}
              pageSize={pageInfo.pageSize}
              onChange={this.onPageChange}
            />
          </div>
        )}
      </Card>
    )
  }
}

export default FeatureList