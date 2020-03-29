<template>
<div>
	<div class="pageTop flex flexcenter flex_ac">
        <div class="goBack flex flexcenter flex_ac" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        收货地址
        <div class="pageTopBtn" style="color: #616161" @click="$router.push('/shopWeb/addressAdd?tag=add&time='+new Date().getTime())">新增</div>
    </div>
	<div  id="scrollDiv" style="height: calc(100vh - 45px)">
		<div class="fapiaoBox bgfff">
			<div class="fapiaoItem flex flexbetween" v-for="item,index in addList" :key="index">
				<div class="flex flex1" @click="chooseAdr(item)">
					<div>
						<h2>{{item.province+item.city+item.district+' '+item.receiverStreet+item.houseNumber}}</h2>
						<p>{{item.receiverName}} {{item.receiverTel}} <i class="default" v-if="item.isDefault==1">默认</i></p>
					</div>
				</div>
				<div class="chkBtn flexauto" @click="editAdress(item)"><i class="el-icon-edit-outline"></i></div>
			</div>
		</div>
		<div class="noData" v-if="addList.length==0"><img src="@/static/images/noAdr.png" style="width: 150px"><p>暂无数据</p></div>
	</div>
</div>
</template>

<script>
	export default {
		name: 'addRemark',
		data() {
			return {
				addList: [],
				fromPaySubmit:this.$route.query.fromPaySubmit||''
			}
		},
		mounted(){
			this.getAddressList();
			sessionStorage.removeItem('editAdrObj')
			sessionStorage.removeItem('curPosi')
			sessionStorage.removeItem('chooseMapAdr')
		},
		methods: {
			getAddressList: function() {
	            var e = this;
	            e.$dialog.loading.open(" ")
	            this.$api.post("/address/addressList", {}, function(t) {
	                e.$dialog.loading.close(),
	                e.addList = t.list
	            }, function(e) {
	                e.$dialog.loading.close(),
	                Toast({
	                    mes: e.msg,
	                    timeout: "1500"
	                })
	            })
	        },
	        editAdress(obj){
	        	sessionStorage.setItem('editAdrObj',JSON.stringify(obj))
	        	this.$router.push('/shopWeb/addressAdd?tag=edit&addressId='+obj.addressId)
	        },
	        chooseAdr(obj){
	        	if (this.fromPaySubmit!='') {
	        		sessionStorage.setItem('chooseAdr',JSON.stringify(obj))
	        		this.goBack()
	        	}
	        }
		}
	}
</script>
<style scoped>
	.fapiaoBox{margin:0;padding:0 10px;}
	.fapiaoItem{padding:10px 0;}
	.fapiaoItem .flex1{padding-bottom: 10px;margin-right: 10px;}
	.default{display: inline-block;background: rgba(255,0,0,0.1);color: #e55a5a;font-size: 12px;padding:0 5px;border-radius: 3px;}
</style>
