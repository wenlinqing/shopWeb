<template>
<div class="loginBoxer">

  <div class="loginCont bgfff">
    <div class="loginForm flex">
      <div class="login_left">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
          <h3 class="title">系统登录</h3>
          <el-form-item prop="mobile">
            <el-input type="text" v-model="ruleForm2.mobile" auto-complete="off" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <br/>
          <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
          <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="login_right">
        <!-- <img src="@/assets/loginPic.png"> -->
      </div>
    </div>
  </div>
      
</div>
</template>

<script>
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          mobile: '13058076001',
          password: '123456wlq',
          type:'admin'
        },
        rules2: {
          mobile: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    created(){
      /*if ( this.$cookie.getCookie('loginName')&&this.$route.fullPath=='/login') {
        this.$router.replace('/home')
      }*/
      // console.log(this.$route.fullPath)
    },
    methods: {
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.$api.post('/login',this.ruleForm2,result=>{
              sessionStorage.setItem('session',JSON.stringify(result.userInfo))
              this.$dialog.toast({
                  mes: '登录成功',
                  timeout: 1500,
                  icon: 'success',
                  callback: () => {
                    this.$router.replace('/shopWeb/home')
                  }
              });
            },err=>{
              this.$dialog.toast({
                  mes: err.msg,
                  timeout: 1500,
                  icon: 'error'
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    width: 300px;
    background: #fff;
  }
  .login-container .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .login-container .remember {
    margin: 0px 0px 35px 0px;
  }
.loginBoxer{height: 100vh;position: absolute;width: 100%;top: 0;bottom: 0; background: url(../../static/images/loginBg.png) no-repeat;background-size: cover;}

.loginCont{width: 1100px; margin:0 auto;position: relative;top:50%;transform:translateY(-50%);box-shadow: 0 0 25px  #ccc;border-radius: 10px;overflow: hidden;align-items:center;}

.loginForm{align-items:center;}
.login_right{width: 700px;height: 620px;background: url(../../static/images/loginPic.png) no-repeat;background-size: cover;}
.login_left{flex:1;}
</style>