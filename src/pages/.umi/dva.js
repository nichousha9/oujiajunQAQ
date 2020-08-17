import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData[location.pathname] } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'common', ...(require('E:/仓库/项目仓库/dtmm-fe/src/models/common.js').default) });
app.model({ namespace: 'global', ...(require('E:/仓库/项目仓库/dtmm-fe/src/models/global.js').default) });
app.model({ namespace: 'login', ...(require('E:/仓库/项目仓库/dtmm-fe/src/models/login.js').default) });
app.model({ namespace: 'menuJump', ...(require('E:/仓库/项目仓库/dtmm-fe/src/models/menuJump.js').default) });
app.model({ namespace: 'user', ...(require('E:/仓库/项目仓库/dtmm-fe/src/models/user.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
