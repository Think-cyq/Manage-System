<template>
  <div class="user-container">

    <div style="padding: 10px 0">
      <el-input style="width: 300px; margin-left: 20px"  placeholder="Please enter name" suffix-icon="el-icon-search" v-model="name"></el-input>
<!--      <el-input style="width: 300px" placeholder="please input your email" suffix-icon="el-icon-message" v-model="email"></el-input>
      <el-input style="width: 300px" placeholder="Please enter address" suffix-icon="el-icon-position" v-model="address"></el-input>
      --><el-button round class="ml-5" type="primary" @click="load">Search</el-button>
      <el-button round class="ml-5" type="success" @click="reset">reset</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button round type="primary" @click="handleAdd(null)">add<i class="el-icon-circle-plus-outline"></i></el-button>
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
<!--      <el-upload
          action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button round type="primary" class="ml-5">import<i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button round type="primary" @click="exp" class="ml-5">export<i class="el-icon-top"></i></el-button>
    --></div>

  <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
            row-key="id" default-expand-all @selection-change="handleSelectionChange" :row-class-name="rowClass" >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="id" width="80" align="center"></el-table-column>
    <el-table-column prop="name" label="name" align="center"></el-table-column>
    <el-table-column prop="path" label="path" align="center"></el-table-column>
    <el-table-column prop="pagePath" label="pagePath" align="center"></el-table-column>
    <el-table-column label="icon" class-name="fontSize18" align="center" label-class-name="fontSize12">
      <template slot-scope="scope">
        <i :class="scope.row.icon" />
      </template>
    </el-table-column>
    <el-table-column prop="description" label="description" align="center"></el-table-column>
    <el-table-column prop="sortNum" label="sortNum"></el-table-column>
    <el-table-column label="operation" width="280" align="center">
      <template slot-scope="scope">
        <el-button round type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">addChildren<i class="el-icon-edit-plus"></i></el-button>
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

  <el-dialog title="Menu info" :visible.sync="dialogFormVisible" width="30%" style="text-align: center" >
    <el-form label-width="100px" size="small">
      <el-form-item label="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="path">
        <el-input v-model="form.path" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="pagePath">
        <el-input v-model="form.pagePath" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="icon">
        <template slot-scope="scope">
          <el-select clearable v-model="form.icon" placeholder="Please select" style="width: 100%">
            <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
              <i :class="item.value" /> {{ item.name }}
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item label="顺序">
        <el-input v-model="form.sortNum" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="description">
        <el-input v-model="form.description" autocomplete="off"></el-input>
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
  name: "Menu",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      name: "",
      username: "",
      description:"",
      form:{},
      dialogFormVisible: false,
      multipleSelection: [],
      options: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      request.get("/menu", {
        params:{
          name: this.name,
        }
      }).then(res => {
        // 检查响应中是否有 records 字段
        console.log(res)
          this.tableData = res.data
      })
    },

    save(){
      request.post("/menu",this.form).then(res => {
        if(res.code === '200'){
          this.$message.success("save success!")
          this.dialogFormVisible = false
          this.load()
        } else{
          this.$message.error("save wrong!")
        }
      })
    },
    handleAdd(pid){
      this.dialogFormVisible = true
      this.form = {}
      if(pid){
        this.form.pid = pid
      }
    },
    reset(){
      this.name=""
      this.load()
    },
    handleEdit(row){
      this.form = row
      this.dialogFormVisible = true

      //请求图标的数据
      request.get("/menu/icons").then(res => {
        this.options = res.data
        console.log(this.options)
      })
    },
    del(id){
      request.delete("/menu/" + id).then(res => {
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
      request.post("/menu/del/batch",ids).then(res => {
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
      window.open("http://localhost:9090/menu/export")
    },
    handleExcelImportSuccess(){
      this.$message.success("import success!")
      this.load()
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

.fontSize18{
  font-size: 18px;
  color: aqua;
}

.fontSize12{
  font-size: 12px;
  color: #717f6d;
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