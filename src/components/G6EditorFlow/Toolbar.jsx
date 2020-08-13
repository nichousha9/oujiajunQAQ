import React from 'react';
import './toolbar.less';
import './font.less'

class ToolBar extends React.Component {

  render() {
    const { handleReset } = this.props;
    return (<div id="toolbar">
      <i data-command="undo" className="command commandi iconfonttool icon-undo" title="撤销"></i>
      <i data-command="redo" className="command commandi iconfonttool icon-redo" title="重做"></i>
      <i onClick={()=>{ if(handleReset) handleReset()}}title="重置"  className="iconfont commandi icon-reset icon" />
      <span className="separator"></span>
      <i data-command="copy" className="command commandi iconfonttool icon-copy-o" title="复制"></i>
      <i data-command="paste" className="command commandi iconfonttool icon-paster-o" title="粘贴"></i>
      <i data-command="delete" className="command commandi iconfonttool icon-delete-o" title="删除"></i>
      <span className="separator"></span>
      <i data-command="zoomIn" className="command commandi iconfonttool icon-zoom-in-o" title="放大"></i>
      <i data-command="zoomOut" className="command commandi iconfonttool icon-zoom-out-o" title="缩小"></i>
      <i data-command="autoZoom" className="command commandi iconfonttool icon-fit" title="适应画布"></i>
      <i data-command="resetZoom" className="command commandi iconfonttool icon-actual-size-o" title="实际尺寸"></i>
      <span className="separator"></span>
      <i data-command="toBack" className="command commandi iconfonttool icon-to-back" title="层级后置"></i>
      <i data-command="toFront" className="command commandi iconfonttool icon-to-front" title="层级前置"></i>
      <span className="separator"></span>
      <i data-command="multiSelect" className="command commandi iconfonttool icon-select" title="多选"></i>
{/*      <i data-command="addGroup" className="command commandi iconfont icon-group" title="成组"></i>
      <i data-command="unGroup" className="command commandi iconfont icon-ungroup" title="解组"></i>*/}
    </div>);
  }
}
export default ToolBar;
