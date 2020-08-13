import React from 'react';
import { Card, Button, Divider, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Ellipsis from '@/components/Ellipsis';
import ElementModal from './components/ElementModal';
import SearchForm from './components/SearchForm';

const STATUS_MAP = {
  REST: '1000', // 待启动
  RUNNING: '1100', // 已启动
  DELETE: '2000',
};

@connect(({ templateElement, loading }) => ({
  elementModalVisible: templateElement.elementModalVisible,
  fieldTypeList: templateElement.fieldTypeList,
  workOrderTypeList: templateElement.workOrderTypeList,
  mapTables: templateElement.mapTables,
  pageInfo: templateElement.pageInfo,
  templateElementList: templateElement.templateElementList,
  templateElementListEffectLoading:
    loading.effects['templateElement/fetchTemplateElementList'] ||
    loading.effects['templateElement/deleteTemplateElementEffect'] ||
    loading.effects['templateElement/startTemplateElementEffect'],
}))
class TemplateElement extends React.Component {
  componentDidMount() {
    this.qryMapTable();
    this.qryFieldTypeList();
    this.qryWorkOrderTypeList();
    this.getTemplateElementList();
  }

  searchForm = form => {
    this.formRef = form;
  };

  getOrderTypeText = orderTypeCode => {
    const { workOrderTypeList } = this.props;
    const targetOrderType = workOrderTypeList.find(
      orderTypeItem => orderTypeItem.code === orderTypeCode,
    );
    if (targetOrderType) {
      return targetOrderType.name;
    }
    return '';
  };

  getFieldText = fieldCode => {
    const { fieldTypeList } = this.props;
    const targetFieldType = fieldTypeList.find(
      fieldTypeItem => fieldTypeItem.attrValueCode === fieldCode,
    );
    if (targetFieldType) {
      return targetFieldType.attrValueName;
    }
    return '';
  };

  getMapTables = mapTableCode => {
    const { mapTables } = this.props;
    const targetMapTable = mapTables.find(
      mapTableItem => mapTableItem.attrValueCode === mapTableCode,
    );
    if (targetMapTable) {
      return targetMapTable.attrValueName;
    }
    return '';
  };

  showModal = (action, record) => {
    const { dispatch } = this.props;
    if (action !== 'add') {
      dispatch({
        type: 'templateElement/getCurrentTemplateElement',
        payload: record,
      });
    }
    dispatch({
      type: 'templateElement/getAction',
      payload: action,
    });
    dispatch({
      type: 'templateElement/switchModalVisible',
      payload: true,
    });
  };

  getTemplateElementList = () => {
    const fieldValues = this.formRef.getSearchConditionValue();
    this.qryTemplateElementList(fieldValues);
  };

  startTemplateElement = columnId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateElement/updateTemplateElementEffect',
      payload: {
        statusCd: STATUS_MAP.RUNNING,
        columnId,
      },
      callback: () => {
        // 刷新
        this.getTemplateElementList();
      },
    });
  };

  abortTemplateElement = columnId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateElement/updateTemplateElementEffect',
      payload: {
        statusCd: STATUS_MAP.REST,
        columnId,
      },
      callback: () => {
        // 刷新
        this.getTemplateElementList();
      },
    });
  };

  deleteTemplateElement = columnId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateElement/updateTemplateElementEffect',
      payload: {
        statusCd: STATUS_MAP.DELETE,
        columnId,
      },
      callback: () => {
        // 刷新
        this.getTemplateElementList();
      },
    });
  };

  handleTableChange = (pageNum, pageSize) => {
    const { dispatch, pageInfo } = this.props;
    dispatch({
      type: 'templateElement/getPageInfo',
      payload: { ...pageInfo, pageNum, pageSize },
    });

    this.getTemplateElementList();
  };

  qryWorkOrderTypeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateElement/fetchWorkOrderTypeListEffect',
      payload: {
        hasBasicType: 'Y',
      },
    });
  };

  qryFieldTypeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateElement/fetchFieldTypeListOrMappingEffect',
      payload: { attrSpecCode: 'ORDER_COLUMN_TYPE' },
      callback: svcCont => {
        dispatch({
          type: 'templateElement/getFieldTypeList',
          payload: svcCont.data,
        });
      },
    });
  };

  qryMapTable = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'templateElement/fetchFieldTypeListOrMappingEffect',
      payload: { attrSpecCode: 'ORDER_TABLE_CODE' },
      callback: svcCont => {
        dispatch({
          type: 'templateElement/getMapTables',
          payload: svcCont.data,
        });
      },
    });
  };

  qryTemplateElementList = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateElement/fetchTemplateElementListEffect',
      payload: { ...values },
    });
  };

  render() {
    const {
      pageInfo,
      templateElementList,
      templateElementListEffectLoading,
      elementModalVisible,
    } = this.props;

    const { total, pageNum, pageSize } = pageInfo;

    const columns = [
      {
        title: formatMessage({ id: 'templateElement.elementName' }, '要素名称'),
        dataIndex: 'columnName',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: formatMessage({ id: 'templateElement.workOrderType' }, '工单类别'),
        dataIndex: 'orderType',
        render: text => (text ? this.getOrderTypeText(text) : ''),
      },
      {
        title: formatMessage({ id: 'templateElement.fieldType' }, '字段类型'),
        dataIndex: 'columnType',
        render: text => (text ? this.getFieldText(text) : ''),
      },
      {
        title: formatMessage({ id: 'templateElement.belongTable' }, '映射表'),
        dataIndex: 'belongTable',
        render: text => (text ? this.getMapTables(text) : ''),
      },
      {
        title: formatMessage({ id: 'templateElement.columnCode' }, '映射字段'),
        dataIndex: 'columnCode',
        render: text => (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        ),
      },
      {
        title: formatMessage({ id: 'templateElement.isFilling' }, '是否填充'),
        dataIndex: 'ifFilled',
        render: text =>
          text === 'Y'
            ? formatMessage({ id: 'common.text.yes' })
            : formatMessage({ id: 'common.text.no' }),
      },
      {
        title: formatMessage({ id: 'common.table.creator' }, '创建人'),
        dataIndex: 'creater',
      },
      {
        title: formatMessage({ id: 'common.table.createTime' }, '创建时间'),
        dataIndex: 'createTime',
      },
      {
        title: formatMessage({ id: 'common.table.action' }, '操作'),
        dataIndex: 'action',
        width: 210,
        render: (_, record) => (
          <span>
            {record.statusCd === STATUS_MAP.REST ? (
              <a
                onClick={() => {
                  this.startTemplateElement(record.columnId);
                }}
              >
                {formatMessage({ id: 'common.table.action.start' }, '启动')}
              </a>
            ) : (
              <a
                onClick={() => {
                  this.abortTemplateElement(record.columnId);
                }}
              >
                {formatMessage({ id: 'common.table.action.abort' }, '终止')}
              </a>
            )}
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.showModal('view', record);
              }}
            >
              {formatMessage({ id: 'common.table.action.detail' }, '详情')}
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.showModal('edit', record);
              }}
            >
              {formatMessage({ id: 'common.table.action.edit' }, '编辑')}
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title={formatMessage({ id: 'common.title.isConfirm' }, '是否确认')}
              onConfirm={() => this.deleteTemplateElement(record.columnId)}
              cancelText={formatMessage({ id: 'common.btn.cancel' }, '取消')}
              okText={formatMessage({ id: 'common.btn.confirm' }, '确定')}
            >
              <a>{formatMessage({ id: 'common.table.action.delete' }, '删除')}</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNum,
      total,
      pageSize,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: (page, size) => this.handleTableChange(page, size),
      onShowSizeChange: (current, size) => this.handleTableChange(current, size),
    };

    return (
      <>
        <Card
          size="small"
          title={formatMessage({ id: 'menu.templateElement' }, '模板要素配置')}
          extra={
            <Button
              size="small"
              type="primary"
              onClick={() => {
                this.showModal('add');
              }}
            >
              {formatMessage({ id: 'templateElement.addElement' }, '新增要素')}
            </Button>
          }
        >
          <SearchForm
            wrappedComponentRef={this.searchForm}
            qryTemplateElementList={this.qryTemplateElementList}
          />
          <Table
            rowKey={record => record.columnId}
            columns={columns}
            pagination={paginationProps}
            dataSource={templateElementList}
            loading={templateElementListEffectLoading}
            // scroll={{ x: 900 }}
          />
        </Card>
        {elementModalVisible ? (
          <ElementModal getTemplateElementList={this.getTemplateElementList} />
        ) : null}
      </>
    );
  }
}

export default TemplateElement;
