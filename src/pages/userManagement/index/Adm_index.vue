<template>
<div>
  <el-row class="home" :gutter="20">
    <el-col :span="10" >
      <div class="home-time">
       <div class="div">
         <p class="p1">今日咨询数</p>
         <p class="p2">{{todayNum}}</p>
       </div>
       <div class="div">
         <p class="p1">今日咨询时长</p>
         <p class="p2">{{todayTime}}</p>
       </div>
      </div>

    </el-col>
    <el-col style="background: #fff;" :span="14" >
        <div style=" "><LineChart/></div>
    </el-col>
</el-row>
<el-row style="margin-top:20px;height:245px;overflow:hidden" :gutter="20">
  <el-col style="background: #fff;height:300px" :span="10" >
    <div style="padding:10px 20px;border-bottom: 1px solid #f4f4f5;line-height:28px">在线咨询师
      <el-pagination
        style="float:right"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPageCoun"
        :page-size="pageSizeCoun"
        layout="prev, pager, next"
        :total="countList.length">
      </el-pagination>
    </div>
    <div class="content">
      <div v-for="item in pageDataCoun" :key="item.name" class="item-box">
        <span>{{item.coun_name}}</span>
        <el-tag v-if="item.coun_status ==='忙碌'"  type="danger" style="float:right">{{item.coun_status}}</el-tag>
         <el-tag v-if="item.coun_status ==='空闲'"  type="success" style="float:right">{{item.coun_status}}</el-tag>
      </div>
    </div>
  </el-col>
  <el-col style="background: #304156;height:100%" :span="3" >
    <div class="sun-static">
      <div class="title">在线咨询师会话</div>
      <div class="num">{{onlineCoun_conversation_num}}</div>
      <!-- <div class="num">{{countList.length}}</div> -->
      <!-- //在线咨询师个数 -->
    </div>
  </el-col>
  <el-col style="background: #fff;height:300px"  :span="8" >
    <div  style="height:300px">
      <div style="padding:10px 20px;border-bottom:1px soild #f4f4f5;line-height:28px">在线督导
      <el-pagination
        style="float:right"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPageSup"
        :page-size="pageSizeSup"
        layout="prev, pager, next"
        :total="superList.length">
      </el-pagination>
      <div class="content">
      <div v-for="item in pageDataSup" :key="item.name" class="item-box" style="width:100%">
        <span>{{item.sup_name}}</span>
         <el-tag v-if="item.sup_status ==='忙碌'"  type="danger" style="float:right">{{item.sup_status}}</el-tag>
         <el-tag v-if="item.sup_status ==='空闲'"  type="success" style="float:right">{{item.sup_status}}</el-tag>
      </div>
    </div>
    </div>
    </div>
  </el-col>
  <el-col style="background: #304156;height:100%" :span="3" >
    <div class="sun-static">
      <div class="title">在线督导会话</div>
      <div class="num">{{onlineSup_conversation_num}}</div>
      <!-- <div class="num">{{superList.length}}</div> -->
    </div>
  </el-col>
</el-row>
<el-row style="margin-top:20px" :gutter="20">
  <el-col style="background: #fff;" :span="10" >
    <div style="padding:10px 20px;line-height:28px">7日咨询数量统计
    </div>
    <div >
      <MonthSumChart/>
    </div>
  </el-col>
  <el-col :span="7" >
    <div style="background: #fff;height:288px" >
      <div style="padding:10px 20px;line-height:28px">当月咨询数排行榜
    </div>
    <div class="rank-box">
      <div v-for="(item,index) in MonthRankData.slice(0,4)" :key="index" class="rank-item">
          <span>{{item.coun_name}}</span>
          <span style="float:right">{{item.total_num_thisMonth}}</span>
        </div>
    </div>
    </div>

  </el-col>
  <el-col :span="7"  style="background: #fff;">
    <div style="background: #fff;height:288px" >
      <div style="padding:10px 20px;line-height:28px">咨询师评分排行榜
    </div>
    <div class="rank-box">
        <div v-for="(item,index) in counRankData.slice(0,4)" :key="index"  class="rank-item">
          <span>{{item.coun_name}}</span>
          <span style="float:right">{{item.avg_score}}</span>
        </div>
    </div>

    </div>

  </el-col>
