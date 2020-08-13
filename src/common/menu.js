import { isUrl ,filterMenu,arrayToTree} from '../utils/utils';


function formatter(data, parentAuthority) {
 const currMenu = filterMenu(data);
 const newMenu = arrayToTree(currMenu);
   return newMenu.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = item.path ? item.path : '/';
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, item.authority);
    }
    return result;
  });
}

export const getMenuData = (menu = []) => formatter(menu);
