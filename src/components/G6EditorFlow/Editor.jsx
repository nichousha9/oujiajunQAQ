import React from 'react';
import G6Editor from '@antv/g6-editor';


class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: {}, // 当前选中项数据模型
      curZoom: 1, // 当前缩放比率
      minZoom: 0.5, // 最小缩放比率
      maxZoom: 2 // 最大缩放比率
    };
  }
  changeZoom(zoom) {
    const page = this.page;
    page.zoom(zoom);
  }
  toggleGrid(ev) {
    const page = this.page;
    if (ev.target.checked) {
      page.showGrid();
    } else {
      page.hideGrid();
    }
  }
  updateGraph(key, value) {
    const editor = this.editor;
    editor.executeCommand(() => {
      const page = this.page;
      const selectedItems = page.getSelected();
      selectedItems.forEach(item => {
        const updateModel = {};
        updateModel[key] = value;
        page.update(item, updateModel);
      });
    });
  }
  componentDidMount() {
    // 生成 G6 Editor 编辑器
    const height = window.innerHeight - 255;
    const editor = new G6Editor();
    const itempannel = new G6Editor.Itempannel({
      container: 'itempannel',
    });
    const toolbar = new G6Editor.Toolbar({
      container: 'toolbar',
    });
    const page = new G6Editor.Flow({
      graph: {
        container: 'g6page',
        height
      },
      align: {
        grid: true
      },
      noEndEdge: false,
      edgeResizeable: false
    });
    page.on('afteritemselected', ev => {
      this.setState({
        selectedModel: ev.item.getModel(),
      });
    });
    page.on('afterzoom', ev => {
      this.setState({
        curZoom: ev.updateMatrix[0],
      });
    });
    editor.add(itempannel);
    editor.add(toolbar);
    editor.add(page);
    this.page = page;
    this.editor = editor;
  }
}

export default Editor;
