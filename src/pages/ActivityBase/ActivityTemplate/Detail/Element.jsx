import React from 'react'
import { useDrag } from 'react-dnd';
import classnames from 'classnames';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';

const Box = (props) => {
  const { disabled, columnName, type, dragEnd, iconPath, ...args } = props;
  const [{ opacity }, drag] = useDrag({
    canDrag: !disabled,
    item: {  ...args, columnName, type },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0 : 1,
    }),
    end: dragEnd
  })
  return (
    <div ref={drag} className={classnames(styles.element, disabled ? styles.disabled : null)} style={{ opacity }}>
      <span className={styles.icon}>{iconPath ? <img src={iconPath} alt='图标' /> : null}</span>
      <Ellipsis tooltip lines={1} className={styles.text}>
        {columnName}
      </Ellipsis>
    </div>
  )
}
export default Box
