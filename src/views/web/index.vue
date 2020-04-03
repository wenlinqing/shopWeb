<template>
<div>
    <div id="scrollDiv">
        <yd-slider autoplay="3000" class="bannerBox" id="bannerBox">
            <yd-slider-item>
                <img src="@/static/images/product/dami.jpg">
            </yd-slider-item>
            <yd-slider-item>
               <img src="@/static/images/product/tuji1.jpg">
            </yd-slider-item>
            <yd-slider-item>
                <img src="@/static/images/product/tuji2.jpg">
            </yd-slider-item>
        </yd-slider>

        <yd-rollnotice autoplay="3000" class="indexNews">
            <yd-rollnotice-item><span> 庆 </span>热烈庆祝农惠千家原生态上线！</yd-rollnotice-item>
            <yd-rollnotice-item><span> 欢 </span>欢迎新老客户下单，充值多多 优惠多多！</yd-rollnotice-item>
            <yd-rollnotice-item><span> 优 </span>个人中心开放充值优惠活动啦！</yd-rollnotice-item>
        </yd-rollnotice>
        <div style="height: 50px" v-if="showNav"></div>
        <div class="navBox flex bgfff" :class="showNav?'fixed':''">
            <div class="flex1 flex flexcenter" :class="navTag==1?'on':''" @click="tagFun(1)"><span>首页</span></div>
            <div class="flex1 flex flexcenter" :class="navTag==2?'on':''" @click="tagFun(2)"><span>商品中心</span></div>
            <div class="flex1 flex flexcenter" :class="navTag==3?'on':''" @click="tagFun(3)"><span>联系我们</span></div>
        </div>
        <section class="content bgfff" v-if="navTag==1">
            <h1 style="padding: 20px 0 0;text-align: center;font-size: 20px;font-weight: bold;">农惠千家原生态</h1>
            
            <p>农惠千家原生态为您提供 原生态巴马香猪肉，原生态土鸡，有机大米，有机绿色蔬菜 等原生态农产品。我们将当季的新鲜的特色农产品，精挑细选后第一时间送到您的手中，让您吃出时尚，吃出健康，吃出高品质，吃出老滋味，吃出生命的活力，体验回归自然的美好人生。</p>
            <img src="@/static/images/product/pro1.jpg">
            <p>原生态农产品指无污染，无农药残留，纯天然有机生活品。本公司专业经营原生态农产品，为您提供优质产品，营造优质生活。我公司经营 生态猪肉，生态土鸡，有机大米，有机绿色蔬菜等绿色产品。</p>
            <img src="@/static/images/product/pro2.jpg">
            <p>有机大米是没有加工没有农药没有化学物质纯自然生长的食物，符合国家或国际有机食品要求和标准要求，有机食品标志是代表健康有机产品。</p>
            <img src="@/static/images/product/pro3.jpg">
        </section>

        <section class="content bgfff" v-if="navTag==3">
            <img src="@/static/images/lx.jpg">
            <p>地址：农惠千家原生态</p>
            <p>联系人： 农惠千家原生态</p>
            <p>电话：<a href="tel:88888888"> 8888-8888</a></p>
        </section>

        <div class="productBox flex" v-if="navTag==2">
            <div class="flexauto bgfff proItem" v-for="item,index in dataList" :key="index">
                <a>
                    <img :src="item.productImg" class="img">
                    <h2>{{item.productName}}</h2>
                    <section class="flex flexbetween price">
                        <span v-if="newcomer==1" style="font-size: 12px;">新人<i>{{item.newComerPrice}}</i>/{{item.unit}}</span><!-- 新人价 优先 -->
                        <span v-if="newcomer==0&&item.isPromote==1" style="font-size: 12px;">促销<i>{{item.promotePrice}}</i>/{{item.unit}}</span><!-- 促销 -->
                        <span v-if="newcomer==0&&item.isPromote==0" style="font-size: 12px;">¥<i>{{item.price}}</i>/{{item.unit}}</span><!-- 不促销 -->
                        <b v-if="!(newcomer==0&&item.isPromote==0)" style="font-size: 12px;">¥{{item.price}}</b>
                    </section><!-- newComerPrice -->
                    <div class="buy flex flex_ac">
                        <p class="flex1"><img src="@/static/images/hot.png"> <i>售</i> {{item.amount}}</p>
                        <div class="actionBox flex flex_ac">
                            <div class="mini" v-if="item.num>0" @click="buyFun(1,item.productId)"><img src="@/static/images/pro_mini2.png"></div>
                            <div class="nums" v-if="item.num>0">{{item.num}}</div>
                            <div class="add" @click="buyFun(2,item.productId)"><img src="@/static/images/pro_add2.png"></div>
                        </div>
                    </div>
                        
                </a>
            </div>
        </div>

        <el-backtop target="#scrollDiv" style="color: #FFAA16;"></el-backtop>
    </div>

    <div class="fixedNav flex flexcenter" style="left: 40px" v-if="showCar" @click="showCarDetail=true">
        <img src="@/static/images/shopCarOn.png" style="width: 100%">
    </div>
    <div class="fixedNav flex flexcenter" @click="goPersonal">
        <img src="@/static/images/person.png">
    </div>

    <bottom ref="mybottom" @childEmitParentFun="childEmitParentFun" class="fixed_bottom" v-if="showCarDetail"></bottom>

    <div class="indexRedBg fixed" v-if="showRed"></div>
    <div class="indexRedBoxer" v-if="showRed">
        <div class="redbg1">
            <div  class="logos"><img src="@/static/images/logo.png"></div>
            <p v-if="redMoney==0">农惠千家给您发了一个红包</p>
            <div v-if="redMoney==0" class="redBtn" :class="btnAct?'act':''" @click="gotRedFun"></div>
            <p v-if="redMoney!=0">恭喜您 抢到 <b>{{redMoney}}</b> 现金红包</p>
            <div v-if="redMoney!=0" class="redBtnOk" @click="showRed=!showRed">知道了</div>
            <div class="redClose" @click="showRed=!showRed"><i class="el-icon-close"></i></div>
        </div>
        <div class="redbg2">
            <p v-if="redMoney!=0">已存入账户余额，可直接进行消费</p>
        </div>
    </div>
