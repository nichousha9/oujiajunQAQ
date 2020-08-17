const routes = [
  {
    path: '/login',
    component: './User/login',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/',
        redirect: '/grossAnalysis',
      },
      {
        path: '/grossAnalysis', // 总体分析
        name: 'grossAnalysis',
        // icon: 'iconjiankong',
        component: './GrossAnalysis',
      },
      {
        path: '/configManage', // 配置管理
        name: 'configManage',
        // icon: 'iconjiankong',
        component: './ConfigManage',
      },
      {
        path: '/lyricManage', // 舆情管理
        name: 'lyricManage',
        // icon: 'iconjiankong',
        component: './LyricManage',
      },
      {
        path: '/opinionLeader', // 意见领袖
        name: 'opinionLeader',
        // icon: 'iconjiankong',
        component: './LyricManage',
      },
      {
        path: '/recycleBin', // 回收站
        name: 'recycleBin',
        // icon: 'iconjiankong',
        component: './LyricManage',
      },
    ],
  },
  {
    component: './404',
  },
];

export default routes;
