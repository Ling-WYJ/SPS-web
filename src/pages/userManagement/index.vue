<template>
  <div class="user">
    <div class="left">
      <div class="sidebar-logo-container">社会心理服务平台</div>
      <div
        :class="{ cur: item.path == url }"
        v-for="(item, index) in list"
        :key="index"
        @click="handleClick(item)"
        class="sidebar-style"
      >
        {{ item.meta.title }}
      </div>
    </div>
    <div class="right">
      <div class="nav-bar">
        <Navbar />
      </div>
      <div class="app-mian">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script >
import { mapState } from "vuex";
import Navbar from "@/components/Navbar.vue";
export default {
  name: "userManagement",
  data() {
    return {
      isTitle: "",
      user_id: sessionStorage.getItem("user_id"),
      user_name: JSON.parse(sessionStorage.getItem("GET_USER_INFO")).userID,  
    };
  },
  components: { Navbar },
  computed: {
    ...mapState({
      userRole: (state) => state.user.role,
    }),
    url() {
      return this.$route.path;
    },
    list() {
      let role = "";
      if (this.userRole) {
        role = this.userRole;
      } else {
        role = JSON.parse(sessionStorage.getItem("GET_USER_INFO")).role;
      }
      return this.$router.options.routes[1].children.filter(
        (e) => e.role.includes(role) || e.role == "all"
      );
    },
  },
  created() {
    // console.log(this.url, "ppppp");
    // this.$router.push(this.list[0].path);
  },
  methods: {
    handleClick(data) {
      if (data.name === "chat-sup") {
        window.sessionStorage.setItem("isInChatSup", true);
      } else {
        window.sessionStorage.setItem("isInChatSup", false);
      }
      this.$router.push(data.path);
    },
    logout() {
      //offline
      this.getform()
      this.$store.dispatch("logout");
      window.sessionStorage.clear();
      window.localStorage.clear();
      this.$router.push("/login");
      
    },
    getform(){
        this.$ajax
        .get("/auth/getInfo", { params: { user_name: this.user_name } })
        .then((res) => {
          if (res.data) {
            this.data = res.data 
            this.role=res.data.role
            // this.status= res.data.coun_status
          }
          if(this.role=="supervisor")
          {
              this.offline_sup()
          }
          else if(this.role=="counsellor")
          {
              this.offline_con()
          }
        });
      },
      offline_sup(){
        var Statuslist ={ sup_id: this.user_id,sup_status: "offline" }
          this.$ajax.put("/supervisor/changeStatus", Statuslist).then((res) => {
            if (res.data) {
              this.message = res.data.message;
              console.log(this.message, 111);
            }
          });
      },
      offline_con(){
        var Statuslist ={ coun_id: this.user_id,coun_status: "offline" }
          this.$ajax.put("/counsellor/changeStatus", Statuslist).then((res) => {
            if (res.data) {
              this.message = res.data.message;
              console.log(this.message, 111);
            }
          });
      },
  },
};
</script>

<style   scoped>
.user {
  display: flex;
}
.left {
  -webkit-transition: width 0.28s;
  transition: width 0.28s;
  width: 200px !important;
  background-color: #304156;
  height: 100%;
  position: fixed;

  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  -webkit-box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
  box-shadow: 2px 0 6px rgb(0 21 41 / 35%);
  line-height: 50px;
  color: #fff;
}
.sidebar-style {
  color: rgb(191, 203, 217);
  text-align: center;
  z-index: 1002;
  font-size: 14px;
  cursor: pointer;
}
.right {
  display: inline-block;
  width: 100%;
  margin-left: 200px;
}
.app-mian {
  padding: 20px;
}
.nav-bar {
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
}
.cur {
  color: rgb(64, 158, 255);
}
</style>
