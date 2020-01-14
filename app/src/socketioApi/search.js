import {send} from '@/utils/socketio'


// 搜索用户接口
export function search (data) {
    let reqData = {
        'c':'UsersService',
        'a':'search',
        'data':data
    }
    return send('send', reqData, 'api')
}
