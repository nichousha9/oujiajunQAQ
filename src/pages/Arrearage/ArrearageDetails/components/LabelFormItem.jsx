import React from 'react';

function LabelFormItem({ title, children }) {
  return (
    <div className="item">
      <span style={{ marginRight: 10 }}>{title}</span>
      {children}
    </div>
  );
}

export default LabelFormItem;
