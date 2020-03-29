<template>
<section style="padding:20px 0">
    <el-row>
        <el-col :xs="24" :lg="8" style="position:relative;margin-bottom:20px;">
          <img src="@/static/images/admin.png" style="width:100%">
          <p class="system">个人管理系统</p>
        </el-col>
        <el-col :xs="24" :lg="16" style="padding:0 20px;">
              <div class="dataBox">
                    <el-row>
                        <el-col :xs="24" :lg="12" >
                        <div class="dataItem">
                            <p>登入名</p>
                            <span style="color:#999">admin</span>
                        </div>
                      </el-col>
                      <el-col :xs="24" :lg="12" >
                        <div class="dataItem">
                            <p>当前时间</p>
                            <span style="color:#999">{{curentDate}}</span>
                        </div>
                      </el-col>
                  </el-row>
              </div>

              <div class="dataBox" style="margin-top:40px;">
                    <!-- <h2>网站整体情况</h2> -->
                    <el-row>
                        <el-col :xs="24" :lg="8" >
                        <div class="dataItem">
                            <p><i class="el-icon-date"></i>昨日新增</p>
                            <span>{{allData.yesTodayTotal}}</span>
                        </div>
                      </el-col>
                      <el-col :xs="24" :lg="8" >
                        <div class="dataItem">
                            <p><i class="el-icon-date"></i>今日新增</p>
                            <span>{{allData.todayTotal}}</span>
                        </div>
                      </el-col>
                      <el-col :xs="24" :lg="8" >
                        <div class="dataItem">
                            <p><i class="el-icon-date"></i>最近七天新增</p>
                            <span>{{allData.last7Days}}</span>
                        </div>
                      </el-col>
                  </el-row>
              </div>
              <div class="dataBox" style="margin-top:40px;">
                  <el-row>
                        <el-col :xs="24" :lg="8" >
                        <div class="dataItem">
                            <p><i class="el-icon-date"></i>上月新增</p>
                            <span>{{allData.passMonth}}</span>
                        </div>
                      </el-col>
                      <el-col :xs="24" :lg="8" >
                        <div class="dataItem">
                            <p><i class="el-icon-date"></i>本月新增</p>
                            <span>{{allData.curMonth}}</span>
                        </div>
                      </el-col>
                      <el-col :xs="24" :lg="8" >
                        <div class="dataItem">
                            <p><i class="el-icon-check"></i>总用户数</p>
                            <span>{{allData.allTotal}}</span>
                        </div>
                      </el-col>
                  </el-row>
              </div>
              <!-- <p style="padding:20px 0;text-align:center;font-size:16px;color:#999;">5s自动更新数据</p> -->
        </el-col>
    </el-row>
</section>
</template>

<script>
export default {
    data() {
    return {
      allData:{},
            curentDate:moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  },
    created(){
        setInterval(()=>{
            this.curentDate=moment().format('YYYY-MM-DD HH:mm:ss')
        },1000)
        // console.log(moment().format('YYYY-MM-DD 00:00:00'))
        // this.getData();
    },
    methods:{
        getData(){
            this.$api.get('/admin/getMember',{},result=>{
          this.allData=result.data;
          /*setTimeout(()=>{
            this.getData();
          },5000)*/
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

<style scoped>
.system{position: absolute;top: 10%;left: 50%;transform: translate(-50%,-50%);font-size: 20px;color: #fff;}
.dataBox{border:1px solid #ddd;padding:20px;border-radius: 10px;}
.dataBox h2{font-size: 16px;}
.dataItem{text-align: center;}
.dataItem span{font-size: 30px;font-weight: bold;display: block;margin: 30px 0;color: #f00}
.dataItem p{margin: 20px 0;font-size: 16px;color: #999}
.dataItem p i{font-size: 20px; margin-right: 10px;vertical-align: middle;}
</style>