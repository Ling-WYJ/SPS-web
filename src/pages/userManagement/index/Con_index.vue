<template>
  <div>
    <el-row class="card" :gutter="20" type="flex">
      <el-col :span="7" class="user_card">
        <el-card
          :body-style="{ padding: '0px' }"
          style="height: 300px; padding: 30px"
        >
          <div class="name" style="margin: 12px 0">咨询师：{{ user_name }}</div>
          <div class="name" style="margin: 12px 0">咨询师状态：{{ status }}</div>
          <div class="title" style="margin-bottom: 15px">我的综合评价</div>
          <!-- <ul class="star" style="padding:0;margin:12px 0"> -->
          <!-- eslint-disable-next-line -->
          <!-- <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" track-by="index"></span> -->
          <!--性能优化 track-by 数据不改变时不会重新渲染-->
          <!-- </ul> -->
          <!-- <el-rate value="rate"></el-rate> -->
          <el-rate
            v-model="rate"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          
          </el-rate>

        </el-card>
      </el-col>
      <el-col style="background: #304156; height: 100%" :span="3" class="user_card">
        <div class="sun-static" style="height: 300px">
          <div class="title">累计完成咨询</div>
          <div class="num">{{ all_num }}</div>
          <div class="title" style="margin-top: 20px">累计完成时长</div>
          <div class="num">{{ all_minitus }}</div>
        </div>
      </el-col>
      <el-col :span="10" style="position: absolute; left: 0; top: 320px;">
        <div class="home-time" style="height: 340px">
          <div class="div">
            <p class="p1">今日咨询数</p>
            <p class="p2">{{ today_num }}</p>
          </div>
          <div class="div">
            <p class="p1">今日咨询时长</p>
            <p class="p2">{{ today_time }}</p>
          </div>
          <div class="div">
            <p class="p1">当前会话数</p>
            <p class="p2">{{conversation_num}}</p>
          </div>
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
  </div>
</template>

<script>
//import {getData} from '../../api/data.js'
// import * as echarts from 'echarts'

// import Echart from '../../src/components/ECharts'
import DataTable from "./components/DataTablePart";

export default {
    name:'home',

    data() {
        return {
          user_id:sessionStorage.getItem('user_id'),
          user_name:JSON.parse(sessionStorage.getItem('GET_USER_INFO')).userID,
          score: [],
          scheduleData:[],
          today_num:0,
          today_time:0,
          all_num:0,
          all_minitus:0,
          conversation_num:0,
          status:[]
          // rate:0
        }
    },
    components: {
      DataTable
    },
    created() {
      console.warn('record')
    },
    mounted() {
      this.reLogin();
      this.update();
      this.getSchedule();
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
          role: 0,
        });
        promise.then(function () {
          console.log("身份信息已更新");
        });
      } else {
        this.$router.push({ path: "/login" });
      }
    },
    // 咨询师状态
    getTodayNum(user_id) {
      this.$ajax
          .get("/record/todayNum", {params: {user_id}})
          .then((res) => {
            if (res.data) {
              this.today_num = res.data[0].today_num;
              console.log(this.today_num, 111);
            }
          });
    },
    // 获取今日咨询数
    getTodayNum(user_id) {
      this.$ajax
          .get("/record/todayNum", {params: {user_id}})
          .then((res) => {
            if (res.data) {
              this.today_num = res.data[0].today_num;
              console.log(this.today_num, 111);
            }
          });
    },
    // 获取当前会话数
    getConversationNum(coun_id) {
      this.$ajax.get("/counsellor/getConversationNum", {params: {coun_id}}).then((res) => {
            if (res.data) {
              this.conversation_num = res.data.conversation_num;
              console.log(this.conversation_num,456);
            }
          })},
      // 获取今日咨询时长
      getTodayTime(user_id)
      {
        this.$ajax.get('/record/todayTime', {params: {user_id}}).then((res) => {
          if (res.data) {
            this.today_time = res.data[0].today_time;
          }
        })
      }
    ,
      // 获取累计完成时长和累计数
      getSum(user_id)
      {
        this.$ajax.get('/record/allNumandTime', {params: {user_id}}).then((res) => {
          if (res.data) {
            this.all_num = res.data[0].all_num
            this.all_minitus = res.data[0].all_minitus
          }
        })
      }
    ,
      // 日期转换
      processDate(date)
      {
        console.log(new Date(new Date(date).getTime() - 86400000).toISOString().split('T')[0])
        // return new Date(date).toISOString().split('T')[0]
        return new Date(new Date(date).getTime() + 86400000).toISOString().split('T')[0]
      }
    ,
      getScore(user_id)
      {
        console.log(this.data.user_id)
        this.$ajax.get('/feedback/score', {params: {coun_id: user_id}}).then((res) => {
          console.log(res)
          if (res.data) {
            this.score = res.data.score
          }
        })
      }
    ,
      update()
      {
        this.$ajax.get('/auth/getInfo', {params: {user_name: this.user_name}}).then((res) => {
          if (res.data) {
            this.data = res.data 
            this.status= res.data.coun_status
            this.getScore(this.user_id)
            this.getTodayNum(this.user_id)
            this.getTodayTime(this.user_id)
            this.getSum(this.user_id)
            this.getConversationNum(this.user_id)
           
          }
        })
      }
    ,

      setSch(day)
      {
        const item = this.scheduleData.find(item => this.processDate(item.date) === day)
        return item ? '值班' : ''
      }
    ,
      getSchedule()
      {
        this.$ajax.get('/schedule/list', {params: {user_id: this.user_id}}).then((res) => {
          console.log(res)
          if (res.data) {
            this.scheduleData = res.data
          }
        })
      }
    ,
    },
    computed:{ //计算属性
      rate() {
      let result = 0
      let score = Math.floor(this.score * 2 ) / 2
      let hasDecimal = score % 1 !== 0
        console.log(score)
      let integer = Math.floor(score)
        console.log(integer)
      for(let i=0;i<integer;i++) {
        // result.push('on')
        result++;
      }
      console.log(result)
      if(hasDecimal) {
        // result.push('half')
        result = result + 0.5;
      }
     /* while(result.length < 5) {
        // result.push('off')
      }*/
      return result
    },
    userName() {
      return this.$store.state.user.userID;
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

.star {
  font-size: 0;
}
.star-item {
  display: inline-block;
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  margin-right: 0px;
  background-size: 100%;
}
.star-item.on {
  background-image: url(~@/assets/image/on.png);
}
.star-item.half {
  background-image: url(~@/assets/image/half.png);
}
.star-item.off {
  background-image: url(~@/assets/image/off.jpeg);
}
</style>
