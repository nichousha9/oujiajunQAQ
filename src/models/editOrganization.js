import { orgSave, orgUpdate } from '../services/systemSum';

export default {
  namespace: 'editOrganization',
  state: {
  },
  effects: {
    *fetchOrgSave({ payload }, { call}) {
      const response = yield call(orgSave,payload);
      return response;
    },
    *fetchOrgUpdate({ payload }, { call }) {
      const response = yield call(orgUpdate,payload);
      return response;
    },
  },
  reducers: {
  },
};
