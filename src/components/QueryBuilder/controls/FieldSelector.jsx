/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';
// import SelectFieldModal from '@/pages/createProcess/components/StepRules/SelectFieldModal';

const { Search } = Input;

class FieldSelector extends React.PureComponent {
  state = {
    conditionModalVisible: false,
  };

  showConditionModal = () => {
    this.setState({
      conditionModalVisible: true,
    });
  };

  handleConditionSelectFields = (keys, rows) => {
    const row = rows[0];
    const { fieldId } = row;

    const { handleOnChange, onValueChanged } = this.props;
    if (typeof handleOnChange === 'function') {
      handleOnChange(fieldId, row);
    }
  };

  handleConditionModalOk = modalSelectedRows => {
    this.setState({
      conditionModalVisible: false,
    });

    const { getNewData } = this.props;
    const newData = modalSelectedRows;
    if (getNewData) {
      getNewData(newData);
    }
  };

  handleConditionModalCancel = () => {
    this.setState({
      conditionModalVisible: false,
    });
  };

  onSearch = value => {
    const { id, onConditionSearch } = this.props;

    this.showConditionModal();
  };

  render() {
    const { conditionModalVisible } = this.state;
    const { id, value, options, className, handleOnChange, title, form, actionType } = this.props;

    const { getFieldDecorator } = form;
    const message = '请选择';

    return (
      <span>
        <Form.Item label="">
          {getFieldDecorator(`${id}_field`, {
            rules: [{ required: true, message }],
          })(
            actionType === 'V' ? (
              <Input
                className={className}
                type="text"
                value={value}
                disabled={actionType === 'V'}
                onChange={e => handleOnChange(e.target.value)}
              />
            ) : (
              <Search
                placeholder={message}
                className={className}
                disabled
                onSearch={this.onSearch}
              />
            ),
          )}
        </Form.Item>

        {/* <SelectFieldModal
          multiple={false}
          visible={conditionModalVisible}
          handleOk={this.handleConditionModalOk}
          handleCancel={this.handleConditionModalCancel}
          handleSelectFields={this.handleConditionSelectFields}
        /> */}
      </span>
    );
  }
}

FieldSelector.displayName = 'FieldSelector';

FieldSelector.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
  handleOnChange: PropTypes.func,
  onValueChanged: PropTypes.func,
  title: PropTypes.string,
};

export default FieldSelector;
