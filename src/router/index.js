import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router= new Router({
	mode: 'history',
	routes: [
	    {
	  		path:'*',
	  		name:404,
	  		hidden:true,
	  		redirect: '/shopWeb/login'
	  	},
		{
			path: '/shopWeb/',
			hidden:true,
			redirect: '/shopWeb/login'
		},
		{
			path: '/shopWeb/index',
			name: '',
			hidden:true,
			component: resolve => require(['@/views/web/index'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/login',
			name: 'login',
			hidden:true,
			component: resolve => require(['@/views/login/login'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/shopWeb/regist',
			name: 'regist',
			hidden:true,
			component: resolve => require(['@/views/login/regist'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/shopWeb/password',
			name: 'password',
			hidden:true,
			component: resolve => require(['@/views/login/password'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/shopWeb/orderSubmit',
			name: 'orderSubmit',
			hidden:true,
			component: resolve => require(['@/views/web/orderSubmit'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/addressList',
			name: 'addressList',
			hidden:true,
			component: resolve => require(['@/views/web/addressList'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/addressAdd',
			name: 'addressAdd',
			hidden:true,
			component: resolve => require(['@/views/web/addressAdd'], resolve),
			meta:{
		        requireAuth:true,
		        // keepAlive:true,
		    },
		},
		{
			path: '/shopWeb/addressMapPosition',
			name: 'addressMapPosition',
			hidden:true,
			component: resolve => require(['@/views/web/addressMapPosition'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/userpersonal',
			name: 'userpersonal',
			hidden:true,
			component: resolve => require(['@/views/web/userpersonal'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/feedback',
			name: 'feedback',
			hidden:true,
			component: resolve => require(['@/views/web/feedback'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/recharge',
			name: 'recharge',
			hidden:true,
			component: resolve => require(['@/views/web/recharge'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/rechargeList',
			name: 'rechargeList',
			hidden:true,
			component: resolve => require(['@/views/web/rechargeList'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		/////////////////////////////////////////////////////////////////////////
		{
			path: '/shopWeb/adminLogin',
			name: 'adminLogin',
			hidden:true,
			component: resolve => require(['@/views/login/adminLogin'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/shopWeb/admin',
			name: 'admin',
			hidden:false,
			component: resolve => require(['@/views/admin/admin'], resolve),
			children:[
				{
		      		path: '/shopWeb/home',
		      		name:'首页',
		      		component: resolve => require(['@/views/admin/home'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/shopWeb/users',
		      		name:'用户管理',
		      		component: resolve => require(['@/views/admin/users'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/shopWeb/userRecharge',
		      		name:'用户充值',
		      		component: resolve => require(['@/views/admin/userRecharge'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/shopWeb/productList',
		      		name:'商品管理',
		      		component: resolve => require(['@/views/admin/productList'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/shopWeb/riderList',
		      		name:'骑手管理',
		      		component: resolve => require(['@/views/admin/riders'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/shopWeb/riderWithdraw',
		      		name:'骑手提现',
		      		component: resolve => require(['@/views/admin/riderWithdraw'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
		      	{
		      		path: '/shopWeb/orderList',
		      		name:'订单管理',
		      		component: resolve => require(['@/views/admin/orderList'], resolve),
		      		meta:{
				        requireAuth:true,
				    },
		      	},
			]
		},
		////////////////////////////////////////////////////////////////////////////
		{
			path: '/shopWeb/rider',
			name: 'rider',
			hidden:true,
			component: resolve => require(['@/views/rider/rider'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/shopWeb/ridercenter',
			name: 'ridercenter',
			hidden:true,
			component: resolve => require(['@/views/rider/ridercenter'], resolve),
			meta:{
		        requireAuth:false,
		    },
		},
		{
			path: '/shopWeb/withdraw',
			name: 'withdraw',
			hidden:true,
			component: resolve => require(['@/views/rider/withdraw'], resolve),
			meta:{
		        requireAuth:true,
		    },
		},
		{
			path: '/shopWeb/withdrawList',
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