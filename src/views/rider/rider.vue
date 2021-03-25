<template>
<div>
    <div class="topTitle flex flexbetween flex_ac bgfff" style="border-bottom: 1px solid #f5f5f5;">
        <div class="shopTag flex flexbetween" style="flex-wrap: nowrap;overflow-x: auto;padding:10px 5px 3px;height: 45px">
            <div :class="orderTag==0?'on':''" @click="filterData(0)">任务大厅<span></span></div>
            <div :class="orderTag==1?'on':''" @click="filterData(1)">配送中<span></span></div>
            <div :class="orderTag==2?'on':''" @click="filterData(2)">已完成<span></span></div>
        </div>
        <div class="dongtai flex flexcenter" @click="$router.push('/ridercenter')"><img src="@/static/images/dongtaiTop.png"></div>
    </div>
    <div  id="scrollDiv" class="scrollDiv" style="height: calc(100vh - 46px);padding-bottom: 100px;">
        <div class="orderBox bgfff" v-for="items,indexs in orderList" :key="indexs">
            <div class="orderShop">
                <div class="" style="overflow: hidden;">
                    <div class="flex flexbetween">
                        <h2>{{items.receiverName}}  {{items.receiverTel}}</h2>
                        <a :href="'tel:'+items.receiverTel" v-if="items.status==1" class="el-icon-phone makePhone"></a>
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
                    <div v-if="items.payWay==0">应收<i>￥</i><b>{{items.totalPrice}}</b></div>
                    <div v-if="items.payWay==1">已付<i>￥</i><b>{{items.totalPrice}}</b></div>
                    <div v-if="items.status==2">已收<i>￥</i><b>{{items.totalPrice}}</b></div>
                    <span>共 {{items.totalAmount}} 件</span>
                </div>
                <div class="orderAct flex">
                    <div class="on" @click="takeOrder(items)" v-if="items.status==0">立即抢单</div>
                    <div @click="cancelOrder(items)" v-if="items.status==1">取消</div>
                    <div class="on" @click="successOrder(items)" v-if="items.status==1">送达</div>
                </div>
            </div>
        </div>
        <div class="noData" v-if="orderList.length==0">
            <img src="@/static/images/noAdr.png">
            <p>暂无数据</p>
        </div>

        <!-- <div class="timeDown" v-if="orderTag==0">{{time}}s后自动刷新</div> -->
        <el-backtop target=".scrollDiv" style="color: #FFAA16;"></el-backtop>
    </div>
    <audio src="/static/media.mp3" ref="audio" style="display: none;"> </audio>
</div>
</template>

<script>
import { sendMsg,socket } from '@/api/mysocket'
export default {
    name: 'rider',
    data () {
        return {
            userInfo:JSON.parse(sessionStorage.getItem('session'))||{},
            orderList: [],
            orderTag:0,
            setInt:null,
            time:20,
        }
    },
    destroyed() {
      socket.close() //离开路由之后断开websocket连接
    },
    beforeRouteLeave(to, from, next) {
        clearInterval(this.setInt)
        next();
    },
    created(){
        this.$dialog.loading.close();
        this.getOrderList();
        this.timeFun()
    },
    methods:{
        timeFun(){
            /*this.setInt=setInterval(()=>{
                --this.time
                if (this.time==0) {
                    this.time=20
                    this.getOrderList();
                }
            },1000)*/
            this.setInt=setInterval(()=>{
                // this.orderList=[]
                this.getOrderList()
            },2000)
        },
        cancelOrder(items){
            this.$dialog.confirm({
                title: '温馨提示',
                mes: '确定客户取消该订单？',
                opts: () => {
                    this.$dialog.loading.open(' ');
                    this.$api.post('/order/rider/orderAction',{
                        orderNo:items.orderNo,
                        riderId:this.userInfo.riderId,
                        items:items,
                        actions: 4,
                    },result=>{
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '订单已取消，请带回商品报备',
                            timeout: 2500,
                            icon: 'success',
                            callback:()=>{
                                this.getOrderList()
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
        successOrder(items){
            this.$dialog.confirm({
                title: '温馨提示',
                mes: '确定配送成功，客户已收货？',
                opts: () => {
                    this.$dialog.loading.open(' ');
                    this.$api.post('/order/rider/orderAction',{
                        orderNo:items.orderNo,
                        userId:items.userId,
                        riderId:this.userInfo.riderId,
                        items:items,
                        actions: 2,
                    },result=>{
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '订单已完成，收益已到账',
                            timeout: 2500,
                            icon: 'success',
                            callback:()=>{
                                this.getOrderList()
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
        takeOrder(items){
            this.$dialog.confirm({
                title: '温馨提示',
                mes: '确定配送该订单？',
                opts: () => {
                    this.$dialog.loading.open(' ');
                    this.$api.post('/order/rider/orderAction',{
                        orderNo:items.orderNo,
                        riderId:this.userInfo.riderId,
                        riderName:this.userInfo.riderName,
                        riderPhone:this.userInfo.mobile,
                        actions: 1,
                    },result=>{
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '已接单，赶紧配送吧',
                            timeout: 2500,
                            icon: 'success',
                            callback:()=>{
                                this.getOrderList()
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
        filterData(orderTag){
            if (this.orderTag==orderTag) {return}

            if (orderTag==1||orderTag==2) {
                this.time=20
                clearInterval(this.setInt)
                this.setInt=null
            }else{
                clearInterval(this.setInt)
                this.setInt=null
                this.timeFun()
            }
            this.orderList=[]
            this.orderTag=orderTag
            this.getOrderList();
        },
        getOrderList(){
            if (this.orderTag==0) {
                sendMsg({
                    type:'rider',
                    riderId:this.userInfo.riderId,
                    orderTag:0
                },ev=>{
                    // console.log(ev.data)
                    var data=JSON.parse(ev.data)
                    if (data.length>0) {
                        this.$refs.audio.play()
                    }
                    this.orderList=data;
                })
            }else{
                this.$dialog.loading.open(' ');
                this.$api.post('/order/riderOrder',{
                    riderId:this.userInfo.riderId,
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
            }
        }
    }
}
</script>

<style scoped>

</style>
