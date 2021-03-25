<template>
<div>
	<div class="pageTop flex flexcenter flex_ac" style="border-bottom: none;">
        <div class="goBack flex flexcenter flex_ac" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        提交订单
    </div>
	<div  id="scrollDiv" class="scrollDivBg" style="height:calc(100vh - 140px);">
		<div class="secTop linearBg">
	        <div class="shopBox bgfff" @click="$router.push('/addressList?fromPaySubmit=1')" v-if="addList.receiverName">
	            <div class="shops flex">
	                <div class="flex1">
	                    <h1 class="textElli">{{addList.province+addList.city+addList.district+' '+addList.receiverStreet+addList.houseNumber}} </h1>
	                    <p class="flex flex_ac">{{addList.receiverName}} {{addList.receiverTel}}</p>
	                </div>
	                <i class="el-icon-arrow-right" style="font-size: 20px;"></i>
	            </div>
	        </div>
	        <div class="shopBox bgfff" @click="$router.push('/addressList?fromPaySubmit=1')" v-if="!addList.receiverName">
	            <div class="shops flex">
	                <div class="flex1">
	                    <h1 class="textElli" style="margin-bottom: 0;">添加收获地址 <i class="el-icon-arrow-right"></i></h1>
	                </div>
	            </div>
	        </div>
	    </div>


	    <div class="payInfo bgfff">
	    	<div class="shopName">{{shopName}}</div>
	    	<div class="caiInfo flex flex_ac" v-for="item,index in products" :key="index" v-if="item.num>0">
	    		<img class="flexauto tou" :src="item.productImg" >
                <div class="flex1 flex" style="overflow: hidden;flex-direction: column;">
                    <h2 style="height:auto;">{{item.productName}}</h2>
                    <p style="text-decoration: line-through;" v-if="!(newcomer==0&&item.isPromote==0)">￥{{item.price}}</p>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 100px;">
                	<div class="flex flex_ac" style="font-size: 12px;color: #aaa">
                		<i style="font-size: 16px;color: #333">{{item.num}}</i>{{item.unit}}
                	</div>
                    <b style="color: #f00;" v-if="newcomer==1">新¥<i>{{item.newComerPrice}}</i></b><!-- 新人价 优先 -->
                    <b style="color: #f00;" v-if="newcomer==0&&item.isPromote==1">促¥<i>{{item.promotePrice}}</i></b><!-- 促销 -->
                    <b style="color: #f00;" v-if="newcomer==0&&item.isPromote==0">¥<i>{{item.price}}</i></b><!-- 不促销 -->
                </div>
            </div>

            <div class="caiInfo flex" style="border-bottom: none;padding-top:10px;padding-bottom: 10px;">
                <div class="flex1" style="overflow: hidden;">
                    <h2 class="textElli flex1">配送费</h2>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 80px;">
                	<i></i>
                    <b style="color: #f00;">¥1</b>
                </div>
            </div>
            <div class="caiInfo flex" style="border-bottom: none;padding-top:10px;padding-bottom: 0;">
                <div class="flex1" style="overflow: hidden;">
                    <h2 class="textElli flex1 flex flex_ac">送达时间</h2>
                </div>
                <div class="caiPrice flex flexbetween flex_ac" style="width: 200px;">
                	<el-radio v-model="radio" label="1" @change="choseTimeFun1" style="margin-right: 10px;">尽快送达</el-radio>
  					<el-radio v-model="radio" label="2" @change="choseTimeFun2" >{{hopeSendTime!=''?hopeSendTime:'选择时间'}}</el-radio>
                </div>
            </div>
	    </div>

	    <div class="payInfo bgfff">
	    	<el-input type="textarea" v-model.trim="remark" show-word-limit maxlength="30" placeholder="备注"></el-input>
	    </div>
	    <br/><br/>
	</div>	
	<div class="payWays flex flex_ac flexbetween bgfff">
		支付方式
		<div class="flex payBtn flex1">
			<div class="flex flex_ac" :class="payway==0?'on':''" @click="changePay(0)"><i class="el-icon-success"></i> 货到付款</div>
			<div class="flex flex_ac" :class="payway==1?'on':''" @click="changePay(1)"><i class="el-icon-success"></i> 余额支付({{userAssets.enabledMoney}})</div>
		</div>
	</div>
	<div class="footer flex">
        <div class="ft_left flex1 flex flexbetween" style="padding:0 10px;">
        	<div class="flex flex_ac" style="color: #fff;">已优惠 ¥{{(totalPrice-finalPrice)/100}}</div>
            <div class="carInfo flex flexdir flex_ac flexcenter">
                <h2>合计：￥<i>{{(finalPrice/100)+1}}</i></h2>
            </div>
            
        </div>
        <div class="goPay flex flexcenter flex_ac" @click="orderType">提交订单</div>
    </div>

    <yd-datetime ref="ydDatetime" :start-date="startDate" :end-date="endDate" v-model="datetime" :callback="callbackFun" style="display: none;"></yd-datetime>

    <yd-keyboard v-model="showKeybord" input-text="请输入交易密码" :callback="keybordCallBack" ref="keyboard"></yd-keyboard>

