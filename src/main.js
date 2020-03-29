// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import elementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(elementUi);


import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.px.css'
Vue.use(YDUI)
/*this.$dialog.toast({
        mes: '保存成功',
        timeout: 1500,
        icon: 'success'
    });*/


import './static/css/style.css';
import api from '@/api/index'
Vue.prototype.$api = api


import moment from 'moment'
window.moment=moment;

Vue.filter('formatDate',function(time){
    // time=Number(time)
    if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }else{
        return ''
    }
})
Vue.filter('formatDay',function(time){
    time=Number(time)
  return moment(time).format('YYYY-MM-DD')
})




Vue.prototype.goBack = function () {
    window.history.go(-1)
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
