/*
 * @Author: hua
 * @Date: 2019-12-30 20:23:23
 * @description: 无权限socketio监听事件
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:04:06
 */

/* 
 * 无权限socketio监听事件
 */
export default function setupUnAuthEvent(){
    window.apiSocket.on('connect', (data) => {
        //逻辑处理
        console.log("连接成功")
        //Alert.close()
    });
    window.apiSocket.on('connecting', (data) => {
        //逻辑处理
        console.log("断开正在连接了")
    });
    window.apiSocket.on('disconnect', (data) => {
        //逻辑处理
        console.log("断开连接")
    });
    window.apiSocket.on('connect_failed', (data) => {
        //逻辑处理
        console.log("连接失败")
    });
    window.apiSocket.on('error', (data) => {
        //逻辑处理
        console.log("错误发生，并且无法被其他事件类型所处理")
        /*暂时注释 router.push({
            name: 'connectLose',
            query: {text:"链接已经断开"}
        }) */
    });
    window.apiSocket.on('reconnect', (data) => {
        //逻辑处理
        console.log("成功重连")
    });
    window.apiSocket.on('reconnecting', (data) => {
        //逻辑处理
        console.log("正在重连")
    });
    window.apiSocket.on('connect_error', function(data){
        console.log(data + ' - connect_error');
    });
}