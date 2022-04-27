<template>
  <div>
    <el-row class="card" :gutter="20" type="flex">
      <el-col :span="5" class="user_card">
        <el-card :body-style="{ padding: '0px' }">
          <div class="name" style="height: 240px; padding: 20px">
            <div class="name" style="margin: 12px 0">督导：{{ sup_name }}</div>
             <div class="name" style="margin: 12px 0">状态：{{ status }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <div class="home-time">
          <div class="div">
            <p class="p1">今日咨询数</p>
            <p class="p2">{{ today_num }}</p>
          </div>
          <div class="div">
            <p class="p1">今日咨询时长</p>
            <p class="p2">{{ today_time }}</p>
          </div>
        </div>
      </el-col>
      <el-col
        style="
          background: #fff;
          position: absolute;
          top: 260px;
          left: 10px;
          height: 400px;
        "
        :span="9"
      >
        <div
          style="
            padding: 10px 20px;
            border-bottom: 1px solid #f4f4f5;
            line-height: 28px;
          "
        >
          在线咨询师
          <el-pagination
            style="float: right"
            background
            :page-size="9"
            layout="prev, pager, next"
            :total="countList.length"
          >
          </el-pagination>
        </div>
        <div class="content">
          <div v-for="item in countList" :key="item.name" class="item-box">
            <span>{{ item.coun_name }}</span>
            <el-tag type="success" style="float: right">{{item.coun_status}}</el-tag>
          </div>
        </div>
      </el-col>
      <el-col
        style="
          background: #304156;
          height: 100%;
          position: absolute;
          top: 260px;
          left: 39%;
          height: 400px;
        "
        :span="3"
        class="user_card"
      >
        <div class="sun-static">
          <div class="title">正在进行会话</div>
          <div class="num">{{ conversation_num }}</div>
        </div>
      </el-col>
      <el-col :span="14">
        <el-calendar v-model="choseDay">
          <!-- <template
            slot="dateCell"
            slot-scope="{date, data}">

            <p @click="calendar_event(date)" >
              {{ data.day.split('-').slice(1).join('-') }}
            </p>
          </template> -->
          <template slot="dateCell" slot-scope="{ data }">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split("-").slice(1).join("-") }}
              {{ data.isSelected ? "" : "" }}
            </p>
            <div style="padding: 0 0 0 20px">
              <label>{{ setSch(data.day) }}</label
              ><br />
            </div>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
    <el-row class="home" :gutter="20">
      <el-col :span="24">
        <data-table></data-table>
      </el-col>
    </el-row>
    <!-- <el-row style="margin-top:20px;height:245px;overflow:hidden" :gutter="20">

</el-row>  -->
  </div>
</template>

<script>
//import {getData} from '../../api/data.js'
// import * as echarts from 'echarts'
import { mapState } from 'vuex'
// import Echart from '../../src/components/ECharts'
import DataTable from "./components/DataTablePart";

