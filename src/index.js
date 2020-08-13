import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

// import createHistory from 'history/createHashHistory';

// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';

const createHistory = require('history').createHashHistory;

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);
// 注册存系统的数据字典的，
app.model(require('./models/dataDic').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line