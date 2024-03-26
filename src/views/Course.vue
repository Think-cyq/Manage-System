<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="enter name" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">search</el-button>
      <el-button type="warning" @click="reset">reset</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-button round type="primary" @click="handleAdd" v-if="user.role === 'ROLE_ADMIN'">add<i class="el-icon-circle-plus-outline"></i></el-button>
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

    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" :row-class-name="rowClass" >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="40" align="center"></el-table-column>
      <el-table-column prop="name" label="CourseName" width="140" align="center"></el-table-column>
      <el-table-column prop="score" label="score" width="120" align="center"></el-table-column>
      <el-table-column prop="times" label="times" align="center"></el-table-column>
      <el-table-column prop="teacher" label="teacher" align="center"></el-table-column>
      <el-table-column label="like_num" align="center">
          <template slot-scope="scope">
            <el-button
                type="warning"
                icon="el-icon-star-off"
                @click="Add_num(scope.row.id)"
                circle>
            </el-button>
          </template>
      </el-table-column>




      <el-table-column label="operation" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="selectCourse(scope.row.id)">选课</el-button>
          <el-button round type="success" @click="handleEdit(scope.row)">edit<i class="el-icon-edit-outline"></i></el-button>
          <el-popconfirm
              class="ml-5"
              confirm-button-text='ensure'
              cancel-button-text='think again'
              icon="el-icon-info"
              icon-color="red"
              title="Are you sure?"
              @confirm="del(scope.row.id)"
          >
            <el-button round type="warning" slot="reference" v-if="user.role === 'ROLE_ADMIN'">delete<i class="el-icon-delete"></i></el-button>
            <el-button type="warning" icon="el-icon-star-off" circle>fff</el-button>
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


  <el-dialog title="Course info" :visible.sync="dialogFormVisible" width="30%" >
    <el-form label-width="80px" size="small">
      <el-form-item label="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="score">
        <el-input v-model="form.score" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="times">
        <el-input v-model="form.times" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="teacher">
        <el-select clearable v-model="form.teacherId" placeholder="Please select your teacher">
          <el-option v-for="item in teachers" :key="item.id" :label="item.nickname" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">cancel</el-button>
      <el-button type="primary" @click="save">ensure</el-button>
    </div>
  </el-dialog>
  </div>
</template>


<script>
import request from "@/utils/request";

export default {
  name: "Course.vue",
  data(){
    return{
      tableData: [],
      name:'',
      multipleSelection: [],
      pageNum: 1,
      pageSize: 5,
      total:0,
      dialogFormVisible: false,
      form:{},
      teachers: [],
      like_num: 0,
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      request.get("/course/page", {
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
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
      });

      request.get("/user/role/ROLE_TEACHER").then(res => {

          this.teachers = res.data;
        console.log(res)
      })
    },
    Add_num(courseId){
      request.post(`/course/like`,{
          like_num:this.like_num++,
          courseId: courseId
      }).then(res =>{
        if(res.code === '200') {
          this.$message.success("save success")
        }else{
          this.$message.error("save wrong")
        }
      })
    },

    save(){
      request.post("/course",this.form).then(res => {
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

    handleEdit(row){
      console.log(row)
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },

    reset(){
      this.name=""
      this.load()
    },
    del(id){
      request.delete("/course/" + id).then(res => {
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
      request.post("/course/del/batch",ids).then(res => {
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
    handlecourseUploadSuccess(res){
      console.log(res)
    },
    download(url){
      window.open(url)
    },
    selectCourse(courseId){
      request.post('/course/studentCourse/' + courseId + "/"+ this.user.id).then(res => {
        if(res.code === '200'){
          this.$message.success("Select Course success!")
        }else{
          this.$message.success(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>