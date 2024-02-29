<template>
  <div class="wrapper">
    <div style="margin: 200px auto; background-color: #FFE4E1; width: 500px; height: 350px; padding: 20px; border-radius: 10px">
      <div style="margin: 10px 0; text-align: center; font-size: 24px; color: #FFC1C1; font-family: 'Comic Sans MS', Arial;"><b>❤login❤</b></div>
      <div style="text-align: center;">
        <img src="../assets/logo4.gif" alt="Image" width="200px">
      </div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: center">
          <el-button type="success" size="small" autocomplete="off" @click="login">login</el-button>
          <el-button type="warning" size="small" autocomplete="off" @click="$router.push('/register')">register</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

import request from "@/utils/request";
<script>
import request from "@/utils/request";

export default {
  name: "Login",
  data(){
    return{
      user: {},
      rules: {
        username:[
          { required: true, message: 'Please enter username', trigger:'blur'},
          { min: 2, max:5, message: 'length between 2 and 5', trigger: 'blur'}
        ],
        password:[
          { required: true, message: 'Please enter password', trigger:'blur'},
          { min: 6, max:20, message: 'length between 6 and 20', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    login(){
      this.$refs['userForm'].validate((valid) => {
        if(valid){ //表单校验合法
          request.post("/user/login",this.user).then(res => {
            if(res.code === '200'){
              this.$router.push("/")
              this.$message.success("login success!")
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  background-image: url('../assets/logo7.jpg');
  overflow: hidden;
}
</style>