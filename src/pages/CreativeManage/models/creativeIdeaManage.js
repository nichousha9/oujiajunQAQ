import {
  qryMessageFolder,
  addAdviceTypeSort,
  modAdviceTypeSort,
  delAdviceTypeSort,
  qryCreativeInfoList,
  operatorAdviceType,
  delCreativeInfo,
  qryTargetChannel,
  getLabelInfoList,
  qryOffersInfo,
  addOfferCreative,
  delOfferCreative,
  queryMccFolderList,
  qryMacroList,
  copyAdviceType,
  addCopyCreativeInfo,
  changeAdviceType,
  updateMoveCreative,
  qryMccAdviceType,
  addCreativeInfo,
  getValidLabelValueByLabelId,
  getLabelDatasByInfo,
  saveImageFile,
  editCreativeInfo,
  qryProLabelRelData,
} from '@/services/creativeIdeaManage';

export default {
  namespace: 'creativeIdeaManage',
  state: {
    editData: {},
  },
  effects: {
    *qryMessageFolder({ payload }, { call }) {
      const response = yield call(qryMessageFolder, payload);
      return response;
    },
    *addAdviceTypeSort({ payload }, { call }) {
      const response = yield call(addAdviceTypeSort, payload);
      return response;
    },
    *modAdviceTypeSort({ payload }, { call }) {
      const response = yield call(modAdviceTypeSort, payload);
      return response;
    },
    *delAdviceTypeSort({ payload }, { call }) {
      const response = yield call(delAdviceTypeSort, payload);
      return response;
    },
    *qryCreativeInfoList({ payload }, { call }) {
      const response = yield call(qryCreativeInfoList, payload);
      return response;
    },
    *operatorAdviceType({ payload }, { call }) {
      const response = yield call(operatorAdviceType, payload);
      return response;
    },
    *delCreativeInfo({ payload }, { call }) {
      const response = yield call(delCreativeInfo, payload);
      return response;
    },
    *qryTargetChannel({ payload }, { call }) {
      const response = yield call(qryTargetChannel, payload);
      return response;
    },
    *getLabelInfoList({ payload }, { call }) {
      const response = yield call(getLabelInfoList, payload);
      return response;
    },
    *qryOffersInfo({ payload }, { call }) {
      const response = yield call(qryOffersInfo, payload);
      return response;
    },
    *addOfferCreative({ payload }, { call }) {
      const response = yield call(addOfferCreative, payload);
      return response;
    },
    *delOfferCreative({ payload }, { call }) {
      const response = yield call(delOfferCreative, payload);
      return response;
    },
    *queryMccFolderList({ payload }, { call }) {
      const response = yield call(queryMccFolderList, payload);
      return response;
    },
    *qryMacroList({ payload }, { call }) {
      const response = yield call(qryMacroList, payload);
      return response;
    },
    *copyAdviceType({ payload }, { call }) {
      const response = yield call(copyAdviceType, payload);
      return response;
    },
    *changeAdviceType({ payload }, { call }) {
      const response = yield call(changeAdviceType, payload);
      return response;
    },
    *addCopyCreativeInfo({ payload }, { call }) {
      const response = yield call(addCopyCreativeInfo, payload);
      return response;
    },
    *updateMoveCreative({ payload }, { call }) {
      const response = yield call(updateMoveCreative, payload);
      return response;
    },
    *addCreativeInfo({ payload }, { call }) {
      const response = yield call(addCreativeInfo, payload);
      return response;
    },
    *getValidLabelValueByLabelId({ payload }, { call }) {
      const response = yield call(getValidLabelValueByLabelId, payload);
      return response;
    },
    *getLabelDatasByInfo({ payload }, { call }) {
      const response = yield call(getLabelDatasByInfo, payload);
      return response;
    },
    *saveImageFile({ payload }, { call }) {
      const response = yield call(saveImageFile, payload);
      return response;
    },
    *editCreativeInfo({ payload }, { call }) {
      const response = yield call(editCreativeInfo, payload);
      return response;
    },
    *qryProLabelRelData({ payload }, { call }) {
      const res = yield call(qryProLabelRelData, payload);
      return res;
    },

    *qryMccAdviceType({ payload }, { call }) {
      const res = yield call(qryMccAdviceType, payload);
      return res;
      // if (res.topCont && res.topCont.resultCode == 0) {
      //   yield put({
      //     type: 'setEidtData',
      //     payload: res.svcCont.data[0],
      //   });
      // }
    },
  },
  reducers: {
    setEidtData(state, { payload: editData }) {
      return Object.assign({}, state, { editData });
    },
  },
};