</div>
</template>

<script>
    import bottom from './bottom'
    export default {
        name: 'index',
        data () {
            return {
                userInfo:JSON.parse(sessionStorage.getItem('session')),
                navTag: sessionStorage.getItem('navTag')?sessionStorage.getItem('navTag'):1,
                newcomer: JSON.parse(sessionStorage.getItem('session')).newcomer,
                dataList:JSON.parse(localStorage.getItem('products'))||[],
                showNav:!1,
                showCar:!1,
                showCarDetail:!1,
                btnAct:false,
                showRed:false,
                redMoney:0,
            }
        },
        components: {
            bottom
        },
        mounted(){
            this.$dialog.loading.close();
            this.tagFun(this.navTag)
            this.showCarFun()
            document.getElementById('scrollDiv').addEventListener('scroll', this.handleScroll)
        },
        created(){
            this.$api.post('/systems/getRedParama',{},result=>{
                if (result.data.red_activity==1) {
                    this.showRed=true;
                }
            },err=>{
              this.$dialog.toast({
                  mes: err.msg,
                  timeout: 1500,
                  icon: 'error'
              });
            })
            // this.getDataList();
        },
        beforeRouteLeave(to, from, next) {
            document.getElementById('scrollDiv').removeEventListener('scroll', this.handleScroll)
            next();
        },
        methods:{
            gotRedFun(){
                this.btnAct=!0
                setTimeout(()=>{
                    this.$api.post('/users/web/getReds',{
                        userId:this.userInfo.userId
                    },result=>{
                        this.redMoney=result.data
                    },err=>{
                        this.btnAct=!1
                        this.$dialog.toast({
                          mes: err.msg,
                          timeout: 1500,
                          icon: 'error'
                        });
                    })
                },1500)
            },
            goPersonal(){
                this.$router.push('/shopWeb/userpersonal');
            },
            childEmitParentFun(){
                // console.log('由子组件触发')
                this.dataList = JSON.parse(localStorage.getItem("products"))
                this.showCarDetail=!1;
                this.showCarFun()
                this.$forceUpdate()
            },
            showCarFun(){
                // 判断是否显示购物车
                for (var i = 0; i < this.dataList.length; i++) {
                    if (this.dataList[i].num>0) {
                        this.showCar=!0;
                        break;
                    }else{
                        this.showCar=!1;
                    }
                }
            },
            buyFun(type,productId){
                if (type==2) {
                    for (var i = 0; i < this.dataList.length; i++) {
                        if (this.dataList[i].productId===productId) {
                            this.dataList[i].num+=1;
                            break;
                        }
                    }
                }else{
                    for (var i = 0; i < this.dataList.length; i++) {
                        if (this.dataList[i].productId===productId) {
                            this.dataList[i].num-=1
                        }
                    }
                }
                localStorage.setItem('products',JSON.stringify(this.dataList))
                this.showCarFun()
            },
            handleScroll(e){
                var scrollTop=e.target.scrollTop;
                var heights=document.getElementById('bannerBox').offsetHeight;
                if ( scrollTop>=heights) {
                  this.showNav=true;
                }else{
                  this.showNav=false;
                }
            },
            tagFun(type){
                this.navTag=type;
                if (type==2&&!localStorage.getItem('products')) {
                    sessionStorage.setItem('navTag',type)
                    // console.log('aaaaaaaaaa')
                    this.getDataList();
                }else{
                    sessionStorage.setItem('navTag',type)
                    // console.log('bbbbbbbb')
                }
            },
            //获取商品列表
            getDataList() {
                this.$api.post('/product/getDataList',{
                    page: 1,
                    pageSize:20,
                    title: '',
                },result=>{
                    if (localStorage.getItem('products')) {// 不是第一次进  要挑出购物车数据
                        var products=JSON.parse(localStorage.getItem('products'));
                        var list=result.list
                        for (var i = 0; i < list.length; i++) {
                            var num=products[i].num;
                            Object.assign(products[i],...list[i])
                            products[i].num=num;
                            // console.log(num,list[i].num,products[i])
                        }
                        this.dataList=products;
                        localStorage.setItem('products',JSON.stringify(products))
                    }else{// 第一次进直接赋值
                        this.dataList=result.list;
                        localStorage.setItem('products',JSON.stringify(result.list))
                    }
                },err=>{
                  this.$dialog.toast({
                      mes: err.msg,
                      timeout: 1500,
                      icon: 'error'
                  });
                })
            },
        }
    }
</script>
<style scoped>

</style>
