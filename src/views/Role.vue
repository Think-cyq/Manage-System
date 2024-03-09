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
<!--      <el-upload
          action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button round type="primary" class="ml-5">import<i class="el-icon-bottom"></i></el-button>
      </el-upload>
      <el-button round type="primary" @click="exp" class="ml-5">export<i class="el-icon-top"></i></el-button>
    --></div>

  <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectionChange" :row-class-name="rowClass" >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="id" width="80" align="center"></el-table-column>
    <el-table-column prop="name" label="RoleName" align="center" width="200px"></el-table-column>
    <el-table-column prop="flag" label="key-flag" align="center" width="200px"></el-table-column>
    <el-table-column prop="description" label="description" align="center" width="200px"></el-table-column>
    <el-table-column label="operation" align="center">
      <template slot-scope="scope">
        <el-button round type="info" @click="selectMenu(scope.row)">Assignment Menu<i class="el-icon-menu"></i></el-button>
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

    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%" >
      <el-form label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识">
          <el-input v-model="form.flag" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button type="primary" @click="save">ensure</el-button>
      </div>
    </el-dialog>

  <el-dialog title="menu Assignment" :visible.sync="menuDialogVis" width="30%" style="text-align: center" >
    <el-tree
        :props="props"
        :data = "menuData"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="expends"
        :default-checked-keys="checks">
        <span class="custom-tree-node" slot-scope="{ node , data}">
          <span><i :class="data.icon" ></i>{{ data.name }}</span>
        </span>
    </el-tree>

    <div slot="footer" class="dialog-footer">
      <el-button @click="menuDialogVis = false">cancel</el-button>
      <el-button type="primary" @click="saveRoleMenu">ensure</el-button>

    </div>
  </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Role",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      name: "",
      form:{},
      dialogFormVisible: false,
      menuDialogVis : false,
      multipleSelection: [],
      menuData:[],
      props: {
        label: 'name',
        disabled: 'disabled'
      },
      expends: [],
      checks: [],
      roleId: 0,
      roleFlag: '',
      ids: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      request.get("/role/page", {
        params:{
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.name,
        }
      }).then(res => {
        // 检查响应中是否有 records 字段
          this.tableData = res.data.records;
          this.total = res.data.total;
      })
    },

    save(){
      request.post("/role",this.form).then(res => {
        if(res.code === '200'){
          this.$message.success("save success!")
          this.dialogFormVisible = false
          this.load()
        } else{
          this.$message.error("save wrong!")
        }
      })
    },
    saveRoleMenu(){
      request.post("/role/roleMenu/" + this.roleId,this.$refs.tree.getCheckedKeys()).then(res => {
        if (res.code === '200') {
          this.$message.success("Binding success!")
          this.dialogFormVisible = false
          // 操作管理员角色后需要重新登录
          if (this.roleFlag === 'ROLE_ADMIN') {
            console.log(this.roleFlag)
            this.$store.commit("logout")
          }

        } else {
          this.$message.error(res.msg)
        }
      })    },
    handleAdd(){
      this.dialogFormVisible = true
      this.form = {}
    },
    reset(){
      this.name=""
      this.load()
    },

    handleEdit(row){
      console.log(row)
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    del(id){
      request.delete("/role/" + id).then(res => {
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
      request.post("/role/del/batch",ids).then(res => {
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
    async selectMenu(role){
      this.menuDialogVis = true
      this.roleId = role.id
      this.roleFlag = role.flag

      //请求菜单数据
      request.get("/menu").then(res => {
        // 检查响应中是否有 records 字段
        this.menuData = res.data

        //把后台返回的菜单数据处理成 id 数组
        this.expends = this.menuData.map(v => v.id)

      })

      request.get("/role/roleMenu/"+ this.roleId ).then(res => {
        //先渲染弹窗里面的元素
        this.menuDialogVis = true

        this.checks = res.data
        this.ids.forEach(id => {
          if(!this.checks.includes(id)){
            this.$refs.tree.setChecked(id,false)
          }
        })
      })
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

.user-container {
  /* 设置背景图片路径和属性 */
  background-image: url("../assets/logo2.gif");
  background-color: #FFF0F5;
  background-size: cover; /* 设置背景图片尺寸 */
  background-position: center; /* 设置背景图片位置 */
  height: 100%;
}
</style>