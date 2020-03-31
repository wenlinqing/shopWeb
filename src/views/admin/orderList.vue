<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" size="medium">
				<el-form-item>
					<el-input v-model.trim="orderNo" placeholder="订单号"></el-input>
				</el-form-item>
        <el-form-item>
          <el-select v-model="status" placeholder="请选择订单状态" @change="getOrderList">
            <el-option value="" label="全部订单">全部订单</el-option>
            <el-option value="0" label="待接单">待接单</el-option>
            <el-option value="1" label="配送中">配送中</el-option>
            <el-option value="2" label="配送完成">配送完成</el-option>
            <el-option value="3" label="用户取消">用户取消</el-option>
            <el-option value="4" label="骑手取消">骑手取消</el-option>
          </el-select>
        </el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getOrderList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderList" highlight-current-row style="width: 100%;" border>
			<el-table-column type="index" width="60" align='center'>
			</el-table-column>

      <el-table-column prop="create_time" label="下单时间" width="160" align='center' sortable>
        <template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
      </el-table-column>
			<el-table-column prop="orderNo" label="订单号" width="190">
			</el-table-column>
			<el-table-column prop="totalPrice" label="订单金额" width="80" align='center'>
			</el-table-column>
			<el-table-column prop="totalAmount" label="商品数量" width="80" align='center'>
			</el-table-column>
      
      <el-table-column prop="payWay" label="支付方式" width="80" align='center'>
        <!-- 0 货到付款 1 积分付款 -->
        <template slot-scope="scope">
          <i v-if="scope.row.payWay==0" class="status1">货到付款</i>
          <i v-if="scope.row.payWay==1" class="status3">积分付款</i>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="80" align='center'>
        <!-- 订单状态 0 待送货 1 送货中 2 成功 3 用户取消 4 骑手取消 (用户不要了) -->
        <template slot-scope="scope">
          <i v-if="scope.row.status==0" class="status0">待送货</i>
          <i v-if="scope.row.status==1" class="status1">送货中</i>
          <i v-if="scope.row.status==2" class="status2">成功</i>
          <i v-if="scope.row.status==3" class="status3">用户取消</i>
          <i v-if="scope.row.status==4" class="status3">骑手取消</i>
        </template>
      </el-table-column>

      <el-table-column prop="riderName" label="骑手姓名" width="80" align='center'>
      </el-table-column>
      <el-table-column prop="riderPhone" label="骑手电话" width="115" align='center'>
      </el-table-column>
      <el-table-column label="接单时间" width="160" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.reveive_time==''">------</i>
          <i v-else>{{scope.row.reveive_time|formatDate}}</i>
        </template>
      </el-table-column>
      <el-table-column label="是否送达" width="80" align='center'>
        <!-- 是否送达 0 否 1 是 -->
        <template slot-scope="scope">
          <i v-if="scope.row.isDelive==0" class="status3">否</i>
          <i v-if="scope.row.isDelive==1" class="status1">是</i>
        </template>
      </el-table-column>
      <el-table-column label="送达时间" width="160" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.isDelive==0">-----</i>
          <i v-if="scope.row.isDelive==1" class="status1">{{scope.row.delive_time|formatDate}}</i>
        </template>
      </el-table-column>


      <el-table-column prop="receiverName" label="收获人" width="80" align='center'>
      </el-table-column>
      <el-table-column prop="receiverTel" label="收获电话" width="115" align='center'>
      </el-table-column>
      <el-table-column label="收获地址" align='center'>
        <template slot-scope="scope">{{scope.row.province+scope.row.city+scope.row.district+' '+scope.row.receiverStreet+scope.row.houseNumber}}</template>
      </el-table-column>
      

			<el-table-column prop="hopeSendTime" label="希望送达" width="80" align='center'>
      </el-table-column>
      <el-table-column prop="remark" label="订单备注" width="80" align='center'>
      </el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
export default {
  data() {
    return {
      orderNo:'',
      orderList: [],
      total: 0,
      page: 1,
      pageSize:20,
      status:'',
    };
  },
  mounted() {
    this.getOrderList();
    // console.log( moment().format('YYYY-MM-DD HH:mm:ss') )
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getOrderList();
    },
    //获取订单列表
    getOrderList() {
      this.$api.post('/order/admin/getOrderList',{
        page: this.page,
        pageSize:this.pageSize,
        orderNo: this.orderNo,
        status:this.status,
      },result=>{
	      this.orderList=result.list;
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