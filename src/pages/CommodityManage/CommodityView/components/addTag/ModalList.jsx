import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../../index.less';

const columns = [
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

@connect(() => ({}))
class ModalList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selecttag: {}, // 选择的标签列表item，每次保存后清空
    };
  }

  componentWillReceiveProps(nextProps) {
    const { modalVisible } = this.props;
    if (!modalVisible && nextProps.modalVisible) {
      this.getLabelInfoList();
    }
  }

  getLabelInfoList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'commodityList/getLabelInfoList',
      payload: {
        labelType: '2', // 商品标签
      },
    }).then(res => {
      if (res && res.topCont && res.topCont.resultCode === 0) {
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
        const { propsOption, changepropsOption } = this.props;
        const newoption = {};
        newoption[name] = this.dealLabelInfo(res.svcCont.data);
        changepropsOption({ ...propsOption, ...newoption });
      }
    });
  };

  dealLabelInfoList = data => {
    const { initialLabel } = this.props;
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
    initialLabel(labelInfo);
  };

  dealLabelInfo = data => {
    const valueList = data.valueList.map(item => ({
      value: item.labelValue,
      name: item.valueName,
    }));
    return valueList;
  };

  render() {
    const { modalVisible, handleSwitchGroup, labelInfo, getchooseTag } = this.props;
    const { selecttag } = this.state;
    const { tag } = selecttag;
    return (
      <Modal
        title={formatMessage({ id: 'commodityManage.name.tagList' })}
        visible={modalVisible}
        onOk={() => {
          getchooseTag(selecttag);
          this.setState({ selecttag: {} });
          handleSwitchGroup(false);
        }}
        onCancel={() => {
          // this.setState({ visible: false });
          handleSwitchGroup(false);
        }}
        centered
        width="730px"
        className={styles.tagModalStyle}
      >
        <Table
          className={styles.wrapper}
          bordered={false}
          dataSource={labelInfo}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
          }}
          onRow={rowrecord => {
            return {
              onClick: () => {
                this.setState({ selecttag: rowrecord });
              },
            };
          }}
          rowClassName={newrecord => {
            return newrecord.tag === tag ? 'clickRowStyle' : '';
          }}
        />
      </Modal>
    );
  }
}

export default ModalList;
