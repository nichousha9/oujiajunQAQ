import React from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import Catalogue from './Catalogue';
import EventList from './EventList';
import style from '../index.less';

const mapStateToprops = () => ({});

function ListContainer(props) {
  const { dispatch } = props;

  // 目录树
  function getNodeInfo(pathCode) {
    dispatch({
      type: 'eventManage/changePathCode',
      payload: pathCode,
    });
  }

  return (
    <div className={style.listContainer}>
      <Row type="flex" gutter={16}>
        <Col span={5}>
          <Catalogue getNodeInfo={getNodeInfo} />
        </Col>
        <Col span={19}>
          <EventList />
        </Col>
      </Row>
    </div>
  );
}

export default connect(mapStateToprops)(ListContainer);
