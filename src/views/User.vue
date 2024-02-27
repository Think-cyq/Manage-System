<template>
  <div class="component-container">

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
    <el-button round type="primary" class="ml-5">import<i class="el-icon-bottom"></i></el-button>
    <el-button round type="primary">export<i class="el-icon-top"></i></el-button>
  </div>

  <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" :row-class-name="rowClass" >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="id" width="40" align="center"></el-table-column>
    <el-table-column prop="username" label="username" width="140" align="center"></el-table-column>
    <el-table-column prop="nickname" label="nickname" width="120" align="center"></el-table-column>
    <el-table-column prop="email" label="email" align="center"></el-table-column>
    <el-table-column prop="phone" label="phone" align="center"></el-table-column>
    <el-table-column prop="address" label="address" align="center"></el-table-column>
    <el-table-column label="operation" width="200" align="center">
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
      email:"",
      address:"",
      form:{},
      dialogFormVisible: false,
      multipleSelection: [],
    }
  },
  created() {
    this.load()
  },
  methods: {
    load(){
      request.get("/user/page",{
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,

          email: this.email,
          address: this.address
        }
      }).then(res => {

        this.tableData = res.records
        this.total = res.total
      })

    },
    save(){
      request.post("/user",this.form).then(res => {
        if(res){
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
        if(res){
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
        if(res){
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


<style>
.header-row {
  background: #FFE4E1!important;
}

.table-row {
  background: #FFF0F5!important;
}

.component-container {
  /* 设置背景图片路径和属性 */
  background-color: #FFF0F5;
  background-size: cover; /* 设置背景图片尺寸 */
  background-position: center; /* 设置背景图片位置 */
}
</style>