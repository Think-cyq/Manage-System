<template>
  <div class="user-container">

    <div style="padding: 10px 0">
      <el-input style="width: 300px"  placeholder="Please enter name" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-input style="width: 300px" placeholder="please input your email" suffix-icon="el-icon-message" v-model="email"></el-input>
      <el-input style="width: 300px" placeholder="Please enter address" suffix-icon="el-icon-position" v-model="address"></el-input>
      <el-button round class="ml-5" type="primary" @click="load">Search</el-button>
      <el-button round class="ml-5" type="success" @click="reset">reset</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button round type="primary" @click="handleAdd">add<i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
          class="ml-5"
          confirm-button-text='ensure'
          cancel-button-text='think again'
          icon="el-icon-info"
          icon-color="red"
          title="Are you sure?"
          @confirm="delBatch"
      >
        <el-button round type="danger" slot="reference" >deleteBatch<i class="el-icon-delete"></i></el-button>
      </el-popconfirm>
      <el-upload
          action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button round type="primary" class="ml-5">import<i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button round type="primary" @click="exp" class="ml-5">export<i class="el-icon-top"></i></el-button>
    </div>

  <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" :row-class-name="rowClass" >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="id" width="40" align="center"></el-table-column>
    <el-table-column prop="username" label="username" width="140" align="center"></el-table-column>
    <el-table-column prop="role" label="role" align="center">
      <template slot-scope="scope">
        <el-tag type="primary" v-if="scope.row.role === 'ROLE_ADMIN'">admin</el-tag>
        <el-tag type="warning" v-if="scope.row.role === 'ROLE_TEACHER'">teacher</el-tag>
        <el-tag type="success" v-if="scope.row.role === 'ROLE_STUDENT'">student</el-tag>

      </template>
    </el-table-column>

    <el-table-column prop="nickname" label="nickname" width="120" align="center" ></el-table-column>
    <el-table-column prop="email" label="email" align="center"></el-table-column>
    <el-table-column prop="phone" label="phone" align="center"></el-table-column>
    <el-table-column prop="address" label="address" align="center"></el-table-column>
    <el-table-column label="operation" width="450" align="center">
      <template slot-scope="scope">
        <el-button round type="success" @click="checkCourse(scope.row.courses)" v-if="scope.row.role === 'ROLE_TEACHER'">Check Taught<i class="el-icon-edit-document"></i></el-button>
        <el-button round type="warning" @click="checkStuCourse(scope.row.stuCourses)" v-if="scope.row.role === 'ROLE_STUDENT'">Check Selected<i class="el-icon-edit-document"></i></el-button>
        <el-button round type="primary" @click="handleEdit(scope.row)">edit<i class="el-icon-edit-outline"></i></el-button>

        <el-popconfirm
            class="ml-5"
            confirm-button-text='ensure'
            cancel-button-text='think again'
            icon="el-icon-info"
            icon-color="red"
            title="Are you sure?"
            @confirm="del(scope.row.id)"
        >
          <el-button round type="warning" slot="reference">delete<i class="el-icon-delete"></i></el-button>
        </el-popconfirm>
      </template>
    </el-table-column>

  </el-table>
  <div style="padding: 10px 0">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>

  <el-dialog title="user info" :visible.sync="dialogFormVisible" wodth="30%" >
    <el-form label-width="80px" size="small">
      <el-form-item label="username">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="role">
        <el-select clearable v-model="form.role" placeholder="please choose role" style="width: 100%">
          <el-option v-for="item in roles" :key="item.name" :value="item.flag"></el-option>
        </el-select>
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
        <el-input v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">cancel</el-button>
      <el-button type="primary" @click="save">ensure</el-button>
    </div>
  </el-dialog>

  <el-dialog title="course info" :visible.sync="vis" width="30%">
    <el-table :data="courses">
      <el-table-column prop="name" label="courseName"></el-table-column>
      <el-table-column prop="score" label="score"></el-table-column>
    </el-table>
  </el-dialog>

    <el-dialog title="course info" :visible.sync="vis" width="30%">
      <el-table :data="courses">
        <el-table-column prop="name" label="courseName"></el-table-column>
        <el-table-column prop="score" label="score"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "User",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      username: "",
      nickname:"",
      avatar:"",
      email:"",
      address:"",
      form:{},
      dialogFormVisible: false,
      multipleSelection: [],
      roles: [],
      courses:[],
      vis: false,
      stuVis:false,
      stuCourses: false
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      request.get("/user/page", {
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,

          email: this.email,
          address: this.address
        }
      }).then(res => {
        // 检查响应中是否有 records 字段
        if (res.data && Array.isArray(res.data.records)) {
          this.tableData = res.data.records;
          this.total = res.data.total;
        }
      }).catch(error => {
        // 这里处理请求失败的情况，比如网络错误或者服务器返回的错误状态码
        // 可以根据不同的 HTTP 状态码来显示不同的错误信息
        if (error.response) {
          if (error.response.status === 401) {
            // token 验证失败的处理
            this.$message.error("Token verification failed, please log in again.");
            // 可能需要重定向到登录页面或显示登录对话框
            // this.$router.push('/login');
          } else {
            // 其他类型的错误处理
            this.$message.error("An error occurred: " + error.response.statusText);
          }
        } else {
          // 处理没有响应的情况（例如网络错误）
          this.$message.error("Network error or no response from server.");
        }
      })
      request.get("/role").then(res => {
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
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {}
    },
    reset(){
      this.username=""
      this.email=""
      this.address=""
      this.load()
    },
    handleEdit(row){
      this.form = row
      this.dialogFormVisible = true
    },
    del(id){
      request.delete("/user/" + id).then(res => {
        if(res.code === '200'){
          this.$message.success("delete success!")
          this.load()
        } else {
          this.$message.error("delete wrong!")
        }
      })
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id) //[{},{},{}] => [1,2,3]
      request.post("/user/del/batch",ids).then(res => {
        if(res.code === '200'){
          this.$message.success("delete batch success!")
          this.load()
        } else {
          this.$message.error("delete batch wrong!")
        }
      })
    },
    headerBg(){
      return 'header-row';
    },
    rowClass(){
      return 'table-row';
    },
    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
    },
    exp(){
      window.open("http://localhost:9090/user/export")
    },
    handleExcelImportSuccess(){
      this.$message.success("import success!")
      this.load()
    },
    checkCourse(courses){
      this.courses = courses
      this.vis = true
    },
    checkStuCourse(stuCourses){
      this.courses = stuCourses
      this.stuVis = true
    }
  }
}

</script>


<style>
.header-row {
  background: #FFE4E1!important;
}

.table-row {
  background: #FFF0F5!important;
}

.user-container {
  /* 设置背景图片路径和属性 */
  background-image: url("../assets/logo2.gif");
  background-color: #FFF0F5;
  background-size: cover; /* 设置背景图片尺寸 */
  background-position: center; /* 设置背景图片位置 */
  height: 100%;
}
</style>