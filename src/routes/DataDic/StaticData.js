import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Button, Icon, message, Popconfirm } from 'antd';
import styles from '../SystemSunm/UserAccount/index.less';
import StandardTable from '../../components/StandardTable';
import EditStaticDataModal from './EditStaticDataModal';

@connect(({ staticData, loading }) => ({
  staticData,
  loading: loading.effects['staticData/fetchStaticDataList'],
}))
export default class StaticData extends React.PureComponent {
  state = {
    editStaticDataVisible: false, // 修改的Modal
    editId: '', // 当前修改的数据
  };
  componentDidMount() {
    this.loadPage();
  }
  loadPage = (p = 0, ps = 10) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'staticData/fetchStaticDataList',
      payload: { p, ps },
    });
  };
  tableChange = (data = {}) => {
    const { current, pageSize } = data;
    this.loadPage(current, pageSize);
  };
  deleteData = () => {
    const { state = {} } = this.tableRef;
    const { dispatch } = this.props;
    const { selectedRowKeys = [] } = state;
    if (!selectedRowKeys.length) {
      message.error('请选择要操作的数据');
      return;
    }
    dispatch({
      type: 'staticData/fetchDeleteData',
      payload: { ids: selectedRowKeys },
    }).then((res) => {
      if (res && res.status === 'OK') {
        message.success('删除成功');
        this.loadPage();
      }
    });
  };

  handleStaticData = (id) => {
    this.setState({ editStaticDataVisible: true, editId: id || '' });
  };
  closeModal = () => {
    this.setState({ editStaticDataVisible: false });
  };
  tableRef = {};
  render() {
    const extralContent = (
      <div>
        <Popconfirm
          placement="top"
          title="确定删除?"
          onConfirm={this.deleteData}
          okText="确定"
          cancelText="取消"
        >
          <Button className="margin-left-10" type="primary">
            批量删除
          </Button>
        </Popconfirm>
        <Button
          className="margin-left-10"
          type="primary"
          onClick={() => {
            this.handleStaticData();
          }}
        >
          新增
        </Button>
      </div>
    );
    const columns = [
      {
        title: '数据名',
        dataIndex: 'paramName',
      },
      {
        title: '数据编码',
        dataIndex: 'paramCode',
      },
      {
        title: '数据值',
        dataIndex: 'paramVal',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 70,
        render: (data) => {
          return (
            <a
              onClick={() => {
                this.handleStaticData(data);
              }}
            >
              <Icon type="edit" className="margin-right-5" />
              编辑
            </a>
          );
        },
      },
    ];
    const {
      staticData: { staticDataList = {} },
      loading = false,
    } = this.props;
    const { editStaticDataVisible = false, editId = '' } = this.state;
    const modalProps = {
      closeModal: this.closeModal,
      onOk: this.loadPage,
      visible: editStaticDataVisible,
      editId,
    };
    return (
      <div
        className={classnames(
          'padding-left-10 padding-right-10',
          styles.userAccount,
          'bgWhite',
          'border',
          'height100'
        )}
      >
        <StandardTable
          ref={(ele) => {
            this.tableRef = ele;
          }}
          loading={loading}
          extralContent={extralContent}
          showTableHeader="true"
          checkable
          listName="静态数据列表"
          columns={columns}
          data={staticDataList}
          onChange={this.tableChange}
          cutHeight="250"
        />
        {editStaticDataVisible && <EditStaticDataModal {...modalProps} />}
      </div>
    );
  }
}
