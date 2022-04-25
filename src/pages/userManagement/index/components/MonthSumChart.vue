<template>
  <div>  
    <div ref="chart" :style="{  height: '240px' }"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      user_id:sessionStorage.getItem('user_id')
    }
  },
  mounted() {
    this.getRecordNum()
    console.log(123)
  },
  methods: {
     // 最近7天的咨询量
      getRecordNum() {
        this.$ajax.get('/admin/recordNumRecent',{params: {user_id: this.user_id}}).then(res=>{
          if(res.data) {
            const xData=[new Date(new Date().getTime()-86400000*6).toISOString().split('T')[0],
            new Date(new Date().getTime()-86400000*5).toISOString().split('T')[0],
            new Date(new Date().getTime()-86400000*4).toISOString().split('T')[0],
            new Date(new Date().getTime()-86400000*3).toISOString().split('T')[0],
            new Date(new Date().getTime()-86400000*2).toISOString().split('T')[0],
            new Date(new Date().getTime()-86400000*1).toISOString().split('T')[0],
            new Date(new Date().getTime()).toISOString().split('T')[0]]
            const valData=[0,0,0,0,0,0,0]
            res.data.forEach(item=>{
              const index=xData.findIndex((child)=>child===item.days)
              if(index!==-1) {
                valData[index]=item.record_num
              }
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