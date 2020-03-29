<template>
  <section>
    <!--列表-->
    <el-table :data="userList" highlight-current-rowstyle="width: 100%;" border>
      <el-table-column type="index" label="序号" width="80" align='center'>
      </el-table-column>
      <el-table-column prop="riderName" label="骑手名" align='center'>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align='center'>
      </el-table-column>
      <el-table-column prop="withdrawal_account" label="提现账户" align='center'>
      </el-table-column>
      <el-table-column prop="money" label="提现金额" align='center'>
      </el-table-column>
      <el-table-column prop="status" label="状态" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.status==1" class="status1">待审核</i>
          <i v-if="scope.row.status==2" class="status2">成功</i>
          <i v-if="scope.row.status==3" class="status3">已拒绝</i>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="申请时间" width="200" align='center'>
         <template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
      </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.status==1" @click="applyFun(scope.row,2)">通过</el-button>
          <el-button type="danger" size="mini" v-if="scope.row.status==1" @click="applyFun(scope.row,3)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      total: 0,
      page: 1,
      pageSize:20,
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    //审核申请
    applyFun(row,status){
        var mes='';
        if (status==1) {
            mes='确定已转账给改骑手，确定通过？';
        }else{
            mes='转账不成功，确定拒绝该申请？';
        }
      this.$dialog.confirm({
        title: '温馨提示',
        mes: mes,
        opts: () => { 
          this.$dialog.loading.open(' ');
          this.$api.post('/riders/admin/checkApply',{
              id:row.id,
              riderId:row.riderId,
              money: row.money,
              status: status,
          },result=>{
              this.$dialog.loading.close();
              this.$dialog.toast({
                  mes: '操作成功',
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
                  timeout: 2500,
                  icon: 'error'
              });
          })
          }
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getDataList();
    },
    //获取用户列表
    getDataList() {
      this.$api.post('/riders/applyList',{
        page: this.page,
        pageSize:this.pageSize,
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
  }
  
};
</script>

<style scoped>
.el-table /deep/ thead{color: #1f2d3d;}
.el-table /deep/ th{height: 40px;padding:0;background-color: #eef1f6;}
.el-table /deep/ td{height: 40px;padding:0;}

</style>