<template>
  <div
    class="loading"
    v-loading="showLoading"
    element-loading-text="正在拼命初始化..."
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="chat-wrapper">
      <el-row>
        <el-col :xs="10" :sm="8" :md="8" :lg="6" :xl="6">
          <side-bar-sup />
        </el-col>
        <el-col :xs="7" :sm="8" :md="8" :lg="9" :xl="9">
          <current-conversation />
        </el-col>
        <el-col :xs="7" :sm="8" :md="8" :lg="9" :xl="9">
          <!-- <current-conversation /> -->
          <div class="syncChat" v-if="showCurrentConversation">
            <div class="synChat-title">{{coun}}和{{visitor}}的会话</div>
            <div class="synChat-dialog-section" ref="sync-list" @scroll="this.onScroll">
              <div :label="m.message_key" v-for="m in message" :key="m.message_key">
                <div class="synChat-message-box">
                  <div class="synChat-message-box-top">
                    <div class="synChat-message-box-name">{{m.from_name}}</div>
                    <div class="synChat-message-box-time">{{new Date(m.msg_time).toLocaleString()}}</div>
                  </div>
                  <div class="synChat-message-box-bottom">{{m.text}}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <calling ref="callLayer" class="chat-wrapper" />
    <image-previewer />
    <group-live />
  </div>
</template>

