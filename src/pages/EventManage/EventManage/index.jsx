import React from 'react';
import { connect } from 'dva';
import ListContainer from './components/ListContainer';
import DetailFormModal from './components/DetailFormModal';
import style from './index.less';

const mapStateToProps = ({ eventManageComm }) => ({
  isShowDetailForm: eventManageComm.isShowDetailForm,
});

function EventManage(props) {
  const { isShowDetailForm } = props;

  return (
    <div className={style.eventManage}>
      <ListContainer />
      {(isShowDetailForm === 'add' || isShowDetailForm === 'edit') && <DetailFormModal />}
    </div>
  );
}

export default connect(mapStateToProps)(EventManage);
