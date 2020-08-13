import React from 'react';
import router from 'umi/router';
import { Card, Form, Input, Row, Col, Table, Divider, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './index.less';
const { TextArea } = Input;
const FormItem = Form.Item;

const formNameAndTypeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
    md: { span: 14 },
  },
};
const formDescLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 14 },
  },
};

function NewTem(props) {
  const {
    form: { getFieldDecorator },
  } = props;
  // 返回上一页
  function goback() {
    router.push({
      pathname: '/activityApproval/approvalTemplate',
      state: {
        type: 'cancel',
      },
    });
  }
  // 保存新增模版
  function saveTem() {}

  const columns = [
    {
      title: '角色ID',
      dataIndex: 'userID',
      key: 'userID',
      render: text => <a>{text}</a>,
    },
    {
      title: '角色名称',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '默认步骤',
      dataIndex: 'defaultStep',
      key: 'defaultStep',
    },
    {
      title: '默认审批人',
      dataIndex: 'defaultApprover',
      key: 'defaultApprover',
    },
    {
      title: '审批人可否编辑',
      dataIndex: 'ifApproverCanEdit',
      key: 'ifApproverCanEdit',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>Invite {record.name}</a>
          <Divider type="vertical" />
          <a>Delete</a>
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  // 导航右侧菜单
  const topRightDiv = (
    <div>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          saveTem();
        }}
      >
        {formatMessage(
          {
            id: 'activityApproval.approvalTemplate.save',
          },
          '保存',
        )}
      </Button>
      <Button
        size="small"
        onClick={() => {
          goback();
        }}
        style={{ marginLeft: 8 }}
      >
        {formatMessage(
          {
            id: 'activityApproval.approvalTemplate.cancel',
          },
          '取消',
        )}
      </Button>
    </div>
  );

  return (
    <div className={styles.newTemWrapper}>
      <Card title="添加模版" className={styles.newTem} extra={topRightDiv}>
        <span className={styles.modalDeatil}>模版细节</span>
        <Form>
          <Row>
            {/* 模版名称 */}
            <Col span={9} className={styles.ruleNameAndType}>
              <FormItem
                {...formNameAndTypeLayout}
                label={formatMessage(
                  { id: 'activityApproval.approvalTemplate.modalName' },
                  '模版名称',
                )}
              >
                {getFieldDecorator('groupName', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        { id: 'activityApproval.approvalTemplate.EnterModalName' },
                        '请输入规则名称',
                      ),
                    },
                    {
                      max: 60,
                      message: formatMessage(
                        { id: 'activityApproval.approvalTemplate.MaxEnterLen' },
                        '输入最大长度为60',
                      ),
                    },
                  ],
                })(
                  <Input
                    size="small"
                    placeholder={formatMessage(
                      { id: 'activityApproval.approvalTemplate.pleaseEnter' },
                      '请输入',
                    )}
                  />,
                )}
              </FormItem>
            </Col>
            {/* 默认模版 */}
            <Col span={9} className={styles.ruleNameAndType}>
              <FormItem
                {...formNameAndTypeLayout}
                label={formatMessage(
                  { id: 'activityApproval.approvalTemplate.defaultTem' },
                  '默认模版',
                )}
              >
                {getFieldDecorator('groupType', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage(
                        { id: 'activityApproval.approvalTemplate.EnterDefaultTem' },
                        '请输入默认模版',
                      ),
                    },
                  ],
                })(
                  <Input
                    size="small"
                    placeholder={formatMessage(
                      { id: 'activityApproval.approvalTemplate.pleaseEnter' },
                      '请输入',
                    )}
                  />,
                )}
              </FormItem>
            </Col>
            {/* remark */}
          </Row>
          <Row className={styles.ruleDesc}>
            <FormItem
              {...formDescLayout}
              label={formatMessage({ id: 'activityApproval.approvalTemplate.remark' }, '备注')}
            >
              {getFieldDecorator('groupDesc', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      { id: 'activityApproval.approvalTemplate.EnterRemark' },
                      '请输入备注',
                    ),
                  },
                  {
                    max: 240,
                    message: formatMessage(
                      { id: 'activityApproval.approvalTemplate.maxEnterTextAreaLen' },
                      '输入最大长度为240',
                    ),
                  },
                ],
              })(
                <TextArea
                  size="small"
                  placeholder={formatMessage(
                    { id: 'activityApproval.approvalTemplate.pleaseEnter' },
                    '请输入',
                  )}
                  rows={2}
                />,
              )}
            </FormItem>
          </Row>
        </Form>
        <span className={styles.rulesDeatil}>Arrpoval角色</span>
        <Table
          columns={columns}
          dataSource={data}
          footer={() => (
            <Button type="primary" size="small">
              添加角色
            </Button>
          )}
          pagination={false}
        />
      </Card>
    </div>
  );
}
export default Form.create()(NewTem);
