
<template>
    <el-container style="min-height: 100vh">

      <el-aside :width="sideWidth + 'px'" style="background-color: rgba(236,160,160,0.2)">
        <Aside :is-collapse="isCollapse"/>
      </el-aside>

      <el-container style="background-color: rgba(236,160,160,0.2)">
        <el-header style=" border-bottom: 1px solid #ccc">
          <Header :collapse-btn-class="collapseBtnClass" @collapse="collapse" :user="user"/>
        </el-header>

        <el-main class="page">
<!--表示当前页面的子路由会在<router-view/>里面展示-->
            <router-view @refreshUser="getUser" />
        </el-main>
      </el-container>
    </el-container>
</template>

<script>

import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
import request from "@/utils/request";

export default {
  name: 'Manage',
  data(){
    return {
        collapseBtnClass: 'el-icon-s-fold',
        isCollapse: false,
        sideWidth: 200,
        user: {}
    }
  },
  components:{
    Aside,
    Header
  },
  created() {
    //从后台获取最新的后台数据
    this.getUser()
  },
  methods: {
    collapse() {
        this.isCollapse = !this.isCollapse
        if(this.isCollapse){
            this.sideWidth = 64
            this.collapseBtnClass = 'el-icon-s-unfold'
        }else{
            this.sideWidth = 200
            this.collapseBtnClass = 'el-icon-s-fold'
        }
    },

    getUser() {
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      if (username) {
        // 从后台获取User数据
        request.get("/user/username/" + username).then(res => {
          // 重新赋值后台的最新User数据
          this.user = res.data
        })
      }
    }
  }
}
</script>

<style>
.page{
  background-image: url("../assets/logo2.gif");
  background-color: #FFF0F5;
  background-size: cover; /* 设置背景图片尺寸 */
  background-position: center; /* 设置背景图片位置 */
  height: 100%;
}
</style>

