import React from 'react';
import { connect } from 'dva';
import { List } from 'antd';
import Iconfont from '@/components/Iconfont';
import style from '../index.less';

const mapStateToProps = ({ eventManageComm }) => ({
  itemDetail: eventManageComm.itemDetail,
});

function CardList(props) {
  const { itemDetail } = props;

  return (
    <div className={style.cardList}>
      <List
        size="small"
        dataSource={[itemDetail]}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className="left-lmg">
                  <Iconfont type="iconhuodong" />
                </div>
              }
              title={item.name}
              description={
                <span>
                  <span>描述:&nbsp;</span>
                  <span>{item.description}</span>
                </span>
              }
            />
            <List.Item.Meta
              title={<span>&nbsp;</span>}
              description={
                <span>
                  <span>商品编码:&nbsp;</span>
                  <span>{item.code}</span>
                </span>
              }
            />
            <List.Item.Meta
              title={<span>&nbsp;</span>}
              description={
                <span>
                  <span>创建时间:&nbsp;</span>
                  <span>{item.createTime}</span>
                </span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default connect(mapStateToProps)(CardList);
