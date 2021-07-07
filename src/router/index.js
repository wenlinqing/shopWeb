import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router= new Router({
	mode: 'history',
	base: '/',
	routes: [
	    {
	  		path:'*',
	  		name:404,
	  		hidden:true,
	  		redirect: '/index'
	  	},
		{
			path: '/',
			hidden:true,
			component: resolve => require(['@/views/web/index'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/test',
			name: '',
			hidden:true,
			component: resolve => require(['@/views/web/test'], resolve),
			meta:{
		        // requireAuth:true,
		    },
		},
		{
			path: '/index',
			name: '',
			hidden:true,
			component: resolve => require(['@/views/web/index'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/login',
			name: 'login',
			hidden:true,
			component: resolve => require(['@/views/login/login'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/riderLogin',
			name: 'riderLogin',
			hidden:true,
			component: resolve => require(['@/views/login/riderLogin'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/regist',
			name: 'regist',
			hidden:true,
			component: resolve => require(['@/views/login/regist'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/password',
			name: 'password',
			hidden:true,
			component: resolve => require(['@/views/login/password'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/orderSubmit',
			name: 'orderSubmit',
			hidden:true,
			component: resolve => require(['@/views/web/orderSubmit'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/addressList',
			name: 'addressList',
			hidden:true,
			component: resolve => require(['@/views/web/addressList'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/addressAdd',
			name: 'addressAdd',
			hidden:true,
			component: resolve => require(['@/views/web/addressAdd'], resolve),
			meta:{
		        requireAuth:true,
		        // keepAlive:true,
		    },
		},
		{
			path: '/addressMapPosition',
			name: 'addressMapPosition',
			hidden:true,
			component: resolve => require(['@/views/web/addressMapPosition'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/userpersonal',
			name: 'userpersonal',
			hidden:true,
			component: resolve => require(['@/views/web/userpersonal'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/feedback',
			name: 'feedback',
			hidden:true,
			component: resolve => require(['@/views/web/feedback'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/recharge',
			name: 'recharge',
			hidden:true,
			component: resolve => require(['@/views/web/recharge'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/rechargeList',
			name: 'rechargeList',
			hidden:true,
			component: resolve => require(['@/views/web/rechargeList'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		/////////////////////////////////////////////////////////////////////////
		{
			path: '/adminLogin',
			name: 'adminLogin',
			hidden:true,
			component: resolve => require(['@/views/login/adminLogin'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/admin',
			name: 'admin',
			hidden:false,
			component: resolve => require(['@/views/admin/admin'], resolve),
			children:[
				{
		      		path: '/home',
		      		name:'首页',
		      		component: resolve => require(['@/views/admin/home'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/users',
		      		name:'用户管理',
		      		component: resolve => require(['@/views/admin/users'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/userRecharge',
		      		name:'用户充值',
		      		component: resolve => require(['@/views/admin/userRecharge'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/productList',
		      		name:'商品管理',
		      		component: resolve => require(['@/views/admin/productList'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/riderList',
		      		name:'骑手管理',
		      		component: resolve => require(['@/views/admin/riders'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/riderWithdraw',
		      		name:'骑手提现',
		      		component: resolve => require(['@/views/admin/riderWithdraw'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/orderList',
		      		name:'订单管理',
		      		component: resolve => require(['@/views/admin/orderList'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/saleRecord',
		      		name:'销售记录',
		      		component: resolve => require(['@/views/admin/zhu_sales_record'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
			]
		},
		////////////////////////////////////////////////////////////////////////////
		{
			path: '/rider',
			name: 'rider',
			hidden:true,
			component: resolve => require(['@/views/rider/rider'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/ridercenter',
			name: 'ridercenter',
			hidden:true,
			component: resolve => require(['@/views/rider/ridercenter'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/withdraw',
			name: 'withdraw',
			hidden:true,
			component: resolve => require(['@/views/rider/withdraw'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/withdrawList',
			name: 'withdrawList',
			hidden:true,
			component: resolve => require(['@/views/rider/withdrawList'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
	]
})

router.beforeEach((to,from,next)=>{
	// console.log(to,from)
  	if (to.meta.requireAuth) {
	    if (sessionStorage.getItem('session')) {
	      next();
	    }else{
	      next({
	        path:'/login',
	        query:{redirect: to.fullPath}
	      });
	    }
	}
  	next();
})

export default router;