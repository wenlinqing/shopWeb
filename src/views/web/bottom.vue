<template>
<div>
    <!-- 底部 -->
    <div class="footer flex">
        <div class="ft_left flex1 flex">
            <div class="carIcon">
                <img src="@/static/images/shopCarOn.png">
                <!-- <i>{{totalNum}}</i> -->
            </div>
            <div class="carInfo" style="padding-top: 6px">
                <h2>￥<i>{{finalPrice/100}}</i></h2>
                <p><b style="text-decoration: line-through;" v-if="finalPrice!=totalPrice">￥{{totalPrice/100}}</b>  已优惠¥{{(totalPrice-finalPrice)/100}}</p>
            </div>
        </div>
        <div class="goPay flex flexcenter flex_ac" @click="$router.push('/orderSubmit')">去下单</div>
    </div>

    <div class="carBg" @click="$emit('childEmitParentFun')"></div>
    <div class="carBox">
        <div class="carTitle flex flexbetween">
            已选商品
            <div @click="clearCar"><i class="iconfont icon-lajixiang"></i> 清空购物车</div>
        </div>
        <div class="carAll">
            <div class="caiInfo flex flex_ac" v-for="item,proIndex in products" :key="proIndex" v-if="item.num>0">
                <h2 class="flex1">{{item.productName}}</h2>
                <div class="caiPrice flex flexbetween flex_ac">
                    <b style="color: #f00;" v-if="newcomer==1"><i style="font-size: 12px;">新人¥</i>{{item.newComerPrice}}</b><!-- 新人价 优先 -->
                    <b style="color: #f00;" v-if="newcomer==0&&item.isPromote==1"><i style="font-size: 12px;">促¥</i>{{item.promotePrice}}</b><!-- 促销 -->
                    <b style="color: #f00;" v-if="newcomer==0&&item.isPromote==0">¥<i>{{item.price}}</i></b><!-- 不促销 -->

                    <div class="actionBox flex flex_ac">
                        <div class="mini" @click="buyFun(1,item.productId)" v-if="item.num>0"><img src="@/static/images/pro_mini2.png"></div>
                        <div class="nums" v-if="item.num>0">{{item.num}}</div>
                        <div class="add" @click="buyFun(2,item.productId)"><img src="@/static/images/pro_add2.png"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        name: 'bottom',
        data () {
            return {
                totalPrice:0,
                totalNum:0,
                newcomer: sessionStorage.getItem('session')?JSON.parse(sessionStorage.getItem('session')).newcomer:1,
                products:JSON.parse(localStorage.getItem("products")),
                finalPrice:0,// 最终价格
            }
        },
        created(){
            this.getTotal()
        },
        mounted(){

        },
        methods: {
            buyFun(type,productId){
                var products=JSON.parse(localStorage.getItem("products"))
                if (type==2) {// 商品添加
                    for (var i = 0; i < products.length; i++){
                        if (products[i].productId === productId) {
                            products[i].num = products[i].num + 1
                            break;
                        }
                    }
                }else{// 商品减少
                    for (var i = 0; i < products.length; i++){
                        if (products[i].productId === productId&&products[i].num>0) {
                            products[i].num = products[i].num - 1
                            break;
                        }
                    }
                }
                localStorage.setItem("products", JSON.stringify(products));
                this.products = products;
                this.getTotal()
                // this.$emit('childEmitParentFun');// 子组件 触发 父组件中的方法 
            },
            getTotal(){
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
                }
                this.finalPrice=finalPrice
                this.totalPrice=totalPrice;
                if (totalPrice==0) {
                    this.$emit('childEmitParentFun');// 子组件 触发 父组件中的方法 
                }
                this.$forceUpdate()
            },
            clearCar(){
                this.$confirm('确定清空购物车?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.totalPrice=0;
                    var products=JSON.parse(localStorage.getItem("products"))
                    for (var i = 0; i < products.length; i++){
                        products[i].num=0
                    }
                    this.products=products
                    sessionStorage.setItem("localStorage",JSON.stringify(products))
                    this.$emit('childEmitParentFun');// 子组件 触发 父组件中的方法 
                }).catch(() => {

                });
            }
        }
    }
</script>
