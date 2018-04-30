/*
 * @Author: husida 
 * @Date: 2018-01-17 12:04:56 
 * @Last Modified by: husida
 * @Last Modified time: 2018-01-17 14:29:13
 * @Explain: 网络请求封装 $http: 封装axios配置，$server封装接口请求
 *  this.$http.post(url,{}).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    })
 * 
 *  this.$server.getMenu().then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
 */

import http from './http'
import server from './server'


export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", { value: http });
    Object.defineProperty(Vue.prototype, "$server", { value: server });
  }
};

