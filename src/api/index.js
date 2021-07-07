// 配置API接口地址
var root = '/api/'

// 引用axios
var axios = require('axios')
// 自定义判断元素类型JS
function toType(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull(o) {
	for (var key in o) {
		if (o[key] === null) {
			delete o[key]
		}
		if (toType(o[key]) === 'string') {
			o[key] = o[key].trim()
		} else if (toType(o[key]) === 'object') {
			o[key] = filterNull(o[key])
		} else if (toType(o[key]) === 'array') {
			o[key] = filterNull(o[key])
		}
	}
	return o
}

import { Toast } from 'vue-ydui/dist/lib.px/dialog'
window.Toast=Toast;

import router from "@/router";

function apiAxios(method, url, params, success, failure) {
	if (params) {
		params = filterNull(params)
	}
	var session = sessionStorage.getItem('session')
	axios({
		headers: {
			'Content-type': 'application/json;charse=UTF-8',
			'authorization': localStorage.getItem('token')||'',
			'roletype': session ? JSON.parse(session).roleType : '',
			'userId':session ? JSON.parse(session).userId:'',
		},
		method: method,
		url: url,
		data: method === 'POST' || method === 'PUT' ? params : null,
		params: method === 'GET' || method === 'DELETE' ? params : null,
		baseURL: root,
		withCredentials: false
	})
		.then(function (res) {
			if (res.data.code == '401') {
				// router.push({
				// 	path: "/login",
				// 	query: { redirect: router.app._route.fullPath }
				// });
				Toast({
	                mes: '请重新登录',
	                timeout: 1500,
	                icon: 'error'
	            });
				return;
			}else if (res.data.code === '200') {
				if (success) {
					success(res.data)
				}
			} else {
				if (failure) {
					failure(res.data)
				} else {
					//window.alert('error: ' + JSON.stringify(res.data))
				}
			}
		})
		.catch(function (err) {
			let res = err.response
			if (err) {
				// console.error('api error, HTTP CODE: ' + res.status)
			}
		})
}

// 返回在vue模板中的调用接口
export default {
	get: function (url, params, success, failure) {
		return apiAxios('GET', url, params, success, failure)
	},
	post: function (url, params, success, failure) {
		return apiAxios('POST', url, params, success, failure)
	},
	put: function (url, params, success, failure) {
		return apiAxios('PUT', url, params, success, failure)
	},
	delete: function (url, params, success, failure) {
		return apiAxios('DELETE', url, params, success, failure)
	},
	getUrlParam: function (name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
	},

}