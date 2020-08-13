/* eslint-disable react/jsx-no-bind */
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import classnames from 'classnames';
import { formatMessage } from 'umi-plugin-react/locale';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';
import Iconfont from '@/components/Iconfont';

const Card = ({ disabled, columnName, index, accept, moveCard, delElement, elementType, outLimit, ...args }) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      if(!monitor.canDrop()) {
        return
      }
      if(outLimit && (!dragIndex || dragIndex !== 0)) {
        return
      }
      // Determine rectangle on screen
      // const hoverBoundingRect = ref.current.getBoundingClientRect()
      // Get vertical middle
      // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      // const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      // const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      //   return
      // }
      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return
      // }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex, item)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    canDrag: !disabled,
    item: {  ...args, columnName, type: accept },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    })
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  if(elementType === 'table') {
    return (
      <div ref={ref} className={classnames(styles.tableCard, disabled ? styles.disabled : null)} style={{ opacity }}>
        <p className={styles.label}>
          <Ellipsis tooltip lines={1}>
            {columnName}
          </Ellipsis>
        </p>
        <p className={styles.value}>-</p>
        {
          !disabled ? (
            <Iconfont onClick={delElement.bind(this, index)} type='iconshanchux' className={styles.delBtn} />
          ) : null
        }
      </div>
    )
  }
  return (
    <div ref={ref} className={classnames(styles.card, disabled ? styles.disabled : null)} style={{ opacity }}>
      <span className={styles.label}>{columnName}：</span>
      <span className={styles.inputBlank}>{formatMessage({ id: 'common.form.input' })}</span>
      {
        !disabled ? (
          <Iconfont onClick={delElement.bind(this, index)} type='iconshanchux' />
        ) : null
      }
    </div>
  )
}
export default Card;
