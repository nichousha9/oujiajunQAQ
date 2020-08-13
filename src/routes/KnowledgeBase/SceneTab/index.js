import React from 'react';
import {Row} from 'antd';
import SceneList from '../SceneList';
import SceneInfo from '../SceneInfo';
import SceneDialogSetting from '../SceneDialogSetting';

export default class SceneTab extends React.Component {
  state = {
    listDisplay: true,
    infoDisplay: false,
    showSet:false,
    setItem:{},
    sceneId: '',
  };

  changeDisplay(sceneId) {
    // 更改显示视图
    this.setState({
      listDisplay: !this.state.listDisplay,
      infoDisplay: !this.state.infoDisplay,
      sceneId,
    });
  };
  closeSetting = () =>{
    // item 是当前的对话信息;
    // 更改显示视图
    this.setState({
      listDisplay: false,
      infoDisplay: true,
      showSet: false,
      setItem:{},
    });
  }
  showSetting =(item)=>{
    // item 是当前的对话信息;
    // 更改显示视图
    this.setState({
      listDisplay: false,
      infoDisplay: false,
      showSet: true,
      setItem:item,
    });
  }
  render() {
    const {loading} = this.props;
    const {listDisplay, infoDisplay, showSet,sceneId,setItem} = this.state;
    const listProps = {
      sceneId,
      loading,
      changeDisplay:this.changeDisplay.bind(this),
    };
    const infoProps = {
      sceneId,
      loading,
      changeDisplay:this.changeDisplay.bind(this),
      showSetting:this.showSetting,
    };
    return (
      <div className="selfAdapt" style={{height:'auto'}} >
        <Row>
          {listDisplay && <SceneList {...listProps} />}
          {infoDisplay && <SceneInfo {...infoProps} />}
          {showSet && <SceneDialogSetting sceneId={sceneId} setItem={setItem} closeSetting={this.closeSetting} />}
        </Row>
      </div>
    );
  }
}
