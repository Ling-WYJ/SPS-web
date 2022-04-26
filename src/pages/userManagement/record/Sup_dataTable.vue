<template>
  <view-page>
    <!-- 搜索框 -->
    <template slot="search-field">
      <el-input v-model="searchStr" suffix-icon="el-icon-search" placeholder="请输入搜索内容" ></el-input>
    </template>
    <!-- 表格区 -->
    <el-table :data="filtedData">
      <el-table-column label="咨询人" prop="visitor_name">
        <template slot-scope="scope">
          {{scope.row.visitor_name}}
        </template>
      </el-table-column>
      <el-table-column label="咨询师" prop="coun_name">
        <template slot-scope="scope">
          {{scope.row.coun_name}}
        </template>
      </el-table-column>
      <el-table-column label="咨询时长(分钟)">
        <template slot-scope="scope">
          {{scope.row.period}}
        </template>
      </el-table-column>
      <el-table-column label="咨询日期">
        <template slot-scope="scope">
          {{ scope.row.begin_time}}
        </template>
      </el-table-column>
      <el-table-column label="是否求助">
        <template slot-scope="scope">
          {{scope.row.help_or_not}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-view" plain></el-button>
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-download" plain></el-button>
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
  data() {
    return{
      data: [],
      sup_id:sessionStorage.getItem('user_id'),
      sup_name:JSON.parse(sessionStorage.getItem('GET_USER_INFO')).userID,
      filterType: '',
      filterDates: null,
      searchStr:'',
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    update() {
      this.$ajax.get('/record/supAndBind',{params: {sup_id: this.sup_id}}).then((res) => {
        console.log(res)
        if (res.data) {
          this.data = res.data.RecordList
          for(var i = 0;i <this.data.length ; i++) {
            this.data[i].begin_time = this.data[i].begin_time?this.data[i].begin_time.substring(0,10):''
            this.data[i].period = Math.floor(this.data[i].period /60)
            if(this.data[i].help_or_not == '0')
            {
              this.data[i].help_or_not = '否'
            }
            else
            {
              this.data[i].help_or_not = '是'
            }
          }
        }
      }).catch(err => this.$notify({
        type: 'error',
        message: err
      }))
    }
  },
  computed: {
    filtedData() {
      return this.data.filter((item) => {
        var reg = new RegExp(this.searchStr, 'i')
        return !this.searchStr || reg.test(item.visitor_name)
      })
    },
  }
}
</script>

<style scoped>

</style>
