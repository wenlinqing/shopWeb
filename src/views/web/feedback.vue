<template>
<div>
    <div class="pageTop flex flexcenter flex_ac" style="border-bottom: none;">
        <div class="goBack flex flexcenter flex_ac" @click="goBack"><i class="el-icon-arrow-left"></i></div>
        问题反馈
    </div>
    <div style="height:calc(100vh - 45px);padding: 0 15px;">
        <br/>
        <br/>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="" prop="content">
            <el-input type="textarea" v-model.trim="ruleForm.content" rows="5" maxlength="30" show-word-limit placeholder="请详细描述问题"></el-input>
          </el-form-item>
          <br/>
          <el-form-item>
            <el-button style="width: 100%;background: #FFD200;border-color: #FFD200;" type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
    </div>
    
</div>
</template>

<script>
      export default {
        data() {
          return {
            ruleForm: {
                userId:JSON.parse(sessionStorage.getItem('session')).userId,
                content: ''
            },
            rules: {
              content: [
                { required: true, message: '请详细描述问题', trigger: 'blur' }
              ]
            }
          };
        },
        methods: {
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$dialog.loading.open(' ');
                this.$api.post('/users/feedback',this.ruleForm,result=>{
                    this.$dialog.loading.close();
                    this.$dialog.toast({
                        mes: '问题已提交，请等待反馈',
                        timeout: 2500,
                        icon: 'success',
                        callback:()=>{
                            this.goBack()
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
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
        }
      }
    </script>