export default {
  name: "home",

  data() {
    return {
      countList: [],
      scheduleData: [],
      user_name: JSON.parse(sessionStorage.getItem("GET_USER_INFO")).userID,
      user_id: sessionStorage.getItem("user_id"),
      rate: "",
      data: [],
      today_num: 0,
      today_time: 0,
      all_num: 0,
      all_minitus: 0,
      conversation_num: 0,
      status: [],
    };
  },
  computed: {
    ...mapState({
      isSDKReady: (state) => state.user.isSDKReady,
      userID: (state) => state.user.userID,
      userSig: (state) => state.user.userSig,
      sdkAppID: (state) => state.user.sdkAppID,
    }),
  },
  mounted() {
    // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
    this.tim.on(this.TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this);
    // SDK NOT READT
    this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onReadyStateUpdate, this);
    // SDK内部出错
    this.tim.on(this.TIM.EVENT.ERROR, this.onError);
    if (!this.isSDKReady) {
      this.reLogin();
    }
    this.getCounList();
    this.getSchedule();
    this.update();
  },
  components: {
    DataTable,
  },
  created() {
    console.warn("record");
  },
  methods: {
    onError({ data }) {
      if (data.message !== "Network Error") {
        this.$store.commit("showMessage", {
          message: data.message,
          type: "error",
        });
      }
    },
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
        this.tim.updateMyProfile({
          role: 1,
        }).then(function () {
          console.log("身份信息已更新");
        });
        this.$store.dispatch("getBlacklist");
        // 登录trtc calling
        this.trtcCalling.login({
          sdkAppID: this.sdkAppID,
          userID: this.userID,
          userSig: this.userSig,
        });
      }
    },
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
        this.loading = false;
      } else {
        this.$router.push({ path: "/login" });
      }
    },
    // 日期转换
    processDate(date) {
      // console.log(
      //   new Date(new Date(date).getTime() - 86400000)
      //     .toISOString()
      //     .split("T")[0]
      // );
      // return new Date(date).toISOString().split('T')[0]
      return new Date(new Date(date).getTime() + 86400000)
        .toISOString()
        .split("T")[0];
    },
    setSch(day) {
      const item = this.scheduleData.find(
        (item) => this.processDate(item.date) === day
      );
      return item ? "值班" : "";
    },
    getCounList() {
      this.$ajax
        .get("/supervisor/bindOnlineCounsellorList", {
          params: { user_id: this.user_id },
        })
        .then((res) => {
          // console.log(res.data, 222);
          this.countList = res.data;
          for(var i = 0;i <this.countList.length ; i++)
          {
                       
              if(this.countList[i].coun_status=="free")
              {
                this.countList[i].coun_status="空闲"
              }
              else if(this.countList[i].coun_status=="busy")
              {
                this.countList[i].coun_status="忙碌"
              }
          }
         
        });
    },
    getSchedule() {
      this.$ajax
        .get("/schedule/list", { params: { user_id: this.user_id } })
        .then((res) => {
          // console.log(res);
          if (res.data) {
            this.scheduleData = res.data;
            // console.log(res.data);
          }
        });
    },
    update() {
      this.$ajax
        .get("/auth/getInfo", { params: { user_name: this.user_name } })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.data = res.data;
            this.sup_name=this.data.sup_name
            // this.user_name=this.data.user_name
            // this.getScore(this.user_id);
            this.getTodayNum(this.user_id);
            this.getTodayTime(this.user_id);
            this.getSum(this.user_id);
            this.getConversationNum_sup(this.user_id);
            this.status= res.data.sup_status
            if(this.status=="free")
            {
              this.status="空闲"
            }
            else(this.status=="busy")
            {
              this.status="忙碌"
            }
          }
        });
    },
    //督导评分
    // getScore(user_id) {
    //   console.log(this.user_id);
    //   this.$ajax
    //     .get("/feedback/score", { params: { coun_id: user_id } })
    //     .then((res) => {
    //       console.log(res);
    //       if (res.data) {
    //         this.score = res.data.score;
    //       }
    //     });
    // },
   // 获取当前会话数
    getConversationNum_sup(sup_id) {
      this.$ajax.get("/supervisor/getConversationNum", { params: {sup_id}}).then((res) => {
          if (res.data) {
            this.conversation_num = res.data.conversation_num;
            console.log(this.conversation_num,222,sup_id);
               if(this.conversation_num > 1)
              {
                
                this.changeStatusBusy(sup_id);
              }
              else
              {
                this.changeStatusFree(sup_id);
              }
          }
        });
    },
    //置为free
         changeStatusFree(sup_id) {
          var Statuslist ={ sup_id: sup_id,sup_status: "free" }
          this.$ajax.put("/supervisor/changeStatus", Statuslist).then((res) => {
            if (res.data) {
              this.message = res.data.message;
              console.log(this.message, 111);
            }
          });
       },
    //置为busy
      changeStatusBusy(sup_id) {
          var Statuslist ={ sup_id: sup_id,sup_status: "busy" }
          this.$ajax.put("/supervisor/changeStatus", Statuslist).then((res) => {
            if (res.data) {
              this.message = res.data.message;
              console.log(this.message, 111);
            }
          });
    },



    // 获取今日咨询数
    getTodayNum(user_id) {
      this.$ajax
        .get("/record/todayNum", { params: { user_id } })
        .then((res) => {
          if (res.data) {
            this.today_num = res.data[0].today_num;
            // console.log(this.today_num, 111);
          }
        });
    },
    // 获取今日咨询时长
    getTodayTime(user_id) {
      this.$ajax
        .get("/record/todayTime", { params: { user_id } })
        .then((res) => {
          if (res.data) {
            this.today_time = res.data[0].today_time;
          }
        });
    },
    // 获取累计完成时长和累计数
    getSum(user_id) {
      this.$ajax
        .get("/record/allNumandTime", { params: { user_id } })
        .then((res) => {
          if (res.data) {
            this.all_num = res.data[0].all_num;
            this.all_minitus = res.data[0].all_minitus;
          }
        });
    },
  },
};
</script>


<style scoped>
.col_2 {
  height: 100px;
}
.home-time {
  display: flex;
  background: #fff;
  text-align: center;
  height: 240px;
}
.div {
  width: 50%;
  padding-top: 30px;
}
.div .p1 {
  color: #999;
}
.p2 {
  font-size: 50px;
}

.item-box {
  padding: 16px;
  width: 33%;
  float: left;
  line-height: 32px;
  border-bottom: 1px solid #f4f4f5;
  border-right: 1px solid #f4f4f5;
}

.sun-static {
  display: flex;
  flex-direction: column;
  text-align: center;
  color: #fff;
  padding: 150px 0;
  height: 100%;
}
.sun-static .num {
  font-size: 30px;
  font-weight: 800;
  margin-top: 50px;
}
.rank-box {
  padding: 10px;
}

.rank-item {
  padding: 10px;
  line-height: 30px;
}
.rank-item:first-child::before {
  content: "1";
  font-size: 16px;
  font-weight: 700;
  color: red;
  margin-right: 10px;
}
.rank-item:nth-child(2)::before {
  content: "2";
  font-size: 16px;
  font-weight: 700;
  color: blue;
  margin-right: 10px;
}
.rank-item:nth-child(3)::before {
  content: "3";
  font-size: 16px;
  font-weight: 700;
  color: green;
  margin-right: 10px;
}
.rank-item:nth-child(4)::before {
  content: "4";
  font-size: 16px;
  font-weight: 700;
  color: #f4f4f5;
  margin-right: 10px;
}
.image {
  width: 100%;
  display: block;
  width: 60px;
  height: 60px;
  left: 100px;
  top: 100px;
}
</style>
