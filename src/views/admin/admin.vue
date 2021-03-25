<template>
    <div>
        <div class="adminHead flex flexbetween">
            后台管理系统
            <div class="loginOut flex flexcenter" @click="loginOut">
                退出登录
            </div>
        </div>
        <div class="adminBox flex">
            <div class="adminLeft">
                <router-link class="flex flexcenter" v-for="(item,index) in routes.children" :key="index" :to="item.path">{{item.name}}</router-link>
            </div>
            <div class="adminRight flex1 bgfff">
                <transition name="fade" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'admin',
  data () {
    return {
        routes:{},
    }
  },
  created(){
    var routes=this.$router.options.routes
    for (var i = 0; i < routes.length; i++) {
        if (!routes[i].hidden) {
            this.routes=routes[i]
            return
        }
    }
  },
  methods: {
    loginOut(){
        this.$dialog.loading.open(' ');
        this.$api.post('/loginOut',{},result=>{
            this.$dialog.loading.close();
            this.formVisible=false;
            this.$dialog.toast({
                mes: '退出成功',
                timeout: 1500,
                icon: 'success',
                callback:()=>{
                    this.$router.replace('/adminLogin')
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
    }
  }
}
</script>
