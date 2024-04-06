<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 40px;color: #FFF0F5">
      <el-col :span="6">
        <el-card>
          <div style="color: lightpink;text-align: center">🌈总人数🌈</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            {{this.total}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: lightpink; text-align: center">🧸总课程数🧸</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            {{ this.course_total }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: lightpink;text-align: center">🍬受欢迎老师🍬</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            lsy
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: lightpink">💝总文章数💝</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold; ">
            {{ this.count }}
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
      <el-button @click="sortUsersByLikeNum"></el-button>
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
      total: 0,
      course_total: 0,
      pageNum:0,
      pageSize:0,
      name: '',
      count:0,
      user:[]
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
      this.total = res.data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
      request.get("/course/page", {
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,

        }
      }).then(res =>{
          this.course_total = res.data.total;
      }).catch(error => {
        console.error("Error fetching data:", error);
        // 处理错误
      });
      request.get("/article/count").then(res =>{
        this.count = res.data;
      }).catch(error => {
        console.error("Error fetching data:", error);
        // 处理错误
      });
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
  },
  //统计最受欢迎
  methods: {
    MyGet(){
      request.post("/user",this.user).then(res => {
        if(res.code === '200'){
          this.user = res.data;
        } else{
          this.$message.error("获取失败!")
        }
      })
    },
    sortUsersByLikeNum(users) {
      // 冒泡排序算法
      for (let i = 0; i < users.length - 1; i++) {
        for (let j = 0; j < users.length - i - 1; j++) {
          if (users[j].like_num < users[j + 1].like_num) {
            // Swap users[j] and users[j+1]
            const temp = users[j];
            users[j] = users[j + 1];
            users[j + 1] = temp;
          }
        }
      }
      return users;
    }
  }
}
</script>

<style scoped>

</style>