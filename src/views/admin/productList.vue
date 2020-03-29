<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" size="medium">
				<el-form-item>
					<el-input v-model="filtersName" placeholder="输入商品名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="page=1;getDataList()">搜索</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增商品</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<el-table :data="dataList" highlight-current-row @selection-change="selsChange" style="width: 100%;" border >
			<el-table-column type="index" label="序号" width="60" align='center'>
			</el-table-column>
			<el-table-column prop="productImg" label="商品图片" width="150" align='center'>
        <template slot-scope="scope">
          <img :src="scope.row.productImg" style="width: 100px;height: 100px;">
        </template>
			</el-table-column>

			<el-table-column prop="productName" label="商品名称" min-width="300" align='center'>
			</el-table-column>
			<el-table-column prop="price" label="商品价格" width="150" align='center' sortable>
			</el-table-column>
      <el-table-column prop="newComerPrice" label="新人价" width="150" align='center'>
      </el-table-column>
      <el-table-column prop="promotePrice" label="促销价" width="150" align='center'>
      </el-table-column>
      <el-table-column prop="isPromote" label="是否促销" width="80" align='center'>
        <template slot-scope="scope">
          <i v-if="scope.row.isPromote==1" style="color:#f00">是</i>
          <i v-if="scope.row.isPromote==0">否</i>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align='center'>
      </el-table-column>
      <el-table-column prop="amount" label="数量" width="110" align='center' sortable></el-table-column>

			<el-table-column prop="create_time" label="时间" width="200" align='center'>
				<template slot-scope="scope">{{scope.row.create_time|formatDate}}</template>
			</el-table-column>

			<el-table-column label="操作" width="250" align='center'>
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="handleEnabled(scope.row)">{{scope.row.isEnabled==1?'下架':'上架'}}</el-button>
					<el-button size="mini" type="danger" @click="handlePreview(scope.row)">{{scope.row.isPromote==1?'关促销':'开促销'}}</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

    <!--添加商品-->
    <el-dialog :title="actType=='add'?'添加商品':'编辑商品'" :visible.sync="formVisible" :close-on-click-modal="false" width="30%">
      <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="商品图片" prop="productImg">
          <el-input v-model.trim="ruleForm.productImg" auto-complete="off" placeholder="网络商品图地址"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model.trim="ruleForm.productName" auto-complete="off" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model.trim="ruleForm.price" auto-complete="off" placeholder="商品价格">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="新人价" prop="newComerPrice">
          <el-input v-model.trim="ruleForm.newComerPrice" auto-complete="off" placeholder="新人价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品单位" prop="unit">
          <el-input v-model.trim="ruleForm.unit" auto-complete="off" placeholder="斤/只/把/袋/包">
            <template slot="append">例如 ￥100/{{ruleForm.unit==''?'斤':ruleForm.unit}}</template>
          </el-input>
        </el-form-item>

        <el-form-item label="促销价" prop="promotePrice">
          <el-input v-model.trim="ruleForm.promotePrice" auto-complete="off" placeholder="活动促销价">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click.native="formVisible = !1">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
      </div>
    </el-dialog>
	</section>
</template>

<script>
export default {
  data() {
    return {
      filtersName:'',
      dataList: [],
      total: 0,
      page: 1,
      pageSize:20,
      sels: [],

      actType:'add',
      formVisible:!1,
      ruleForm: {
        productId:'',
        productImg: '',
        productName: '',
        price: '',
        newComerPrice:'',
        unit:'',
        promotePrice:'',
      },
      rules: {
        productImg: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        productName: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        price: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        newComerPrice: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        unit: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
        promotePrice: [
          {required: true, message: '不能为空', trigger: 'blur'},
        ],
      },
    };
  },
  mounted() {
    this.getDataList();
    // console.log( moment().format('YYYY-MM-DD HH:mm:ss') )
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$dialog.loading.open(' ');
            if (this.actType=='add') {
              var url="/product/productAdd"
              var test="添加成功"
            }else{
              var url="/product/productEdit"
              var test="编辑成功"
            }
            this.ruleForm.type="riders"
            this.ruleForm.actionType="regist"
            
            this.$api.post(url,this.ruleForm,result => {
              this.$dialog.loading.close();
              this.formVisible=false;
              this.$dialog.toast({
                  mes: test,
                  timeout: 1500,
                  icon: 'success',
                  callback:()=>{
                    this.getDataList();
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getDataList();
    },
    //»ñÈ¡ÉÌÆ·ÁÐ±í
    getDataList() {
      this.$api.post('/product/getDataList',{
        page: this.page,
        pageSize:this.pageSize,
        title: this.filtersName,
      },result=>{
	      this.dataList=result.list;
	      this.total=result.totals
	    },err=>{
	      this.$dialog.toast({
	          mes: err.msg,
	          timeout: 1500,
	          icon: 'error'
	      });
	    })
    },

    //添加商品
    handleAdd: function() {
      this.formVisible=true;
      this.actType='add';
      return
      for(var key in this.ruleForm){
        if (key!='productId') {
          this.ruleForm[key]=''
        }
      }
    },
    handleEdit(row) {
      this.actType='edit';
      this.formVisible = true;
      this.ruleForm = Object.assign({}, row);
    },
    //È«Ñ¡µ¥Ñ¡¶àÑ¡
    selsChange: function(sels) {
      this.sels = sels;
    },

    // ÉÏÏÂ¼Ü
    handleEnabled(row){
      if (row.isEnabled==0) {
        var txt='确定上架该商品'
      }else{
        var txt='确定下架该商品'
      }
      this.$confirm(txt, "提示", {
        type: "warning"
      })
      .then(() => {
        this.$api.post('/product/enabledProduct',{
          productId:row.productId,
          isEnabled:row.isEnabled==1?0:1,
        },result=>{
          this.$dialog.toast({
              mes: '操作成功',
              timeout: 1500,
              callback: () => {
                this.getDataList();
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
    // ÐÞ¸Ä·ÃÎÊÁ¿
    handlePreview( row) {
      this.$prompt('ÇëÊäÈë·ÃÎÊÁ¿', 'ÌáÊ¾', {
        closeOnClickModal:false,
        confirmButtonText: 'È·¶¨',
        cancelButtonText: 'È¡Ïû',
        // inputPattern: /^\d+/g,
        // inputErrorMessage: 'Ö»ÄÜÊäÈëÊý×Ö'
      }).then(({ value }) => {
        // console.log(value)
        if(!isNaN(value)&&value){
          this.$api.post('/product/editQuantity',{
            productId:row.productId,
            preview:value,
          },result=>{
            this.$dialog.toast({
                mes: '²Ù×÷³É¹¦',
                timeout: 1500,
                callback: () => {
                  this.getDataList();
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
              mes: 'ÇëÊäÈë¿â´æ',
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