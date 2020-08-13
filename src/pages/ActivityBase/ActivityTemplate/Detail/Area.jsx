import React from 'react';
import { useDrop } from 'react-dnd';
import { message } from 'antd';
import classnames from 'classnames';
import styles from './index.less';
import Card from './Card';

const Area = ({ disabled, areaType, accept, elementType, data, onDrop, moveCard, delElement, outLimit }) => {

  const [, drop] = useDrop({
    accept,
    drop: (item, minitor) => {
      if(outLimit) {
        message.info('超过上限15');
        return
      }
      if(minitor.canDrop()){
        onDrop(areaType, item, minitor)
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  })
  // const isActive = isOver && canDrop
  // let backgroundColor = '#F6F7F8'
  // if (isActive) {
  //   backgroundColor = 'darkgreen'
  // } else if (canDrop) {
  //   backgroundColor = 'darkkhaki'
  // }

  const renderCard = (card, index) => {
    if(card){
      return (
        <Card
          {...card}
          disabled={disabled}
          key={card.columnId}
          index={index}
          accept={accept}
          moveCard={(...args) => {moveCard(areaType, ...args)}}
          delElement={(...args) => {delElement(areaType, ...args)}}
          elementType={elementType}
          outLimit={outLimit}
        />
      )
    }
    return <div key={`index${index}`} className={classnames(elementType === 'table'? styles.tableCard : styles.card, styles.blank)} />
  }
  
  return (
    <div ref={drop} className={styles.area}>
      <div className={classnames(elementType === 'table' ? styles.tableCardCon : '')}>{data.map((card, i) => renderCard(card, i))}</div>
    </div>
  )
}
export default Area;
