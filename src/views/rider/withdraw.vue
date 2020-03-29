<template>
<div>
	<div class="pageTop topTitle flex flexbetween flex_ac" style="border-bottom: none;">
        <div class="goBack flex flexcenter flex_ac" style="position: relative;" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        <div class="texts">提现申请</div>
        <div style="font-size: 14px;color:#999; padding:10px 15px;" @click="$router.push('/shopWeb/withdrawList')">提现记录</div>
    </div>
	<div  id="scrollDiv" style="height:calc(100vh - 45px);">
		<div class="rechargeBox bgfff">
			<div style="font-size:16px;padding:10px;color:#999" >请选择提现金额</div>

			<div class="chargeBox flex">
				<div class="chargeItem" :class="1===actIdx?'on':''" @click="itemFun(1,5)">
					<h2>5元</h2>
				</div>
				<div class="chargeItem" :class="2===actIdx?'on':''" @click="itemFun(2,10)">
					<h2>10元</h2>
				</div>
				<div class="chargeItem" :class="3===actIdx?'on':''" @click="itemFun(3,50)">
					<h2>50元</h2>
				</div>
				<div class="chargeItem" :class="4===actIdx?'on':''" @click="itemFun(4,100)">
					<h2>100元</h2>
				</div>
				<div class="chargeItem" :class="5===actIdx?'on':''" @click="itemFun(5,200)">
					<h2>200元</h2>
				</div>
				<div class="chargeItem" :class="6===actIdx?'on':''" @click="itemFun(6,500)">
					<h2>500元</h2>
				</div>
			</div>
			<div class="rechargeBtn">
				<p>账户余额：{{amount_available}}元</p><br/>

				<el-button type="primary" style="width:100%;height:45px;background: #FFD200;border-color: #FFD200;" @click="rechargeFun" v-if="amount_available>=money">申请</el-button>

				<el-button type="primary" style="width:100%;height:45px;background: #ccc;border-color: #ccc;" v-if="amount_available<money">余额不足</el-button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'riderwithdraw',
	data() {
		return {
			userInfo:JSON.parse(sessionStorage.getItem('session')),
			amount_available:JSON.parse(sessionStorage.getItem('session')).amount_available,
			money:'',
			actIdx:'',
		}
	},
	created() {
		this.itemFun(1,5);
	},
	mounted() {
		this.$dialog.loading.close();
	},
	methods: {
		itemFun(index,money){
			this.actIdx=index;
			this.money=money;
		},
		rechargeFun(){
			this.$dialog.confirm({
                title: '温馨提示',
                mes: '请核对提现金额，继续提现？',
                opts: () => { 
					this.$dialog.loading.open(' ');
					this.$api.post('/riders/applyForWithdrawal',{
		                riderId:this.userInfo.riderId,
		                money: this.money,
		            },result=>{
		                this.$dialog.loading.close();
		                this.$dialog.toast({
		                    mes: '申请已提交，请等待审核',
		                    timeout: 2500,
		                    icon: 'success',
		                    callback:()=>{
		                    	this.amount_available-=this.money;
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
		}
	}
}
</script>
<style scoped>
.rechargeBox{margin: 15px 0;padding-bottom: 20px;overflow: hidden;}
.rechargeBox input{border: none;outline: none;height: 55px;width: 100%;margin-left: 15px}
.chargeBox{margin-left: 10px;padding:15px 10px 15px 0;flex-wrap: wrap;border-top: 1px solid #F4F4F4;}
.chargeItem{border:1px solid #F1B624;border-radius: 3px;width: calc(33.33% - 10px);margin:0 5px 10px;text-align: center;padding:10px 0;color: #F1B624;}
.chargeItem h2{font-size: 16px;margin-bottom: 5px}
.chargeItem p{font-size: 12px;}
.chargeItem.on{color: #fff;background: #FFD200;border-color: #FFD200}
.rechargeBtn{padding:0 15px;}


</style>