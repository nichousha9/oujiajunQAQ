import defaultSettings from '../../config/defaultSettings';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    theme: defaultSettings.navTheme,
    layout: defaultSettings.layout,
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(
      state = {
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
