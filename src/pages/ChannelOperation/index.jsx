import React, { Component } from 'react';
import { connect } from 'dva';
import ChannelList from './components/channel/index';
import OperationBitForm from './components/operation/OperationForm';
import style from './index.less';

@connect(({ operationBitList }) => ({
  showOperationBitForm: operationBitList.showForm,
}))
class ChannelOperation extends Component {
  render() {
    const { showOperationBitForm } = this.props;

    return (
      <section className={style.ChannelOperationContainer}>
        <ChannelList />
        {showOperationBitForm ? <OperationBitForm /> : null}
      </section>
    );
  }
}

export default ChannelOperation;
