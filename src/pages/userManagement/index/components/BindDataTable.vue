<template>
  <view-page>
    <!-- 搜索框 -->
    <template slot="search-field">
      <el-input suffix-icon="el-icon-search" placeholder="请输入姓名" ></el-input>
    </template>
    <!-- 表格区 -->
    <el-table :data="pagedData">
      <el-pagination :total="total" :current-page="currentPage" 
         :page-size="currentPageSize" :page-sizes="[3, 5]"
         layout="total, sizes, prev, pager, next, jumper"
         @size-change="pageSizeChange" @current-change="pageChange">
      </el-pagination>
      <el-table-column label="咨询人" prop="visitor_name">
        <template slot-scope="scope">
          {{scope.row.visitor_name}}
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
      <el-table-column label="督导求助">
        <template slot-scope="scope">
          {{scope.row.sup_name}}
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
import ViewPage from './ViewPagePart'
export default {
  components: {
    ViewPage
  },
  data() {
    return{
      data: [],
      filterType: '',
      searchStr:'',
      currentPage: 2,
      currentPageSize: 4
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    pageSizeChange(size) {
        this.currentPageSize = size
    },
    pageChange(page) {
        this.currentPage = page
    },
    update() {
      this.$ajax.get('/record/all').then((res) => {
        console.log(res)
        if (res.data) {
          this.data = res.data.RecordList
          for(var i = 0;i <this.data.length ; i++) {
            this.data[i].begin_time = this.data[i].begin_time.substring(0,10)
            this.data[i].period = Math.floor(this.data[i].period /60)
            if(this.data[i].help_or_not == '0')
            {
              this.data[i].help_or_not = '否'
              this.data[i].sup_id = '无'
            }
            else
            {
              this.data[i].help_or_not == '是'
              if(this.data[i].sup_id == null)
                this.data[i].sup_id = '无'
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
  total() {
        return this.filtedData.length
    },
  pagedData() {
        return this.filtedData.slice((this.currentPage - 1) * this.currentPageSize, this.currentPage * this.currentPageSize)
    }
}
}
</script>

<style scoped>

</style>
