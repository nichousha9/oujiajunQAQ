import React, { useEffect } from 'react';
import { connect } from 'dva';
import DetailCard from './components/DetailCard';
import InputSrcModal from './components/InputSrcModal';
import OutputAttrDetailModal from './components/OutputAttrDetailModal';
import style from './index.less';

const mapStateToProps = ({ configDetail }) => ({
  isShowAddEventModal: configDetail.isShowAddEventModal,
  isShowOutputAttrForm: configDetail.isShowOutputAttrForm,
});

function ConfigDetail(props) {
  const { isShowAddEventModal, isShowOutputAttrForm, dispatch } = props;

  // 清除 state
  function initState() {
    dispatch({
      type: 'configDetail/initState',
    });
  }

  // 清除 state
  useEffect(() => initState, []); // 第二个参数用来限制 update 钩子函数的执行，但是无法阻止 DidMount ，和 UnMount 的执行

  return (
    <div className={style.configDetail}>
      <DetailCard />
      {isShowAddEventModal ? <InputSrcModal /> : null}
      {isShowOutputAttrForm === 'add' ? <OutputAttrDetailModal /> : null}
    </div>
  );
}

export default connect(mapStateToProps)(ConfigDetail);
