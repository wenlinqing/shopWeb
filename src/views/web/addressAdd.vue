<template>
<div>
	<div class="pageTop flex flexcenter flex_ac">
        <div class="goBack flex flexcenter flex_ac" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        {{tag=='add'?'新增收货地址':'修改收货地址'}}
        <div class="pageTopBtn" v-if="tag=='edit'" @click="delAdr">删除</div>
    </div>
	<div  id="scrollDiv" style="height: calc(100vh - 45px)">
		<div class="addInvoice bgfff">
			<div class="invoiceItem flex">
				<label>联系人</label>
				<div class="flex1">
					<input type="text" v-model.trim="ruleForm.receiverName" placeholder="请输入联系人" style="width: 100%;">
					<!-- <div class="choiceType">
						<b @click="sexFun(0)" :class="ruleForm.sex==0?'on':''">先生</b>
						<b @click="sexFun(1)" :class="ruleForm.sex==1?'on':''">女士</b>
					</div> -->
				</div>
					
			</div>
			<div class="invoiceItem flex flex_ac">
				<label>联系电话</label>
				<input type="text" v-model.trim="ruleForm.receiverTel" placeholder="请输入联系电话">
			</div>

			<div class="invoiceItem flex flex_ac" @click="$router.push('/shopWeb/addressMapPosition')">
				<label>地图定位</label>
				<div>{{ruleForm.lat!=''&&ruleForm.lng!=''?ruleForm.province+ruleForm.city+ruleForm.district+' '+ruleForm.receiverStreet:'请选择定位'}} </div>
				<i class="el-icon-arrow-right"></i>
			</div>

			<div class="invoiceItem flex flex_ac">
				<label>详细地址</label>
				<input type="text" v-model.trim="ruleForm.houseNumber" placeholder="例：XX大厦2号楼1301室">
			</div>
		</div>
    	
		<div class="defaultBtn bgfff flex flexbetween">
			设为常用地址
			<el-switch v-model="isDefault" active-color="#53D769" inactive-color="#aaa"></el-switch>
		</div>
		<div class="saveBtn flex flex_ac flexcenter" @click="saveFun">保存</div>

		<!-- <div class="amap-wrapper" id="my_container" style="height:0;background:#fff;" v-if="tag=='add'"></div> -->
	</div>
</div>
</template>

