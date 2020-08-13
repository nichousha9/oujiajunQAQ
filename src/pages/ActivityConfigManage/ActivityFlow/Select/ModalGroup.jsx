/**
 * select分组选择弹框 组件
 * props: {
 *  visible 是否可见
 *  onCancel 关闭弹框函数
 * }
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Button, Table } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import commonStyles from '../common.less';
import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

const columns = [
  {
    title: formatMessage({ id: 'activityConfigManage.select.groupName' }),
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: formatMessage({ id: 'activityConfigManage.select.groupNum' }),
    dataIndex: 'segmentcount',
    key: 'segmentcount',
  },
  {
    title: formatMessage({ id: 'activityConfigManage.select.groupDesc' }),
    dataIndex: 'description',
    key: 'description',
  },
];

@connect(({ loading, activitySelect }) => ({
  loading: loading.effects['activitySelect/qryMccSegmentInfo'],
  selectSegment: activitySelect.selectSegment,
}))
@Form.create()
class ModalGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: {
        list: [],
      },
      selectedRowKeys: '',
    };
    this.pageInfo = {
      pageSize: 5,
      pageNum: 1,
    };
    this.selectSegment = '';
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.props;
    if (!visible && nextProps.visible) {
      this.qryMccSegmentInfo();
    }
  }

  // 获取标签列表，flag 是否重置搜索名称
  qryMccSegmentInfo = flag => {
    const { dispatch, form, selectSegment } = this.props;
    const resetFlag = flag === true;
    if (resetFlag) {
      form.setFieldsValue({
        segmentName: '',
      });
    }
    dispatch({
      type: 'activitySelect/qryMccSegmentInfo',
      payload: {
        segmentName: resetFlag ? '' : form.getFieldValue('segmentName'),
        pageInfo: { ...this.pageInfo },
      },
      callback: res => {
        this.setState({
          groupInfo: {
            list: res.data,
            pageSize: res.pageInfo.pageSize,
            total: res.pageInfo.total,
            pageNum: res.pageInfo.pageNum,
          },
          selectedRowKeys: (selectSegment && selectSegment.map(item => item.segmentid)) || '',
        });
        this.selectSegment = selectSegment;
      },
    });
  };

  // 表格交互
  handleTableChange = pagination => {
    this.pageInfo.pageNum = pagination.current;
    this.pageInfo.pageSize = pagination.pageSize;
    this.qryMccSegmentInfo();
  };

  // 提交
  handleSubmit = () => {
    const { dispatch, onCancel } = this.props;
    // 更新选中的分组
    dispatch({
      type: 'activitySelect/save',
      payload: {
        selectSegment: this.selectSegment,
      },
    });
    onCancel();
  };

  render() {
    const { visible, form, onCancel, loading } = this.props;
    const { groupInfo, selectedRowKeys } = this.state;

    const pagination = {
      total: groupInfo.total,
      pageSize: groupInfo.pageSize,
      current: groupInfo.pageNum,
      showQuickJumper: true,
      showSizeChanger: true,
    };

    // 切换选择
    const rowSelection = {
      onChange: (key, value) => {
        this.setState({ selectedRowKeys: key });
        this.selectSegment = value;
      },
      type: 'checkbox',
      selectedRowKeys,
    };

    return (
      <Modal
        title={formatMessage({ id: 'activityConfigManage.select.groupTitle' })}
        visible={visible}
        width={840}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        okText={formatMessage({ id: 'common.btn.submit' })}
        cancelText={formatMessage({ id: 'common.btn.back' })}
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        wrapClassName={commonStyles.flowModal}
      >
        <Form {...formItemLayout}>
          <Form.Item
            label={formatMessage({ id: 'activityConfigManage.select.groupName' })}
            className="mb10"
          >
            {form.getFieldDecorator('segmentName', {
              rules: [{ max: 20, message: '内容请控制在20个字符以内' }],
            })(
              <Input.Search
                maxLength={21}
                size="small"
                placeholder={formatMessage({ id: 'common.form.search' })}
                onSearch={this.qryMccSegmentInfo}
                className={styles.groupSearchWidth}
              />,
            )}
            <Button size="small" type="primary" className="mlr16" onClick={this.qryMccSegmentInfo}>
              {formatMessage({ id: 'common.btn.confirm' })}
            </Button>
            <Button
              size="small"
              onClick={() => {
                this.qryMccSegmentInfo(true);
              }}
            >
              {formatMessage({ id: 'common.btn.reset' })}
            </Button>
          </Form.Item>
        </Form>
        <Table
          columns={columns}
          dataSource={groupInfo.list}
          rowKey="segmentid"
          loading={loading}
          rowSelection={rowSelection}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}

export default ModalGroup;
