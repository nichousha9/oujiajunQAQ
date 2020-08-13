import React, { Component } from 'react';
import { Row, Col } from 'antd';
import LabelTreeCard from './LabelTreeCard';
import MyList from './myList';
import styles from './index.less';
import CreativeCreate from './creativeCreate';

export default class CreativeIdeaManage extends Component {
  state = {
    curTreeNode: {},
    curCreateType: '', // 为空隐藏 1.图文 2.文字 3.html
    isEdit: false, // 是否为编辑
    creativeRecord: {}, // 当前选择的创意列表项的信息
    isDetail: false, // 是否为查看
  };

  setCurGrpInfo = node => {
    this.setState({
      curTreeNode: node,
    });
  };

  setCreateType = curCreateType => {
    this.setState({
      curCreateType,
    });
  };

  restoreCreativeRecord = creativeRecord => {
    this.setState({
      creativeRecord,
    });
  };

  render() {
    const { curTreeNode, curCreateType, isEdit, creativeRecord, isDetail } = this.state;
    return (
      <div className={styles.wrapper}>
        {!curCreateType && !isEdit && !isDetail ? (
          <Row type="flex" gutter={16} className="common-list-wrapper">
            <Col span={5}>
              <LabelTreeCard setCurGrpInfo={this.setCurGrpInfo} />
            </Col>
            <Col span={19}>
              <MyList
                changeEdit={v => {
                  this.setState({ isEdit: v });
                }}
                changeDetail={v => {
                  this.setState({ isDetail: v });
                }}
                curTreeNode={curTreeNode}
                setCreateType={this.setCreateType}
                restoreCreativeRecord={this.restoreCreativeRecord}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <CreativeCreate
              curTreeNode={curTreeNode}
              curCreateType={curCreateType}
              setCreateType={this.setCreateType}
              creativeRecord={creativeRecord}
              restoreCreativeRecord={this.restoreCreativeRecord}
              isEdit={isEdit}
              isDetail={isDetail}
              changeEdit={v => {
                this.setState({ isEdit: v });
              }}
              changeDetail={v => {
                this.setState({ isDetail: v });
              }}
            />
          </Row>
        )}
      </div>
    );
  }
}
