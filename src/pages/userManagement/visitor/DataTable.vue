<template>
  <view-page>
    <!-- 搜索框 -->
    <!-- 搜索框 -->
    <template slot="search-field">
      <el-input v-model="searchStr" suffix-icon="el-icon-search" placeholder="请输入搜索内容" ></el-input>
    </template>
    <!-- 表格区 -->
    <el-table :data="filtedData">
      <el-table-column label="姓名" prop="name">
        <template slot-scope="scope">
          {{scope.row.visitor_name}}
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{scope.row.visitor_gender}}
        </template>
      </el-table-column>
      <el-table-column label="联系电话">
        <template slot-scope="scope">
          {{scope.row.visitor_phone}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{scope.row.visitor_status}}
        </template>
      </el-table-column>
      <el-table-column label="紧急联系人">
        <template slot-scope="scope">
          {{scope.row.emergency_name}}
        </template>
      </el-table-column>
      <el-table-column label="紧急联系人电话">
        <template slot-scope="scope">
          {{scope.row.emergency_phone}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="info" @click="banned(scope.row)" style="padding: 7px" plain>状态修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </view-page>
</template>

<script>
import ViewPage from './ViewPage'
export default {
  components: {
    ViewPage
  },
  inject: ['reload'],
  data() {
    return{
      visitorList: [],
      searchStr: '',
      filterType: '',
      status:'',
      user_id:sessionStorage.getItem('user_id')
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      this.$ajax.get('/admin/visitorList', {params: {user_id: this.user_id}}).then((res) => {
        console.log(res)
        if (res.data) {
          this.visitorList = res.data
          for(var i = 0;i <this.visitorList.length ; i++) {
            //性别转换
            if(this.visitorList[i].visitor_gender == 'Male')
            {
              this.visitorList[i].visitor_gender = '男'
            }
            else if(this.visitorList[i].visitor_gender == 'Female')
                this.visitorList[i].visitor_gender = '女'
            else
              this.visitorList[i].visitor_gender = '其他'
            //状态转换
            if(this.visitorList[i].visitor_status == 'normal')
            {
              this.visitorList[i].visitor_status = '正常'
            }
            else
            {
              if(this.visitorList[i].visitor_status == 'banned')
                this.visitorList[i].visitor_status = '禁用'
            }
          }
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
    },
    // timer() {
    //   return setTimeout(() => {
    //     this.update()
    //   }, 2000)
    // },
    banned(row) {
      if (row.visitor_status == '禁用')
        this.status = 'normal'
      else if (row.visitor_status == '正常')
        this.status = 'banned'
      console.log(row.visitor_status)
      this.$ajax.post('admin/changeVisitorStatus',{
        'user_id': row.visitor_id,
        'status': this.status
      }).then((res) => {
        console.log(res.data)
        if (res.data) {
          this.visitorList = res.data
        }
        if (this.status == 'banned') {
          this.$store.commit('showMessage', {
            type: 'success',
            message: '禁用成功！'
          })
        }
        else {
          this.$store.commit('showMessage', {
            type: 'success',
            message: '启用成功！'
          })
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
      setTimeout(() => {
        this.reload()
      }, 1500)
    }
  },
  computed: {
    filtedData() {
      return this.visitorList.filter((item) => {
        var reg = new RegExp(this.searchStr, 'i')
        return !this.searchStr || reg.test(item.visitor_name)
      })
    }
  },
  // watch: {
  //   data() {
  //     this.timer()
  //   }
  // },
  // destroyed() {
  //   clearTimeout(this.timer)
  // }
}
</script>

<style scoped>
</style>