<script >
import { Notification } from "element-ui";
import { mapState } from "vuex";
import CurrentConversation from "@/components/conversation/current-conversation";
import SideBarSup from "@/components/layout/side-bar-sup";
// import Login from '@/components/user/login'
import ImagePreviewer from "@/components/message/image-previewer.vue";
// import QrCodeList from '@/components/qr-code-list'
import { translateGroupSystemNotice } from "@/utils/common";
import GroupLive from "@/components/group-live/index";
import Calling from "@/components/message/trtc-calling/calling-index";
import { ACTION } from "@/utils/trtcCustomMessageMap";
export default {
  name: "chat",
  data() {
    return {
      message: [
        {
          "message_key": '1',
          "from_user": "zhqtest",
          "to_user": "coun",
          "msg_time": "2022-04-27T06:40:10.000Z",
          "text": "test3",
          "from_name": "张好奇",
          "to_name": "欧豪"
        },
        {
          "message_key": '2',
          "from_user": "zhqtest",
          "to_user": "coun",
          "msg_time": "2022-04-27T06:41:41.000Z",
          "text": "[访客给出评价]",
          "from_name": "张好奇",
          "to_name": "欧豪"
        }
    ],
      coun: "欧豪",
      visitor: "张好奇",
    };
  },
  components: {
    SideBarSup,
    CurrentConversation,
    ImagePreviewer,
    GroupLive,
    Calling,
  },
  computed: {
    ...mapState({
      currentUserProfile: (state) => state.user.currentUserProfile,
      currentConversation: (state) => state.conversation.currentConversation,
      videoCall: (state) => state.conversation.videoCall,
      audioCall: (state) => state.conversation.audioCall,
      isSDKReady: (state) => state.user.isSDKReady,
      isBusy: (state) => state.video.isBusy,
      userID: (state) => state.user.userID,
      userSig: (state) => state.user.userSig,
      sdkAppID: (state) => state.user.sdkAppID,
    }),
    // 是否显示 Loading 状态
    showLoading() {
      return !this.isSDKReady;
    },
    showCurrentConversation() {
      return !!this.currentConversation.conversationID
    },
  },
  mounted() {
    // 初始化监听器
    this.initListener()
    if (!this.isSDKReady){
      this.reLogin()
    }
  },
  watch: {},

  methods: {
    reLogin() {
      const user_name =
        JSON.parse(window.sessionStorage.GET_USER_INFO).userID || "";
      const userSig =
        JSON.parse(window.sessionStorage.GET_USER_INFO).userSig || "";
      if (user_name != "" && userSig != "") {
        this.tim
          .login({
            userID: user_name,
            userSig,
          })
          .then(async () => {
            this.$store.commit("toggleIsLogin", true);
            this.$store.commit("startComputeCurrent");
          });
      } else {
        this.$router.push({ path: "/login" });
      }
    },
    initListener() {
      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
      // SDK NOT READT
      this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this);
      // 被踢出
      this.tim.on(this.TIM.EVENT.KICKED_OUT, this.onKickOut);
      // SDK内部出错
      this.tim.on(this.TIM.EVENT.ERROR, this.onError);
      // 收到新消息
      this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onReceiveMessage);
      // 会话列表更新
      this.tim.on(
        this.TIM.EVENT.CONVERSATION_LIST_UPDATED,
        this.onUpdateConversationList
      );
      // 群组列表更新
      this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onUpdateGroupList);
      // 网络监测
      this.tim.on(this.TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange);
      // 已读回执
      this.tim.on(
        this.TIM.EVENT.MESSAGE_READ_BY_PEER,
        this.onMessageReadByPeer
      );
      // 黑名单更新
      this.tim.on(this.TIM.EVENT.FRIEND_LIST_UPDATED, this.onFriendListUpdated);

      this.tim.on(
        this.TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED,
        this.onFriendApplicationListUpdated
      );

      this.tim.on(
        this.TIM.EVENT.FRIEND_GROUP_LIST_UPDATED,
        this.onFriendGroupListUpdated
      );
    },
    onScroll({ target: { scrollTop } }) {
      let messageListNode = this.$refs['sync-list']
      if (!messageListNode) {
        return
      }
      if (this.preScrollHeight - messageListNode.clientHeight - scrollTop < 20) {
        this.isShowScrollButtomTips = false
      }
    },
    onFriendApplicationListUpdated(data) {
      this.$store.commit(
        "updateApplicationList",
        data.data.friendApplicationList
      );
      this.$store.commit("updateUnreadCount", data.data.unreadCount);
    },
    onFriendListUpdated(data) {
      this.$store.commit("updateFriendList", data.data);
    },
    onFriendGroupListUpdated(data) {
      this.$store.commit("updateFriendGroupList", data.data);
    },

    onReceiveMessage({ data: messageList }) {
      this.handleVideoMessage(messageList);
      this.handleQuitGroupTip(messageList);
      this.handleCloseGroupLive(messageList);
      this.$store.commit("pushCurrentMessageList", messageList);
      this.$store.commit("pushAvChatRoomMessageList", messageList);
    },

    onError({ data }) {
      if (data.message !== "Network Error") {
        this.$store.commit("showMessage", {
          message: data.message,
          type: "error",
        });
      }
    },
    onMessageReadByPeer() {},
    onReadyStateUpdate({ name }) {
      const isSDKReady = name === this.TIM.EVENT.SDK_READY ? true : false;
      this.$store.commit("toggleIsSDKReady", isSDKReady);

      if (isSDKReady) {
        this.tim
          .getMyProfile()
          .then(({ data }) => {
            this.$store.commit("updateCurrentUserProfile", data);
          })
          .catch((error) => {
            this.$store.commit("showMessage", {
              type: "error",
              message: error.message,
            });
          });
          // this.loading = false;
        this.$store.dispatch("getBlacklist");
        // 登录trtc calling
        this.trtcCalling.login({
          sdkAppID: this.sdkAppID,
          userID: this.userID,
          userSig: this.userSig,
        });
      }
    },
    kickedOutReason(type) {
      switch (type) {
        case this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
          return "由于多实例登录";
        case this.TIM.TYPES.KICKED_OUT_MULT_DEVICE:
          return "由于多设备登录";
        case this.TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          return "由于 userSig 过期";
        default:
          return "";
      }
    },
    checkoutNetState(state) {
      switch (state) {
        case this.TIM.TYPES.NET_STATE_CONNECTED:
          return { message: "已接入网络", type: "success" };
        case this.TIM.TYPES.NET_STATE_CONNECTING:
          return { message: "当前网络不稳定", type: "warning" };
        case this.TIM.TYPES.NET_STATE_DISCONNECTED:
          return { message: "当前网络不可用", type: "error" };
        default:
          return "";
      }
    },
    onNetStateChange(event) {
      this.$store.commit(
        "showMessage",
        this.checkoutNetState(event.data.state)
      );
    },

    onKickOut(event) {
      this.$store.commit("showMessage", {
        message: `${this.kickedOutReason(event.data.type)}被踢出，请重新登录。`,
        type: "error",
      });
      this.$store.commit("toggleIsLogin", false);
      this.$store.commit("reset");
    },
    onUpdateConversationList(event) {
      this.$store.commit("updateConversationList", event.data);
    },

    onUpdateGroupList(event) {
      this.$store.commit("updateGroupList", event.data);
    },
    onReceiveGroupSystemNotice(event) {
      const isKickedout = event.data.type === 4;
      const isCurrentConversation =
        `GROUP${event.data.message.payload.groupProfile.groupID}` ===
        this.currentConversation.conversationID;
      // 在当前会话被踢，需reset当前会话
      if (isKickedout && isCurrentConversation) {
        this.$store.commit("resetCurrentConversation");
      }
      Notification({
        title: "新系统通知",
        message: translateGroupSystemNotice(event.data.message),
        duration: 3000,
        onClick: () => {
          const SystemConversationID = "@TIM#SYSTEM";
          this.$store.dispatch("checkoutConversation", SystemConversationID);
        },
      });
    },

    selectConversation(conversationID) {
      if (conversationID !== this.currentConversation.conversationID) {
        this.$store.dispatch("checkoutConversation", conversationID);
      }
    },
    isJsonStr(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (err) {
        return false;
      }
    },
    handleVideoMessage(messageList) {
      const videoMessageList = messageList.filter(
        (message) =>
          message.type === this.TIM.TYPES.MSG_CUSTOM &&
          this.isJsonStr(message.payload.data)
      );
      if (videoMessageList.length === 0) return;
      const videoPayload = JSON.parse(videoMessageList[0].payload.data);
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_DIALING) {
        if (this.isBusy) {
          this.$bus.$emit("busy", videoPayload, videoMessageList[0]);
          return;
        }
        this.$store.commit("GENERATE_VIDEO_ROOM", videoPayload.room_id);
        this.selectConversation(videoMessageList[0].conversationID); // 切换当前会话页
        if (videoMessageList[0].from !== this.userID) {
          this.$bus.$emit("isCalled");
        }
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_CANCEL) {
        this.$bus.$emit("missCall");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_REJECT) {
        this.$bus.$emit("isRefused");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_SPONSOR_TIMEOUT) {
        this.$bus.$emit("missCall");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ACCEPTED) {
        this.$bus.$emit("isAccept");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_HANGUP) {
        this.$bus.$emit("isHungUp");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_LINE_BUSY) {
        this.$bus.$emit("isRefused");
      }
      if (videoPayload.action === ACTION.VIDEO_CALL_ACTION_ERROR) {
        this.$bus.$emit("isRefused");
      }
    },
    /**
     * 使用 window.Notification 进行全局的系统通知
     * @param {Message} message
     */
    notifyMe(message) {
      // 需检测浏览器支持和用户授权
      if (!("Notification" in window)) {
        return;
      } else if (window.Notification.permission === "granted") {
        this.handleNotify(message);
      } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission().then((permission) => {
          // 如果用户同意，就可以向他们发送通知
          if (permission === "granted") {
            this.handleNotify(message);
          }
        });
      }
    },
    handleNotify(message) {
      const notification = new window.Notification("有人提到了你", {
        icon: "https://web.sdk.qcloud.com/im/assets/images/logo.png",
        body: message.payload.text,
      });
      notification.onclick = () => {
        window.focus();
        this.$store.dispatch("checkoutConversation", message.conversationID);
        notification.close();
      };
    },
    /**
     * 收到有群成员退群/被踢出的groupTip时，需要将相关群成员从当前会话的群成员列表中移除
     * @param {Message[]} messageList
     */
    handleQuitGroupTip(messageList) {
      // 筛选出当前会话的退群/被踢群的 groupTip
      const groupTips = messageList.filter((message) => {
        return (
          this.currentConversation.conversationID === message.conversationID &&
          message.type === this.TIM.TYPES.MSG_GRP_TIP &&
          (message.payload.operationType === this.TIM.TYPES.GRP_TIP_MBR_QUIT ||
            message.payload.operationType ===
              this.TIM.TYPES.GRP_TIP_MBR_KICKED_OUT)
        );
      });
      // 清理当前会话的群成员列表
      if (groupTips.length > 0) {
        groupTips.forEach((groupTip) => {
          if (
            Array.isArray(groupTip.payload.userIDList) ||
            groupTip.payload.userIDList.length > 0
          ) {
            this.$store.commit(
              "deleteGroupMemberList",
              groupTip.payload.userIDList
            );
          }
        });
      }
    },
    /**
     * 收到结束直播自定义消息，派发事件关闭组件
     * @param {Message[]} messageList
     */
    handleCloseGroupLive(messageList) {
      messageList.forEach((message) => {
        if (
          this.currentConversation.conversationID === message.conversationID &&
          message.type === this.TIM.TYPES.MSG_CUSTOM
        ) {
          let data = {};
          try {
            data = JSON.parse(message.payload.data);
          } catch (e) {
            data = {};
          }
          if (data.roomId && Number(data.roomStatus) === 0) {
            this.$bus.$emit("close-group-live");
          }
        }
      });
    },
  },
};
</script>

<style >
.loading {
  width: calc(100vw - 240px);
  height: calc(100vh - 90px);
}

.syncChat {
  border-left: 1px solid #ccc !important;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.synChat-title {
  padding: 0 20px;
  color: #1c2438;
  font-size: 18px;
  font-weight: bold;
  line-height: 50px;
  text-shadow: #76828c 0 0 0.1em;
  border-bottom: 1px solid #e7e7e7;
  height: 50px;
}

.synChat-dialog-section {
  height: calc(80vh - 50px);
  display: flex;
  flex-direction: column;
}

.synChat-message-box {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}

.synChat-message-box-top {
  display: flex;
  flex-direction: row;
  margin-left: 1rem;
  margin-bottom: 0.5rem;
}
.synChat-message-box-name {
  color: #222;
  margin-right: 2rem;
}
.synChat-message-box-bottom {
  margin-left: 1rem;
}

</style>
