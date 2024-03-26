<template>
  <div class="center-container" style="margin: -100px; align-content: center">
      <el-card style="width: 500px;background-color:#FFE4E1">
        <el-form label-width="80px" size="small">

          <el-upload
              style="align-content: center; text-align: center"
              class="avatar-uploader"
              :action="'http://' + serverIp +':9090/file/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              >
            <img v-if="form.avatar" :src="form.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <el-form-item label="username">
            <el-input v-model="form.username" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="nickname">
            <el-input v-model="form.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="phone">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="address">
            <el-input type="textarea" v-model="form.address" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center">
              <el-button type="primary"  @click="save">ensure</el-button>
              <el-button type="primary"  @click="reset">reset</el-button>
            </div>
            </el-form-item>
        </el-form>
      </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
import {serverIp} from "../../public/config";

export default {
  name: "Person",
  data(){
    return{
      serverIp: serverIp,
      form:{},
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {
      this.getUser().then(res => {
        this.form = res
    })
  },
  methods:{
    serverIp() {
      return serverIp
    },
    async getUser(){
      return (await request.get("/user/username/" + this.user.username)).data
    },
    save(){
      request.post("/user",this.form).then(res => {
        if(res.code === '200'){
          this.$message.success("save success!")
          console.log("我启动了")
          //触发父级更新用户的方法
          this.$emit("refreshUser")

          //更新浏览器存储信息
          this.getUser().then(res => {
            res.token = JSON.parse(localStorage.getItem("user")).token
            localStorage.setItem("user",JSON.stringify(res))
          })
        } else{
          this.$message.error("save wrong!")
        }
      })
    },
    // 修改后的 reset 方法
    reset() {
      this.form.username = '';
      this.form.nickname = '';
      this.form.email = '';
      this.form.phone = '';
      this.form.address = '';
    },
    handleAvatarSuccess(res){
      this.form.avatar = res
    }
  },

}
</script>

<style scoped>
.center-container {
  background-image: url("../assets/logo7.jpg");
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 使容器占据整个视口高度 */
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #FFC1C1;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #FFF0F5;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  border-radius: 50%;
  width: 138px;
  height: 138px;
  display: block;
}
</style>