import React, { useEffect } from 'react';
import { connect } from 'dva';
import DetailCard from './components/DetailCard';
import AddInputAttr from './components/AddInputAttr';
import style from './index.less';

const mapStateToProps = ({ srcConfigDetail }) => ({
  isShowInputAttrForm: srcConfigDetail.isShowInputAttrForm,
});

function ConfigDetail(props) {
  const { isShowInputAttrForm, dispatch } = props;

  // 清除 state
  function initState() {
    dispatch({
      type: 'srcConfigDetail/initState',
    });
  }

  // 清除 state
  useEffect(() => initState, []); // 第二个参数用来限制 update 钩子函数的执行，但是无法阻止 DidMount ，和 UnMount 的执行

  return (
    <div className={style.srcConfigDetail}>
      <DetailCard />
      {isShowInputAttrForm === 'add' && <AddInputAttr />}
    </div>
  );
}

export default connect(mapStateToProps)(ConfigDetail);
