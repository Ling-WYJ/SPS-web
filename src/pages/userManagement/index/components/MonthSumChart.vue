<template>
  <div>  
    <div ref="chart" :style="{  height: '240px' }"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {}
  },
  mounted() {
    this.getRecordNum()
    console.log(123)
  },
  methods: {
     // 最近7天的咨询量
      getRecordNum() {
        this.$ajax.get('/admin/recordNumRecent',{params: {user_id: '7'}}).then(res=>{
          if(res.data) {
            const xData=[]
            const valData=[]
            res.data.forEach(item=>{
              xData.push(item.days)
              valData.push(item.record_num)
            })
            this.drawLine(xData,valData)
          }
        })
      },
    drawLine(xData,valData) {
      let myChart = echarts.init(this.$refs.chart)
      myChart.setOption( {
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        tooltip:{},
        series: [
          {
            color:'#67c23a',
            data: valData,
            type: 'line'
          }
        ]
      })
    },
  }
}
</script>
<style scoped>
</style>