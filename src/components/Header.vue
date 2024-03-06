<template>
  <div class="component-container" style="color: #FFE4E1">
    <div style="font-size: 12px;line-height: 60px; display: flex; color: #FFC1C1">
      <div style="flex: 1">
        <span :class="collapseBtnClass" style="cursor: pointer;font-size: 20px" @click="SonCollapse"></span>

        <el-breadcrumb separator="/" style="display: inline-block;margin-right: 10px">
          <el-breadcrumb-item :to="'/'">First-Page</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-dropdown style="width: 100px; cursor: pointer" >
        <div style="display: inline-block">
          <img :src="user.avatar" alt=""
               style="width: 30px; border-radius: 50%; height: 30px;position: relative; top: 10px; right: 5px">
          <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style=" margin-left: 5px"></i>
        </div>

        <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
          <el-dropdown-item style="font-size: 14px; padding: 5px 0">
            <router-link to="/person">self-info</router-link>
          </el-dropdown-item>

          <el-dropdown-item style="font-size: 14px; padding: 5px 0">
            <span style="text-decoration: #FFC1C1" @click="logout">logout</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name:"Header",
  props: {
    collapseBtnClass: String,
    user: Object
  },
  computed: {
    currentPathName(){
      return this.$store.state.currentPathName;
      //需要监听的数据
    }
  },
  watch:{
    currentPathName(newVal,oldVal) {
      console.log(newVal)
    }
  },
  data(){
    return {
    }
  },
  methods: {
    SonCollapse() {
      this.$emit('collapse');
    },
    logout(){
      this.$store.commit("logout")
      this.$message.success("logout success!")
    }
  }
}
</script>

<style>
.component-container {
  /* 设置背景图片路径和属性 */
  background-color: #FFF0F5;
}
</style>