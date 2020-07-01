<template>
    <div>
        <el-button type="primary" round @click="">登录</el-button>
        <el-button type="success" round @click="getData">获取数据</el-button>
        <el-button type="success" round @click="getOrderList">获取订单数据</el-button>
        <el-button type="success" round @click="loginOut">退出登录</el-button>
        <div style="padding-top: 100px;text-align: center;font-size: 20px">{{msg}}</div>

        <div class="test3">
            <div class="msg" ref="box">
              <div v-for="item in list" :class="[item.type,'msg-item']">
                <p>
                  {{item.content}}
                </p>
              </div>
            </div>
            <div class="input-group">
              <input type="text" v-model="contentText">
              <!-- <button @click="sendText">发送</button> -->
            </div>
          </div>
    </div>
</template>

<script>
import socket from '@/api/mysocket'
export default {
  name: 'test',
  data () {
    return {
      msg: '',
      list: [],//聊天记录的数组
        contentText: "",//input输入的值
    }
  },
  mounted() {
    
  },
  created(){
       this.loginFun()
  },
    /*watch: {
      //监听list,当有修改的时候进行div的屏幕滚动，确保能看到最新的聊天
      list: function () {
        let that = this;
        setTimeout(() => {
          that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
        }, 0);
        //加setTimeout的原因：由于vue采用虚拟dom，我每次生成新的消息时获取到的div的scrollHeight的值是生成新消息之前的值，所以造成每次都是最新的那条消息被隐藏掉了
      }
    },*/
  methods:{
    //发送聊天信息
    /*sendText() {
        let that = this;
        this.list = [...this.list, {type: "mine", content: this.contentText}];//通过type字段进行区分是自己（mine）发的还是系统（robot）返回的
        this.backText(function () {
          that.contentText = "";//加回调在得到返回数据的时候清除输入框的内容
        });
    },
    backText(callback) {
        let that = this;
        if (window.WebSocket) {
          let ws = new WebSocket("ws://192.168.1.210:8082");
          ws.onopen = function (e) {
            console.log("链接服务器成功");
            console.log("that.contentText is", that.contentText);
            ws.send(that.contentText);
            callback();
          };
          ws.onclose = function (e) {
            console.log("服务器关闭")
          };
          ws.onerror = function () {
            console.log("服务器出错")
          };
          ws.onmessage = function (e) {
            that.list = [...that.list, {type: "robot", content: e.data}]
          }
        }
    },*/
    loginFun(){
        socket.sendMsg(1,ev=>{
            console.log(ev.data)
        })
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
        this.$api.post('/product/getDataList',{},result=>{
            this.msg=result.msg
        },err=>{
          this.$dialog.toast({
              mes: err.msg,
              timeout: 1500,
              icon: 'error'
          });
        }) 
    },
    getOrderList(){
        this.$api.post('/order/admin/getOrderList',{
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
