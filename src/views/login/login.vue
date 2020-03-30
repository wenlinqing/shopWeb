<template>
	<div class="registBox">
		<br/><br/><br/>
		<!-- <img src="@/static/images/loginIcon4.png" class="loginBack" style="width: 15px;" @click="goBack"> -->
		<div class="loginBox" style="text-align:center;">
			<a><img src="@/static/images/logo.png" ></a>
		</div>
		<div class="regist">
			<div class="loginItem">
				<input type="number" v-model.trim="ruleForm.mobile" placeholder="请输入手机号">
				<img src="@/static/images/loginIcon1.png" v-if="ruleForm.mobile!=''" style="width: 13px;right: 3px;" @click="clearName">
			</div>
			<div class="loginItem">
				<input :type="showPwd?'text':'password'" v-model.trim="ruleForm.password" placeholder="请输入登录密码">
				<img src="@/static/images/loginIcon3.png" style="width: 19px;" v-if="!showPwd" @click="showPwdFun(1)">
				<img src="@/static/images/loginIcon2.png" style="width: 19px;" v-if="showPwd" @click="showPwdFun(0)">
			</div>
			<div style="margin:20px 0;text-align: right;" class="flex flexbetween">
				<div >
					<el-radio v-model="ruleForm.type" label="web">用户登录</el-radio>
	  				<el-radio v-model="ruleForm.type" label="riders">骑手登录</el-radio>
				</div>
				<router-link to='/shopWeb/password' style="color:#aaa;font-size:12px;">忘记密码？</router-link>
			</div>
				
			<div class="submit">
				<el-button type="primary" @click="submitForm()" style="background:#5b8426;border:none;border-radius:20px;box-shadow:0px 4px 4px 0px rgba(226,75,62,0.33);">登 录</el-button>
				<div style="margin-top:10px;"><span style="color:#555;">新用户？</span><router-link to='/shopWeb/regist' style="color:#5b8426">立即注册</router-link></div>
			</div>
		</div>
	</div>
</template>


<script>

export default{
	name:'login',
	data(){
		return {
			ruleForm: {
				mobile: localStorage.getItem('wwwmobile')||'',
				password: localStorage.getItem('wwwpassword')||'',
				type:'web'
		    },
			showPwd:false,
		}
	},
	mounted(){
		this.$dialog.loading.close();
		/*for (var i = 0; i < 10; i++) {
			console.log('No'+(moment().format('YYMMDDHHmm')).toString() + (Number(Math.random().toString().substr(3, 10)) + Date.now()).toString())
		}*/
		/*if (localStorage.getItem('wwwmobile')&&localStorage.getItem('wwwpassword')) {
			this.submitForm()
		}*/
	},
	methods:{
		showPwdFun(type){
			if (type==1) {
				this.showPwd=true
			}else{
				this.showPwd=false
			}
		},
		clearName() {
			this.ruleForm.mobile=''
		},
		submitForm() {
			if (this.ruleForm.mobile.trim()=='') {
				this.$dialog.toast({
	                mes: '请输入手机号',
	                timeout: 1500,
	                icon: 'error'
	            });
	            return
			}
			if (this.ruleForm.mobile.trim().length!=11) {
				this.$dialog.toast({
	                mes: '手机号输入有误',
	                timeout: 1500,
	                icon: 'error'
	            });
	            return
			}
			if (this.ruleForm.password.trim()=='') {
				this.$dialog.toast({
	                mes: '请输入密码',
	                timeout: 1500,
	                icon: 'error'
	            });
	            return
			}
			// console.log(this.ruleForm)
			// return
			this.$dialog.loading.open(' ');
			this.$api.post('/login',this.ruleForm,result => {
				this.$dialog.loading.close()
				localStorage.setItem('wwwmobile',this.ruleForm.mobile)
				localStorage.setItem('wwwpassword',this.ruleForm.password)
				sessionStorage.setItem('session',JSON.stringify(result.userInfo))
				if (result.userInfo.roleType=='web') {
					this.$router.replace('/shopWeb/index')
				}else{
					this.$router.replace('/shopWeb/rider')
				}
			},err=>{
				this.$dialog.loading.close();
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
.loginBack{position: absolute;top: 15px;left: 15px;z-index: 9}
.loginItem{border-bottom: 1px solid #eee;padding:5px 0;position: relative;}
.loginItem input{border:none;outline: none;height: 35px;width: 100%;}
.loginItem img{position: absolute;right: 0;top: 50%;-webkit-transform:translateY(-50%);z-index: 9}

</style>
