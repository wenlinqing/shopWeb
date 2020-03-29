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

        <!-- <yd-rollnotice autoplay="5000" class="indexNews">
            <yd-rollnotice-item><span style="color:#F00;"> 荐 </span>荣耀V9 3月超级钜惠！</yd-rollnotice-item>
            <yd-rollnotice-item><span style="color:#F00;"> 荐 </span>3.23京东超级品牌日格力盛典</yd-rollnotice-item>
            <yd-rollnotice-item><span style="color:#F00;"> 荐 </span>京东服饰 早春新品低至7折</yd-rollnotice-item>
        </yd-rollnotice> -->
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
</div>
</template>

<script>
    import bottom from './bottom'
    export default {
        name: 'index',
        data () {
            return {
                navTag: 1,
                newcomer: JSON.parse(sessionStorage.getItem('session')).newcomer,
                dataList:JSON.parse(sessionStorage.getItem('products'))||[],
                showNav:!1,
                showCar:!1,
                showCarDetail:!1,

            }
        },
        components: {
            bottom
        },
        mounted(){
            this.$dialog.loading.close();
            this.tagFun(1)
            this.showCarFun()
            document.getElementById('scrollDiv').addEventListener('scroll', this.handleScroll)
        },
        created(){

            this.getDataList();
            /*this.$api.post('/order/getParama',{
                userId:'20032217351748174296162',
                productId:'202003221584878200',
                prices: [28.88, 20],
                productCounts: [2, 3],
                productIds: ["202003221584878200", "202003221584878007"],
                values: [["202003221584878200", 28.88, 2], ["202003221584878007", 20, 3]]
            },result=>{
                
            },err=>{
              this.$dialog.toast({
                  mes: err.msg,
                  timeout: 1500,
                  icon: 'error'
              });
            })*/
        },
        beforeRouteLeave(to, from, next) {
            document.getElementById('scrollDiv').removeEventListener('scroll', this.handleScroll)
            next();
        },
        methods:{
            goPersonal(){
                this.$router.push('/shopWeb/userpersonal');
            },
            childEmitParentFun(){
                // console.log('由子组件触发')
                this.dataList = JSON.parse(sessionStorage.getItem("products"))
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
                sessionStorage.setItem('products',JSON.stringify(this.dataList))
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
                /*if (type==2&&this.dataList.length==0&&!sessionStorage.getItem('products')) {
                    this.getDataList();
                }*/
            },
            //获取商品列表
            getDataList() {
                this.$api.post('/product/getDataList',{
                    page: 1,
                    pageSize:20,
                    title: '',
                },result=>{
                    if (result.list.length>0) {
                        this.dataList=result.list;
                        sessionStorage.setItem('products',JSON.stringify(result.list))
                    }
                   this.total=result.totals
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
