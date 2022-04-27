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
        <template slot-scope="scope">
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-view" @click="view(scope.row)" plain></el-button>
          <el-button size="mini" type="info" style="padding: 7px" icon="el-icon-download" @click="download(scope.row)" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <record-dialog :show="recordShow" title="查看咨询记录" @close="closeRecordDialog" ></record-dialog>
  </view-page>
</template>

<script>
  import ViewPage from './ViewPage'
  import json2csv from 'json2csv'
  import recordDialog from "@/pages/userManagement/record/recordDialog";
  export default {
  components: {
    ViewPage,
    recordDialog,
  },
  data() {
    return{
      data: [],
      recordView: [],//record
      recordShow: false,//record的dialog
      filterType: '',
      filterDates: null,
      searchStr:'',
      fields: ['msg_time','from_name','to_name','text']
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

            this.data[i].begin_time = new Date(this.data[i].begin_time).toLocaleString()

            if(this.data[i].help_or_not == '0')
            {
              this.data[i].sup_name = '无'
            }
            else
            {
              if(this.data[i].sup_name == '无求助督导')
                this.data[i].sup_name = '无'
            }
            //评分转换
            let result = 0;
            let score = Math.floor(this.data[i].score * 2) / 2;
            let hasDecimal = score % 1 !== 0;
            let integer = Math.floor(score);
            for (let i = 0; i < integer; i++) {
              result++;
            }
            if (hasDecimal) {
              result = result + 0.5;
            }
            this.data[i].score = result
          }
        }
      })
    },
    download(row){
      console.log(row)
        this.$ajax.get('/record/content',{params: {record_id: row.record_id}}).then((res) => {
            console.log(res.data)
            try {
              const result = json2csv.parse(res.data, { fields: this.fields });
              // 判断浏览器类型
              if ((navigator.userAgent.indexOf('compatible') > -1 &&
                      navigator.userAgent.indexOf('MSIE') > -1) ||
                  navigator.userAgent.indexOf('Edge') > -1) {
                //IE10或Edge浏览器
                var BOM = "\uFEFF";
                var csvData = new Blob([BOM + result], { type: "text/csv" });
                navigator.msSaveBlob(csvData, `record.csv`);
              } else {
                //非IE浏览器
                var csvContent = "data:text/csv;charset=utf-8,\uFEFF" + result;
                //使用a标签的download属性实现下载功能
                var link = document.createElement("a");
                link.href = encodeURI(csvContent);
                link.download = `record.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            } catch (err) {
              alert(err);
            }


        }
    )
  },
    view(row){
      this.recordShow = true
      this.$ajax.get('/record/content',{params: {record_id: row.record_id}}).then((res) => {
        console.log(res.data)
        this.recordView = res.data
      })
      },
    closeRecordDialog() {
      this.recordShow = false
      this.activeName='first'
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