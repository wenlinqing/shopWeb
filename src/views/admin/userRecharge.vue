<template>
  <section>
    <!--列表-->
    <el-table :data="dataList" highlight-current-rowstyle="width: 100%;" border>
      <el-table-column type="index" label="序号" width="80" align='center'>
      </el-table-column>
      <el-table-column prop="username" label="用户名" align='center'>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align='center'>
      </el-table-column>
      <el-table-column prop="money" label="充值金额" align='center'>
      </el-table-column>
      <el-table-column prop="recharge_bonus" label="赠送金额" align='center'>
      </el-table-column>
      <el-table-column prop="recharge_way" label="充值方式" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.recharge_way==1">支付宝</i>
          <i v-if="scope.row.recharge_way==2">微信</i>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.status==1" class="status1">待审核</i>
          <i v-if="scope.row.status==2" class="status2">充值成功</i>
          <i v-if="scope.row.status==3" class="status3">失败</i>
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
      dataList: [],
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
            mes='已收到用户充值金额，确定通过？';
        }else{
            mes='未收到充值，确定拒绝该申请？';
        }
      this.$dialog.confirm({
        title: '温馨提示',
        mes: mes,
        opts: () => { 
          this.$dialog.loading.open(' ');
          this.$api.post('/users/admin/rechargeCheck',{
              orderNo:row.orderNo,
              userId:row.userId,
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
      this.$api.post('/users/web/userAssetsDetail',{
        page: this.page,
        pageSize:this.pageSize,
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
  }
  
};
</script>

<style scoped>
.el-table /deep/ thead{color: #1f2d3d;}
.el-table /deep/ th{height: 40px;padding:0;background-color: #eef1f6;}
.el-table /deep/ td{height: 40px;padding:0;}

</style>