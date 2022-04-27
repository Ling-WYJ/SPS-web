<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header class="head" height="100px">
      <h2>社会心理服务平台</h2>
      <h4>个人信息</h4>
    </el-header>
    <!-- 主区域 -->
    <el-main>
      <data-table></data-table>
      <data-table2></data-table2>
      <data-table3></data-table3>
    </el-main>
  </el-container>
</template>

<script >
import DataTable from './Sup_dataTable'
import DataTable2 from './Coun_dataTable'
import DataTable3 from './Adm_dataTable'
export default {
    data() {
        return {}
    },
    components: {
      DataTable,
      DataTable2,
      DataTable3
    },
    created() {
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
