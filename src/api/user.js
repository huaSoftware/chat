import request from '@/utils/request'

// 登录接口
export function login (email, password) {
  return request({
    url: '/api/v2/login',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

// 用户信息
export function userInfo(){
  return request({
    url: '/api/v2/user.info',
    method: 'get'
  })
}

// 注册接口
export function register(data) {
  return request({
    url: '/api/v2/register',
    method: 'post',
    data
  })
}

//上传图片
export function uploadImgByBase64 (data) {
  return request({
    url: '/api/v2/document/upload/base64',
    method: 'post',
    data
  })
}



