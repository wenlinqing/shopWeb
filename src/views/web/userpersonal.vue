<template>
<div id="scrollDiv" class="scrollDiv" style="padding-bottom: 50px;">
    <div class="personTop" style="position: relative;">
        <div class="backBtn flex flexcenter" style="position: absolute;" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        <div class="personSetUp flex" style="height: 50px"></div>
        <div class="personInfo flex flexcenter" style="padding:0;position:relative;">
            <div class="flex flex_ac" >
                <a><img class="tou" src="@/static/images/default.png"></a>
                <div>
                    <p  class="intoPer flex flex_ac">{{userInfo.username}} {{userInfo.mobile}}</p>
                    <div style="color:#f00;font-size:12px;" class="flex flex_ac">会员等级: 普通VIP</div>
                </div>
            </div>
            <!-- <div class="signBtn" >未签到<i class="iconfont icon-xiangyoujiantou" style="font-size:12px;"></i></div> -->
            <!-- <div class="signBtn signed" v-if="getCheckInInfo==1" @click="goSign">已签到<i class="iconfont icon-xiangyoujiantou" style="font-size:12px;"></i></div> -->
        </div>

        <div class="perAssetBox flex" style="margin-top: 20px">
            <div class="flex1" @click="$router.push('/shopWeb/rechargeList')">
                <p>余额(￥)</p>
                <h2>{{userAssets.enabledMoney}}</h2>
            </div>
            <div class="flex1" @click="$router.push('/shopWeb/rechargeList')">
                <p>已消费(￥)</p>
                <h2>{{userAssets.usedMoney}}</h2>
            </div>
            
            <router-link class="viewAssetLink" to="/shopWeb/recharge">充值 <i class="el-icon-arrow-right"></i></router-link>
        </div>
    </div>

    <div style="height: 45px" v-if="isFixed"></div>
    <div class="perSectionOne bgfff" style="margin-bottom: 0" :class="isFixed?'fixed':''">
        <div class="shopTag flex flexbetween" style="flex-wrap: nowrap;overflow-x: auto;padding:10px 5px 3px;height: 45px">
            <div :class="orderTag==3?'on':''" @click="filterData(3)">全部<span></span></div>
            <div :class="orderTag==0?'on':''" @click="filterData(0)">待配送<span></span></div>
            <div :class="orderTag==1?'on':''" @click="filterData(1)">配送中<span></span></div>
            <div :class="orderTag==2?'on':''" @click="filterData(2)">已完成<span></span></div>
        </div>
    </div>

    <div id="targetBox">
        <div class="orderBox bgfff" v-for="items,indexs in orderList" :key="indexs">
            <div class="orderShop">
                <div class="" style="overflow: hidden;">
                    <div class="flex flexbetween">
                        <h2 v-if="items.status==1||items.status==2">配送员: {{items.riderName}}  {{items.riderPhone}}</h2>
                        <a :href="'tel:'+items.riderPhone" v-if="items.status==1" class="el-icon-phone makePhone"></a>
                    </div>
                    <div class="shopsTag">
                        {{items.province}}{{items.city}}{{items.district}}{{items.receiverStreet}}{{items.houseNumber}}
                    </div>
                    <div class="shopsTag">
                        订单号: {{items.orderNo}}
                    </div>
                </div>
            </div>
            <div class="orderPrice flex flexbetween">
                <div class="orPrice flex flex_ac">
                    <div v-if="items.payWay==0">应付<i>￥</i><b>{{items.totalPrice}}</b></div>
                    <div v-if="items.payWay==1">已付<i>￥</i><b>{{items.totalPrice}}</b></div>
                    <span>共 {{items.totalAmount}} 件</span>
                </div>
                <div class="orderAct flex flex_ac" style="margin-left: 5px">
                    <i  v-if="items.status==0" style="color: #6b90ff">待配送</i>
                    <i  v-if="items.status==1" style="color: #ff2323">配送中</i>
                    <i  v-if="items.status==2" style="color: #29d800">已完成</i>
                    <i  v-if="items.status==3||items.status==4" style="font-size: 12px;">已取消 <b v-if="items.payWay==1" style="color: #f00;">金额已退回账户</b></i>
                    <div @click="cancelOrder(items)" v-if="items.status==0">取消</div>
                </div>
            </div>
        </div>
        <div class="noData" v-if="orderList.length==0">
            <img src="@/static/images/noAdr.png">
            <p>暂无数据</p>
        </div>

        <el-backtop target=".scrollDiv" style="color: #FFAA16;"></el-backtop>

    </div>

    <router-link class="backBtn flex flexcenter" style="left: auto;right: 5px;top: auto;bottom:25px;" to="/shopWeb/feedback"><i class="el-icon-message"></i></router-link>
</div>
</template>

<script>
export default {
    name: 'userpersonal',
    data () {
        return {
            userInfo:JSON.parse(sessionStorage.getItem('session'))||{},
            orderList: [],
            orderTag:3,
            userAssets:{},
            isFixed:false,
        }
    },
    mounted: function() {
        document.getElementById("scrollDiv").addEventListener("scroll", this.handleScroll)
    },
    created(){
        this.$dialog.loading.close();
        this.getOrderList();
        this.getUserAssets()
    },
    methods:{
        getUserAssets(){
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
        goFeedback(){
            if (!sessionStorage.getItem('session')) {
                this.$router.replace('/shopWeb/login')
            }else{
                this.$router.push('/shopWeb/feedback')
            }
        },
        goNext(){
            if (!sessionStorage.getItem('session')) {
                this.$router.replace('/shopWeb/login')
            }else{
                this.$router.push('/shopWeb/recharge')
            }
        },
        cancelOrder(items){
            this.$dialog.confirm({
                title: '温馨提示',
                mes: '订单派送中，确定取消该订单？',
                opts: () => {
                    this.$dialog.loading.open(' ');
                    this.$api.post('/users/cancelOrder',{
                        orderNo:items.orderNo,
                        items:items,
                        actions: 0,
                    },result=>{
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '订单已取消，欢迎下次再来',
                            timeout: 2500,
                            icon: 'success',
                            callback:()=>{
                                this.getOrderList()
                                this.getUserAssets()
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
        showTxt(){
            this.$dialog.toast({
                mes: '敬请期待',
                timeout: 2000,
            });
        },
        filterData(orderTag){
            if (this.orderTag==orderTag) {return}

            this.orderList=[]
            this.orderTag=orderTag
            this.getOrderList();
        },
        getOrderList(){
            this.$dialog.loading.open(' ');
            this.$api.post('/users/order',{
                userId:this.userInfo.userId,
                orderTag: this.orderTag,
            },result=>{
                this.$dialog.loading.close();
                this.orderList=result.list;
            },err=>{
                this.$dialog.loading.close();
                this.$dialog.toast({
                    mes: err.msg,
                    timeout: 2500,
                    icon: 'error'
                });
            })
        },
        handleScroll(e) {
            var scrollTop=e.target.scrollTop;
            var targetTop=document.getElementById('targetBox').offsetTop-50
            if (scrollTop>targetTop) {
                this.isFixed=true
            }else{
                this.isFixed=false;
            }
        },
    }
}
</script>

<style scoped>

</style>
