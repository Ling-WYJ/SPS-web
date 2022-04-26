<template>
<div>
  <el-row class="card" :gutter="20" type="flex">
    <el-col :span="5" class="user_card">
      <el-card :body-style="{ padding: '0px' }" >
        <div class="name" style="height:240px;padding:20px">
          <div class="name" style="margin:12px 0">督导：{{user_name}}</div>
        </div>
      </el-card>
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
          <div class="title">累计完成咨询</div>
          <div class="num">{{ all_num }}</div>
          <div class="title" style="margin-top: 20px">累计完成时长</div>
          <div class="num">{{ all_minitus ? all_minitus : 0 }}</div>
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

// import Echart from '../../src/components/ECharts'
import DataTable from "./components/DataTablePart";

export default {
  name: "home",

  data() {
    return {
      countList: [],
      scheduleData: [],
      user_name: JSON.parse(sessionStorage.getItem("GET_USER_INFO")).userID,
      rate: "",
      data: [],
      user_id: sessionStorage.getItem("user_id"),
      today_num: 0,
      today_time: 0,
      all_num: 0,
      all_minitus: 0,
    };
  },
  mounted() {
    this.reLogin();
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
    reLogin() {
      const user_name =
        JSON.parse(window.sessionStorage.GET_USER_INFO).userID || "";
      const userSig =
        JSON.parse(window.sessionStorage.GET_USER_INFO).userSig || "";
      if (user_name != "" && userSig != "") {
        this.tim.login({
          userID: user_name,
          userSig,
        });
        this.loading = false;
        let promise = this.tim.updateMyProfile({
          role: 1,
        });
        promise.then(function () {
          console.log("身份信息已更新");
        });
      } else {
        this.$router.push({ path: "/login" });
      }
    },
    // 日期转换
    processDate(date) {
      console.log(
        new Date(new Date(date).getTime() - 86400000)
          .toISOString()
          .split("T")[0]
      );
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
          console.log(res.data, 222);
          if (res.data) {
            this.countList = res.data;
          }
        });
    },
    getSchedule() {
      this.$ajax
        .get("/schedule/list", { params: { user_id: this.user_id } })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.scheduleData = res.data;
            console.log(res.data);
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
            // this.user_id=this.data.user_id
            // this.user_name=this.data.user_name
            this.getScore(this.user_id);
            this.getTodayNum(this.user_id);
            this.getTodayTime(this.user_id);
            this.getSum(this.user_id);
          }
        });
    },
    getScore(user_id) {
      console.log(this.user_id);
      this.$ajax
        .get("/feedback/score", { params: { coun_id: user_id } })
        .then((res) => {
          console.log(res);
          if (res.data) {
            this.score = res.data.score;
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
            console.log(this.today_num, 111);
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
  padding: 50px 0;
  height: 100%;
}
.sun-static .num {
  font-size: 30px;
  font-weight: 700;
  margin-top: 40px;
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
