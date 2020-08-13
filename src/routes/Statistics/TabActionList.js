/* eslint-disable react/no-unused-state */
import React from 'react';
import { connect } from 'dva';
import CommonDatePicker from '../../components/CommonDatePicker';
import CommonSelect from '../../components/CommonSelect';
import { getAgentAtuhList, getOrgStaticCode, getOrganskills } from '../../services/api';
import { getAllOrgan } from '../../services/systemSum';
import CommonTreeSelect from '../../components/CommonTreeSelect';
// import CommonModalOrgan from '../../components/CommonModalOrgan';

@connect(({ statisticBasicIndex }) => statisticBasicIndex)
export default class TabActionList extends React.Component {
  state = {
    channelList: [],
    userList: [],
    skillList: [],
    skillUserList: [],
  };
  componentDidMount() {
    const { curUserOrganList, dispatch } = this.props;
    if (curUserOrganList && curUserOrganList.length) {
      dispatch({
        type: 'statisticBasicIndex/saveSaticBasic',
        payload: { organid: curUserOrganList[0].id },
      });
      getAgentAtuhList({ status: 1 }).then((res) => {
        if (res.status === 'OK') this.setState({ userList: res.data, skillUserList: res.data });
      });
      getOrganskills({ status: 1 }).then((res) => {
        if (res.status === 'OK') this.setState({ skillList: res.data });
      });
      getOrgStaticCode({ pcode: 'com.dic.channel.type' }).then((res) => {
        this.setState({ channelList: res.data });
      });
    }
  }

  onLoadData = (treeNodeProps) => {
    return new Promise((resolve) => {
      getAllOrgan({ parent: treeNodeProps.id }).then((res) => {
        resolve(res.data);
      });
    });
  };
  handleAgentnoChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticBasicIndex/saveSaticBasic',
      payload: { agentno: e },
    });
  };
  handleChannelChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticBasicIndex/saveSaticBasic',
      payload: { channel: e },
    });
  };
  handleSkillUserChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticBasicIndex/saveSaticBasic',
      payload: { skillUser: e },
    });
  };
  handleSkillChange = (e) => {
    const { dispatch } = this.props;
    getAgentAtuhList({ status: 1, skillid: e }).then((res) => {
      if (res.status === 'OK') this.setState({ skillUserList: res.data });
    });
    dispatch({
      type: 'statisticBasicIndex/saveSaticBasic',
      payload: { skillid: e },
    });
  };
  handleTimeChange = (time = []) => {
    const { dispatch } = this.props;
    const starttime = new Date(time[0]).getTime() || '1527091200000';
    const endtime = new Date(time[1]).getTime() || '1527145200000';
    const status = endtime - starttime + 1000 >= 1000 * 60 * 60 * 24 ? 1 : 0;
    dispatch({
      type: 'statisticBasicIndex/saveSaticBasic',
      payload: {
        starttime,
        endtime,
        status,
      },
    });
  };
  organChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statisticBasicIndex/saveSaticBasic',
      payload: { organid: value },
    });
  };
  render() {
    const { activeKey, curUserOrganList } = this.props;
    const { skillList, skillUserList } = this.state;
    return (
      <div>
        <div style={{ display: 'inline-flex' }}>
          <div
            style={{ display: activeKey === 4 ? 'inline-block' : 'none', marginTop: '-5px' }}
            className="margin-left-10"
          >
            <CommonTreeSelect
              style={{ width: '100%' }}
              onChange={this.organChange}
              treeCheckStrictly
              // value={area}
              myDefaultValue={curUserOrganList && curUserOrganList[0] && curUserOrganList[0].id}
              // treeCheckable="true"
              loadCallBack={this.onLoadData}
              treeData={curUserOrganList}
              nofilter="true"
              type={{ name: 'name', value: 'id' }}
              placeholder="请选择部门"
              ref={(ele) => {
                this.treeRef = ele;
              }}
            />
            {/* <CommonModalOrgan  
              {...this.showOrgan}              
              isForce 
              onChange={this.organChange} 
              noWidth 
              curUserOrganList={curUserOrganList} 
              checkable={false}
            /> */}
          </div>

          {/* <CommonSelect
            style={{ display:activeKey !==2? 'inline-block' : 'none'}}
            className="margin-left-10"
            defaultValue=""
            unknownText="所有渠道"
            addUnknown
            onChange={this.handleChannelChange}
            optionData={{datas: channelList}}
          /> */}

          <CommonSelect
            style={{ display: activeKey === 2 ? 'inline-block' : 'none' }}
            className="margin-left-10"
            defaultValue=""
            unknownText="所有分组"
            addUnknown
            onChange={this.handleSkillChange}
            optionData={{ datas: skillList }}
          />
          <CommonSelect
            style={{ display: activeKey === 2 ? 'inline-block' : 'none' }}
            className="margin-left-10"
            defaultValue=""
            unknownText="所有客服"
            addUnknown
            onChange={this.handleSkillUserChange}
            optionData={{ datas: skillUserList, optionName: 'nickname' }}
          />
          <CommonDatePicker getDataPickerDate={this.handleTimeChange} className="margin-left-10" />
        </div>
      </div>
    );
  }
}
