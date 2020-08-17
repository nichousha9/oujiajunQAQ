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
import RendererWrapper0 from 'E:/仓库/项目仓库/dtmm-fe/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/login',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__User__login" */ '../User/login'),
          LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
            .default,
        })
      : require('../User/login').default,
    exact: true,
  },
  {
    path: '/questionForm',
    component: __IS_BROWSER
      ? _dvaDynamic({
          app: require('@tmp/dva').getApp(),
          models: () => [
            import(/* webpackChunkName: 'p__questionForm__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/questionForm/models/index.js').then(
              m => {
                return { namespace: 'index', ...m.default };
              },
            ),
          ],
          component: () =>
            import(/* webpackChunkName: "p__questionForm__index" */ '../questionForm/index'),
          LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
            .default,
        })
      : require('../questionForm/index').default,
    exact: true,
  },
  {
    path: '/questionPreview',
    component: __IS_BROWSER
      ? _dvaDynamic({
          app: require('@tmp/dva').getApp(),
          models: () => [
            import(/* webpackChunkName: 'p__questionPreview__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/questionPreview/models/index.js').then(
              m => {
                return { namespace: 'index', ...m.default };
              },
            ),
          ],
          component: () =>
            import(/* webpackChunkName: "p__questionPreview__index" */ '../questionPreview/index'),
          LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
            .default,
        })
      : require('../questionPreview/index').default,
    exact: true,
  },
  {
    path: '/onlineUser',
    routes: [
      {
        path: '/onlineUser/onlineAssessment',
        name: 'onlineUser.onlineAssessment',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__OnlineUser__OnlineAssessment__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/OnlineUser/OnlineAssessment/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__OnlineUser__OnlineAssessment__index" */ '../OnlineUser/OnlineAssessment/index'),
              LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                .default,
            })
          : require('../OnlineUser/OnlineAssessment/index').default,
        exact: true,
      },
      {
        path: '/onlineUser/myAssessment',
        name: 'onlineUser.myAssessment',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__OnlineUser__MyAssessment__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/OnlineUser/MyAssessment/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__OnlineUser__MyAssessment__index" */ '../OnlineUser/MyAssessment/index'),
              LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                .default,
            })
          : require('../OnlineUser/MyAssessment/index').default,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/report',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__ReportLayout" */ '../../layouts/ReportLayout'),
          LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/ReportLayout').default,
    routes: [
      {
        path: '/report/onlineEvaluation/metricsReport',
        name: 'metricsReport',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                  m => {
                    return { namespace: 'examine', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                  m => {
                    return { namespace: 'list', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                  m => {
                    return { namespace: 'onlineEvaluation', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Questionnaire__OnlineEvaluation__MetricsReport" */ '../Questionnaire/OnlineEvaluation/MetricsReport.jsx'),
              LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                .default,
            })
          : require('../Questionnaire/OnlineEvaluation/MetricsReport.jsx')
              .default,
        hideInMenu: true,
        exact: true,
      },
      {
        path: '/report/onlineEvaluation/dtmmReport',
        name: 'dtmmReport',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                  m => {
                    return { namespace: 'examine', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                  m => {
                    return { namespace: 'list', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                  m => {
                    return { namespace: 'onlineEvaluation', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Questionnaire__OnlineEvaluation__DtmmReport" */ '../Questionnaire/OnlineEvaluation/DtmmReport.jsx'),
              LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                .default,
            })
          : require('../Questionnaire/OnlineEvaluation/DtmmReport.jsx').default,
        hideInMenu: true,
        exact: true,
      },
      {
        path: '/report/onlineEvaluation/downloadReport',
        name: 'downloadReport',
        component: __IS_BROWSER
          ? _dvaDynamic({
              app: require('@tmp/dva').getApp(),
              models: () => [
                import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                  m => {
                    return { namespace: 'examine', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                  m => {
                    return { namespace: 'index', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                  m => {
                    return { namespace: 'list', ...m.default };
                  },
                ),
                import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                  m => {
                    return { namespace: 'onlineEvaluation', ...m.default };
                  },
                ),
              ],
              component: () =>
                import(/* webpackChunkName: "p__Questionnaire__OnlineEvaluation__DownloadReport" */ '../Questionnaire/OnlineEvaluation/DownloadReport.jsx'),
              LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                .default,
            })
          : require('../Questionnaire/OnlineEvaluation/DownloadReport.jsx')
              .default,
        hideInMenu: true,
        exact: true,
      },
      {
        component: () =>
          React.createElement(
            require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
          LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
            .default,
        })
      : require('../../layouts/BasicLayout').default,
    Routes: [require('../Authorized').default],
    routes: [
      {
        path: '/index.html',
        redirect: '/Metrics/MetricsManagement',
        exact: true,
      },
      {
        path: '/',
        redirect: '/Metrics/MetricsManagement',
        exact: true,
      },
      {
        path: '/Metrics',
        name: 'Metrics.Management',
        icon: 'bar-chart',
        routes: [
          {
            path: '/Metrics',
            redirect: '/Metrics/MetricsManagement',
            exact: true,
          },
          {
            path: '/Metrics/MetricsManagement',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MetricsManagement__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/MetricsManagement/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MetricsManagement__index" */ '../MetricsManagement/index.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../MetricsManagement/index.jsx').default,
            exact: true,
          },
          {
            path: '/Metrics/MetricsManagement/add',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MetricsManagement__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/MetricsManagement/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MetricsManagement__AddMetrics" */ '../MetricsManagement/AddMetrics.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../MetricsManagement/AddMetrics.jsx').default,
            exact: true,
          },
          {
            path: '/Metrics/MetricsManagement/edit',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MetricsManagement__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/MetricsManagement/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MetricsManagement__EditMetrics" */ '../MetricsManagement/EditMetrics.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../MetricsManagement/EditMetrics.jsx').default,
            exact: true,
          },
          {
            path: '/Metrics/MetricsManagement/MetricsBigData',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MetricsManagement__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/MetricsManagement/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MetricsManagement__MetricsBigData" */ '../MetricsManagement/MetricsBigData.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../MetricsManagement/MetricsBigData.jsx').default,
            exact: true,
          },
          {
            path: '/Metrics/MetricsManagement/MetricsBigDataParticulars',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MetricsManagement__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/MetricsManagement/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MetricsManagement__MetricsBigDataParticulars" */ '../MetricsManagement/MetricsBigDataParticulars.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../MetricsManagement/MetricsBigDataParticulars.jsx')
                  .default,
            exact: true,
          },
          {
            path: '/Metrics/MetricsManagement/LookDTMM',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__MetricsManagement__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/MetricsManagement/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__MetricsManagement__LookDTMM" */ '../MetricsManagement/LookDTMM.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../MetricsManagement/LookDTMM.jsx').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/questionnaire',
        name: 'questionnaire.Management',
        icon: 'funnel-plot',
        routes: [
          {
            path: '/index.html',
            redirect: '/questionnaire/Questionnaire/DesignQuestionnaire.jsx',
            exact: true,
          },
          {
            path: '/',
            redirect: '/questionnaire/Questionnaire/DesignQuestionnaire.jsx',
            exact: true,
          },
          {
            path: '/questionnaire/list',
            name: 'list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                      m => {
                        return { namespace: 'examine', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                      m => {
                        return { namespace: 'list', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                      m => {
                        return { namespace: 'onlineEvaluation', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__Questionnaire__list" */ '../Questionnaire/list'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../Questionnaire/list').default,
            exact: true,
          },
          {
            path: '/questionnaire/types',
            name: 'add',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                      m => {
                        return { namespace: 'examine', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                      m => {
                        return { namespace: 'list', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                      m => {
                        return { namespace: 'onlineEvaluation', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__Questionnaire__types" */ '../Questionnaire/types'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../Questionnaire/types').default,
            exact: true,
          },
          {
            path: '/questionnaire/commonAdd',
            name: 'common',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                      m => {
                        return { namespace: 'examine', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                      m => {
                        return { namespace: 'list', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                      m => {
                        return { namespace: 'onlineEvaluation', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__Questionnaire__commonAdd" */ '../Questionnaire/commonAdd'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../Questionnaire/commonAdd').default,
            exact: true,
          },
          {
            path: '/questionnaire/design',
            name: 'design',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                      m => {
                        return { namespace: 'examine', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                      m => {
                        return { namespace: 'list', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                      m => {
                        return { namespace: 'onlineEvaluation', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__Questionnaire__DesignQuestionnaire" */ '../Questionnaire/DesignQuestionnaire.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../Questionnaire/DesignQuestionnaire.jsx').default,
            exact: true,
          },
          {
            path: '/questionnaire/send',
            name: 'send',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                      m => {
                        return { namespace: 'examine', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                      m => {
                        return { namespace: 'list', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                      m => {
                        return { namespace: 'onlineEvaluation', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__Questionnaire__SendQuestionnaire" */ '../Questionnaire/SendQuestionnaire.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../Questionnaire/SendQuestionnaire.jsx').default,
            exact: true,
          },
          {
            path: '/questionnaire/examine',
            name: 'examine',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                      m => {
                        return { namespace: 'examine', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                      m => {
                        return { namespace: 'list', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                      m => {
                        return { namespace: 'onlineEvaluation', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__Questionnaire__ExamineQuestionnaire__index" */ '../Questionnaire/ExamineQuestionnaire/index.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../Questionnaire/ExamineQuestionnaire/index.jsx')
                  .default,
            exact: true,
          },
          {
            path: '/questionnaire/addQuestionnaire',
            hideInMenu: true,
            name: '新增指标问卷',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__Questionnaire__models__examine.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/examine.js').then(
                      m => {
                        return { namespace: 'examine', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__list.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/list.js').then(
                      m => {
                        return { namespace: 'list', ...m.default };
                      },
                    ),
                    import(/* webpackChunkName: 'p__Questionnaire__models__onlineEvaluation.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/Questionnaire/models/onlineEvaluation.js').then(
                      m => {
                        return { namespace: 'onlineEvaluation', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__Questionnaire__AddQuestionnaire" */ '../Questionnaire/AddQuestionnaire.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../Questionnaire/AddQuestionnaire.jsx').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/DTMM',
        name: 'dtmm.Management',
        icon: 'bar-chart',
        routes: [
          {
            path: '/DTMM',
            redirect: '/DTMM/DtmmManage',
            exact: true,
          },
          {
            path: '/DTMM/DtmmManage',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DtmmManage__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/DtmmManage/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DtmmManage__index" */ '../DtmmManage/index.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../DtmmManage/index.jsx').default,
            exact: true,
          },
          {
            path: '/DTMM/DtmmManage/add',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DtmmManage__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/DtmmManage/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DtmmManage__AddDtmm" */ '../DtmmManage/AddDtmm.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../DtmmManage/AddDtmm.jsx').default,
            exact: true,
          },
          {
            path: '/DTMM/DtmmManage/edit',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DtmmManage__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/DtmmManage/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DtmmManage__EditDtmm" */ '../DtmmManage/EditDtmm.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../DtmmManage/EditDtmm.jsx').default,
            exact: true,
          },
          {
            path: '/DTMM/DTMMInfluenceMetrics',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DtmmManage__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/DtmmManage/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DtmmManage__DTMMInfluenceMetrics" */ '../DtmmManage/DTMMInfluenceMetrics.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../DtmmManage/DTMMInfluenceMetrics.jsx').default,
            exact: true,
          },
          {
            path: '/DTMM/DTMMRelevanceMetrics',
            hideInMenu: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__DtmmManage__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/DtmmManage/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__DtmmManage__DTMMRelevanceMetrics" */ '../DtmmManage/DTMMRelevanceMetrics.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../DtmmManage/DTMMRelevanceMetrics.jsx').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/boardManagement',
        name: 'board.Management',
        icon: 'funnel-plot',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__BoardManagement__index" */ '../BoardManagement/index.jsx'),
              LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                .default,
            })
          : require('../BoardManagement/index.jsx').default,
        exact: true,
      },
      {
        path: '/enterpriseProject',
        name: 'enterprise.project.Management',
        icon: 'bar-chart',
        routes: [
          {
            path: '/enterpriseProject/project',
            name: 'project',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__EnterpriseProject__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/EnterpriseProject/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__EnterpriseProject__index" */ '../EnterpriseProject/index.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../EnterpriseProject/index.jsx').default,
            exact: true,
          },
          {
            path: '/enterpriseProject/indicatorBigData',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__EnterpriseProject__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/EnterpriseProject/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__EnterpriseProject__IndicatorBigData" */ '../EnterpriseProject/IndicatorBigData.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../EnterpriseProject/IndicatorBigData.jsx').default,
            exact: true,
          },
          {
            path: '/enterpriseProject/company',
            name: 'company',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CompanyManage__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/CompanyManage/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CompanyManage__index" */ '../CompanyManage/index.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../CompanyManage/index.jsx').default,
            exact: true,
          },
          {
            path: '/enterpriseProject/company/info',
            name: 'companyInfo',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CompanyManage__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/CompanyManage/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CompanyManage__CompanyInfo" */ '../CompanyManage/CompanyInfo.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../CompanyManage/CompanyInfo.jsx').default,
            hideInMenu: true,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        path: '/customerView',
        name: 'customer.view',
        icon: 'bar-chart',
        routes: [
          {
            path: '/customerView/metrics',
            name: 'metrics',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerView__Metrics__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/CustomerView/Metrics/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerView__Metrics__index" */ '../CustomerView/Metrics/index.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerView/Metrics/index.jsx').default,
            exact: true,
          },
          {
            path: '/customerView/dtmm',
            name: 'dtmm',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  app: require('@tmp/dva').getApp(),
                  models: () => [
                    import(/* webpackChunkName: 'p__CustomerView__Dtmm__models__index.js' */ 'E:/仓库/项目仓库/dtmm-fe/src/pages/CustomerView/Dtmm/models/index.js').then(
                      m => {
                        return { namespace: 'index', ...m.default };
                      },
                    ),
                  ],
                  component: () =>
                    import(/* webpackChunkName: "p__CustomerView__Dtmm__index" */ '../CustomerView/Dtmm/index.jsx'),
                  LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
                    .default,
                })
              : require('../CustomerView/Dtmm/index.jsx').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: () =>
          React.createElement(
            require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
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
          LoadingComponent: require('E:/仓库/项目仓库/dtmm-fe/src/components/PageLoading/index')
            .default,
        })
      : require('../404').default,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('E:/仓库/项目仓库/dtmm-fe/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
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
