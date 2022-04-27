 import tim from '../../tim'
const user = {
  state: {
    currentUserProfile: {},
    isLogin: false,
    isSDKReady: false, // TIM SDK 是否 ready
    userID: 0,
    userSig: '',
    sdkAppID: 0,
    role:''
  },
  mutations: {
    updateCurrentUserProfile(state, userProfile) {
      state.currentUserProfile = userProfile
    },
    toggleIsLogin(state, isLogin) {
      state.isLogin = typeof isLogin === 'undefined' ? !state.isLogin : isLogin
    },
    toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
    },
    reset(state) {
      Object.assign(state, {
        currentUserProfile: {},
        isLogin: false,
        isSDKReady: false // TIM SDK 是否 ready
      })
    },
    GET_USER_INFO(state, payload) {
      state.userID = payload.userID
      state.userSig = payload.userSig
      state.sdkAppID = payload.sdkAppID
      state.role = payload.role
    },
  },
  actions: {
    // login(context, userID) {
    //   tim
    //     .login({
    //       userID,
    //       userSig: window.genTestUserSig(userID).userSig
    //     })
    //     .then(() => {
    //       context.commit('toggleIsLogin', true)
    //       context.commit('startComputeCurrent')
    //       window.$message({ type: 'success', message: '登录成功' })
    //     })
    //     .catch(imError => {
    //       if (imError.code === 2000) {
    //         window.$message.error(imError.message + ', 请检查是否正确填写了 SDKAPPID')
    //       } else {
    //         window.$message.error(imError.message)
    //       }
    //     })
    // },
    getform(){
      const user_name=JSON.parse(sessionStorage.getItem("GET_USER_INFO")).userID;
      let role = '';
      this.$ajax
      .get("/auth/getInfo", { params: { user_name } })
      .then((res) => {
        if (res.data) {
          this.data = res.data 
          role=res.data.role
          // this.status= res.data.coun_status
        }
        if(role=="supervisor")
        {
            this.offline_sup()
        }
        else if(role=="counsellor")
        {
            this.offline_con()
        }
      });
    },
    offline_sup(){
      var Statuslist ={
        sup_id: sessionStorage.getItem("user_id"),
        sup_status: "offline"
      }
        this.$ajax.put("/supervisor/changeStatus", Statuslist).then((res) => {
          if (res.data) {
            this.message = res.data.message;
            console.log(this.message, 111);
          }
        });
    },
    offline_con(){
      var Statuslist ={
        coun_id: sessionStorage.getItem("user_id"),
        coun_status: "offline"
      }
        this.$ajax.put("/counsellor/changeStatus", Statuslist).then((res) => {
          if (res.data) {
            this.message = res.data.message;
            console.log(this.message, 111);
          }
        });
    },
    logout(context) {

      //offline


      // 若有当前会话，在退出登录时已读上报
      if (context.rootState.conversation.currentConversation.conversationID) {
        tim.setMessageRead({ conversationID: context.rootState.conversation.currentConversation.conversationID })
      }
      tim.logout().then(() => {
        context.commit('toggleIsLogin')
        context.commit('stopComputeCurrent')
        context.commit('reset')
        window.sessionStorage.clear();
        window.localStorage.clear();
      })
    }
  }
}

export default user