</div>
</template>

<script>
export default {
  	name: "submit",
	data: function() {
	    return {
	    	userInfo:JSON.parse(sessionStorage.getItem('session'))||{},//tradePwd
	    	shopName:'农惠千家原生态',
	        addList: {},
	        products:JSON.parse(localStorage.getItem("products")),
	        newcomer: JSON.parse(sessionStorage.getItem('session')).newcomer,
	        totalPrice:0,
	        totalAmount:0,
	        finalPrice:0,// 最终价格
	        userId:JSON.parse(sessionStorage.getItem('session')).userId||'',
	        radio:'1',
	        hopeSendTime:'',

	        startDate:moment().format('YYYY-MM-DD HH:mm'),
	        endDate:moment().add(2, 'days').format('YYYY-MM-DD HH:mm'),
	        datetime:'',
	        remark:'',
	        payway:0,
	        userAssets:{},
	        showKeybord:false,
	        isSave:sessionStorage.getItem('isSave')||'',
	    }
	},
	created: function() {
	    var e = this;
	    e.$dialog.loading.close()
	    if ( sessionStorage.getItem('chooseAdr') ) {// 如果从地址列表选择了地址
	    	this.addList=JSON.parse(sessionStorage.getItem('chooseAdr'))
	    }else{
	    	e.$dialog.loading.open(" ");
		    this.$api.post("/address/addressList", {}, function(t) {
		    	e.$dialog.loading.close()
		        if (0 != t.list.length) {
		            var i = t.list.filter(function(e) {
		                if (e.isDefault)
		                    return !0
		            });
		            0 != i.length ? e.addList = i[0] : e.addList = t.list[0]
		        }
		    }, function(t) {
		        e.$dialog.loading.close(),
		        e.$dialog.toast({
		            mes: t.msg,
		            timeout: 1500,
		            icon: "error"
		        })
		    });
	    }
	    this.getTotalMoney()

	    this.$api.post('/users/userAssets',{
            userId:this.userInfo.userId
        },result=>{
            this.userAssets=result.data
        },err=>{
            this.$dialog.loading.close();
            this.$dialog.toast({
              mes: err.msg,
              timeout: 2000,
              icon: 'error'
            });
        })
	},
	methods: {
		changePay(way){
			if (way==1&&this.userAssets.enabledMoney<((this.finalPrice/100)+1) ) {
				this.$dialog.toast({
		            mes: '可用余额不足，请在个人中心充值',
		            timeout: 1500,
		        })
				return
			}
			this.payway=way;
		},
		callbackFun(){
			if (this.radio==2) {
				// console.log(this.datetime)
				this.hopeSendTime=moment(this.datetime).format('MM-DD HH:mm')
				// console.log(this.hopeSendTime)
			}
		},
		choseTimeFun1(){
			this.hopeSendTime=''
		},
		choseTimeFun2(){
			this.$refs.ydDatetime.open();
		},
	    getTotalMoney() {
	        var totalPrice=0,finalPrice=0;
            var products=JSON.parse(localStorage.getItem("products"))
            for (var i = 0; i < products.length; i++){
                var salePrice=0,prePrice=0;
                if(this.newcomer==1){
                    salePrice=parseFloat(products[i].newComerPrice.toFixed(2))*100  // 新人不打折 享有新人价
                }
                if(this.newcomer==0&&products[i].isPromote==1){// 促销价 promotePrice
                    salePrice=parseFloat(products[i].promotePrice.toFixed(2))*100
                }
                if(this.newcomer==0&&products[i].isPromote==0){// 不促销价 price
                    salePrice=parseFloat(products[i].price.toFixed(2))*100
                }

                finalPrice+=products[i].num*salePrice

                prePrice=parseFloat(products[i].price.toFixed(2))*100 // 不打折的价格
                totalPrice+=products[i].num*prePrice // 不打折的总价格

                this.totalAmount+=products[i].num
            }
            this.finalPrice=finalPrice
            this.totalPrice=totalPrice;
            this.$forceUpdate()
	    },
	    keybordCallBack(val){
	    	// console.log('输入的密码是：' + val);
            this.$dialog.loading.open('验证支付密码');
            if (val==this.userInfo.tradePwd) {
            	setTimeout(() => {
	            	this.$dialog.loading.close();
	            	sessionStorage.setItem('isSave',true)
	            	this.isSave=true;
	            	this.showKeybord=false;
	            	this.submitOrder()
            	}, 800);
            }else{
            	setTimeout(() => {
	                this.$refs.keyboard.$emit('ydui.keyboard.error', '对不起，您的支付密码不正确，请重新输入。');
	                this.$dialog.loading.close();
	            }, 1000);
            }
	    },
	    orderType(){
	    	this.$dialog.confirm({
                title: '温馨提示',
                mes: '确定订单信息无误，继续提交？',
                opts: () => { 
                	if (this.payway==1&&this.isSave=='') {
			    		this.showKeybord=true;
			    	}else{
			    		this.submitOrder()
			    	}
                }
            });
	    },
	    submitOrder(){
	    	if (!this.addList.addressId) {
	    		this.$dialog.toast({
                    mes: "请选择配送地址",
                    timeout: 1500,
		            icon: "error",
                    callback:()=> {
                        this.$router.push('/addressList')
                    }
                })
                return
	    	}
	    	if (this.hopeSendTime==''&&this.radio==2) {
	    		this.$dialog.toast({
		            mes: '请选择送达时间',
		            timeout: 1500,
		            icon:'error'
		        })
	    		return
	    	}

	    	var data={
	    		userId:this.userId,
	    		newcomer:this.newcomer,
	    		hopeSendTime:this.radio==1?'尽快送达':this.hopeSendTime,// 希望送达时间
	    		remark:this.remark,
	    		totalAmount:this.totalAmount,
	    		totalPrice:(this.finalPrice/100)+1,

	    		receiverName:this.addList.receiverName,
		        receiverTel:this.addList.receiverTel,
		        houseNumber:this.addList.houseNumber,

		        province:this.addList.province,
		        city:this.addList.city,
		        district:this.addList.district,
		        receiverStreet:this.addList.receiverStreet,
		        lng:this.addList.lng,
		        lat:this.addList.lat,
		        payway:this.payway,
	    	}
	    	var productIds=[]
	    	var productCounts=[]
	    	var prices=[]

	    	var values=[]
	    	this.products.forEach((item,index)=>{
	        	if (item.num>0) {
	        		productIds.push(item.productId)
	        		productCounts.push(item.num)
	        		if(this.newcomer==1){
                        prices.push(item.newComerPrice)// 新人价
                    }
                    if(this.newcomer==0&&item.isPromote==1){// 促销价 promotePrice
                        prices.push(item.promotePrice)// 新人价
                    }
                    if(this.newcomer==0&&item.isPromote==0){// 不促销价 price
                        prices.push(item.price)// 新人价
                    }
	        	}
	        })
	    	for(var i = 0; i < productIds.length; i++) {
				values[i]=[productIds[i],prices[i],productCounts[i]]
			}

	    	data.productIds=productIds
	    	data.productCounts=productCounts
	    	data.prices=prices
	    	data.values=values
	    	// console.log('data=',data,values)
	    	// return
	    	
	    	/*this.$dialog.confirm({
                title: '温馨提示',
                mes: '确定订单信息无误，继续提交？',
                opts: () => {*/
            this.$dialog.loading.open(" ")
	    	this.$api.post("/order/createOrder", data, (result)=> {
                this.$dialog.loading.close()
                this.$dialog.toast({
                    mes: "下单成功,我们将尽快给您送货",
                    timeout: 3000,
                    callback:()=> {
                        localStorage.removeItem("products")
                        var session=JSON.parse(sessionStorage.getItem('session'))
                        session.newcomer=0
                        sessionStorage.setItem("session",JSON.stringify(session))
                        this.$dialog.loading.close()
                        this.goBack();
                    }
                })
            }, (err)=> {
                this.$dialog.loading.close();
                this.$dialog.toast({
                    mes: err.msg,
                    timeout: 1500
                })
            })
            /*    }
            });*/
	    },
	}
}
</script>

<style scoped>
	.shopBox{padding:20px 10px;}
	.shops{top: 0}
	.shops div{margin-left: 10px;padding-top: 0;}
	.shops div h1{font-weight: bold;margin-bottom: 10px;}
	.shops div h1 i{float: right;color: #aaa;font-size: 20px;}
	.caiInfo b{color: #333;}
</style>
