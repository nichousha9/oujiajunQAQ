import { arrayToTree } from '../../utils/utils';

const subMenuData = {
  '/system/summary': [
    {
      id:1,
      text:'用户组',
      key:'User',
    },
    {
      id:11,
      pid:1,
      text:'用户账号',
      key:'/system/userAccount',
    },
    {
      id:12,
      pid:1,
      text:'系统角色',
      key:'/system/systemRole',
    },
    {
      id:13,
      pid:1,
      text:'组织机构',
      key:'/system/organization',
    },
    {
      id:15,
      pid:1,
      text:'权限管理',
      key:'/system/menu',
    },
    // {
    //   id:13,
    //   pid:1,
    //   text:'组织机构',
    //   key:'/system/organization',
    // },
    /* {
      id:14,
      pid:1,
      text:'公聊区',
      key:'/system/publicchat',
    }, */
    {
      id:2,
      text:'客服接入',
      key:'/snsaccount',
    },
    // {
    //   id:21,
    //   pid:2,
    //   text:'网络列表',
    //   key:'/system/snsaccount',
    // },
    // {
    //   id:3,
    //   text:'工单管理',
    //   key:'/workorder',
    // },
    // {
    //   id:31,
    //   pid:3,
    //   text:'工单列表',
    //   key:'/system/workorder/list',
    // },
    // {
    //   id:32,
    //   pid:3,
    //   text:'工单配置',
    //   key:'/system/workorder/config',
    // },
    {
      id:4,
      text:'数据管理',
      key:'/dataDic',
    },
    {
      id:41,
      pid:4,
      text:'静态数据管理',
      key:'/dataDic/staticData',
    },
    // {
    //   id:42,
    //   pid:4,
    //   text:'地区管理',
    //   key:'/dataDic/areaDataManager',
    // },
    /* {
      id:5,
      text:'知识库管理',
      key:'/knowledge',
    }, */
    // {
    //   id:51,
    //   pid:5,
    //   text:'知识树设置',
    //   key:'/knowledge/treeSetting',
    // },
  ] ,
}

export default function getSubMenuData(type){
  if(subMenuData[type]){
    return arrayToTree(subMenuData[type])
  }
  return [];
}