</el-row>
</div>

</template>

<script>



//import {getData} from '../../api/data.js'
// import * as echarts from 'echarts'

// import Echart from '../../src/components/ECharts'
import LineChart from './components/line-chart.vue'
import MonthSumChart from './components/MonthSumChart.vue'
export default {
  name:'home',
components:{
  LineChart,
  MonthSumChart
},
    data() {
        return {
          todayNum:0,
          todayTime:0,
          user_name:JSON.parse(sessionStorage.getItem('GET_USER_INFO')).userID,
          user_id:sessionStorage.getItem('user_id'),
          //  userImg:require('../../../assets/image/user.png'),
          onlineCoun_conversation_num:0,
          onlineSup_conversation_num:0,
          echartData:{
            order:{
                xData:[],
                series:[]
            },
            user:{
                xData:[],
                series:[]
            },
            video:{
                series:[]
            }
          },
          countList:[],
          superList:[],
          pageSizeCoun: 9,
          pageSizeSup: 3,
          pageDataCoun: [],
          pageDataSup: [],
          currentPageCoun: 1,
          currentPageSup: 1,
        }
    },
    mounted() {
      //  getData().then(res=>{
      //      const{code,data}=res.data
      //  })
      this.getInfo(),
      this.getCounRank()
      this.getCounThisMonthRank()
      this.getCounList()
      this.getSupList()
      this.getTodayNum()
      this.getTodayTime()
      this.getOnlineCounConversationNum()
      this.getOnlineSupConversationNum()
    },
    methods: {
      // 获取个人信息
      getInfo() {
        this.$ajax.get('/auth/getInfo',{params: {user_name: this.user_name}}).then(res=>{
          console.log(res,123)
        })
      },
      // 获取所有咨询师评分排行
      getCounRank() {
        this.$ajax.get('/admin/counsellorScoreRank',{params: {user_id: this.user_id}}).then(res=>{
          console.log(res.data,222)
          if(res.data) {
            this.counRankData=res.data
          }
        })
      },
      // 获取当前咨询师会话数
      getOnlineCounConversationNum() {
        this.$ajax.get("/admin/getOnlineCounConversationNum", {params: {user_id: this.user_id}}).then((res) => {
              if (res.data) {
                this. onlineCoun_conversation_num = res.data.onlineCoun_conversation_num;
                console.log(this. onlineCoun_conversation_num);
              }
            })},
        // 获取当前督导会话数
      getOnlineSupConversationNum() {
        this.$ajax.get("/admin/getOnlineSupConversationNum", {params: {user_id: this.user_id}}).then((res) => {
              if (res.data) {
                this. onlineSup_conversation_num = res.data.onlineSup_conversation_num;
                console.log(this. onlineSup_conversation_num);
              }
            })},
      // 获取所有咨询师评分排行
      getCounRecordNum() {
        this.$ajax.get('/admin/counsellorScoreRank',{params: {user_id: this.user_id}}).then(res=>{
          console.log(res.data,222)
          if(res.data) {
            this.counRankData=res.data
          }
        })
      },
      // 获取咨询师排行榜
      getCounThisMonthRank() {
        this.$ajax.get('/admin/numThisMonthRank',{params: {user_id: this.user_id}}).then(res=>{
          console.log(res.data,222)
          if(res.data) {
            this.MonthRankData=res.data
          }
        })
      },
      // 获取当前在线咨询师列表
      getCounList() {
        this.$ajax.get('/admin/onlineCounsellorList',{params: {user_id: this.user_id}}).then(res=>{
          console.log(res.data,222)
            this.countList = res.data;
          for(var i = 0;i <this.countList.length ; i++)
          {
              // if(this.countList[i].coun_name.length>4)
              //     this.countList[i].coun_name= countList[i].coun_name.slice(0,4)    
              if(this.countList[i].coun_status==="free")
              {
                this.countList[i].coun_status="空闲"
              }
              else if(this.countList[i].coun_status==="busy")
              {
                this.countList[i].coun_status="忙碌"
              }
          }
          this.getPageDataCoun()
        })
      },
      // 获取当前督导在线列表
      getSupList() {
        this.$ajax.get('/admin/onlineSupervisorList',{params: {user_id: this.user_id}}).then(res=>{
          console.log(res.data,222)
            this.superList = res.data;
          for(var i = 0;i <this.superList.length ; i++) {
              if(this.superList[i].sup_status=="free") {
                this.superList[i].sup_status="空闲"
              }
              else if(this.superList[i].sup_status=="busy") {
                this.superList[i].sup_status="忙碌"
              }
          }
          this.getPageDataSup();
        })
      },
      getPageDataSup() {
        let start = (this.currentPageSup - 1) * this.pageSizeSup;
        let end = start + this.pageSizeSup;
        this.pageDataSup = this.superList.slice(start, end);
      },
      getPageDataCoun() {
        let start = (this.currentPageCoun - 1) * this.pageSizeCoun;
        let end = start + this.pageSizeCoun;
        this.pageDataCoun = this.countList.slice(start, end);
      },
      handleCurrentChange() {
        this.getPageDataSup();
        this.getPageDataCoun();
      },
      // 获取今日咨询数
      getTodayNum() {
        this.$ajax.get('/admin/todayNum',{params: {user_id: this.user_id}}).then(res=>{
          if(res.data) {
            this.todayNum=res.data[0].today_num
          }
        })
      },
      // 获取今日时长
      getTodayTime() {
        this.$ajax.get('/admin/todayTime',{params: {user_id: this.user_id}}).then(res=>{
          if(res.data) {
            this.todayTime=res.data[0].today_time
            var hour = parseInt(this.todayTime / 3600) < 10 ? '0' + parseInt(this.todayTime / 3600) : parseInt(this.todayTime / 3600)
            var min = parseInt(this.todayTime% 3600 / 60) < 10 ? '0' + parseInt(this.todayTime % 3600 / 60) : parseInt(this.todayTime % 3600 / 60)
            var sec = parseInt(this.todayTime % 3600 % 60) < 10 ? '0' + parseInt(this.todayTime % 3600 % 60) : parseInt(this.todayTime % 3600 % 60)
            this.todayTime = hour + ':' + min + ':' + sec
          }
        })
      }

    }
}
</script>


