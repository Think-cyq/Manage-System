<template>
  <div class="wrapper">
    <div style="margin: 100px auto; background-color: #FFE4E1; width: 400px; height: 500px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px; color: #FFC1C1; font-family: 'Comic Sans MS', Arial;"><b>❤register❤</b></div>
      <div style="text-align: center;">
        <img src="../assets/logo4.gif" alt="Image" width="170px">
      </div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" placeholder="enter your username" prefix-icon="el-icon-user" v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input size="medium" placeholder="enter your nickname" prefix-icon="el-icon-user" v-model="user.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" placeholder="enter your password" prefix-icon="el-icon-lock" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input placeholder="ensure your password" size="medium" prefix-icon="el-icon-lock" show-password v-model="user.confirmPassword"></el-input>
        </el-form-item>

        <el-form-item>
          <el-select clearable v-model="user.role" placeholder="please choose role" style="width: 100%">
            <el-option v-for="item in roles" :key="item.name" :value="item.flag"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="margin: 10px 0; text-align: center">
          <el-button type="success" size="small" autocomplete="off" @click="login">register</el-button>
          <el-button type="warning" size="small" autocomplete="off"@click="$router.push('/login')">return login</el-button>
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
        nickname:[
          { required: true, message: 'Please enter username', trigger:'blur'},
          { min: 2, max:5, message: 'length between 2 and 5', trigger: 'blur'}
        ],
        password:[
          { required: true, message: 'Please enter password', trigger:'blur'},
          { min: 6, max:20, message: 'length between 6 and 20', trigger: 'blur'}
        ],
        confirmPassword:[
          { required: true, message: 'Please enter password', trigger:'blur'},
          { min: 6, max:20, message: 'length between 6 and 20', trigger: 'blur'}
        ],
      },
      roles:[],
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      request.get("/role").then(res => {
        console.log(res)
        this.roles = res.data
      })
    },
    save(){
      request.post("/user",this.form).then(res => {
        if(res.code === '200'){

          this.$message.success("save success!")
          this.dialogFormVisible = false
          this.load()
        } else{
          this.$message.error("save wrong!")
        }
      })
    },
    login(){
      this.$refs['userForm'].validate((valid) => {
        if(valid){ //表单校验合法
          if(this.user.password !== this.user.confirmPassword){
            this.$message.error("differ than before!")
            return false
          }
          request.post("/user/register",this.user).then(res => {
            if(res.code === '200'){
              console.log(this.user)
              this.$message.success("register success!")
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