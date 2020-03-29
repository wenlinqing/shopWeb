<template>
<div>
    <div style="height: 430px;">
        <div class="personTop">
            <div class="backBtn flex flexcenter" @click="goBack"><i class="el-icon-arrow-left"></i></div>
            <div class="personSetUp flex"></div>
            <div class="personInfo flex flexcenter" style="padding:0;position:relative;">
                <div class="flex flex_ac" >
                    <a><img class="tou" src="@/static/images/default.png"></a>
                    <div>
                        <p  class="intoPer flex flex_ac">{{userInfo.riderName}} {{userInfo.mobile}}</p>
                        <div style="color:#666;font-size:12px;" class="flex flex_ac">提现账户: {{userInfo.withdrawal_account}}</div>
                    </div>
                </div>
            </div>

            <div class="topEnter flex flexcenter">
                <a to="/personal/myCollection">
                    <h2>{{incomeInfos.todayIncome}}</h2>
                    <p>今日收益</p>
                </a>
                <a to="/personal/footPrint">
                    <h2>{{incomeInfos.yestodayIncome}}</h2>
                    <p>昨日收益</p>
                </a>
                <a to="/personal/myViews">
                    <h2>{{incomeInfos.monthIncome}}</h2>
                    <p>上个月</p>
                </a>
            </div>

            <div class="perAssetBox flex">
                <div class="flex1">
                    <p>总金额</p>
                    <h2>{{incomeInfos.total_income}}</h2>
                </div>
                <div class="flex1">
                    <p>可用金额</p>
                    <h2>{{incomeInfos.amount_available}}</h2>
                </div>
                <div class="flex1">
                    <p>冻结金额</p>
                    <h2>{{incomeInfos.frozen_amount}}</h2>
                </div>
                    
                <a class="viewAssetLink" @click="goNext">提现 <i class="el-icon-arrow-right"></i></a>
            </div>
        </div>

        <div class="perSectionOne bgfff">
            <div class="topEnter bgfff flex flexcenter">
                <a>
                    <h2>{{orderCounts.todayAmount}}</h2>
                    <p>今日量</p>
                </a>
                <a>
                    <h2>{{orderCounts.yestodayAmount}}</h2>
                    <p>昨日量</p>
                </a>
                <a >
                    <h2>{{orderCounts.monthAmount}}</h2>
                    <p>上个月</p>
                </a>
            </div>

            <div class="topEnter bgfff flex flexcenter" style="padding-top: 0">
                <a>
                    <h2>{{orderCounts.successAmount}}</h2>
                    <p>配送成功</p>
                </a>
                <a >
                    <h2 >{{orderCounts.failAmount}}</h2>
                    <p>配送失败</p>
                </a>
                <a>
                    <h2>{{orderCounts.totalAmount}}</h2>
                    <p>总单量</p>
                </a>
            </div>
        </div>

    </div>
    <div style="height:calc(100vh - 430px)"><x-chart ></x-chart></div>
</div>
</template>

<script>
import XChart from '@/views/rider/chart.vue'
export default {
    name: 'ridercenter',
    data () {
        return {
            userInfo:JSON.parse(sessionStorage.getItem('session'))||{},
            incomeInfos:{},
            orderCounts:{},
        }
    },
    components:{
        XChart
    },
    created(){
        this.$dialog.loading.close();

        this.$api.post('/riders/incomeInfos',{
            riderId:this.userInfo.riderId
        },result=>{
            this.incomeInfos=result.data
            this.userInfo.amount_available=result.data.amount_available;
            sessionStorage.setItem('session',JSON.stringify(this.userInfo))
        },err=>{
            this.$dialog.loading.close();
            this.$dialog.toast({
              mes: err.msg,
              timeout: 2000,
              icon: 'error'
            });
        })

        this.$api.post('/riders/orderCounts',{
            riderId:this.userInfo.riderId
        },result=>{
            this.orderCounts=result.data
        },err=>{
            this.$dialog.loading.close();
            this.$dialog.toast({
              mes: err.msg,
              timeout: 2000,
              icon: 'error'
            });
        })
    },
    methods:{
        goNext(){
            if (!sessionStorage.getItem('session')) {
                this.$router.replace('/shopWeb/login')
            }else{
                this.$router.push('/shopWeb/withdraw')
            }
        },
    }
}
</script>

<style scoped>

</style>
