<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" size="medium">
        <el-form-item>
          <el-input v-model="filtersName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="page=1;getDataList()">查询</el-button>
        </el-form-item>
      </el-form>

    </el-col>

    <!--列表-->
    <el-table :data="userList" highlight-current-rowstyle="width: 100%;" border>
      <el-table-column type="index" label="序号" width="80" align='center'>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align='center'>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align='center'>
      </el-table-column>
      <el-table-column prop="newcomer" label="是否新人" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.newcomer==1" style="color: #409EFF;">是</i>
          <i v-if="scope.row.newcomer==0" style="color:#f00">否</i>
        </template>
      </el-table-column>
      <el-table-column prop="reportsNum" label="被举报次数" align='center'>
      </el-table-column>

      <el-table-column prop="locked" label="是否禁用" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.locked==1" style="color:#f00">是</i>
          <i v-if="scope.row.locked==0">否</i>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="注册时间" min-width="100" align='center'>
        <template slot-scope="scope">
          {{scope.row.create_time|formatDate}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" align='center'>
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button> -->
          <el-button size="mini" :style="scope.row.locked==0?'background-color:#f56c6c;border-color:#f56c6c;color:#fff':'background-color:#409eff;border-color:#409eff;color:#fff'" 
          @click="handleDisabled(scope.row)">{{scope.row.locked==0?'禁用':'启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--新增界面-->
    <el-dialog :title="actType=='add'?'新增骑手':'编辑用户'" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="姓名" prop="username">
          <el-input v-model.trim="ruleForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.trim="ruleForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model.trim="ruleForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认秘密" prop="chkPassword" v-if="actType=='add'">
          <el-input type="password" v-model.trim="ruleForm.chkPassword" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="passwordNew" v-if="actType=='edit'">
          <el-input type="password" v-model.trim="ruleForm.passwordNew" auto-complete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="确认秘密" prop="chkPasswordNew" v-if="actType=='edit'">
          <el-input type="password" v-model.trim="ruleForm.chkPasswordNew" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click.native="formVisible = !1">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    var phone = (rule, value, callback) => {
      if (value && (!(/^[1][123456789]\d{9}$/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
        callback(new Error(this.language.errorPhone))
      } else {
        callback()
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
      callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
      callback(new Error('两次输入密码不一致!'));
      } else {
      callback();
      }
    };
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
      callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.passwordNew) {
      callback(new Error('两次输入密码不一致!'));
      } else {
      callback();
      }
    };
    return {
      filtersName: "",
      userList: [],
      total: 0,
      page: 1,
      pageSize:20,


      actType:'add',
      formVisible:!1,
      ruleForm: {
        riderId:'',
        username: '',
        mobile: '',
        password: '',
        chkPassword:'',
        passwordNew:'',
        chkPasswordNew:'',
      },
      rules: {
        username: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        mobile: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { validator: phone, trigger: 'blur' },
        ],
        password: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {min: 5, max: 10, message: '长度5到10', trigger: 'blur'}
        ],
        chkPassword: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {min: 5, max: 10, message: '长度5到10', trigger: 'blur'},
          {required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwordNew: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {min: 5, max: 10, message: '长度5到10', trigger: 'blur'}
        ],
        chkPasswordNew: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {min: 5, max: 10, message: '长度5到10', trigger: 'blur'},
          {required: true, validator: validatePassNew, trigger: 'blur' }
        ],
      },
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    //编辑
    handleEdit(row) {
      this.actType='edit';
      this.formVisible = true;
      this.ruleForm = Object.assign({}, row);
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$dialog.loading.open(' ');
            if (this.actType=='add') {
              var url="/regist"
              var test="注册成功"
            }else{
              var url="/updateUserInfo"
              var test="更新成功"
            }
            this.ruleForm.type="riders"
            this.ruleForm.actionType="regist"
            // console.log(this.ruleForm)
            this.$api.post(url,this.ruleForm,result => {
              this.$dialog.loading.close();
              this.formVisible=false;
              this.$dialog.toast({
                  mes: test,
                  timeout: 1500,
                  icon: 'success',
                  callback:()=>{
                    this.getDataList();
                  }
              });
            },err=>{
              this.$dialog.loading.close();
              this.$dialog.toast({
                  mes: err.msg,
                  timeout: 1500,
                  icon: 'error'
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getDataList();
    },
    //获取用户列表
    getDataList() {
      this.$api.post('/users/getDataList',{
        page: this.page,
        pageSize:this.pageSize,
        title: this.filtersName,
      },result=>{
        this.userList=result.list;
        this.total=result.totals
      },err=>{
        this.$dialog.toast({
            mes: err.msg,
            timeout: 1500,
            icon: 'error'
        });
      })
    },
    handleDisabled(row){
      if (row.locked==0) {
        var txt='确认禁用该用户？'
      }else{
        var txt='确认启用该用户？'
      }
      this.$confirm(txt, "提示", {
        type: "warning"
      })
      .then(() => {
       this.$api.post('/users/enabledUser',{
        userId:row.userId,
        locked:row.locked==0?1:0,
      },result=>{
          this.$dialog.toast({
              mes: '操作成功',
              timeout: 1500,
              callback: () => {
                this.getDataList();
              }
          });
        },err=>{
          this.$dialog.toast({
              mes: err.msg,
              timeout: 1500,
              icon: 'error'
          });
        })
      })
    }
  }
  
};
</script>

<style scoped>
.el-table /deep/ thead{color: #1f2d3d;}
.el-table /deep/ th{height: 40px;padding:0;background-color: #eef1f6;}
.el-table /deep/ td{height: 40px;padding:0;}

</style>