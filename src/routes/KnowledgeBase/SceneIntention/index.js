import React from 'react';
import {Menu} from 'antd';
import {getLayoutHeight}  from '../../../utils/eventUtils'
import SceneIntentionSample from './SceneIntentionSample';
import SceneIntentionTest from './SceneIntentionTest';

export default class SceneIntention extends React.Component {
  state = {
    menuId: 'sample',
    sampleVisible: true,
    testVisible: false,
  };

  handleClick = (e) => {
    this.setState({
      menuId: e.key,
      sampleVisible: e.key === 'sample',
      testVisible: e.key === 'test',
    });
  };


  render() {
    const {sceneId,loading} = this.props;
    const {menuId, sampleVisible, testVisible} = this.state;
    const height = getLayoutHeight();
    const samplePros = {
      sceneId,
      loading,
    };
    const testPros = {
      sceneId,
      loading,
    };
    return (
      <div style={{minHeight: height, border: '1px solid rgb(0,15,29,.08)'}}>
        <Menu
          onClick={this.handleClick}
          selectedKeys={[menuId]}
          mode="horizontal"
        >
           {
             /*<Menu.Item key="sample">
            样本
          </Menu.Item>
          <Menu.Item key="test">
            测试
          </Menu.Item> */}
        </Menu>
        <div>
          {sampleVisible && <SceneIntentionSample {...samplePros} />}
          {testVisible && <SceneIntentionTest {...testPros} />}
        </div>
      </div>
    );
  }
}