<style scoped>
.col_2{
   height: 100px;
}
.home-time{
   display: flex;
   background: #fff;
   text-align: center;
   height: 240px;
}
.div{
   width: 50%;
   padding-top: 30px;
}
.div .p1{
  color:#999;
}
.p2{
  font-size:50px;
}

.item-box{
  padding: 16px;
  width: 33%;
  float:left;
  line-height: 32px;
  border-bottom: 1px solid #f4f4f5;
  border-right:1px solid #f4f4f5
}

.sun-static{
  display: flex;
  flex-direction: column;
  text-align: center;
  color: #fff;
  padding: 50px 0;
  height: 100%;
}
.sun-static .num{
  font-size: 30px;
  font-weight: 700;
  margin-top: 40px;
}
.rank-box{
  padding: 10px;
}

.rank-item{
  padding: 10px;
  line-height: 30px;
}
.rank-item:first-child::before{
  content:'1';
  font-size:16px;
  font-weight: 700;
  color:red;
  margin-right: 10px;
}
.rank-item:nth-child(2)::before{
  content:'2';
  font-size:16px;
  font-weight: 700;
  color:blue;
   margin-right: 10px;
}
.rank-item:nth-child(3)::before{
  content:'3';
  font-size:16px;
  font-weight: 700;
  color:green;
   margin-right: 10px;
}
.rank-item:nth-child(4)::before{
  content:'4';
  font-size:16px;
  font-weight: 700;
  color:black;;
   margin-right: 10px;
}

</style>
