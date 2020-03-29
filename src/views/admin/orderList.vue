<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" size="medium">
				<el-form-item>
					<el-input v-model="filtersName" placeholder="项目名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getprojectList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">发布新品</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="projectList" highlight-current-row @selection-change="selsChange" style="width: 100%;" border>
			<el-table-column type="selection" width="55" align='center'>
			</el-table-column>
			<el-table-column type="index" width="60" align='center'>
			</el-table-column>
			<el-table-column prop="project_name" label="项目名称" min-width="200">
			</el-table-column>

			<el-table-column prop="space_type" label="空间类型" min-width="100" align='center'>
			</el-table-column>
			<el-table-column prop="position" label="地理位置" min-width="150" align='center'>
			</el-table-column>
      <el-table-column prop="developer" label="开发商" min-width="100" align='center'>
      </el-table-column>
      <el-table-column prop="designer" label="设计师" min-width="100" align='center'>
      </el-table-column>
      <el-table-column prop="preview" label="访问量" min-width="100" align='center'>
      </el-table-column>
      
      <!-- <el-table-column label="商品图片" min-width="110" align='center'>
        <template slot-scope="scope">
          <div style="padding:5px;"><img :src="imgUrl+scope.row.project_image" v-if="scope.row.project_image" style="max-width:50px;max-height:50px"></div>
        </template>
      </el-table-column> -->

			<el-table-column prop="create_time" label="上传时间" min-width="100" align='center'>
				<template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
			</el-table-column>
			<!-- <el-table-column prop="update_time" label="修改时间" min-width="180" align='center'>
				<template slot-scope="scope">{{scope.row.modify_time|formatDate}}</template>
			</el-table-column> -->
			<el-table-column label="操作" width="230" align='center'>
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="handleEnabled(scope.row)">{{scope.row.isEnabled==1?'下架':'上架'}}</el-button>
					<el-button size="mini" type="danger" @click="handlePreview(scope.row)">访问量</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
export default {
  data() {
    return {
      filtersName:'',
      projectList: [],
      total: 0,
      page: 1,
      pageSize:20,
      sels: [], //列表选中列
    };
  },
  mounted() {
    // this.getprojectList();
    // console.log( moment().format('YYYY-MM-DD HH:mm:ss') )
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getprojectList();
    },
    //获取文章列表
    getprojectList() {
      this.$api.post('/project/getprojectList',{
        page: this.page,
        pageSize:this.pageSize,
        title: this.filters.name,
      },result=>{
	      this.projectList=result.list;
	      this.total=result.totals
	    },err=>{
	      this.$dialog.toast({
	          mes: err.msg,
	          timeout: 1500,
	          icon: 'error'
	      });
	    })
    },

    //显示新增界面
    handleAdd: function() {
      this.$router.push('/shopWeb/projectAdd')
    },
    handleEdit(row){
      this.$router.push({path:'/shopWeb/projectAdd',query:{project_id:row.project_id}})
    },
    //全选单选多选
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.project_id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
      .then(() => {
        // console.log(ids)
        // return 
       this.$api.post('/project/delete',{project_id:ids},result=>{
          if ( (this.sels.length==this.projectList.length) && this.page!=1) {
            --this.page
          }
          this.$dialog.toast({
              mes: '删除成功',
              timeout: 1500,
              callback: () => {
                this.getprojectList();
              }
          });
        },err=>{
          this.$dialog.toast({
              mes: err.msg,
              timeout: 1500,
              icon: 'error'
          });
        })
      })
      .catch(() => {});
    },
    // 上下架
    handleEnabled(row){
      if (row.isEnabled==0) {
        var txt='确认上架？'
      }else{
        var txt='确认下架？'
      }
      this.$confirm(txt, "提示", {
        type: "warning"
      })
      .then(() => {
        this.$api.post('/project/enabledProject',{
          project_id:row.project_id,
          isEnabled:row.isEnabled==1?0:1,
        },result=>{
          this.$dialog.toast({
              mes: '操作成功',
              timeout: 1500,
              callback: () => {
                this.getprojectList();
              }
          });
        },err=>{
          this.$dialog.toast({
              mes: err.msg,
              timeout: 1500,
              icon: 'error'
          });
        })
      })
    },
    // 修改访问量
    handlePreview( row) {
      this.$prompt('请输入访问量', '提示', {
        closeOnClickModal:false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /^\d+/g,
        // inputErrorMessage: '只能输入数字'
      }).then(({ value }) => {
        // console.log(value)
        if(!isNaN(value)&&value){
          this.$api.post('/project/editQuantity',{
            project_id:row.project_id,
            preview:value,
          },result=>{
            this.$dialog.toast({
                mes: '操作成功',
                timeout: 1500,
                callback: () => {
                  this.getprojectList();
                }
            });
          },err=>{
            this.$dialog.toast({
                mes: err.msg,
                timeout: 1500,
                icon: 'error'
            });
          })
        }else{
          this.$dialog.toast({
              mes: '请输入库存',
              timeout: 1500,
              icon: 'error'
          });
        }
      })

    },
    
  }
  
};
</script>

<style scoped>
.el-table /deep/ thead{color: #1f2d3d;}
.el-table /deep/ th{height: 40px;padding:0;background-color: #eef1f6;}
.el-table /deep/ td{height: 40px;padding:0;}

</style>