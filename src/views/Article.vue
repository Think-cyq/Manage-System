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
      <el-table-column prop="name" label="Passage Title" width="200" align="center"></el-table-column>
      <el-table-column prop="content" label="Passage Content" width="200" align="center">
        <template slot-scope="scope">
          <el-button @click="view(scope.row.content)" type="primary">查看内容</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="user" label="user" align="center"></el-table-column>
      <el-table-column prop="time" label="time" align="center"></el-table-column>
      <el-table-column label="operation" width="300" align="center">
        <template slot-scope="scope">
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


  <el-dialog title="Passage info" :visible.sync="dialogFormVisible" width="60%" >
    <el-form label-width="80px" size="small">
      <el-form-item label="文章标题">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="文章内容">
        <mavon-editor ref="md" v-model="form.content" :ishljs="true" @imgAdd="imgAdd"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">cancel</el-button>
      <el-button type="primary" @click="save">ensure</el-button>
    </div>
  </el-dialog>
    <el-dialog title="文章信息" :visible.sync="viewDialogVis" width="60%">
      <el-card>
        <div>
          <mavon-editor
              class="md"
              :value="content"
              :subfield="false"
              :defaultOpen="'preview'"
              :toolbarsFlag="false"
              :editable="false"
              :scrollStyle="true"
              :ishljs="true"
          />
        </div>
      </el-card>
    </el-dialog>


  </div>
</template>


<script>
import axios from 'axios';
import request from "@/utils/request";

export default {
  name: "Article.vue",
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
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      content:'',
      viewDialogVis: false,
    }
  },
  created() {
    this.load()
  },
  methods: {
    view(content){
      this.content = content
      this.viewDialogVis = true
    },
      imgAdd(pos,$file){
      let $vm = this.$ref.md
      //第一步，图片上传到服务器
      const formData = new FormData();
      formData.append('file',$file);
      axios({
        url:'http://localhost:9090/file/upload',
        method:'post',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'},
      }).then((res) => {
        //第二步，将返回的url替换到文本原来的位置
        $vm.$img2Url(pos,res.data);
      })
    },
    load() {
      request.get("/article/page", {
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

    },

    save(){
      request.post("/article",this.form).then(res => {
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
      request.delete("/article/" + id).then(res => {
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
      request.post("/article/del/batch",ids).then(res => {
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


  }
}
</script>

<style scoped>

</style>