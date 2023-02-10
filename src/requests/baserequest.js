import axios from 'axios';
// 引入请求进度条
import nprogress from 'nprogress';
// 引入进度条样式
import "nprogress/nprogress.css"

const baserequest = axios.create({
  baseURL: "http://dj.huashengbook.cn/api",
  timeout: 5000,
})

// 请求拦截器
baserequest.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  nprogress.start();
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器
baserequest.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  nprogress.done();

  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default baserequest;

