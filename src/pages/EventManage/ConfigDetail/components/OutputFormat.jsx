import React, { useState } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';
import FormatConfig from './FormatConfig';
import OutputAttr from './OutputAttr';

const mapStateToProps = () => ({});

function OutputFormat() {
  // 表示单选框选中哪个，以渲染不同的组件
  const [selected, setSelected] = useState('formatConfig');

  // 改变选中项
  function changeSelected(e) {
    setSelected(e.target.value);
  }

  return (
    <div>
      <Radio.Group defaultValue="formatConfig" onChange={changeSelected}>
        <Radio.Button value="formatConfig">格式配置</Radio.Button>
        <Radio.Button value="outputAttr">输出属性</Radio.Button>
      </Radio.Group>
      {(selected === 'formatConfig' && <FormatConfig />) ||
        (selected === 'outputAttr' && <OutputAttr />)}
    </div>
  );
}

export default connect(mapStateToProps)(OutputFormat);
