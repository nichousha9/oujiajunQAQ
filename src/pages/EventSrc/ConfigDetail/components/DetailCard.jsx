import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Card, Icon, Divider } from 'antd';
import CardList from './CardList';
import CardTabs from './CardTabs';
import style from '../index.less';

const mapStateToProps = () => ({});

function DetailCrad() {
  return (
    <Card
      className={style.detailCrad}
      title={
        <Fragment>
          <Link
            className={style.cardTitleLink}
            to={{
              pathname: '/eventSrc',
              state: {
                type: 'cancel',
              },
            }}
          >
            <Icon type="left" />
            &nbsp;
            <span>返回管理列表</span>
          </Link>
          <Divider type="vertical" />
          <span>配置详情</span>
        </Fragment>
      }
    >
      <CardList />
      <CardTabs />
    </Card>
  );
}

export default connect(mapStateToProps)(DetailCrad);
