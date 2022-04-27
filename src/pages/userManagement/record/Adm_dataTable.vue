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
      <el-table-column label="咨询时长">
        <template slot-scope="scope">
          {{scope.row.period}}
        </template>
      </el-table-column>
      <el-table-column label="咨询日期">
        <template slot-scope="scope">
          {{ scope.row.begin_time}}
        </template>
      </el-table-column>
        <el-table-column label="咨询评级">
          <template slot-scope="scope">
          <el-rate
              v-model="scope.row.score"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
          >
          </el-rate>
          </template>
        </el-table-column>
      <el-table-column label="咨询评价">
        <template slot-scope="scope">
          {{scope.row.vis_to_coun_comment}}
        </template>
      </el-table-column>
        <el-table-column label="咨询师反馈">
          <template slot-scope="scope">
            {{scope.row.coun_to_vis_comment}}
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
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-download" @click="download(scope.row)" plain></el-button>
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
      this.$ajax.get('/record/all').then((res) => {
        console.log(res)
        if (res.data) {
          this.data = res.data.RecordList
          for(var i = 0;i <this.data.length ; i++) {

            //处理时分秒转换
            var hour = parseInt(this.data[i].period / 3600) < 10 ? '0' + parseInt(this.data[i].period / 3600) : parseInt(this.data[i].period / 3600)
            var min = parseInt(this.data[i].period % 3600 / 60) < 10 ? '0' + parseInt(this.data[i].period % 3600 / 60) : parseInt(this.data[i].period % 3600 / 60)
            var sec = parseInt(this.data[i].period % 3600 % 60) < 10 ? '0' + parseInt(this.data[i].period % 3600 % 60) : parseInt(this.data[i].period % 3600 % 60)
            this.data[i].period = hour + ':' + min + ':' + sec

            if(this.data[i].help_or_not == '0')
            {
              this.data[i].sup_name = '无'
            }
            else
            {
              if(this.data[i].sup_name == '无求助督导')
                this.data[i].sup_name = '无'
            }
          }
        }
      })
    },
    download(row){
        this.$ajax.get('/record/content',{params: {record_id: row.record_id}}).then((res) => {
          console.log(res)
        }
    )
  },
  },
  computed: {
  filtedData() {
    return this.data.filter((item) => {
      var reg = new RegExp(this.searchStr, 'i')
      return !this.searchStr || reg.test(item.visitor_name) || reg.test(item.sup_name) || reg.test(item.begin_time)
    })
  },
}
}
</script>

<style scoped>

</style>
