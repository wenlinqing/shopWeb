<template>
<div>
	<div class="pageTop topTitle flex flexbetween flex_ac" style="border-bottom: none;">
        <div class="goBack flex flexcenter flex_ac" style="position: relative;" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        <div class="texts">记录明细</div>
    </div>
	<div  id="scrollDiv" style="height:calc(100vh - 45px);padding-top: 10px">
		<div class="redItem flex flexbetween bgfff" v-for='item,index in listDate' :key="index">
			<img src="@/static/images/money_in.png" v-if="item.type==1">
			<img src="@/static/images/money_out.png" v-if="item.type==2">
			<div class="flex1">
				<h2 class="flex flex_ac" v-if="item.type==1">线下充值 
					<i v-if="item.status==1" class="status1">待审核</i>
					<i v-if="item.status==2" class="status2">成功</i>
					<i v-if="item.status==3" class="status3">审核失败</i>
				</h2>
				<h2 v-if="item.type==2">购物消费</h2>
				<p>{{item.create_time|formatDate}}</p>
			</div>
			<div class="redRight add" v-if="item.type==1&&item.status==3">{{item.money}}</div>
			<div class="redRight" v-if="item.type==1&&item.status==2">+{{item.money}}</div>
			<div class="redRight" v-if="item.type==2">—{{item.money}}</div>
		</div>
	</div>

</div>
</template>

<script>
export default {
	name: 'rechargeList',
	data(){
		return{
			userInfo:JSON.parse(sessionStorage.getItem('session')),
			listDate:[],
		}
	},
	created(){
		this.getListDate()
	},
	methods:{

    	getListDate(){
    		this.$dialog.loading.open(' ');
    		this.$api.post('/users/web/userAssetsDetail',{
				userId:this.userInfo.userId,
			},result => {
				this.$dialog.loading.close();
                this.listDate=result.list
	        },err=>{
	            this.$dialog.loading.close();
                this.$dialog.toast({
                    mes: err.msg,
                    timeout: 2500,
                    icon: 'error'
                });
	        })
    	}
    }
}
</script>

<style scoped>


</style>