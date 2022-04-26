<template>
  <div>   
    <div id="myChart1" :style="{  height: '240px' }"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      user_id:sessionStorage.getItem('user_id'),
    }
  },
  mounted() {
    this.getRecordNum()
  },
  methods: {
      getRecordNum() {
        this.$ajax.get('/admin/recordNumToday',{params: {user_id: this.user_id}}).then(res=>{
          if(res.data) {
            console.log(res.data,111122)
            const xData=['00:00','04:00','08:00','12:00','16:00','20:00']
            const valData=[]
            res.data.forEach(item=>{
              valData.push(item.count)
            })
            this.drawLine(xData,valData)
          }
        })
      },
    drawLine(xData,valData) {
      let myChart = echarts.init(document.getElementById('myChart1'))
      myChart.setOption({
          title: {
        text: '今日咨询数量变化',
        top: '2%',
    },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#317EE7',
            },
          },
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '2%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: false,
            },
            data: xData
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              //网格线
              lineStyle: {
                type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
              },
            },
          },
        ],
        series: [
          {
            name: '咨询数量',
            type: 'line',
            stack: '数量',
            showSymbol: false,
            color: '#317EE7',
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default',
                  //渐变色实现===
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    //三种由深及浅的颜色
                    [
                      {
                        offset: 0,
                        color: '#317EE7',
                      },
                      {
                        offset: 1,
                        color: '#426cdb',
                      },
                    ]
                  ),
                },
                lineStyle: {
                  //线的颜色
                  color: '#317EE7',
                },
                //以及在折线图每个日期点顶端显示数字
                label: {
                  show: false,
                  position: 'top',
                  textStyle: {
                    color: '#317EE7',
                  },
                },
              },
            },
            areaStyle: {},
            data: valData,
          },
        ],
      })
    },
  },
}
</script>
<style scoped>
</style>