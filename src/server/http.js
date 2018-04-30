/*
 * @Author: husida 
 * @Date: 2018-01-17 12:06:12 
 * @Last Modified by: husida
 * @Last Modified time: 2018-04-30 16:24:55
 * @Explain: axios 配置
 */
import axios from "axios";
import qs from "qs";
import { Message, Spin } from "iview";
import router from "../router";
import store from "store"

let requestCount = 0;// 请求的数量
let startTime = 0;// 第一条请求开始时间
let timeout = 600;// 请求加载提示最小出现时间
let showLoading = true; // 是否在请求时加载提示

const Axios = axios.create({
	baseURL: "/crawler/api/",
	timeout: 20000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	}
});

// 请求拦截器
Axios.interceptors.request.use(config => {
	// 序列化
	//  config.data = qs.stringify(config.data+'');
	if(showLoading){
		if(requestCount === 0 ) {
			startTime = new Date().getTime();
		}
		requestCount ++;
		Spin.show();
	}

	var sessionId = "";
	var loginInfo = store.get("loginInfo");
	if(loginInfo == undefined)
		sessionId = '';
	else
		sessionId = loginInfo.sessionId;

	if(sessionId == null || sessionId.length < 1) {
		config.headers["sessionId"] = "";
	} else {
		config.headers["sessionId"] = sessionId;
	}
	// 如果有token则加到头部
	if(localStorage.token) {
		config.headers.Authorization = localStorage.token;
	}
	return config;
}, error => {
	if(showLoading){
		requestCount --;
		Spin.hide();
	}

	Message.error({
		content: error,
		closable: true
	});
	return Promise.reject(error);
});

//响应拦截器
Axios.interceptors.response.use(res => {
		if(res.data.code==9000){ // session无效，退出登录
		    //清除登录标识
		    store.set('loginFlag', false);
		    store.set('sessionId', "");
			store.set('user', {});
			if(showLoading){
				Spin.hide();
			}
			
		    //跳转到登录页
		    router.replace({
		        name: 'login'
		    });
		    return Promise.reject(res.data);
		} 
		if(showLoading){
			requestCount--;
			if(requestCount === 0){
				let endTime = new Date().getTime();
				let time = endTime-startTime;
				if(time > timeout) {
					if(requestCount === 0){
						Spin.hide();
					}
				} else {
					setTimeout(() => {
						if(requestCount === 0){
							Spin.hide();
						}	
					}, timeout-time);
				}
				
			}
		}
		
		if(res.data && res.data.code !== 1) {
			Message.error({
				content: res.data.msg,
				closable: true
			});
			return Promise.reject(res.data);
		}
		return res.data;
	},
	error => {
		requestCount--;
		Spin.hide();
		
		Message.error({
			content: '请求远程服务失败！',
			closable: true
		});
		return Promise.reject(error);
	}
);

export default Axios;