<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 40px">
      <el-col :span="6">
        <el-card>
          <div style="color: lightpink;text-align: center">🌈Total number of users🌈</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            100
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
         <div style="color: lightpink; text-align: center">🧸Total sales🧸</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            100
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: lightpink;text-align: center">🍬Total proceeds🍬</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            100
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: lightpink">💝Total number of stores💝</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            100
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id = 'main' style="width: 500px; height: 400px"></div>
      </el-col>

      <el-col :span="12">
        <div id = 'pie' style="width: 500px; height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import request from "@/utils/request";
export default {
  name: "Home",
  data(){
    return {

    }
  },
  mounted() {  //页面元素渲染之后再触发

    var option = {
      title: {
        text: 'The number of members in each quarter',
        subtext: 'trend chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度","第二季度","第三季度","第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "123",
          data: [],
          type: 'line'
        },
        {
          name:"456",
          data:[],
          type: 'bar'
        }
      ]
    };

    //饼图
    var pieOption = {
      title: {
        text: 'Statistics Graph',
        subtext: 'pie chart',
        left: 'center',
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          label: {
            show:true,
            position:'inner',
            textStyle : {
              fontWeight : 300,
              fontSize : 16, //文字的字体大小
              color: "#fff"
            },
            formatter: '{d}%'
          },
          center:['50%','60%'],
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(236,160,160,0.5)'
            }
          }
        }
      ]
    };

    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);
    request.get("/echarts/members").then(res => {
      //填空
      /*option.xAxis.data = res.data.x*/
      option.series[0].data = res.data
      option.series[1].data = res.data
      //在数据准备完毕之后再set
      myChart.setOption(option)

      pieOption.series[0].data = [
        {name: "第一季度" ,value:res.data[0]},
        {name: "第二季度" ,value:res.data[1]},
        {name: "第三季度" ,value:res.data[2]},
        {name: "第四季度" ,value:res.data[3]},
      ]
      pieChart.setOption(pieOption)
    })

    pieChart.setOption(pieOption);
  }
}
</script>

<style scoped>

</style>