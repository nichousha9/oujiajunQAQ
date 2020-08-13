import React from 'react';
import { connect } from 'dva';
import ListContainer from './components/ListContainer';
import DetailFormModal from './components/DetailFormModal';
import style from './index.less';

const mapStateToProps = ({ eventSrcComm }) => ({
  isShowDetailForm: eventSrcComm.isShowDetailForm,
});

function EventSrc(props) {
  const { isShowDetailForm } = props;

  return (
    <div className={style.eventSrc}>
      <ListContainer />
      {(isShowDetailForm === 'add' || isShowDetailForm === 'edit') && <DetailFormModal />}
    </div>
  );
}

export default connect(mapStateToProps)(EventSrc);
