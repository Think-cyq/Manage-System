
<template>
    <el-container style="min-height: 100vh">

      <el-aside :width="sideWidth + 'px'" style="background-color: rgb(230 230 250)">
        <Aside :is-collapse="isCollapse"/>
      </el-aside>

      <el-container>
        <el-header style=" border-bottom: 1px solid #ccc">
          <Header :collapse-btn-class="collapseBtnClass" @collapse="collapse"/>
        </el-header>

        <el-main>
<!--表示当前页面的子路由会在<router-view/>里面展示-->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
</template>

<script>

import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";

export default {
  name: 'Manage',
  data(){
    return {
        collapseBtnClass: 'el-icon-s-fold',
        isCollapse: false,
        sideWidth: 200
    }
  },
  components:{
    Aside,
    Header
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
  }
}
</script>

