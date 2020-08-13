import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Button, Popconfirm, Modal, Select, message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont/index';
import styles from '../../index.less';

const { Option } = Select;
const modalColumns = [
  {
    title: formatMessage({ id: 'commodityManage.name.tagName' }),
    dataIndex: 'tag',
    editable: true,
  },
  {
    title: formatMessage({ id: 'commodityManage.name.tagFold' }),
    dataIndex: 'tagfold',
    editable: true,
  },
  {
    title: formatMessage({ id: 'common.table.createTime' }),
    dataIndex: 'createtime',
    editable: true,
  },
  {
    title: formatMessage({ id: 'common.table.updateTime' }),
    dataIndex: 'updatetime',
    editable: true,
  },
];

@connect(({ commodityList }) => {
  return {
    submitData: commodityList.submitData,
  };
})
class AddTag extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: formatMessage({ id: 'commodityManage.name.tag' }),
        dataIndex: 'labelName',
        width: '30%',
        render: (text, record) => {
          const { submitData, readOnly } = this.props;
          const { relLabelList } = submitData;
          const index = relLabelList.findIndex(item => record.key === item.key);
          return (
            <Input
              size="small"
              style={{ width: 300 }}
              value={undefined === relLabelList[index] ? null : relLabelList[index].labelName}
              suffix={
                !readOnly ? (
                  <Iconfont
                    type="iconcopyx"
                    onClick={() => {
                      this.showlabelModal(record);
                    }}
                  />
                ) : null
              }
            />
          );
        },
      },
      {
        title: formatMessage({ id: 'commodityManage.name.tagProps' }),
        dataIndex: 'labelValue',
        render: (text, record) => {
          // console.log(text, record, index);
          const { propsOption } = this.state;
          const { submitData, readOnly } = this.props;
          const { relLabelList } = submitData;
          const index = relLabelList.findIndex(item => record.key === item.key);
          return relLabelList[index] === undefined ||
            relLabelList[index].labelValueType === '1000' ||
            undefined === propsOption[relLabelList[index].labelName] ? (
            <Input
              size="small"
              placeholder={formatMessage({ id: 'common.form.input' })}
              style={{ width: 280 }}
              readOnly={readOnly}
              value={
                relLabelList[index]
                  ? relLabelList[index].labelValue
                  : formatMessage({ id: 'commodityManage.tip.chooseTag' })
              }
              // eslint-disable-next-line react/jsx-no-bind
              onChange={this.handleInput.bind(this, record.key)}
              maxLength={50}
            />
          ) : (
            <Select
              style={{ width: 280 }}
              size="small"
              disabled={readOnly}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={this.handleSelect.bind(this, record.key)}
              value={
                relLabelList[index].labelValue
                  ? relLabelList[index].labelValue
                  : formatMessage({ id: 'common.form.select' })
              }
            >
              {propsOption[relLabelList[index].labelName].map(item => {
                return (
                  <Option key={item.labelValueId} value={item.labelValue}>
                    {item.valueName}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        title: formatMessage({ id: 'common.table.action' }),
        dataIndex: 'operation',
        render: (text, record) => {
          const { readOnly } = this.props;
          // eslint-disable-next-line react/destructuring-assignment
          return this.props.dataSource.length >= 1 && !readOnly ? (
            <Popconfirm
              title={formatMessage({ id: 'commodityManage.tip.deleteTip' })}
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a href="">{formatMessage({ id: 'common.table.action.delete' })}</a>
            </Popconfirm>
          ) : null;
        },
      },
    ];

    this.state = {
      // dataSource: [], // 外层table数据
      // count: 0,
      modalVisible: false,
      labelInfo: [], // 标签信息
      propsOption: {}, // 标签属性
      // choosetag: [], // 选择的标签数据
      selecttag: null,
      key: -1,
      pageNum: 1,
      pageSize: 5,
      total: 0,
    };
  }

  componentWillMount() {
    this.getLabelInfoList(1);
  }

  // componentWillReceiveProps(nextProps) {
  //     const { modalVisible } = this.state;
  //     console.log(nextProps);
  //     if (!modalVisible && nextProps.modalVisible) {
  //       this.getLabelInfoList();
  //     }
  //   }

  showlabelModal = record => {
    this.setState({
      modalVisible: true,
      key: record.key,
    });
  };

  handleDelete = key => {
    const { dispatch, submitData, handleLabelDelete } = this.props;
    const { relLabelList } = submitData;
    const newrelLabelList = relLabelList.filter(item => item.key !== key);
    // console.log(newrelLabelList,relLabelList);
    dispatch({
      type: 'commodityList/changeSubmitData',
      payload: { ...submitData, relLabelList: newrelLabelList },
    });
    handleLabelDelete(key);
  };

  handleSelect = (key, value, option) => {
    const { dispatch, submitData } = this.props;
    const { relLabelList } = submitData;
    const newrelLabelList = relLabelList.map(item => {
      if (item.key === key) {
        return {
          ...item,
          labelValue: option.props.value,
          labelValueId: option.key,
        };
      }
      return item;
    });
    dispatch({
      type: 'commodityList/changeSubmitData',
      payload: { ...submitData, relLabelList: newrelLabelList },
    });
  };

  handleInput = (key, e) => {
    const { dispatch, submitData } = this.props;
    const { relLabelList } = submitData;
    const newrelLabelList = relLabelList.map(item => {
      if (item.key === key) {
        return {
          ...item,
          labelValue: e.target.value,
          labelValueId: '',
        };
      }
      return item;
    });
    dispatch({
      type: 'commodityList/changeSubmitData',
      payload: { ...submitData, relLabelList: newrelLabelList },
    });
  };

  handleOk = () => {
    const { selecttag, key, propsOption } = this.state;
    const { dispatch, submitData } = this.props;
    const { relLabelList } = submitData;
    if (selecttag) {
      const newLabel = {
        key,
        labelId: selecttag.key,
        labelName: selecttag.tag,
        labelValueType: selecttag.valuetype,
        objectType: '02', // 实体类型 01:创意 02:商品
        optionData: undefined !== propsOption[selecttag.tag] ? propsOption[selecttag.tag] : [],
      };
      const index = relLabelList.findIndex(item => key === item.key);
      // console.log(index, '123');
      if (index !== -1) {
        relLabelList[index] = newLabel;
      } else relLabelList.push(newLabel);
      this.setState({ modalVisible: false, key: -1, selecttag: null });
      dispatch({
        type: 'commodityList/changeSubmitData',
        payload: { ...submitData, relLabelList },
      });
    } else message.error(formatMessage({ id: 'commodityManage.tip.chooseTag' }));
  };

  // handleSave = row => {
  //   const { dataSource } = this.state;
  //   const newData = [...dataSource];
  //   const index = newData.findIndex(item => row.key === item.key);
  //   const item = newData[index];
  //   newData.splice(index, 1, {
  //     ...item,
  //     ...row,
  //   });
  //   this.setState({ dataSource: newData });
  // };

  /**
   * @param{integer} targetPageNum 重置页数
   */
  getLabelInfoList = targetPageNum => {
    const { dispatch } = this.props;
    const { pageNum, pageSize } = this.state;
    dispatch({
      type: 'commodityList/getLabelInfoList',
      payload: {
        labelType: '2', // 商品标签
        pageInfo: {
          pageSize,
          pageNum: targetPageNum || pageNum,
        },
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { pageInfo } = res.svcCont;
        if (pageInfo) {
          this.setState({
            pageNum: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
          });
        }
        this.dealLabelInfoList(res.svcCont.data);
      }
    });
  };

  queryLabelInfoById = (id, name) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/queryLabelInfoById',
      payload: {
        labelId: id,
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
        const { propsOption } = this.state;
        const newoption = {};
        newoption[name] = res.svcCont.data.valueList;
        this.setState({ propsOption: { ...propsOption, ...newoption } });
      }
    });
  };

  dealLabelInfoList = data => {
    const labelInfo = data.map(item => {
      const labelitem = {
        key: item.labelId,
        tag: item.labelName,
        tagfold: item.grpName,
        createtime: item.createDate,
        updatetime: item.updateDate === null ? item.updateDate : '暂未修改',
        valuetype: item.labelDataType,
      };
      if (item.labelDataType === '2000') {
        this.queryLabelInfoById(item.labelId, item.labelName);
      }
      return labelitem;
    });
    // console.log(labelInfo, 'labelInfo');
    this.setState({ labelInfo });
  };

  dealLabelInfo = data => {
    // console.log(data, '123');
    const valueList = data.valueList.map(item => ({
      value: item.labelValue,
      name: item.valueName,
    }));
    return valueList;
  };

  // 处理分页
  handleTableChange = (pageNum, pageSize) => {
    this.setState(
      {
        pageNum,
        pageSize,
      },
      () => {
        this.getLabelInfoList();
      },
    );
  };

  render() {
    const { modalVisible, labelInfo, selecttag, pageNum, pageSize, total } = this.state;
    const { handleLabelAdd, dataSource, readOnly } = this.props;
    // console.log(dataSource,propsOption,labelInfo);
    // console.log(this.props.submitData);

    return (
      <Fragment>
        <div style={{ background: '#F5F5F5', padding: '20px' }}>
          {!readOnly ? (
            <Button onClick={handleLabelAdd} type="primary" style={{ marginBottom: 16 }}>
              {formatMessage({ id: 'common.table.status.new' })}
            </Button>
          ) : (
            ''
          )}
          <Table
            // rowClassName={() => 'editable-row'}
            bordered={false}
            style={{ background: '#fff', padding: '20px' }}
            dataSource={dataSource}
            columns={this.columns}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              size: 'small',
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20'],
            }}
            className={styles.labelTabelStyle}
          />
        </div>
        <Modal
          title={formatMessage({ id: 'commodityManage.name.tagList' })}
          visible={modalVisible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ modalVisible: false, selecttag: null, key: -1 });
          }}
          centered
          width="730px"
          className={styles.tagModalStyle}
        >
          <Table
            className={styles.wrapper}
            bordered={false}
            dataSource={labelInfo}
            columns={modalColumns}
            pagination={{
              total,
              pageSize,
              current: pageNum,
              showQuickJumper: true,
              showSizeChanger: true,
              size: 'small',
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20'],
              onChange: (page, size) => this.handleTableChange(page, size),
              onShowSizeChange: (current, size) => this.handleTableChange(current, size),
            }}
            onRow={rowrecord => {
              return {
                onClick: () => {
                  this.setState({ selecttag: rowrecord });
                },
              };
            }}
            rowClassName={newrecord => {
              // console.log(selecttag);
              return selecttag && newrecord.tag === selecttag.tag ? 'clickRowStyle' : '';
            }}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default AddTag;
