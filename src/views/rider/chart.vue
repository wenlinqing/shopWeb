<template>
  <div id="charts" style="height:100%;"></div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
  // 验证类型
  data(){
    return {
      id: 'charts',
      xAxis:[],
      userInfo:JSON.parse(sessionStorage.getItem('session'))||{},
    }
  },
  mounted() {
      for (var i = 1; i < 8; i++) {
        this.xAxis.push(moment().add(-i, 'days').format('MM.DD'))
      }
      this.$api.post('/riders/7daysInfo',{
          riderId:this.userInfo.riderId,
      },result=>{
          HighCharts.chart(this.id,{
            grid: {
                  top:'8%',
                  left: '1%',
                  right: '4%',
                  bottom: '1%',
                  containLabel: true
                },
                chart: {
                  type: 'line'
                },
                title: {
                  text: ''
                },
                subtitle: {
                  //text: '数据来源: WorldClimate.com'
                },
                xAxis: {
                  categories: this.xAxis
                },
                yAxis: {
                  title: {
                    text: ''
                  }
                },
                plotOptions: {
                  line: {
                    dataLabels: {
                      // 开启数据标签
                      enabled: false          
                    },
                    // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                    enableMouseTracking: true
                  }
                },
                series: result.data
          })
      },err=>{
        this.$dialog.toast({
            mes: err.msg,
            timeout: 2000,
            icon: 'error'
        });
      })
  }
}
</script>
<style scpoed>
#test {height: 200px;}
.highcharts-credits{display: none;}
</style>
