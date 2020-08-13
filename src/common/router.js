import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
import './config'


let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {

    
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/index': {
      component: dynamicWrapper(app, ['homens','commonAreaLevelOne'], () => import('../routes/Index/Index')),
    },
    '/userInfo/modifyprofile': {
      component: dynamicWrapper(app, ['modifyprofile'], () => import('../routes/User/ModifyProfile')),
    },
    // '/agent/index': {
    //   component: dynamicWrapper(app, ['agentstatusUpdate','knowPickUpSaveAudite','agentUserInfo','agentSmartReply','agentQuickReply','transfer','agentChat'], () => import('../routes/Agent/Agent')),
    // },
    '/agent/transfer': {
      component: dynamicWrapper(app, [], () => import('../routes/Agent/Transfer')),
    },
    '/history/list': {
      component: dynamicWrapper(app, ['historyList'], () => import('../routes/History/History')),
    },
    '/history/detail': {
      component: dynamicWrapper(app, [], () => import('../routes/History/Detail')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login', 'global'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['login', 'register', 'createorg', 'global'], () => import('../routes/User/Register')),
    },
    '/user/register/basic': {
      component: dynamicWrapper(app, ['login', 'register', 'createorg', 'global'], () => import('../routes/User/RegistStep/Step1')),
    },
    '/user/register/org': {
      component: dynamicWrapper(app, ['login', 'register', 'createorg'], () => import('../routes/User/RegistStep/Step2')),
    },
    '/user/createorg': {
      component: dynamicWrapper(app, ['createorg'], () => import('../routes/User/CreateOrg')),
    },
    '/knowledgebase/info': {
      component: dynamicWrapper(app, ['knowLedgebaseinfo', 'knowledgeTab', 'synonymTab', 'sceneList', 'sceneDialog', 'sceneEntity', 'lexiconManagement', 'sceneIntention', 'sceneDialogSetting', 'sceneIntentionTest', 'sceneDialogNode'], () => import('../routes/KnowledgeBase/Knowledgebase')),
    },
    '/knowCollection/collectList':{
      component: dynamicWrapper(app, ['knowPickUpSaveAudite'], () => import('../routes/KnowCollection')),
    },
    '/statistics/basicIndex': {
      component: dynamicWrapper(app, ['statisticBasicIndex','guestStatistic','robotResponse','customerService', 'communication'], () => import('../routes/Statistics/BasicIndex')),
    },
    '/knowledgebase/add-question': {
      component: dynamicWrapper(app, ['addStandardQuestion'], () => import('../routes/KnowledgeBase/AddQuestion')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/header': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/HeaderLayout')),
    },
    '/header/createtenant': {
      component: dynamicWrapper(app, ['createtenant', 'tenantModal'], () => import('../routes/User/CreateTenant')),
    },
    '/knowledgebase/sceneTab': {
      component: dynamicWrapper(app, ['modelTraining','recoveryConfiguration'], () => import('../routes/KnowledgeBase/SceneTab')),
    },
    // 场景管理
    '/knowledgebase/sceneList': {
      component: dynamicWrapper(app, ['sceneList'], () => import('../routes/KnowledgeBase/SceneList')),
    },
    // 知识图库
    '/knowledgebase/knowledgeGallery': {
      component: dynamicWrapper(app,
        ['knowledgeGallery'],
        () => import('../routes/KnowledgeGallery')),
    },
    // 客服中心知识库 customerService
    '/knowledgebase/customerService': {
      component: dynamicWrapper(app,
        ['knowledgeGallery'],
        () => import('../routes/KnowledgeGallery/customerService')),
    },
    // 运营视图
    '/operationView/operationView': {
      component: dynamicWrapper(app,
        ['operationView','robotManagement'],
        () => import('../routes/OperationView/Index')),
    },

    // 知识审核
    '/knowledgebase/knowledegereview': {
      component: dynamicWrapper(app,
        ['knowledgeGallery'],
        () => import('../routes/KnowledgeRewiew')),
    },

    // 健康检测
    '/knowledgebase/heathTest': {
      component: dynamicWrapper(app,
        ['knowledgeGallery'],
        () => import('../routes/KnowledgeGallery/heathTest')),
    },

    // problemComparison问题对比
    '/knowledgebase/problemComparison': {
      component: dynamicWrapper(app,
        [],
        () => import('../routes/KnowledgeGallery/problemComparison')),
    },
    // problemInfo 问题编辑
    '/knowledgebase/problemInfo': {
      component: dynamicWrapper(app,
        [],
        () => import('../routes/KnowledgeGallery/problemInfo')),
    },

    
    // tenantManagement 租户管理
    '/tenantManagement/tenantManagement': {
      component: dynamicWrapper(app,
        ['tenantManagement'],
        () => import('../routes/TenantManagement/index')),
    },

    // 机器人管理
    '/robotManagement/robotManagement': {
      component: dynamicWrapper(app,
        ['robotManagement'],
        () => import('../routes/RobotManagement/index')),
    },

    // 机器人编辑
    '/robotManagement/robotConfiguration': {
      component: dynamicWrapper(app,
        ['robotManagement'],
        () => import('../routes/RobotManagement/RobotConfiguration')),
    },
    // 知识补充
    '/knowledgeSupplement/knowledgeSupplement': {
      component: dynamicWrapper(app,
        ['knowledgeSupplement','addStandardQuestion'],
        () => import('../routes/KnowledgeSupplement/index')),
      },


    '/system/summary': {
      component: dynamicWrapper(app, ['systemSum','roleAuth'], () => import('../routes/SystemSunm')),
      routes:[
        {
          path:'/system/userAccount',
          component: dynamicWrapper(app, ['userAccount','addUserAccount'], () => import('../routes/SystemSunm/UserAccount')),
        },
        {
          path:'/system/systemRole',
          component: dynamicWrapper(app, ['systemRole','chooseUser'], () => import('../routes/SystemSunm/SystemRole')),
        },
        {
          path:'/system/organization',
          component: dynamicWrapper(app, ['organization','chooseUser','editOrganization', 'systemSum'], () => import('../routes/SystemSunm/Organization')),
        },
        {
          path:'/system/menu',
          component: dynamicWrapper(app, ['organization','chooseUser','editOrganization', 'systemSum'], () => import('../routes/SystemSunm/Menu')),
        },
        {
          path:'/system/publicchat',
          component: dynamicWrapper(app, ['publicchat','systemRole','chooseUser'], () => import('../routes/SystemSunm/PublicChat')),
        },
        {
          path: '/system/snsaccount',
          component: dynamicWrapper(app, [], () => import('../routes/System/SnsAccount')),
        },
        {
          path: '/system/workorder/list',
          component: dynamicWrapper(app, [], () => import('../routes/Workorder/List')),
        },
        {
          path: '/system/workorder/config',
          component: dynamicWrapper(app, [], () => import('../routes/Workorder/Config')),
        },
        {
          path: '/knowledge/treeSetting',
          component: dynamicWrapper(app, ['knowledgeTreeSetting'], () => import('../routes/KnowledgeSetting/TreeSetting')),
        },
        {
          path: '/dataDic/staticData',
          component: dynamicWrapper(app, ['staticData'], () => import('../routes/DataDic/StaticData')),
        },
        {
          path: '/dataDic/areaDataManager',
          component: dynamicWrapper(app, ['areaDataManager'], () => import('../routes/DataDic/AreaDataManager')),
        },
        
      ],
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // console.log('outline',menuData)

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
