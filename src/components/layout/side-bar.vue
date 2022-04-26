<template>
  <div class="side-bar-wrapper">
    <div class="bar-top">
      <div class="left-avatar">
        <my-profile />
      </div>
      <div class="counselor-information">
        <div class="coun_name">咨询师：{{userName}}</div>
        <div class="coun_tel">电话：{{userTel.slice(0,3)}}****{{userTel.slice(7,11)}}</div>
      </div>
    </div>
    <div class="bar-middle">
      <conversation-list v-show="showConversationList" />
    </div>
    <div class="bar-down">
      <button class="stop-btn" @click="handleEndChat" v-show="showBottonBtn">结束咨询</button>
      <button class="help-btn" @click="handleSelectSupBtn" v-show="showBottonBtn">请求督导</button>
    </div>
    <el-dialog title="选择督导" :visible.sync="showDialog" width="20%">
      <div class="select-sup">
        <div class="select-sup-text">选择已绑定的督导：</div>
        <el-select v-model="selectSupID" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.user_name"
            :label="item.sup_name"
            :value="item.user_name"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import MyProfile from '../my-profile'
import ConversationList from '../conversation/conversation-list'

const activeName = {
  CONVERSATION_LIST: 'conversation-list',
}
export default {
  name: 'SideBar',
  components: {
    MyProfile,
    ConversationList,
  },
  data() {
    return {
      active: activeName.CONVERSATION_LIST,
      activeName: activeName,
      coun_id: null,
      userName: null,
      userTel: null,
      showDialog: false,
      options: null,
      selectSupID: '',
    }
  },
  computed: {
    ...mapGetters(['totalUnreadCount']),
    ...mapState({
      currentUserProfile: state => state.user.currentUserProfile,
      userID: state => state.user.userID,
      applicationUnreadCount: state => state.friend.unreadCount,
      currentConversation: state => state.conversation.currentConversation,
    }),
    showConversationList() {
      return this.active === activeName.CONVERSATION_LIST
    },
    showBottonBtn() {
      return this.currentConversation.conversationID != undefined;
    },
    showAddButton() {
      return [activeName.CONVERSATION_LIST].includes(
        this.active
      )
    },
  },
  mounted() {
    this.$bus.$on('checkoutConversation',()=>{
      this.checkoutActive(activeName.CONVERSATION_LIST)
    })
    this.getUserInfo();
  },

  methods: {
    getBindSupList() {
      this.$ajax.get('/counsellor/bindSupervisorList', {
        params: {
          user_id: this.coun_id
        }
      }).then((res) => {
        console.log(res)
        if (res.data) {
          this.options = res.data
        }
      })
    },
    handleEndChat() {
      const coun = JSON.parse(window.sessionStorage.GET_USER_INFO).userID;
      var visitor = this.currentConversation.userProfile.userID;
      var isHelp = this.selectSupID === '' ? 0 : 1;
      var sup = this.selectSupID === '' ? '无' : this.selectSupID;
      var times = Date.now();
      var end_time = new Date(times).toLocaleString('chinese', {hour12: false}).replaceAll('/', '-');
      this.$ajax.post('/record/complete', {
        visitor,
        coun: coun,
        help_or_not: isHelp,
        sup: sup,
        end_time,
      }).then((res) => {
        if (res.status === 200) {
          this.$notify({
            type: 'success',
            message: '已结束与该访客的对话。'
          })
        }
      })
    },
    checkoutActive(name) {
      this.active = name
    },
    getUserInfo() {
      const userID = JSON.parse(window.sessionStorage.GET_USER_INFO).userID;
      this.$ajax.get('/auth/getInfo', {params: {user_name: userID}}).then((res) => {
        console.log(res)
        if (res.data) {
          this.coun_id = res.data.user_id;
          this.userName = res.data.coun_name;
          this.userTel = res.data.coun_phone;
          this.getBindSupList();
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
    },
    handleSelectSupBtn() {
      this.showDialog = true
    },
    handleConfirm() {
      if (this.selectSupID !== '@TIM#SYSTEM') {
        this.$store
          .dispatch('checkoutConversation', `C2C${this.selectSupID}`)
          .then(() => {
            this.showDialog = false
          }).catch(() => {
          this.$store.commit('showMessage', {
            message: '该督导当前无法提供服务，请重新绑定督导',
            type: 'warning'
          })
        })
      } else {
        this.$store.commit('showMessage', {
          message: '该督导当前无法提供服务，请重新绑定督导',
          type: 'warning'
        })
      }
      const coun = JSON.parse(window.sessionStorage.GET_USER_INFO).userID;
      var visitor = this.currentConversation.userProfile.userID;
      this.$ajax.post('/record/help', {
        visitor: visitor,
        coun: coun,
        sup: this.selectSupID,
      })
      this.selectSupID = ''
    },
    logout() {
      this.$store.dispatch('logout')
      window.sessionStorage.clear()
      window.localStorage.clear()
      this.$router.push('/login')
    },
    handleClick(event) {
      switch (event.target.id) {
        case activeName.CONVERSATION_LIST:
          this.checkoutActive(activeName.CONVERSATION_LIST)
          break
      }
    },
    handleRefresh() {
      switch (this.active) {
        case activeName.CONVERSATION_LIST:
          this.tim.getConversationList().catch(error => {
            this.$store.commit('showMessage', {
              type: 'error',
              message: error.message
            })
          })
          break
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.side-bar-wrapper {
  height: 100%;
  color: $black;
  display: flex;
  width: 100%;
  overflow: hidden;
  flex-direction: column;

  .bar-top {
    display flex;
    background-color: $background-deep-dark;
    height: 120px;
    align-items: center;
    border-bottom: 0.5px solid #ccc

    .left-avatar {
      display: flex;
      padding: 20px;
      width: 40%;
    }

    .counselor-information {
      color: #fff;
      font-size: 16px;

      .coun_name {
        margin-bottom: 8px;
      }
    }
  }

  .bar-middle {
    background-color: $background-deep-dark;
    height: calc(80vh - 420px);
  }

  .bar-down {
    background-color: $background-deep-dark;
    height: 300px;
    // border-top: 0.5px solid #ccc;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    .stop-btn {
      width: 80%;
      margin-bottom: 24px;
      font-size: 32px;
      border-radius: 12px;
    }

    .help-btn {
      width: 80%;
      font-size: 32px;
      border-radius: 12px;
      margin-bottom: 48px;
    }
  }

  .select-sup {
    display: flex !important;
    align-items: center;

    .select-sup-text {
      margin-right: 32px;
    }
  }

  .bar-left {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    width: 80px;
    height: $height;
    background-color: $background-deep-dark;

    .tab-items {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      .iconfont {
        position: relative;
        margin: 0;
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
        color: $first;
        user-select: none;
        -moz-user-select: none;
      }

      .active {
        color: $white;
        background-color: $background-dark;

        &::after {
          content: ' ';
          display: block;
          position: absolute;
          top: 0;
          z-index: 0;
          height: 70px;
          // border-left 4px solid $border-highlight
          border-left: 4px solid $light-primary;
        }
      }

      .unread {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 999;
        display: inline-block;
        height: 18px;
        padding: 0 6px;
        font-size: 12px;
        color: #FFF;
        line-height: 18px;
        text-align: center;
        white-space: nowrap;
        border-radius: 10px;
        background-color: $danger;
      }
    }

    .bottom {
      height: 70px;

      &>span {
        display: block;
      }

      .btn-more {
        width: 100%;
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        color: $first;
        text-align: center;
        cursor: pointer;
      }

      .iconfont {
        height: 70px;
        line-height: 70px;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
        color: $first;
        user-select: none;
        -moz-user-select: none;
      }

      .iconfont:hover {
        color: white;
      }
    }

    .btn-more:hover {
      color: $white;
    }
  }

  .bar-right {
    // flex 1
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    height: $height;
    position: relative;
    background-color: $background-dark;
  }
  .group-live {
    position relative
    top 10px
    left 25px
    width 30px
    height 30px
    background url('../../assets/image/live-icon-gray.png') center no-repeat
    background-size cover
    cursor pointer
  }
}
</style>
