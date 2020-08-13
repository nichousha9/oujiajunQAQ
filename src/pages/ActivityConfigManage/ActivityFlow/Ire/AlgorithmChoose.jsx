// 算法模型选择弹窗
import React from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Table, Input, Card, Select, Button, Form, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import moment from 'moment';
import commonStyles from '../common.less';
import styles from './index.less';
import SearchTree from '@/components/SearchTree';
import { formatTree } from '@/utils/formatData';

@connect(({ common, loading }) => ({
  algoTypeList: common.attrSpecCodeList.ALGO_TYPE,
  loading: loading.effects['activityFlowIre/qryAlgoModuleList']
}))
class AlgorithmChoose extends React.Component {
  columns = [
    {
      title: formatMessage({ id: 'activityConfigManage.ire.algoName' }), // 算法名称
      dataIndex: 'algoName',
      key: 'algoName',
    },
    {
      title: formatMessage({ id: 'activityConfigManage.ire.algoCode' }), // 算法编码
      dataIndex: 'algoCode',
      key: 'algoCode',
      render: (text, record) => {
        const time = record.createTime && moment(record.createTime).format('YYYYMMDDHHmmss') || '';
        return time + record.algoId 
      }
    },
    {
      title: formatMessage({ id: 'activityConfigManage.ire.algoType' }), // 算法类型
      dataIndex: 'algoType',
      key: 'algoType',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      // 左边树
      treeSelectedKey: '',
      treeList: [],
      // 右边模块
      pageNum: 1,
      pageSize: 5,
      pageInfo: {}, // 后端的返回
      commodityList: [], // 算法列表
      selectedRow: [], // 选中的行
    };
  }

  componentDidMount() {
    this.qryAlgoFoldList();
    this.qryAttrValueByCode();
  }

  // 获取算法类型
  qryAttrValueByCode = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/qryAttrValueByCode',
      payload: {
        attrSpecCode : "ALGO_TYPE"
      }
    });
  }

  /**
   *获取目录树数据
   *
   * @memberof AlgorithmChoose
   */
  qryAlgoFoldList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activityFlowIre/qryAlgoFoldList',
      payload: {},
      success: svcCont => {
        const { data = [] } = svcCont;
        const newArr = formatTree(data, 'parentFold');
        if (newArr && newArr.length && newArr[0].fold) {
          const treeSelectedKey = newArr[0].fold;
          this.setState({ treeList: newArr, treeSelectedKey }, this.fetchList);
        } else {
          this.setState({ treeList: newArr || [] });
        }
      },
    });
  };

  /**
   *获取算法列表
   *
   * @memberof AlgorithmChoose
   */
  fetchList = () => {
    const { dispatch, form } = this.props;
    const { treeSelectedKey, pageNum, pageSize } = this.state;
    dispatch({
      type: 'activityFlowIre/qryAlgoModuleList',
      payload: {
        pageInfo: { pageNum, pageSize },
        fold: treeSelectedKey, // 目录id
        algoName: form.getFieldValue('algoName'),
        algoType: form.getFieldValue('algoType')
      },
      success: svcCont => {
        const { data = [], pageInfo = {} } = svcCont;
        this.setState({
          commodityList: data,
          pageInfo,
        });
      },
    });
  };

  // 树选中值改变
  onSelectCallBack = key => {
    this.setState({ treeSelectedKey: key }, this.fetchList);
  };

  // 提交
  handleSubmit = () => {
    const { onOk } = this.props;
    const { selectedRow } = this.state;
    if(!selectedRow.id) {
      message.info(formatMessage({ id: 'activityConfigManage.flow.selectNotice' }));
      return
    }
    onOk(selectedRow);
  };

  // 列表条件切换
  onChange = pagination => {
    const { current: pageNum, pageSize } = pagination;
    this.setState(
      {
        pageNum,
        pageSize,
      },
      this.fetchList,
    );
  };

  clickRow = record => {
    this.setState({ selectedRow: record });
  };

  setClassName = record => {
    const { selectedRow } = this.state;
    // 判断索引相等时添加行的高亮样式
    return record.id === selectedRow.id ? commonStyles.tableRowSelect : '';
  };

  render() {
    const { form, onCancel, loading, algoTypeList } = this.props;
    const { getFieldDecorator } = form;
    const { treeList, commodityList, pageInfo, treeSelectedKey } = this.state;

    const treeProps = {
      hideSearch: true,
      showButtons: false,
      defaultSelectedKeys: [treeSelectedKey.toString()],
      treeData: treeList,
      onSelectCallBack: this.onSelectCallBack,
    };

    const pagination = {
      current: pageInfo.pageNum,
      pageSize: pageInfo.pageSize,
      total: pageInfo.total,
      showSizeChanger: true,
      showQuickJumper: true,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.ire.algoLisTitle' })}
        visible
        width={960}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        wrapClassName={commonStyles.flowModal}
      >
        <div className={commonStyles.chooseWrapper}>
          <Row type="flex" gutter={8}>
            {/* 创意选择左边目录树 */}
            <Col span={6}>
              <Card size="small" title={formatMessage({ id: 'activityConfigManage.flow.alogoCatalog' })} className={commonStyles.treeBox}>
                <div>
                  {treeList && treeList.length > 0 && <SearchTree {...treeProps} />}
                </div>
              </Card>
            </Col>
            {/* 创意选择列表及选中列表 */}
            <Col span={18}>
              <div className={styles.searchBox}>
                <Form layout="inline" className={styles.form}>
                  {/* 算法类型 */}
                  <Form.Item label={formatMessage({ id: 'activityConfigManage.ire.algoType' })}>
                    {getFieldDecorator('algoType', {})(
                      <Select size='small' allowClear style={{width: '180px'}}>
                        {
                          algoTypeList.map((item) => (
                            <Select.Option key={item.attrValueCode} value={item.attrValueCode}>{item.attrValueName}</Select.Option>
                          ))
                        }
                      </Select>
                    )}
                  </Form.Item>
                  {/* 算法名称 */}
                  <Form.Item label={formatMessage({ id: 'activityConfigManage.ire.algoName' })}>
                    {getFieldDecorator('algoName', {})(
                      <Input
                        size="small"
                        placeholder={formatMessage({ id: 'common.form.input' })}
                        style={{width: '180px'}}
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type='primary' size='small' onClick={this.fetchList}>
                      {formatMessage({ id: 'common.btn.search' })}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <Table
                rowKey="offerId"
                dataSource={commodityList}
                columns={this.columns}
                pagination={pagination}
                loading={loading}
                rowClassName={this.setClassName}
                onRow={record => ({ onClick: this.clickRow.bind(this, record) })}
                onChange={this.onChange}
              />
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(AlgorithmChoose);
