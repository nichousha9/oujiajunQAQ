import {chatmessagesDesc} from "../services/api";

export default {
  namespace: 'agentChat',

  state: {
    chatMessages: [], // 当前用户的消息列表
    chatPage: 1, // 当前消息page
  },

  effects: {
    *fetchGetChatMessages({ payload }, { call, put }) {
      const response = yield call(chatmessagesDesc,payload);
      yield put({
        type: 'saveGetChatMessages',
        payload: { chatlist: response.data,maxChatListLen: response.msg,page: payload.p,lastMsgId:payload.msgid},
      });
    },
  },

  reducers: {
    saveGetChatMessages(state, {payload}) {
      const { chatMessages : oldList } = state;
      const { chatlist: newList ,page = 1,maxChatListLen=0,lastMsgId=''}  = payload;
      const newChatListIdArr =  oldList.map((chat) => {return chat.id});
      const newListArr = newList.filter((chat)=>{
        if(newChatListIdArr.indexOf(chat.id)>-1) return false;
        return true;
      });
      const newChatList=lastMsgId ? [...newListArr,...oldList] : [...newList];
      return {
        ...state,
        lastMsgId,
        chatPage: page,
        chatMessages: newChatList,
        maxChatListLen,
      };
    },
    updateChatMessages(state,{payload}){
      const { chatList=[],maxChatListLen=0 } = payload;
      return {
        ...state,
        chatMessages:chatList,
        maxChatListLen,
      }
    }
  },
};
