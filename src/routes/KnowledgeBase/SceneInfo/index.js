/* eslint-disable react/no-unused-state */
import React from 'react';
import {Row, Col, Divider, Radio} from 'antd';
import SceneDialogSetting from '../SceneDialogSetting';
import SceneEntity from '../SceneEntity';
import styles from './index.less'
import SceneIntention from "../SceneIntention/index";
import LexiconManagement from "../LexiconManagement/lexiconManagement";

import ModelTraining from '../ModelTraining'

export default class SceneInfo extends React.Component {
  state = {
    flag: '2',
    dialogDisplay: false,
    intentionDisplay: true,
    entityDisplay: false,
    lexiconDisplay:false,
    robotChatDisplay: false,
    sceneTraining:false,
    modelTrainingDisplay:false,
  };

  changeView(e) {
    const flag = e.target.value;
    this.setState({
      flag,
      dialogDisplay: flag === '1',
      intentionDisplay: flag === '2',
      entityDisplay: flag === '3',
      lexiconDisplay:flag === '4',
      robotChatDisplay: flag === '5',
      modelTrainingDisplay:flag === '6',
    });
  };
  render() {
    const {sceneId, changeDisplay, loading} = this.props;
    const {flag, dialogDisplay, intentionDisplay, entityDisplay,lexiconDisplay,modelTrainingDisplay} = this.state;
    const entityPros = {
      loading,
      sceneId,
    };
    const intentPros = {
      loading,
      sceneId,
    };
    const lexiconPros = {
      loading,
      sceneId,
    };
    return (
      <Row>
        <Col sm={24} xs={24}>
          <div style={{marginBottom: 20}}>
            <Row gutter={{md: 8, lg: 24, xl: 48}}>
              <Col md={24} sm={24}>
                <Radio.Group value={flag} onChange={this.changeView.bind(this)}>
                  {/* <Radio.Button value='1'>场景配置</Radio.Button> */}
                  <Radio.Button value='2'>意图管理</Radio.Button>
                  {/* <Radio.Button value="3">实体</Radio.Button> */}
                  <Radio.Button value="4">名词管理</Radio.Button>
                  {/* <Radio.Button value="5">聊天对话</Radio.Button> */}
                  <Radio.Button value="6">模型训练</Radio.Button>
                </Radio.Group>
                <Divider className={styles.divi} type="vertical" />
                <div className={styles.perv} onClick={changeDisplay}> 返回上一级</div>
                {/* <Button className="margin-left-10 floatRight" onClick={this.handleBotsceneTrain} type="primary" disabled={sceneTraining} >场景训练</Button> */}
              </Col>
            </Row>
          </div>
          {dialogDisplay && <SceneDialogSetting sceneId={sceneId} closeSetting={changeDisplay} />}
          {entityDisplay && <SceneEntity {...entityPros} />}
          {intentionDisplay && <SceneIntention {...intentPros} />}
          {lexiconDisplay && <LexiconManagement {...lexiconPros} />}
          {/* {robotChatDisplay && <RobotChat sceneId={sceneId} />} */}
          {modelTrainingDisplay  && <ModelTraining sceneId={sceneId} />}
        </Col>
      </Row>
    );
  }
}
