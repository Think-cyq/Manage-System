<template>
  <div class="component-container">
    <div style="font-size: 12px;line-height: 60px; display: flex">
      <div style="flex: 1">
        <span :class="collapseBtnClass" style="cursor: pointer;font-size: 20px" @click="SonCollapse"></span>

        <el-breadcrumb separator="/" style="display: inline-block;margin-right: 10px">
          <el-breadcrumb-item :to="'/'">First-Page</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-dropdown style="width: 70px; cursor: pointer">
        <span>王小虎</span><i class="el-icon-arrow-down" style=" margin-left: 5px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>information</el-dropdown-item>
          <el-dropdown-item>sign out</el-dropdown-item>
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
  methods: {
    SonCollapse() {
      this.$emit('collapse');
    }
  }
}
</script>

<style>
.component-container {
  /* 设置背景图片路径和属性 */
  background-image: url('../assets/logo2.gif');
  background-size: cover; /* 设置背景图片尺寸 */
  background-position: center; /* 设置背景图片位置 */
  height: 100%;
  width: 100%;
}
</style>