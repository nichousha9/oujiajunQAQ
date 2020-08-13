import React from 'react';
import classNames from 'classnames';
import { Button, Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

export default ({ className, ...rest }) => {
  const clsString = classNames(styles.submit, className);
  if(typeof(rest.children) !==  'string'){
      return  rest.children;
  }
  return (
    <FormItem>
      <Button size="large" className={clsString} type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};
