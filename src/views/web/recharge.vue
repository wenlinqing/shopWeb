<template>
<div>
	<div class="pageTop topTitle flex flexbetween flex_ac" style="border-bottom: none;">
        <div class="goBack flex flexcenter flex_ac" style="position: relative;" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        <div class="texts">充值</div>
        <div style="font-size: 14px;color:#999; padding:10px 15px;" @click="$router.push('/rechargeList')">充值记录</div>
    </div>
	<div  id="scrollDiv" style="height:calc(100vh - 45px);">
		<div class="rechargeBox bgfff">
			<div style="font-size:16px;padding:10px;color:#999" >请选择充值金额</div>

			<div class="chargeBox flex">
				<div class="chargeItem" :class="index==actIdx?'on':''" v-for="item,index in rechargeItem" :key="index" @click="itemFun(index,item)">
					<h2>{{item.money}}元</h2>
					<p>优惠赠送:{{item.gift}}元</p>
				</div>
			</div>
			<div style="padding:0 15px 10px;">
				<el-radio v-model="recharge_way" label="1">支付宝充值</el-radio>
  				<el-radio v-model="recharge_way" label="2">微信充值</el-radio>
			</div>
			<div class="rechargeBtn">
				<p style="color: #f00;">充值活动为线下充值，为维护客户利益 请诚信操作</p><br/>
				<el-button type="primary" style="width:100%;height:45px;background: #FFD200;border-color: #FFD200;" @click="rechargeFun">充值</el-button></div>
		</div>
		<div style="padding:10px;">
			<div style="width: 60%;margin:0 auto;" v-if="recharge_way==1"><img src="@/static/images/zhi.jpg" style="width: 100%;"></div>
			<div style="width: 60%;margin:0 auto;" v-if="recharge_way==2"><img src="@/static/images/wx.jpg" style="width: 100%;"></div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'recharge',
	data() {
		return {
			userInfo:JSON.parse(sessionStorage.getItem('session')),
			money:'',
			actIdx:null,
			rechargeItem:[],
			rechargeObj:{},
			recharge_way:'1',//充值方式 1支付报  2微信
		}
	},
	created() {
		// this.$dialog.loading.open(' ');
		this.$api.post('/users/web/getRechargeItem',{},result => {
			this.$dialog.loading.close();
            this.rechargeItem=result.list
        },err=>{
            this.$dialog.loading.close();
            this.$dialog.toast({
                mes: err.msg,
                timeout: 2500,
                icon: 'error'
            });
        })

	},
	mounted() {
		this.$dialog.loading.close();
	},
	methods: {
		itemFun(index,item){
			this.actIdx=index;
			this.rechargeObj=item;
		},
		rechargeFun(){
			if (this.actIdx==null) {
				this.$dialog.toast({
                    mes: '请选择充值金额',
                    timeout: 1500,
                    icon: 'error'
                });
                return
			}

			this.$dialog.confirm({
                title: '温馨提示',
                mes: '请核对充值金额及充值方式，确定继续充值',
                opts: () => { 
					this.$dialog.loading.open(' ');
					this.$api.post('/users/web/recharge',{
		                userId:this.userInfo.userId,
		                recharge_way:Number(this.recharge_way),
		                rechargeNo:this.rechargeObj.rechargeNo,
		            },result=>{
		                this.$dialog.loading.close();
		                this.$dialog.toast({
		                    mes: '充值申请已提交，请等待审核',
		                    timeout: 2000,
		                    icon: 'success',
		                    callback:()=>{
		                        // this.goBack()
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