/*
 * @Author: your name
 * @Date: 2020-06-01 10:56:43
 * @LastEditTime: 2020-06-12 11:01:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin\src\api\request.js
 */ 
import axios from 'axios'
import { message } from 'antd'
import { RequestAxios } from './type'
import { push } from 'connected-react-router'
import { store } from '../../index'

// 添加请求拦截器
axios.interceptors.request.use(function (config: RequestAxios) {
  // 在发送请求之前做些什么
  const { url = '' } = config
  if(!/^\/api\/user\//.test(url)) {
    const { dispatch } = store
    dispatch(push('/login'))
  }
  return config;
}, function (error: any) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response: any) {
  console.log('响应请求成功', response)
  const res = response.data
  if(response.status !== 200 || res.code !== 0) {
    message.error(res.message)
  } else {
    return res
  }
}, function (error: any) {
  if (error === undefined || error.code === 'ECONNABORTED') {
    message.warning('服务请求超时')
    return Promise.reject(error)
  }
  const { dispatch } = store
  const { response: { status, statusText, data: { msg = '服务器发生错误' } } } = error
  const { response } = error
  const statusTip = statusText || msg
  if(status === 400) {
    dispatch(push('/login'))
  }
  if(status === 401) {
    dispatch({
      type: 'login/logout'
    })
  }
  message.warning(statusTip)
  return Promise.reject(response)
})

