import React, { Component } from 'react';
import CardList from '../../components/CardList';
import JurisdictionCardList from '../../components/JurisdictionCardList';
// import ShareKnowledge from './ShareKnowledge';
// eslint-disable-next-line import/first
import { connect } from 'dva';

@connect(({ knowledgeGallery, loading }) => ({
  knowledgeGallery,
  loading: loading.models.knowledgeGallery,
}))
export default class Knowledgebase extends Component {
  state = {
    jurisdiction: true,
    share: 0,
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({ share: location.share === undefined ? 0 : location.share });
    const user = localStorage.getItem('smartim-user') || '{}';
    if (user !== '{}') {
      const { roleList } = JSON.parse(user);
      const jurisdiction = roleList.some((item) => item.code === 'ORGI_ADMIN');
      this.setState({ jurisdiction });
    }
  }

  render() {
    const { jurisdiction, share } = this.state;
    return <div>{jurisdiction ? <JurisdictionCardList /> : <CardList share={share} />}</div>;
  }
}
