<template>
<div>
	<div class="pageTop fixed flex flexcenter flex_ac" style="border-bottom: none;">
        <div class="goBack flex flexcenter flex_ac" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        购物车
        <div class="pageTopBtn" v-if="allMoney!=0" @click="clearCar">清空</div>
    </div>
	<div  id="scrollDiv">
		
	    <div class="payInfo bgfff" v-if="allMoney>0">
	    	<div class="shopName">{{shopName}}</div>
	    	<div class="caiInfo flex" v-for="proItem,index in product" :key="index" v-if="proItem.num>0">
	    		<img class="flexauto tou" v-lazy="proItem.productPic" >
                <div class="flex1" style="overflow: hidden;">
                    <h2 class="textElli flex1">{{proItem.productName}}</h2>
                    <p>{{proItem.productIngredientsKey}}</p>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 80px;">
                	<i>X{{proItem.num}}</i>
                    <b>¥{{proItem.salePrice}}</b>
                </div>
            </div>
            <div class="caiInfo flex" v-for="proItem,index in chooseSkuList" :key="proItem.attributesName">
                <img class="flexauto tou" v-lazy="proItem.productPic" >
                <div class="flex1" style="overflow: hidden;">
                    <h2 class="textElli flex1">{{proItem.productName}}</h2>
                    <p>{{proItem.attributesName}}</p>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 80px;">
                    <i>X{{proItem.num}}</i>
                    <b>¥{{proItem.salePrice}}</b>
                </div>
            </div>
            <div class="caiInfo flex" style="border-bottom: none;padding-top:10px;padding-bottom: 10px;">
                <div class="flex1" style="overflow: hidden;">
                    <h2 class="textElli flex1">包装费</h2>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 80px;">
                	<i></i>
                    <b>¥{{dazhe.tablewareFee}}</b>
                </div>
            </div>
            <div class="caiInfo flex" style="border-bottom: none;padding-top:10px;padding-bottom: 10px;">
                <div class="flex1" style="overflow: hidden;">
                    <h2 class="textElli flex1">配送费</h2>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 80px;">
                	<i></i>
                    <b>¥{{dazhe.deliveryFee}}</b>
                </div>
            </div>
            <div class="caiInfo flex" style="border-bottom: none;padding-top:10px;padding-bottom: 0;">
                <div class="flex1" style="overflow: hidden;">
                    <h2 class="textElli flex1 flex flex_ac">店铺优惠</h2>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 80px;">
                    <i></i>
                    <b style="color: #FF3413;">-¥{{zhekou.discountsAmount}}</b>
                </div>
            </div>

            <div class="caiInfo" style="border-bottom: none;padding-top:10px;padding-bottom: 0;">
                <div class="caiPrice" style="text-align: right;">
                    <b style="color: #FF3413;"><i class="total">合计:￥</i>{{ (zhekou.actualPayAmount)+dazhe.deliveryFee+dazhe.tablewareFee }}</b>
                    <a class="saveBtn" @click="$router.push('/shopWeb/orderSubmit')">去结算</a>
                </div>
            </div>
	    </div>
	    <div class="noData" v-if="allMoney==0"><img src="@/assets/images/noAdr.png"><p>暂无数据</p></div>
	   
	    <br/><br/>
	</div>	

</div>
</template>

<script>
export default {
  	name: "car",
	data: function() {
	    return {
	    	shopName:sessionStorage.getItem("shopName")||'',
	        product:JSON.parse(sessionStorage.getItem("shops")),
            chooseSkuList:JSON.parse(sessionStorage.getItem("chooseSkuList"))||[],
	        dazhe:{},
	        allMoney:0,
	        zhekou:0,
	    }
	},
	created: function() {
	    this.getTotalMoney()
	},
	methods: {
	    getTotalMoney() {
	        this.product.forEach(item=>{
                console.log(item.salePrice)
	        	this.allMoney+=item.num*(parseFloat(item.salePrice.toFixed(2))*100)
	        })

            if(sessionStorage.getItem("chooseSkuList")){
                var chooseSkuList=this.chooseSkuList;
                for (var i = 0; i < chooseSkuList.length; i++) {
                    var price=parseFloat(chooseSkuList[i].salePrice.toFixed(2))*100
                    
                    this.allMoney+=chooseSkuList[i].num*price
                }
            }

	        if (this.allMoney==0) {
	        	return
	        }

	        this.$api.post("/order/merhant/queryMerchantParam", {},(result)=>{
	            this.dazhe = result.data;
	        },(err)=>{
	            Toast({
	                mes: err.msg,
	                timeout: 1500
	            })
	        })
	        
	        this.$api.post("/order/merhant/getDiscountInfo", {
	        	totalAmount:this.allMoney/100
	        },(result)=>{
                this.zhekou = result.data;
            },(err)=>{
                Toast({
                    mes: err.msg,
                    timeout: 1500
                })
            })
	    },
	    clearCar(){
            this.$confirm('确定清空购物车?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.allMoney=0;
                var products=JSON.parse(sessionStorage.getItem("shops"))
                for (var i = 0; i < products.length; i++){
                    products[i].num=0
                }
                this.product=products
                sessionStorage.setItem("shops",JSON.stringify(products))
                sessionStorage.removeItem("curChoseSku")
                sessionStorage.removeItem("chooseSkuList")
            }).catch(() => {

            });
        }
	}
}
</script>

<style scoped>
	.saveBtn{display: inline-block;margin:0;height: 35px;line-height: 35px;padding:0 20px;border-radius: 5px;margin-left: 10px;}
	.caiInfo b{color: #333;}
	.total{font-size: 14px;}
</style>
