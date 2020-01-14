import {send} from '@/utils/socketio'


// 登录接口
export function login (data) {
    let reqData = {
        'c':'UsersService',
        'a':'login',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 注册接口
export function register(data) {
    let reqData = {
        'c':'UsersService',
        'a':'register',
        'data':data
    }
    return send('send', reqData, 'api')
}

//上传图片
export function uploadImgByBase64 (data) {
    let reqData = {
        'c':'UploadService',
        'a':'uploadBase64',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 用户信息
export function userInfo(){
    let reqData = {
        'c':'UsersService',
        'a':'get'
    }
    return send('send', reqData, 'api')
}
