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
      status:''
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
      if (row.visitor_status == 'banned')
        this.status = 'normal'
      else
        this.status = 'banned'
      this.$ajax.post('admin/changeVisitorStatus',{
        'user_id': row.visitor_id,
        'status': this.status
      }).then((res) => {
        console.log(res)
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
