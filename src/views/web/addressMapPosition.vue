<template>
<div>
    <div class="pageTop fixed flex flexcenter flex_ac">
        <div class="goBack flex flexcenter flex_ac" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        选择收货地址
    </div>

    <div class="amap-wrapper" id="my_containers" style="height:50vh;background:#fff;overflow: hidden;"></div>
    <div class="adrListBox" style="height:50vh;background:#fff;overflow-y: auto;">
        <!-- <div class="adrItem flex flex_ac" v-if="province!=''" @click="goBack">
            <img src="@/assets/images/local.png">{{province+city+district}}<i style="font-size: 12px;color: #aaa;margin-left: 10px;">当前位置</i>
        </div> -->

        <div class="adrItem flex flex_ac" v-if="nearbyPosi.length!=0"  v-for="item,index in nearbyPosi" :key="index" @click="hasChooseAdr(item)">
            <img src="@/static/images/perli3.png">{{item.name}}
        </div>
        
    </div>
    
</div>
</template>
<script>
// import AMap from 'AMap'
export default {
    name: "addressMapPosition",
    data() {
        let self = this;
        return {
            curPosi:{
                province:'',
                city:'',
                district:'',
                adcode:'',
                citycode:'',
            },
            province:'',
            city:'',
            district:'',
            nearbyPosi:[]
        };
    },
    created(){
        this.$dialog.loading.close()
        this.$dialog.loading.open("获取定位中")
    },
    mounted() {
        this.init()
    },
    methods: {
        hasChooseAdr(obj){
            sessionStorage.setItem('chooseMapAdr',JSON.stringify(obj))
            this.goBack()
        },
        init() {
            var self=this;
            var map = new AMap.Map('my_containers',{
              resizeEnable: true,
              zoom: 18,
              // center: [114.06487, 22.6575],
            })
            AMap.plugin('AMap.Geolocation',function(){ //异步加载插件
                var geolocation = new AMap.Geolocation({
                    timeout: 10000,
                    buttonOffset: new AMap.Pixel(10, 20),
                    zoomToAccuracy: true,
                })
                map.addControl(geolocation);
                geolocation.getCurrentPosition(function(status,result){
                    if(status=='complete'){
                        onComplete(result)
                    }else{
                        onError(result)
                    }
                });
            })

            //解析定位结果
            function onComplete(result) {
                self.$dialog.loading.close()
                // console.log('onComplete',result)
                regeocoder([result.position.lng,result.position.lat],that)
                self.province = result.addressComponent.province;
                self.city = result.addressComponent.city;
                self.district = result.addressComponent.district;
            }
            //解析定位错误信息
            function onError(data) {
                console.log('onError',data)
                Toast({
                    mes: '定位失败，请重试',
                    timeout: "1500"
                })
            }

            var geocoder,marker;
            function regeocoder(lnglatXY,that) {  // 点击地图后
                AMap.plugin('AMap.Geocoder',function(){   
                    var geocoder = new AMap.Geocoder({
                        radius: 500,
                        extensions: "all"
                    });        
                    geocoder.getAddress(lnglatXY, function(status, result) {
                        // console.log(result)
                        if (status === 'complete' && result.info === 'OK') {
                            that.nearbyPosi = result.regeocode.pois;
                            var posi={
                                province:result.regeocode.addressComponent.province,
                                city:result.regeocode.addressComponent.city,
                                district:result.regeocode.addressComponent.district,
                                adcode:result.regeocode.addressComponent.adcode,
                                citycode:result.regeocode.addressComponent.citycode,
                            }
                            sessionStorage.setItem('curPosi',JSON.stringify(posi))

                            sessionStorage.setItem('chooseMapAdr',JSON.stringify(result.regeocode.pois[0]))
                        }
                    });  
                    if(!marker){
                        marker = new AMap.Marker();
                        map.add(marker);
                    }
                    marker.setPosition(lnglatXY);
                })    
            }
            var that = this
            map.on('click', function(e) {
                var lnglatXY = [e.lnglat.getLng(),e.lnglat.getLat()];
                that.nearbyPosi = []
                regeocoder(lnglatXY,that)
            });
        },
    }
}
</script>
<style >
.amap-demo {
  height: 100%;
}
.amap-logo,.amap-copyright,.amap-marker-content{display: none!important;}
.adrItem{font-size: 16px;padding:15px;background: #fff;}
.adrItem img{width: 15px;margin-right: 5px;}
</style>