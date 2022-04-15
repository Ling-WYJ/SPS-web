<template>
<div>
  
  <el-row class="card" :gutter="20" type="flex">
    
    <el-col :span="7" class="user_card">
      <el-card :body-style="{ padding: '0px' }">
        <div class="sun-static">
        <img src="..\..\..\assets\image\user.png" class="image">
        <div class="title">累计完成咨询</div>
          <div class="num">43</div>
        </div>
      </el-card>
      </el-col>
    <el-col style="background: #304156;height:100%" :span="3" class="user_card" >
        <div class="sun-static">
          <div class="title">累计完成咨询</div>
          <div class="num">33</div>
        </div>
    </el-col>
    <el-col :span="14" >
     <el-calendar v-model="choseDay">
          <!-- <template
            slot="dateCell"
            slot-scope="{date, data}">
            
            <p @click="calendar_event(date)" >
              {{ data.day.split('-').slice(1).join('-') }}
            </p>
          </template> -->
          <template
            slot="dateCell"
            slot-scope="{ data}">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '' : ''}}
            </p>
            <div  style="padding:0 0 0 20px">
              <label>值班</label><br/>    
            </div>
          </template>
        </el-calendar>
    </el-col>  
    
</el-row>
 <el-row class="home" :gutter="20">
    <el-col :span="10" >
      <div class="home-time">
       <div class="div">
         <p class="p1">今日咨询数</p>
         <p class="p2">35</p>
       </div>
       <div class="div">
         <p class="p1">今日咨询时长</p>
         <p class="p2">6:12:30</p>
       </div>
      </div>
    </el-col >
    <el-col :span="14" >
      <data-table></data-table>
    </el-col >
</el-row>
 

</div>

</template>

<script>



//import {getData} from '../../api/data.js'
// import * as echarts from 'echarts'

// import Echart from '../../src/components/ECharts'
import DataTable from './components/DataTablePart'

export default {
    name:'home',

    data() {
        return {}
    },components:{
      DataTable
    },
    created() {
    console.warn('record')
    },
     methods: {}
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
  color:#f4f4f5;;
   margin-right: 10px;
}
.image{
    width: 100%;
    display: block;
    width:60px;
    height: 60px;
    left: 100px;
		top: 100px
}

</style>