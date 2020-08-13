/**
 * select客户清单弹框 组件
 * props: {
 *  onCancel 关闭弹框函数
 *  processId 节点id
 * }
 */
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Form, Input, Button, Table } from 'antd';
import commonStyles from '../common.less';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

const columns = [
  {
    title: 'ID',
    dataIndex: 'field',
    key: 'field',
  },
  // {
  //   title: formatMessage({ id: 'activityConfigManage.select.phone' }),
  //   dataIndex: 'accNbr',
  //   key: 'accNbr',
  // },
  {
    title: formatMessage({ id: 'activityConfigManage.select.name' }),
    dataIndex: 'fieldName',
    key: 'fieldName',
  },
];

@connect(({ loading }) => ({
  loading: loading.effects['activitySelect/qryCustListByProcessId'],
}))
@Form.create()
class ModalCustomner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerInfo: {
        list: [],
      },
    };
    this.pageInfo = {
      pageSize: 5,
      pageNum: 1,
    };
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentDidMount() {
    this.qryCustListByProcessId();
  }

  // 获取标签列表，flag 是否重置搜索名称
  qryCustListByProcessId = flag => {
    const { dispatch, form, processId } = this.props;
    if (!processId) return;
    const resetFlag = flag === true;
    if (resetFlag) {
      form.setFieldsValue({
        phone: '',
      });
    }
    dispatch({
      type: 'activitySelect/qryCustListByProcessId',
      payload: {
        phone: resetFlag ? '' : form.getFieldValue('phone'),
        processId,
        pageInfo: { ...this.pageInfo },
      },
      callback: res => {
        this.setState({
          customerInfo: {
            list: res.data,
            pageSize: res.pageInfo.pageSize,
            total: res.pageInfo.total,
            pageNum: res.pageInfo.pageNum,
          },
        });
      },
    });
  };

  // 表格交互
  handleTableChange = pagination => {
    this.pageInfo.pageNum = pagination.current;
    this.pageInfo.pageSize = pagination.pageSize;
    this.qryCustListByProcessId();
  };

  render() {
    const { form, onCancel, loading } = this.props;
    const { customerInfo } = this.state;

    const pagination = {
      total: customerInfo.total,
      pageSize: customerInfo.pageSize,
      current: customerInfo.pageNum,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20],
    };

    const visible = true;

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.select.customerTitle' })}
        visible={visible}
        width={840}
        onCancel={onCancel}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ size: 'small' }}
        wrapClassName={commonStyles.flowModal}
      >
        <Form {...formItemLayout}>
          <Form.Item label="ID" className="mb10">
            {form.getFieldDecorator('phone', {
              rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
            })(
              <Input.Search
                maxLength={21}
                size="small"
                placeholder={formatMessage({ id: 'common.form.search' })}
                onSearch={this.qryCustListByProcessId}
                className={styles.groupSearchWidth}
              />,
            )}
            <Button
              size="small"
              type="primary"
              className="mlr16"
              onClick={this.qryCustListByProcessId}
            >
              {formatMessage({ id: 'common.btn.confirm' })}
            </Button>
            <Button
              size="small"
              onClick={() => {
                this.qryCustListByProcessId(true);
              }}
            >
              {formatMessage({ id: 'common.btn.reset' })}
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={columns}
          dataSource={customerInfo.list}
          rowKey="subsId"
          loading={loading}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}

export default ModalCustomner;
