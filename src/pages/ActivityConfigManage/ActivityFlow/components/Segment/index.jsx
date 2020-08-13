// 名单信息设置
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Tabs } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import SegmentChoose from './SegmentChoose';
import commonStyles from '../../common.less';
import styles from './index.less';
import { uniqueArray } from '@/utils/formatData';

@connect(({ activityFlowContact }) => ({
  activityFlowContact,
}))
class Segment extends React.Component {
  tabsData = [
    {
      tabKey: 'red',
      tabName: formatMessage({ id: 'activityConfigManage.contact.redList' }), // '红名单'
    },
    {
      tabKey: 'black',
      tabName: formatMessage({ id: 'activityConfigManage.contact.blackList' }), // '黑名单'
    },
    // {
    //   tabKey: 'white',
    //   tabName: formatMessage({ id: 'activityConfigManage.contact.whiteList' }), // '白名单'
    // },
    // {
    //   tabKey: 'testContact',
    //   tabName: formatMessage({ id: 'activityConfigManage.contact.testContactInfo' }), // '测试名单'
    // },
  ];

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'red', // 选中tab:red,white,black,testContact
      segmentChooseVisible: false,
      // 选中的规则，名字对应tabKey加List
    };
  }

  componentDidMount() {
    const { processId } = this.props;
    // 如果有processId则去请求之前保存数据
    if (processId) {
      this.qryMccProcessSegmentRel();
    }
  }

  /**
   *
   *查询环节之前保存接入数据
   * @memberof Segment
   */
  qryMccProcessSegmentRel = () => {
    const { dispatch, processId } = this.props;
    dispatch({
      type: 'activityFlowContact/qryMccProcessSegmentRel',
      payload: {
        processId,
      },
    });
  };

  /**
   *
   *选择弹窗选择规则
   * @memberof Segment
   */
  addSegment = () => {
    this.setState({ segmentChooseVisible: true });
  };

  /**
   *选中规则返回
   *
   * @memberof Segment
   */
  onOk = values => {
    const { activeKey } = this.state;
    const { dispatch, activityFlowContact } = this.props;
    const newArr = uniqueArray([...activityFlowContact[`${activeKey}List`], values]);
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        [`${activeKey}List`]: newArr,
      },
    });
    this.setState({
      segmentChooseVisible: false,
    });
  };

  /**
   *
   *删除已有规则
   * @memberof Segment
   */
  deleteSegment = (type, id) => {
    const { dispatch, activityFlowContact } = this.props;
    const arr = activityFlowContact[`${type}List`];
    const newArr = arr.filter(item => item.id != id);
    dispatch({
      type: 'activityFlowContact/save',
      payload: {
        [`${type}List`]: newArr,
      },
    });
  };

  /**
   *
   *tab切换
   * @memberof Segment
   */
  tabChange = tab => {
    this.setState({ activeKey: tab });
  };

  render() {
    const { activityFlowContact } = this.props;
    const { activeKey, segmentChooseVisible } = this.state;
    let segmentType;
    switch (activeKey) {
      case 'red': {
        segmentType = 103;
        break;
      }
      case 'black': {
        segmentType = 104;
        break;
      }
      default: {
        break;
      }
    }
    const SegmentChooseProps = {
      visible: segmentChooseVisible,
      onCancel: () => {
        this.setState({ segmentChooseVisible: false });
      },
      onOk: this.onOk,
      segmentType,
    };

    return (
      <Fragment>
        {segmentChooseVisible && <SegmentChoose {...SegmentChooseProps} />}
        <div className={commonStyles.block}>
          <p className={commonStyles.title}>
            {formatMessage({ id: 'activityConfigManage.contact.listInformation' })}
          </p>
          <Tabs
            size="small"
            activeKey={activeKey}
            tabBarExtraContent={
              <Button type="primary" size="small" onClick={this.addSegment}>
                {formatMessage({ id: 'common.table.status.new' })}
              </Button>
            }
            onChange={this.tabChange}
          >
            {this.tabsData.map(item => {
              return (
                <Tabs.TabPane tab={item.tabName} key={item.tabKey}>
                  <Table
                    rowKey="segmentid"
                    className={styles.borderTable}
                    dataSource={activityFlowContact[`${item.tabKey}List`]}
                    columns={[
                      {
                        title: formatMessage({ id: 'activityConfigManage.contact.segment' }), // '表名称',
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: formatMessage({ id: 'common.table.action' }),
                        dataIndex: 'id',
                        key: 'id',
                        render: id => (
                          <a onClick={this.deleteSegment.bind(this, item.tabKey, id)}>
                            {formatMessage({ id: 'common.table.action.delete' })}
                          </a>
                        ),
                      },
                    ]}
                  />
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

export default Segment;
