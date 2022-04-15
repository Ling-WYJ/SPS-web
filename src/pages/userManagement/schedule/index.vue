<template>
    <div class="main">
        <el-calendar v-model="choseDay">
          <template
            slot="dateCell"
            slot-scope="{ data}">
            <p :class="data.isSelected ? 'is-selected' : ''">
              {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
            </p>
            <div  style="padding:0 0 0 20px">
              <label>咨询师:{{setCounNum(data.day)}}</label><br/>
              <label>督导: {{setSupNum(data.day)}}</label><br/>
            </div>
          </template>
        </el-calendar>

        <el-aside width="200px" style="background-color: rgb(256, 256, 256)">
        <el-menu  default-active="1"  class="el-menu-demo" mode="horizontal" >
          <el-menu-item index="1" style="width: 100px" @click="changeType(1)">&nbsp;咨询师</el-menu-item>
          <el-menu-item index="2" style="width: 100px" @click="changeType(2)">&nbsp;&nbsp;&nbsp;督导</el-menu-item>
        </el-menu>
        <br>
        <div style="text-align:center">
          <el-button type="text" @click="handleAdd()">＋ 添加{{type===1?'咨询师':'督导'}}</el-button>
        </div>
          <el-table
            :data="tableData"
            style="width: 100%"
            >
            <el-table-column
              prop="user_name"
              label="姓名"
              show-overflow-tooltip
              width="120">
            </el-table-column>
                <el-table-column
              fixed="right"
              label="操作"
              width="60">
              <template slot-scope="scope" style="color:#F56C6C; font-color:#F56C6C">
                <el-button
                  @click.native.prevent="handelDel(scope.row)"
                  type="text"
                  size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-dialog :visible="visible" :title="`添加${type===1?'咨询师':'督导'}`" width="300px" @closed="userKey=''">
          <el-select
            v-model="userKey"
            filterable
            allow-create
            default-first-option
            placeholder="请选择">
            <el-option
              v-for="item in selectOption"
              :key="type===2?item.sup_id:item.coun_id"
              :label="item.user_name"
              :value="type===2?item.sup_id:item.coun_id">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 认</el-button>
              <el-button @click="visible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'schedule',
    data() {
      return {
        choseDay: new Date(),//选中日期
        tableData:[],//右侧表格数据
        type:1,//咨询师1督导2
        visible:false,//弹框显示隐藏
        userKey:'',//选中添加的key
        option:[],//下拉列表
        supervisorList:[],//督导列表
        counsellorList:[],//咨询师列表
        counNumData:[],
        superNumData:[]
      }
    },
    watch:{
      choseDay() {
          this.getTableData()
        },
      type() {
        this.getTableData()
      }
    },
    created() {
      this.getSupervisorList()
      this.getCounsellorList()
      this.getTodayCounsellorList()
      this.getCounNum()
      this.getSupNum()
    },
    computed:{
      selectOption:function() {
        if(this.type===1) {
          return this.counsellorList.filter(item=>!this.tableData.find(child=>child.user_name===item.user_name))
        }else{
          return this.supervisorList.filter(item=>!this.tableData.find(child=>child.user_name===item.user_name))
        }
      }
    },
    methods:{
      changeType(type) {
        this.type=type
      },
      // 日期转换
      processDate(date) {
        console.log(new Date(new Date(date).getTime()-86400000).toISOString().split('T')[0])
        // return new Date(date).toISOString().split('T')[0]
        return new Date(new Date(date).getTime()+86400000).toISOString().split('T')[0]
      },
      // 设置咨询师数里
      setCounNum(day) {
        const item=this.counNumData.find(item=>this.processDate(item.date)===day)
        if(item) {
          console.log(item.coun_num,111)
        }
        return item?item.coun_num:0
      },
      // 设置督导数
      setSupNum(day) {
        const item=this.superNumData.find(item=>this.processDate(item.date)===day)
        if(item) {
          console.log(item.sup_num,111)
        }
        return item?item.sup_num:0
      },
      //提交
      submitForm() {
        if(!this.userKey) {
          this.$message.warning('请选择')
          return
        }
        const date=new Date(this.choseDay).toISOString().split('T')[0]
        this.$ajax.post('/schedule/daily', {user_id:this.userKey,date}).then((res) => {
          if (res.data) {
            this.$message.success('添加成功')
            this.getTableData()
            this.visible=false
            this.getCounNum()
            this.getSupNum()
          }
        }).catch(err => this.$notify({
          type: 'error',
          message: err
        }))
      },
      //添加
      handleAdd() {
        this.visible=true
      },

      //删除
      handelDel(data) {
        const date=new Date(this.choseDay).toISOString().split('T')[0]
        this.$ajax.delete('/schedule/daliy', {data: {date,user_id:data.user_id}}).then((res) => {
          if (res.data) {
           this.$message.success('移除成功')
           this.getTableData()
          this.getCounNum()
          this.getSupNum()
          }
        }).catch(err =>  {
          console.log(err.response)
          //var errmsg = []
          // if (err.response && err.response.data.errors.length) {
          //   for(var i = 0; i < err.response.data.errors.length; i++) {
          //     errmsg.push( err.response.data.errors[i].msg)
          //   }
          //   // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          //   console.log(err.response.data.msg)
          //   console.log(errmsg)
          //   this.$store.commit('showMessage', {
          //     message: '移除失败：' + errmsg,
          //     type: 'error'
          //   })
          // }
          // else
            this.$store.commit('showMessage', {
              message: '移除失败：' + err.response.data.msg,
              type: 'error'
            })
        })
      },

      // 获取右侧表格数据
      getTableData() {
        this.type===1?this.getTodayCounsellorList():this.getTodaySupervisorList()
      },
      // 获取当天排班的督导列表
      getTodaySupervisorList() {
        const date=new Date(this.choseDay).toISOString().split('T')[0]
        this.$ajax.get('/schedule/supervisorList', {params: {date}}).then((res) => {
          if (res.data) {
            console.log(res,111222)
            res.data.forEach(item=>{
              item.user_name=item.sup_name
              item.user_id=item.sup_id
            })
            this.tableData = res.data
          }
        }).catch(
          () => {
            this.tableData=[]
          }
        )
      },
      // 获取当天排班的咨询师列表
      getTodayCounsellorList() {
        const date=new Date(this.choseDay).toISOString().split('T')[0]
        this.$ajax.get('/schedule/counsellorList', {params: {date}}).then((res) => {
          if (res.data) {
            res.data.forEach(item=>{
              item.user_name=item.coun_name
              item.user_id=item.coun_id
            })
            this.tableData = res.data
          }
        }).catch(err => {
          console.log(err,111)
          {this.tableData=[]}
        })
      },
      // 获取督导列表
      getSupervisorList() {
        this.$ajax.get('/admin/supervisorList', {params: {user_id: '7'}}).then((res) => {
          if (res.data) {
            this.supervisorList = res.data
          }
        }).catch(err => this.$notify({
          type: 'error',
          message: err
        }))
      },
      // 获取咨询师列表
      getCounsellorList() {
        this.$ajax.get('/admin/counsellorList', {params: {user_id: '7'}}).then((res) => {
        if (res.data) {
          this.counsellorList = res.data
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
      },
      // 获取排班咨询师人数
      getCounNum() {
        this.$ajax.get('/admin/TodayCounOnDuty',{params: {user_id: '7'}}).then(res=>{
          this.counNumData=res.data
          console.log(this.counNumData,'counNumData')
        })
      },
      getSupNum() {
        this.$ajax.get('/admin/TodaySupOnDuty',{params: {user_id: '7'}}).then(res=>{
          this.superNumData=res.data
          console.log(this.superNumData,'this.sssss')
        })
      },

    }
}
</script>

<style scoped>
.main{
  background: #fff;
  display: flex;
}
.el-calendar{
  flex: 1;
}
.fr{
  float:right;
}
.rigth-box{
  height: 100%;
  width: 300px;
  border-left:1px solid #C0C4CC;
}
/* eslint-disable-next-line */
/deep/.el-calendar__body .el-calendar-day{
  height: 140px;
}
</style>
