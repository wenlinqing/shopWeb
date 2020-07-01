<template>
    <div>
        <!-- <el-button type="primary" round @click="">登录</el-button> -->
        <el-button type="success" round @click="getData">起手获取订单数据</el-button>
        <el-button type="success" round @click="getOrderList">用户获取订单数据</el-button>
        <el-button type="success" round @click="loginOut">退出登录</el-button>
        <!-- <div style="padding-top: 100px;text-align: center;font-size: 20px">{{msg}}</div> -->
        <audio src="/static/media.mp3" ref="audio" style="display: none;"> </audio>
    </div>
</template>

<script>
import { sendMsg,socket } from '@/api/mysocket'
export default {
  name: 'test',
  data () {
    return {

    }
  },
  mounted() {
    
  },
    destroyed() {
      socket.close() //离开路由之后断开websocket连接
    },
  created(){
       // this.getData()
       // this.setInt=setInterval(()=>{
       //      this.getData()
       //  },2000)
  },
  methods:{
    loginFun(){
        // socket.sendMsg(1,ev=>{
        //     console.log(ev.data)
        // })
        /*this.$api.post('/login',{
            mobile: '13088889999',
            password: '123456',
            type:'web'
        },result=>{
            sessionStorage.setItem('session',JSON.stringify(result.userInfo))
            localStorage.setItem('token',result.userInfo.token)
        },err=>{
          this.$dialog.toast({
              mes: err.msg,
              timeout: 1500,
              icon: 'error'
          });
        }) */
    },
    getData(){
        sendMsg({
            type:'rider',
            riderId:'20032920001950521452463',
            orderTag:2
        },ev=>{
            var data=JSON.parse(ev.data)
            console.log(data)
            // setTimeout(()=>{
            //     this.getData()
            // },5000)
            this.$refs.audio.play()
        })

        /*this.$api.post('/product/getDataList',{},result=>{
            this.msg=result.msg
        },err=>{
          this.$dialog.toast({
              mes: err.msg,
              timeout: 1500,
              icon: 'error'
          });
        }) */
    },
    getOrderList(){
        sendMsg({
            type:'user',
            userId:'20032921321937000618950',
            orderTag:2
        },ev=>{
            // console.log(ev.data)
            setTimeout(()=>{
                this.getOrderList()
            },3000)
        })
        // this.$api.post('/order/admin/getOrderList',{
        //     status:''
        // },result=>{
        //     this.msg=result.msg
        // },err=>{
        //   this.$dialog.toast({
        //       mes: err.msg,
        //       timeout: 1500,
        //       icon: 'error'
        //   });
        // })
    },
    loginOut(){
        // localStorage.removeItem('token')  // /systems/getRedParama
        this.$api.get('/logout',{
            status:''
        },result=>{
            this.msg=result.msg
        },err=>{
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
