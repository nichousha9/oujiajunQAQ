import React from 'react';
import { Col, List, Tooltip, Badge } from 'antd';
import { Link } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import Iconfont from '@/components/Iconfont';
import styles from '../index.less';

function OfferList(props) {
  const {
    offerList
  } = props;

  const cmdState = {
    I: <Badge status="default" text={formatMessage({ id: 'marketingMonitor.initial' }, '初始')} />,
    A: <Badge status="processing" text={formatMessage({ id: 'marketingMonitor.active' }, '激活')} />,
    R: <Badge status="error" text={formatMessage({ id:  'marketingMonitor.return' }, '回退')} />,
  };

  const formatComments = comment => {
    if(!comment) {
      return '';
    } 
    if(comment.length > 14) {
      return `${comment.substring(0, 14)}...`; 
    }
    return comment;
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={offerList}
      renderItem={item => (
        <List.Item key={item.offerId}>
          <Col span={9}>
            <List.Item.Meta
              avatar={
                <div className="left-lmg">
                  <Iconfont type="iconhuodong" />
                </div>
              }
              title={
                <div className={styles.deepColor}>
                  <Tooltip placement="topLeft" title={item.offerName}>
                    <Link
                      to={{
                        pathname: '/commodityManage/commodityView',
                        query: {
                          fold: item.fold,
                          offerName: item.offerName,
                          offerId: item.offerId,
                          actionType: 'view',
                          zsmartOfferCode: item.zsmartOfferCode, // ---- 商品编码 ----
                        },
                      }}
                    >
                      {item.offerName}
                    </Link>
                  </Tooltip>
                </div>
              }
            />
          </Col>
          <Col span={6}>
            <List.Item.Meta
              description={
                <Tooltip placement="topLeft" title={item.comments}>
                  <div className={styles.deepColor}>{formatComments(item.comments)}</div>
                </Tooltip>
              }
            />
          </Col>
          <Col span={6}>
            <List.Item.Meta
              title={
                <div className={styles.lightColor}>
                  {formatMessage({ id: 'commodityManage.name.offerCode' }, '商品编码')}
                </div>
              }
              description={
                <Tooltip placement="topLeft" title={item.zsmartOfferCode}>
                  <div className={styles.deepColor}>{item.zsmartOfferCode}</div>
                </Tooltip>
              }
            />
          </Col>
          <Col span={5}>
            <List.Item.Meta
              title={
                <div className={styles.lightColor}>
                  {formatMessage({ id: 'commodityManage.name.offerStatus' }, '商品状态')}
                </div>
              }
              description={<div className={styles.deepColor}>{cmdState[item.state]}</div>}
            />
          </Col>
        </List.Item>
      )}
    />
  );
}

export default OfferList;