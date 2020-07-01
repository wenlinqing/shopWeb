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
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增记录</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="dataList" highlight-current-rowstyle="width: 100%;" border>
      <el-table-column type="index" label="序号" width="60" align='center'>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align='center' width="80">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align='center' width="120">
      </el-table-column>
      <el-table-column prop="adress" label="地址" align='center' width="300">
      </el-table-column>
      <el-table-column prop="num" label="购买数量" align='center' width="80">
      </el-table-column>
      <el-table-column prop="price" label="购买单价" align='center' width="80">
      </el-table-column>

      <el-table-column prop="locked" label="总金额" align='center' width="80">
        <template slot-scope="scope">
          <b style="font-weight:bold">{{scope.row.num*scope.row.price}}</b>
        </template>
      </el-table-column>
      <el-table-column prop="postage" label="邮费" align='center' width="80">
      </el-table-column>
      <el-table-column prop="remark" label="备注" align='center'>
      </el-table-column>
      <el-table-column prop="create_time" label="购买时间" align='center' width="100">
        <template slot-scope="scope">
          {{scope.row.create_time|formatDay}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--新增界面-->
    <el-dialog :title="actType=='add'?'新增记录':'编辑记录'" :visible.sync="formVisible" :close-on-click-modal="false">
      <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
        <div class="flex">
          <el-form-item label="姓名" prop="username" class="flex1">
            <el-input v-model.trim="ruleForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile" class="flex1">
            <el-input v-model.trim="ruleForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </div>
          
        <el-form-item label="地址" prop="adress">
          <el-input v-model.trim="ruleForm.adress" auto-complete="off"></el-input>
        </el-form-item>

        <div class="flex">
          <el-form-item label="购买数量" prop="num" class="flex1">
            <el-input v-model.trim="ruleForm.num" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="购买价格" prop="price" class="flex1">
            <el-input v-model.trim="ruleForm.price" auto-complete="off"></el-input>
          </el-form-item>
        </div>

        <div class="flex">
          <el-form-item label="赠送数量" prop="giftNum" class="flex1">
            <el-input v-model.trim="ruleForm.giftNum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮费" prop="postage" class="flex1">
            <el-input v-model.trim="ruleForm.postage" auto-complete="off"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model.trim="ruleForm.remark" auto-complete="off"></el-input>
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
        callback(new Error('手机号有误'))
      } else {
        callback()
      }
    };
    return {
      filtersName: "",
      dataList: [],
      total: 0,
      page: 1,
      pageSize:20,


      actType:'add',
      formVisible:!1,
      ruleForm: {
        username: '',
        mobile: '',
        adress: '',
        num:'',
        price:'',
        giftNum:'',
        postage:'',
        remark:'',
      },
      rules: {
        username: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        mobile: [
          {required: true, message: '不能为空', trigger: 'blur'},
          { validator: phone, trigger: 'blur' },
        ],
        adress: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        num: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        price: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        postage: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    handleAdd: function() {
      this.formVisible=true;
      this.actType='add';
      return
      for(var key in this.ruleForm){
        if (key!='id') {
          this.ruleForm[key]=''
        }
      }
    },
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
              var url="/systems/recordAdd"
              var test="添加成功"
            }else{
              var url="/systems/recordEdit"
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
      this.$api.post('/systems/getSalesRecord',{
        page: this.page,
        pageSize:this.pageSize,
        title: this.filtersName,
      },result=>{
        this.dataList=result.list;
        this.total=result.totals
      },err=>{
        this.$dialog.toast({
            mes: err.msg,
            timeout: 1500,
            icon: 'error'
        });
      })
    },
    handleDelete(row){
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