<template>
  <el-menu :default-openeds="['1', '3']" style="min-height: 100%; overflow-x: hidden"
           background-color="rgb(230 230 250)"
           active-text-color="rgb(255 193 193)"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img src="../assets/logo1.png" alt="" style="width: 20px; position: relative; top: 5px; margin-right: 5px">
      <b style="color: #FFC1C1; font-size: 16px; font-family: 'Comic Sans MS', cursive">Management system</b>
    </div>

    <el-menu-item index="/">
      <template slot="title">
        <i class="el-icon-house"></i>
        <span slot="title">Home</span>
      </template>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">System</span>
      </template>

        <el-menu-item index="/user">
          <i class="el-icon-s-custom"></i>
          <span slot="title">User</span>
        </el-menu-item>

        <el-menu-item index="/role">
          <i class="el-icon-user"></i>
          <span slot="title">Role</span>
        </el-menu-item>

        <el-menu-item index="/file">
          <i class="el-icon-document"></i>
          <span slot="title">File</span>
        </el-menu-item>

      <el-menu-item index="/menu">
        <i class="el-icon-folder-remove"></i>
        <span slot="title">Menu</span>
      </el-menu-item>



    </el-submenu>
  </el-menu>
</template>

<script >
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean
  }
}
</script>

<style scoped>

</style>
