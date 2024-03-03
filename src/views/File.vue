<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="enter name" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">search</el-button>
      <el-button type="warning" @click="reset">reset</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-upload
        action="http://localhost:9090/file/upload" :show-file-list="false"  :on-success="handleFileUploadSuccess" style="display: inline-block">
      <el-button round type="primary" class="ml-5">upload files<i class="el-icon-bottom"></i></el-button>
      </el-upload>

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
      <el-table-column prop="name" label="fileName" width="140" align="center"></el-table-column>
      <el-table-column prop="type" label="fileType" width="120" align="center"></el-table-column>
      <el-table-column prop="size" label="fileSize(kb)" align="center"></el-table-column>
<!--      <el-table-column label="preview">
        <template slot-scope="scope">
          <el-button type="primary" @click="preview(scope.row.url)">download</el-button>
        </template>
      </el-table-column>-->
      <el-table-column label="download">
        <template slot-scope="scope">
          <el-button type="primary" @click="download(scope.row.url)">download</el-button>
        </template>
      </el-table-column>
      <el-table-column  label="enable">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc"
                      @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="operation" width="200" align="center">
        <template slot-scope="scope">

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
  </div>

</template>


<script>
import request from "@/utils/request";

export default {
  name: "File.vue",
  data(){
    return{
      tableData: [],
      name:'',
      multipleSelection: [],
      pageNum: 1,
      pageSize: 5,
      total:0
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      request.get("/file/page", {
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
    changeEnable(row){
      request.post("/file/update",row).then(res => {
        if(res.code === '200') {
          this.$message.success("operation successfully!")
        }
      })
    },
    reset(){
      this.name=""
      this.load()
    },
    del(id){
      request.delete("/file/" + id).then(res => {
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
      request.post("/file/del/batch",ids).then(res => {
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
    handleFileUploadSuccess(res){
      console.log(res)
    },
    download(url){
      window.open(url)
    },
    preview(url){
      window.open()
    }
  }
}
</script>

<style scoped>

</style>