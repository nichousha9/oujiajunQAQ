import React from 'react';
import { Menu, Icon, Popover, Input, message, Modal } from 'antd';

const { SubMenu } = Menu;

export default class CommonMenue extends React.Component {
  state = {
    selectedKeys: [],
    menuData: [],
  };
  componentWillReceiveProps(nextProps) {
    const { menuData, selectedKeys } = nextProps;
    if (
      (JSON.stringify(selectedKeys) !== JSON.stringify(this.state.selectedKeys) &&
        !this.state.selectedKeys.length) ||
      JSON.stringify(menuData) !== JSON.stringify(this.props.menuData)
    ) {
      this.setState({ selectedKeys, menuData });
    }
  }
  onSelect = (selectKey) => {
    const { menueSelect } = this.props;
    if (menueSelect) menueSelect(selectKey.key);
    this.setState({ selectedKeys: [selectKey.key] });
  };
  editMenu = (e, menue, isCloseEdit) => {
    const { menuData } = this.state;
    let index;
    const newMenuDate = menuData.map((data, idx) => {
      if (data.id === menue.id) {
        index = idx;
        return {
          ...data,
          isEdit: !isCloseEdit,
        };
      }
      return data;
    });
    this.setState({ menuData: newMenuDate }, () => {
      if (this[`input${index}`]) {
        this[`input${index}`].focus();
      }
    });
  };
  saveMenu = (e, menue) => {
    const { emptyText = '角色名称不能为空' } = this.props;
    e.preventDefault();
    if (!e.target.value) {
      message.error(emptyText);
      return;
    }
    this.editMenu(e, menue, true);
    const { handleSaveMenue } = this.props;
    if (handleSaveMenue) handleSaveMenue({ ...menue, name: e.target.value });
  };
  deleteMenu = (menue) => {
    const { handleDeleteMenu } = this.props;
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (handleDeleteMenu) handleDeleteMenu(menue.id);
      },
    });
  };
  renderMenu = (menuData) => {
    const { onAct = false } = this.props;
    return (menuData || []).map((menu, index) => {
      if (menu.children && menu.children.length > 0) {
        return (
          <SubMenu key={menu.id} title={menu.name}>
            {this.renderMenu(menu.children)}
          </SubMenu>
        );
      }
      if (!menu.isEdit) {
        const actionButton = (
          <span>
            <a>
              <Icon
                className="menueActionIcon"
                type="edit"
                onClick={(e) => {
                  this.editMenu(e, menu);
                }}
              />
            </a>
            <a>
              <Icon
                className="menueActionIcon"
                type="delete"
                onClick={() => {
                  this.deleteMenu(menu);
                }}
              />
            </a>
          </span>
        );
        if (onAct) {
          return (
            <Menu.Item key={menu.id}>
              <div>{menu.name}</div>
            </Menu.Item>
          );
        }
        return (
          <Menu.Item key={menu.id}>
            <Popover placement="rightTop" content={actionButton}>
              <div>{menu.name}</div>
            </Popover>
          </Menu.Item>
        );
      }
      return (
        <Menu.Item key={menu.id}>
          <Input
            ref={(node) => {
              this[`input${index}`] = node;
              // console.log(this[`input${index}`])
            }}
            defaultValue={menu.name}
            onBlur={(e) => {
              this.saveMenu(e, menu);
            }}
          />
        </Menu.Item>
      );
    });
  };

  render() {
    const { selectedKeys, menuData } = this.state;
    return (
      <div className="commonMenu" style={{ overflowY: 'auto' }}>
        <Menu mode="inline" selectedKeys={selectedKeys} onSelect={this.onSelect}>
          {this.renderMenu(menuData)}
        </Menu>
      </div>
    );
  }
}
