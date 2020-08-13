export default {
  namespace: 'effectEvaluation',
  state: {},
  effects: {},
  reducers: {
    save(state, { payload }) {
      return Object.assign({}, state, payload);
    },
  },
};
