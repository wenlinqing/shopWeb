<template>
<div class="registBox">
    <br/><br/><br/>
    <img src="@/static/images/loginIcon4.png" class="loginBack" style="width: 15px;" @click="goBack">
    <div class="loginBox" style="text-align:center;">
      <a><img src="@/static/images/logo.png"></a>
    </div>
		<div class="regist">
			<el-form label-width="80px" label-position="top" :model="ruleForm" ref="ruleForm" :rules='rules'>

        <div class="loginItem">
          <input v-model.trim="ruleForm.username" placeholder="请输入真实姓名">
        </div>
				<div class="loginItem">
          <input type="number" v-model.trim="ruleForm.mobile" placeholder="请输入手机号">
        </div>
        <div class="loginItem">
          <input type="password" v-model.trim="ruleForm.password" placeholder="请设置登录密码">
        </div>
        <div class="loginItem">
          <input type="password" v-model.trim="ruleForm.passwordChk" placeholder="请再次输入密码">
        </div>


				<div class="submit" style="margin-top: 40px;">
					<el-button type="primary" style="background:#5b8426;border:none;border-radius:20px;box-shadow:0px 4px 4px 0px rgba(226,75,62,0.33);" @click="submitForm('ruleForm')">注 册</el-button>
          <div style="margin-top:10px;"><router-link to='/shopWeb/login' replace style="color:#5b8426">去登录</router-link></div>
				</div>
			</el-form>
		</div>

</div>
</template>
<script>
export default{
	name:'regist',
	data(){
	var validatePass = (rule, value, callback) => {
		if (value === '') {
		callback(new Error('请输入密码'));
		} else {
		if (this.ruleForm.passwordChk !== '') {
			this.$refs.ruleForm.validateField('passwordChk');
		}
		callback();
		}
	};
	var validatePass2 = (rule, value, callback) => {
		if (value === '') {
		callback(new Error('请再次输入密码'));
		} else if (value !== this.ruleForm.password) {
		callback(new Error('两次输入密码不一致!'));
		} else {
		callback();
		}
	};
    return {
        ruleForm: {
			username: '',
            mobile: '',
            password: '',
            passwordChk: '',
            type:'web',
            actionType:'regist',
        },
        rules: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '不能为空', trigger: 'blur' },
          ],
          password: [
            {required: true, validator: validatePass, trigger: 'blur' }
          ],
          passwordChk: [
            {required: true, validator: validatePass2, trigger: 'blur' }
          ],
          
        }
    }
  },
  mounted(){
    this.$dialog.loading.close();
  },
  methods:{
    submitForm(formName) {
        if (this.ruleForm.username=='') {
            this.$dialog.toast({
                mes: '请输入真实姓名',
                timeout: 1500,
                icon: 'error'
            });
            return
        }
        if (this.ruleForm.mobile=='') {
            this.$dialog.toast({
                mes: '请输入手机号',
                timeout: 1500,
                icon: 'error'
            });
            return
        }
        if (this.ruleForm.mobile.length!=11) {
            this.$dialog.toast({
                mes: '手机号输入有误',
                timeout: 1500,
                icon: 'error'
            });
            return
        }

        if (this.ruleForm.password=='') {
            this.$dialog.toast({
                mes: '请输入密码',
                timeout: 1500,
                icon: 'error'
            });
            return
        }
        if (this.ruleForm.passwordChk=='') {
            this.$dialog.toast({
                mes: '请再次输入密码',
                timeout: 1500,
                icon: 'error'
            });
            return
        }

        if (this.ruleForm.passwordChk!=this.ruleForm.password) {
            this.$dialog.toast({
                mes: '2次密码输入不一致',
                timeout: 1500,
                icon: 'error'
            });
            return
        }
        this.$dialog.loading.open(' ');
        this.$api.post('/regist',this.ruleForm,result => {
            this.$dialog.loading.close();
            this.$dialog.toast({
              mes: '注册成功',
              timeout: 1500,
              icon: 'success',
              callback:()=>{
                this.$router.go(-1)
              }
            });
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