import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'E:/仓库/项目仓库/fire-kylin/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/login',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__User__login" */ '../User/login'),
          LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
            .default,
        })
      : require('../User/login').default,
    exact: true,
  },
  {
    path: '/403',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__403" */ '../403.jsx'),
          LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
            .default,
        })
      : require('../403.jsx').default,
    exact: true,
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__TabMenuLayout" */ '../../layouts/TabMenuLayout'),
          LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/TabMenuLayout').default,
    Routes: [require('../Authorized').default],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/index.html',
        redirect: '/labelManage',
        exact: true,
      },
      {
        path: '/',
        redirect: '/labelManage',
        exact: true,
      },
      {
        path: '/labelManage',
        name: 'labelManage',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__LabelConfigManage__LabelManage__models__labelManage.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/LabelConfigManage/LabelManage/models/labelManage.js').then(
                  m => {
                    return { namespace: 'labelManage', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__LabelConfigManage__LabelManage__index" */ '../LabelConfigManage/LabelManage/index'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../LabelConfigManage/LabelManage/index').default,
        icon: 'iconbiaoqianguanli',
        exact: true,
      },
      {
        path: '/channelOperation',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__ChannelOperation__models__channelList.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ChannelOperation/models/channelList.js').then(
                  m => {
                    return { namespace: 'channelList', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__ChannelOperation__models__operationBitList.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ChannelOperation/models/operationBitList.js').then(
                  m => {
                    return { namespace: 'operationBitList', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__ChannelOperation__index" */ '../ChannelOperation/index'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../ChannelOperation/index').default,
        name: 'channelOperation',
        icon: 'iconyunyingwei',
        exact: true,
      },
      {
        path: '/commodityManage',
        name: 'commodityManage',
        icon: 'iconshangpinguanli',
        routes: [
          {
            path: '/commodityManage/',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CommodityManage__models__commodityList.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/CommodityManage/models/commodityList.js').then(
                      m => {
                        return { namespace: 'commodityList', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CommodityManage__index" */ '../CommodityManage/index'),
                  LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                    .default,
                })
              : require('../CommodityManage/index').default,
            exact: true,
          },
          {
            path: '/commodityManage/commodityView',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CommodityManage__models__commodityList.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/CommodityManage/models/commodityList.js').then(
                      m => {
                        return { namespace: 'commodityList', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CommodityManage__CommodityView__index" */ '../CommodityManage/CommodityView/index'),
                  LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                    .default,
                })
              : require('../CommodityManage/CommodityView/index').default,
            name: 'commodityManage',
            hideInMenu: true,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/fire-kylin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/creativeIdeaManage',
        name: 'creativeIdeaManage',
        icon: 'smile',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__CreativeIdeaManage__models__creativeIdeaManage.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/CreativeIdeaManage/models/creativeIdeaManage.js').then(
                  m => {
                    return { namespace: 'creativeIdeaManage', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__CreativeIdeaManage__index" */ '../CreativeIdeaManage/index.jsx'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../CreativeIdeaManage/index.jsx').default,
        exact: true,
      },
      {
        path: '/activityConfigManage',
        name: 'activityConfigManage',
        icon: 'iconhuodongguanli',
        routes: [
          {
            path: '/index.html',
            redirect: '/campaignMonitor',
            exact: true,
          },
          {
            path: '/',
            redirect: '/campaignMonitor',
            exact: true,
          },
          {
            path: '/activityConfigManage/marketingActivityList',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ActivityConfigManage__MarketingActivityList__models__activityReview.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/MarketingActivityList/models/activityReview.js').then(
                      m => {
                        return { namespace: 'activityReview', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__MarketingActivityList__models__approveList.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/MarketingActivityList/models/approveList.js').then(
                      m => {
                        return { namespace: 'approveList', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__MarketingActivityList__models__index.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/MarketingActivityList/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__MarketingActivityList__models__marketingActivityList.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/MarketingActivityList/models/marketingActivityList.js').then(
                      m => {
                        return {
                          namespace: 'marketingActivityList',
                          ...m.default,
                        };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ActivityConfigManage__MarketingActivityList__index" */ '../ActivityConfigManage/MarketingActivityList/index'),
                  LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                    .default,
                })
              : require('../ActivityConfigManage/MarketingActivityList/index')
                  .default,
            name: 'marketingActivityList',
            exact: true,
          },
          {
            path: '/activityConfigManage/activityFlow',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__CreateFlow__models__ActivityFlow.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/CreateFlow/models/ActivityFlow.js').then(
                      m => {
                        return { namespace: 'ActivityFlow', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityAbDecision.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityAbDecision.js').then(
                      m => {
                        return {
                          namespace: 'activityAbDecision',
                          ...m.default,
                        };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityDirectBonus.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityDirectBonus.js').then(
                      m => {
                        return {
                          namespace: 'activityDirectBonus',
                          ...m.default,
                        };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityFlowContact.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityFlowContact.js').then(
                      m => {
                        return {
                          namespace: 'activityFlowContact',
                          ...m.default,
                        };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityFlowIre.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityFlowIre.js').then(
                      m => {
                        return { namespace: 'activityFlowIre', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityFlowListener.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityFlowListener.js').then(
                      m => {
                        return {
                          namespace: 'activityFlowListener',
                          ...m.default,
                        };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityFlowSample.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityFlowSample.js').then(
                      m => {
                        return {
                          namespace: 'activityFlowSample',
                          ...m.default,
                        };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityFlowSchedule.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityFlowSchedule.js').then(
                      m => {
                        return {
                          namespace: 'activityFlowSchedule',
                          ...m.default,
                        };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activityNextStage.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activityNextStage.js').then(
                      m => {
                        return { namespace: 'activityNextStage', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activitySegment.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activitySegment.js').then(
                      m => {
                        return { namespace: 'activitySegment', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__ActivitySelect.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/ActivitySelect.js').then(
                      m => {
                        return { namespace: 'ActivitySelect', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__ActivityConfigManage__ActivityFlow__models__activitySet.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigManage/ActivityFlow/models/activitySet.js').then(
                      m => {
                        return { namespace: 'activitySet', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__ActivityConfigManage__ActivityFlow__CreateFlow__index" */ '../ActivityConfigManage/ActivityFlow/CreateFlow/index'),
                  LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                    .default,
                })
              : require('../ActivityConfigManage/ActivityFlow/CreateFlow/index')
                  .default,
            name: 'activityFlow',
            hideInMenu: true,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/fire-kylin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/cacheManage',
        name: 'cacheManage',
        icon: 'iconshangpinguanli',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__CacheManage__models__cacheManage.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/CacheManage/models/cacheManage.js').then(
                  m => {
                    return { namespace: 'cacheManage', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__CacheManage__index" */ '../CacheManage/index'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../CacheManage/index').default,
        exact: true,
      },
      {
        path: '/workOrder',
        name: 'workOrder',
        icon: 'iconshangpinguanli',
        routes: [
          {
            path: '/workOrder/',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__WorkOrder__model.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/WorkOrder/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__WorkOrder" */ '../WorkOrder'),
                  LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                    .default,
                })
              : require('../WorkOrder').default,
            exact: true,
          },
          {
            path: '/workOrder/detail',
            name: 'detail',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__WorkOrder__model.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/WorkOrder/model.js').then(
                      m => {
                        return { namespace: 'model', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__WorkOrder__Detail" */ '../WorkOrder/Detail'),
                  LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                    .default,
                })
              : require('../WorkOrder/Detail').default,
            hideInMenu: true,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/fire-kylin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/activityWork',
        name: 'activityWork',
        icon: 'iconshangpinguanli',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__WorkOrder__ActivityWork__model.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/WorkOrder/ActivityWork/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__WorkOrder__model.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/WorkOrder/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__WorkOrder__ActivityWork__index" */ '../WorkOrder/ActivityWork/index'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../WorkOrder/ActivityWork/index').default,
        exact: true,
      },
      {
        path: '/marketingMonitor',
        name: 'marketingMonitor',
        icon: 'iconjiankong',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__MarketingMonitor__models__marketingMonitor.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/MarketingMonitor/models/marketingMonitor.js').then(
                  m => {
                    return { namespace: 'marketingMonitor', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__MarketingMonitor__index" */ '../MarketingMonitor/index'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../MarketingMonitor/index').default,
        exact: true,
      },
      {
        path: '/feature/detail',
        name: 'feature',
        icon: 'iconshangpinguanli',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Feature__FeatureDetail__models__featureDetail.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/Feature/FeatureDetail/models/featureDetail.js').then(
                  m => {
                    return { namespace: 'featureDetail', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Feature__FeatureDetail__index" */ '../Feature/FeatureDetail/index'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../Feature/FeatureDetail/index').default,
        hideInMenu: true,
        exact: true,
      },
      {
        path: '/activityScheduling',
        name: 'activityScheduling',
        icon: 'iconshangpinguanli',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__EvaluationAnalysis__models__model.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/EvaluationAnalysis/models/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__EvaluationAnalysis" */ '../EvaluationAnalysis'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../EvaluationAnalysis').default,
        exact: true,
      },
      {
        path: '/campaignMarketingComparison',
        name: 'campaignMarketingComparison',
        icon: 'iconshangpinguanli',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__EvaluationAnalysis__models__model.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/EvaluationAnalysis/models/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__EvaluationAnalysis__contrast" */ '../EvaluationAnalysis/contrast'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../EvaluationAnalysis/contrast').default,
        hideInMenu: true,
        exact: true,
      },
      {
        path: '/activityConfigModel',
        name: 'activityConfigModel',
        icon: 'iconshangpinguanli',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__ActivityConfigModel__model.js' */ 'E:/仓库/项目仓库/fire-kylin/src/pages/ActivityConfigModel/model.js').then(
                  m => {
                    return { namespace: 'model', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__ActivityConfigModel__index" */ '../ActivityConfigModel/index'),
              LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
                .default,
            })
          : require('../ActivityConfigModel/index').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('E:/仓库/项目仓库/fire-kylin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
          LoadingComponent: require('E:/仓库/项目仓库/fire-kylin/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('E:/仓库/项目仓库/fire-kylin/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