<script>
	export default {
		name: 'addRemark',
		data() {
			let self = this;
			return {
				isDefault:true,
				tag: this.$route.query.tag||'',
				ruleForm: {
					addressId: '',
					receiverName: '',
					receiverTel: '',
					province: '',
					city: '',
					district: '',
					receiverStreet: '',
					houseNumber: '',
					lat:'',
					lng:'',
					userId:JSON.parse(sessionStorage.getItem('session')).userId||''
				},
				editAdrObj:{},
			}
		},
		activated(){ // 组件keepalive后 更新数据变化
		    // console.log('activated')
		    if (sessionStorage.getItem('curPosi')) {
		    	var curPosi=JSON.parse(sessionStorage.getItem('curPosi'))
				this.ruleForm.province = curPosi.province;
	            this.ruleForm.city = curPosi.city;
	            this.ruleForm.district = curPosi.district;

	            // this.ruleForm.provinceCode = curPosi.adcode;
	            // this.ruleForm.cityCode = curPosi.citycode;
		    }

            if (sessionStorage.getItem('chooseMapAdr')) {
            	var chooseMapAdr=JSON.parse(sessionStorage.getItem('chooseMapAdr'))
                this.ruleForm.receiverStreet=chooseMapAdr.name
                this.ruleForm.lat=chooseMapAdr.location.lat
                this.ruleForm.lng=chooseMapAdr.location.lng
            }
		},
		created(){
			this.$dialog.loading.close();
		},
		mounted(){
			if (this.tag=='add') {
				if (sessionStorage.getItem('curPosi')) {
					var curPosi=JSON.parse(sessionStorage.getItem('curPosi'))
					this.ruleForm.province = curPosi.province;
                    this.ruleForm.city = curPosi.city;
                    this.ruleForm.district = curPosi.district;

                    // this.ruleForm.provinceCode = curPosi.adcode;
                    // this.ruleForm.cityCode = curPosi.citycode;
                }
                if (sessionStorage.getItem('chooseMapAdr')) {
                	var chooseMapAdr=JSON.parse(sessionStorage.getItem('chooseMapAdr'))
                    this.ruleForm.receiverStreet=chooseMapAdr.name
                }
			}else{
				this.ruleForm = Object.assign({},JSON.parse(sessionStorage.getItem('editAdrObj')))
				this.isDefault=this.ruleForm.isDefault==1?true:false;
			}
		},
		methods: {
			delAdr: function() {
	            var t = this;
	            this.$confirm('确定删除该地址?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$dialog.loading.open(" ")
	                t.$api.post("/adress/delete", {
	                    addressId: t.ruleForm.addressId
	                }, function(e) {
	                    t.$dialog.loading.close()
	                    t.$dialog.toast({
	                        mes: "删除成功",
	                        timeout: "1500",
	                        icon: 'success',
	                        callback:()=>{
	                        	t.$router.go(-1)
	                        }
	                    });
	                }, function(e) {
	                    t.$dialog.loading.close()
	                    t.$dialog.toast({
	                        mes: e.msg,
	                        timeout: "1500"
	                    })
	                })
                }).catch(() => {

                });
	        },
			saveFun() {
				if (this.ruleForm.receiverName.trim()=='') {
					this.$dialog.toast({
	                    mes: '请输入联系人',
	                    timeout: 1500,
	                    icon: 'error'
	                })
					return
				}
				if (this.ruleForm.receiverTel.trim()=='') {
					this.$dialog.toast({
	                    mes: '请输入联系电话',
	                    timeout: 1500,
	                    icon: 'error'
	                })
					return
				}
				if (this.ruleForm.receiverTel.trim().length!=11) {
					this.$dialog.toast({
	                    mes: '联系电话输入有误',
	                    timeout: 1500,
	                    icon: 'error'
	                })
					return
				}

				if (this.ruleForm.province==''||this.ruleForm.city=='') {
					this.$dialog.toast({
	                    mes: '请选择定位地址',
	                    timeout: 1500,
	                    icon: 'error'
	                })
					return
				}
				if (this.ruleForm.houseNumber.trim()=='') {
					this.$dialog.toast({
	                    mes: '请输入详细地址',
	                    timeout: 1500,
	                    icon: 'error'
	                })
					return
				}
				this.$dialog.loading.open(" ")
				this.ruleForm.isDefault = this.isDefault ? 1 : 0;
				if (this.tag=='add') {
	                this.$api.post("/address/add", this.ruleForm,(r)=>{
	                    this.$dialog.loading.close();
	                    this.$dialog.toast({
	                        mes: "添加成功",
	                        timeout: "1500",
	                    	icon: 'success',
	                        callback:()=>{
	                        	this.$router.go(-1)
	                        }
	                    });
	                },(err)=> {
	                    this.$dialog.loading.close();
	                    this.$dialog.toast({
	                        mes: err.msg,
	                        timeout: "1500",
	                    	icon: 'error'
	                    })
	                })
				}else{
	                this.$api.post("/address/edit", this.ruleForm, (e)=> {
	                    this.$dialog.loading.close();
	                    this.$dialog.toast({
	                        mes: "更新成功",
	                        timeout: "1500",
	                        icon: 'success',
	                        callback:()=>{
	                        	this.$router.go(-1)
	                        }
	                    });
	                }, (err)=> {
	                    this.$dialog.loading.close();
	                    this.$dialog.toast({
	                        mes: err.msg,
	                        timeout: "1500",
	                    	icon: 'error'
	                    })
	                })
				}
			},
		}
	}
</script>
<style scoped>
	.addInvoice{margin-top: 10px;}
	.invoiceItem label{width: 80px;}
	.choiceType{padding:5px 0;}
	.choiceType b.on{color: #FFAA16;border-color: #FFAA16;background:rgba(255,170,22,0.02);}
	.invoiceItem select{height: 40px;flex: 1;border: none;outline: none;}

	.invoiceItem{position: relative;}
	.invoiceItem i{position: absolute;right: 10px;color: #aaa;font-size: 16px;top: 50%;-webkit-transform:translateY(-50%);}
</style>
