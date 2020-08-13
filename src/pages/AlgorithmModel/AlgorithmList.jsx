import React from 'react';
import {
  Card,
  Button,
  List,
  Input,
  Form,
  Icon,
  Row, 
  Col,
  Select,
  Pagination,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import route from 'umi/router';
import Iconfont from '@/components/Iconfont';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';
import { getAlgorithmCode } from './common';

const { Option } = Select;

@connect(({ algorithmModel, loading })=>({
  pageInfo: algorithmModel.pageInfo,
  algorithmTypeList: algorithmModel.algorithmTypeList,
  currentCatalogBasicInfo: algorithmModel.currentCatalogBasicInfo,
  algorithmListLoading: loading.effects['algorithmModel/qryAlgorithmModuleListEffect'],
}))
@Form.create()
class AlgorithmList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      advancedFilterVisible: false,
      algorithmList: [],
    }
  }

  componentDidMount() {
    // 请求静态数据
    this.qryEngineCode();
    this.qryAlgorithmList();
  }

  componentDidUpdate(nextProps) {
    const { currentCatalogBasicInfo: prevCurrentCatalog } = this.props;
    const { key, title } = prevCurrentCatalog;
    if (key != nextProps.currentCatalogBasicInfo.key || title != nextProps.currentCatalogBasicInfo.title) {
      this.qryAlgorithmList();
    }
  }

  // 查询当前使用引擎: ali or iwhale
  qryEngineCode = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'algorithmModel/qryStaticsListEffect',
      payload: {
        attrSpecCode: 'INTERFACE_SOURCE',
      },
      callback: svcCont => {
        const { data } = svcCont;
        const { attrValueCode: engineCode } = data[0];
        dispatch({
          type: 'algorithmModel/getEngineCode',
          payload: engineCode,
        });
        this.qryAlgorithmTypeList(engineCode);
      }
    });
  }

  // 算法类型
  qryAlgorithmTypeList = engineCode => {
    const { dispatch } = this.props;
    dispatch({
      type: 'algorithmModel/qryAlgorithmTypeListEffect',
      payload: {
        attrSpecCode: engineCode === 'ali' ? 'ALGO_TYPE' : 'IWHALE_ALGO_TYPE',
      }
    });
  }

  // 查询算法列表
  qryAlgorithmList = () => {
    const { dispatch, form } = this.props;
    const fieldsValue = form.getFieldsValue();
    dispatch({
      type: 'algorithmModel/qryAlgorithmModuleListEffect',
      payload: {
        ...fieldsValue,
      },
      callback: svcCont => {
        const { data } = svcCont;
        this.setState({
          algorithmList: data,
        });
      }
    });
  }

  toggleAdvancedFilter  = () => {
    this.setState(preState => ({advancedFilterVisible: !preState.advancedFilterVisible}));
  }

  resetForm = () => {
    const { form } = this.props;
    // 只重置高级筛选
    form.resetFields(['algoType', 'status']);
  }

  handleSearch = () => {
    this.qryAlgorithmList();
  }

  onPageChange = (pageNum, pageSize) => {
    const { dispatch, pageInfo } = this.props;
    dispatch({
      type: 'algorithmModel/getPageInfo',
      payload: { ...pageInfo, pageNum, pageSize },
    });

    this.qryAlgorithmList();
  }

  // 新增算法跳转
  addAlgorithm = () => {
    route.push({
      pathname: 'algorithmModel/detail',
      query: {
        action: 'add',
      }
    });
  }

  // 删除算法模型
  deleteAlgorithmModel = item => {
    const { dispatch, currentCatalogBasicInfo } = this.props;
    const { key: fold, title: foldName } = currentCatalogBasicInfo;
    const { algoId } = item;
    const algoCode = getAlgorithmCode(item);
    dispatch({
      type: 'algorithmModel/deleteAlgorithmModuleEffect',
      payload: { algoId, algoCode, fold, foldName, operType: 'delete' },
      callback: () => {
        this.qryAlgorithmList();
      }
    });
  }

  render() {
    const { advancedFilterVisible, algorithmList } = this.state;
    const { form, algorithmListLoading, algorithmTypeList, pageInfo } = this.props;
    const { getFieldDecorator } = form;

    const { pageNum, pageSize, total } = pageInfo;

    const formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const colLayout = {
      sm: {
        span: 24,
      },
      md: {
        span: 8,
      },
    };
    
    const extraBlock = (
      <div className={styles.extraBlock}>
        <Row type="flex">
          <Col>
              <Button size="small" type="primary" onClick={this.addAlgorithm}>
                {formatMessage(
                  {
                    id: 'algorithmModel.addAlgorithm',
                  },
                )}
              </Button>
          </Col>
          <Col>
            <Form.Item>
              {getFieldDecorator('algoName')(
                <Input.Search
                  size="small"
                  className="filter-input"
                  allowClear
                  placeholder={formatMessage({ id: 'algorithmModel.algorithmName' })}
                  onSearch={val => {
                    this.handleSearch(val);
                  }}
                />
              )}
            </Form.Item>
          </Col>
          <Col>
            <Button size="small" type="link" onClick={this.toggleAdvancedFilter}>
              {formatMessage(
                {
                  id: 'common.btn.AdvancedFilter',
                }
              )}
              <Icon type={advancedFilterVisible ? 'up' : 'down'} />
            </Button>
          </Col>
        </Row>
      </div>
    );

    return (
      <Form {...formLayout}>
        <Card size="small" title={formatMessage({ id: 'algorithmModel.title' })} extra={extraBlock}>
          {advancedFilterVisible ? (
            <div className="show-advanced-div row-bottom-line">
              <Row type="flex">
                <Col {...colLayout}>
                  <Form.Item
                    label={formatMessage({
                      id: 'algorithmModel.algorithmType',
                    })}
                  >
                    {getFieldDecorator('algoType')(
                      <Select
                        size="small"
                        placeholder={formatMessage({
                          id: 'common.form.select',
                        })}
                        allowClear
                      >
                        {algorithmTypeList.map(type => (
                          <Option key={type.attrValueCode} value={type.attrValueCode}>
                            {type.attrValueName}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
                <Col className={styles.btnGroup}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={this.handleSearch}
                    className={styles.btn}
                  >
                    {formatMessage(
                      {
                        id: 'common.btn.search',
                      },
                      '搜索',
                    )}
                  </Button>
                  <Button size="small" onClick={this.resetForm}>
                    {formatMessage(
                      {
                        id: 'common.btn.reset',
                      },
                      '重置',
                    )}
                  </Button>
                </Col>
              </Row>
            </div>
          ) : null}

          <List
            itemLayout="horizontal"
            dataSource={algorithmList}
            loading={algorithmListLoading}
            className="common-list"
            renderItem={item => (
              <List.Item
                actions={[
                  ...[
                    <Link
                      to={{
                        pathname: `/algorithmModel/detail`,
                        query: {
                          action: 'update',
                          id: item.id,
                        },
                      }}
                    >
                      {formatMessage({
                        id: 'common.table.action.edit',
                      })}
                    </Link>,
                  ],
                  ...[
                    <Popconfirm
                      title={formatMessage({ id: 'common.title.isConfirm' })}
                      okText={formatMessage({ id: 'common.btn.confirm'})}
                      cancelText={formatMessage(
                        {
                          id: 'common.btn.cancel',
                        },
                      )}
                      onConfirm={() => this.deleteAlgorithmModel(item)}
                    >
                      <a> {formatMessage({ id: 'common.table.action.delete' })}</a>
                    </Popconfirm>,
                  ],
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="left-lmg">
                      <Iconfont type="iconpricetag" />
                    </div>
                  }
                />
                <Row type="flex" className="list-row-style">
                  <Col span={8}>
                    <div className="deep-color">
                      <Link
                        to={{
                          pathname: `/algorithmModel/detail`,
                          query: {
                            action: 'view',
                            id: item.id,
                          },
                        }}
                      >
                        <Ellipsis tooltip lines={1}>
                          {item.algoName}
                        </Ellipsis>
                      </Link>
                    </div>
                    <div className="light-color text-ellipsis">
                      <Ellipsis tooltip lines={1}>
                        {formatMessage({
                          id: 'algorithmModel.description',
                        })}
                        : {item.algoDesc || ''}
                      </Ellipsis>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="light-color">
                      {formatMessage({
                        id: 'algorithmModel.algorithmCode',
                      })}
                    </div>
                    <Ellipsis tooltip lines={1} className="deep-color">
                      {getAlgorithmCode(item)}
                    </Ellipsis>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
          {total > 0 && (
            <div className="pagination-style">
              <Pagination
                showQuickJumper
                showSizeChanger
                total={total}
                pageSize={pageSize}
                current={pageNum}
                defaultCurrent={1}
                onChange={this.onPageChange}
                onShowSizeChange={this.onPageChange}
              />
            </div>
          )}
        </Card>
      </Form>
    );
  }
}

export default AlgorithmList;
