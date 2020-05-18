
'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2020-05-17 19:48:16
'''
from flask_socketio import join_room, leave_room
from app import socketio, CONST, delayQueue
from flask_socketio import emit
from flask import request
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import decryptMessage
from app.Service.ChatService import ChatService
from app.Service.ConfigService import ConfigService
from app.Service.UsersService import UsersService
from app.Service.UploadService import UploadService
from app.Service.AddressBookService import AddressBookService
from app.Service.UserRoomRelationService import UserRoomRelationService
from app.Service.RoomService import RoomService
from app.Service.LogService import LogService
from app.Models.Admin import Admin
import time
from app.Models.Users import Users

''' 聊天室模式，进入，离开，聊天
'''
@socketio.on('join', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def join(message, user_info):
    if message['type'] == CONST['ROOM']['ALONE']['value']:
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == CONST['ROOM']['GROUP']['value']:
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == CONST['ROOM']['ADMIN']['value']:
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == CONST['ROOM']['NOTIFY']['value']:
        join_room('@broadcast.'+str(user_info['data']['id']))
    return Utils.formatBody({'action': "join"})


""" 2,3的离开事件是否要写？ """
@socketio.on('leave', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def leave(message, user_info):
    room_uuid = message['room_uuid']
    leave_room(room_uuid)
    return Utils.formatBody({'action': "leave"})


''' 管理员聊天室模式，进入，离开，聊天
'''
@socketio.on('adminJoin', namespace='/api')
@decryptMessage
@UsersAuthJWT.adminSocketAuth
def join(message, user_info):
    if message['type'] == CONST['ROOM']['ALONE']['value']:
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == CONST['ROOM']['GROUP']['value']:
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == CONST['ROOM']['ADMIN']['value']:
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == CONST['ROOM']['NOTIFY']['value']:
        filters = {
            Admin.id == user_info['data']['id'],
        }
        user_info = Admin().getOne(filters)
        join_room('@broadcast.'+str(user_info['uuid']))
    return Utils.formatBody({'action': "join"})


""" 2,3的离开事件是否要写？ """
@socketio.on('adminLeave', namespace='/api')
@decryptMessage
@UsersAuthJWT.adminSocketAuth
def leave(message, user_info):
    room_uuid = message['room_uuid']
    leave_room(room_uuid)
    return Utils.formatBody({'action': "leave"})

""" 视频 """
@socketio.on('video', namespace='/api')
def video(message):
    room_uuid = message['data']['room_uuid']
    # 发送消息
    emit('video',  message, room=room_uuid)

""" 聊天 """
@socketio.on('chat', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def chat(message, user_info):
    return ChatService().chat(message, user_info)  # 客户端回调函数的参数


""" 普通交互接口 """
@socketio.on('send', namespace='/api')
def send(message):
    # 这里增加判断文件不加密
    if isinstance(message, dict):
        if'UploadService' in message.values():
            pass
    else:
        message = Utils.decrypt(message)
    """ {c:'控制',a:'行为',Authorization:'行为',data:'JSON数据‘} """
    if 'data' in message.keys():
        if 'Authorization' in message.keys():
            message['data']['Authorization'] = message['Authorization']
        return getattr(globals()[message['c']], message['a'])(message['data'])
    else:
        return getattr(globals()[message['c']], message['a'])(message)


''' 输入事件 '''
@socketio.on('adminInput', namespace='/api')
@decryptMessage
@UsersAuthJWT.adminSocketAuth
def input(message, user_info):
    return ChatService().input(message, user_info)  # 客户端回调函数的参数


''' 输入事件 '''
@socketio.on('input', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def input(message, user_info):
    return ChatService().input(message, user_info)  # 客户端回调函数的参数


""" 连接事件 """
@socketio.on('connect', namespace='/api')
def connect():
    return Utils.formatBody({'action': "connect"})


""" 断开事件 """
@socketio.on('disconnect', namespace='/api')
def disconnect():
    return Utils.formatBody({'action': "disconnect"})


""" 用户登录事件 """
@socketio.on('loginConnect', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def loginConnect(message, user_info):
    user_id = user_info['data']['id']
    delayQueue.client.zadd('onlineUsers', {str(user_id): int(time.time())})
    return Utils.formatBody({'action': "loginConnect"})


""" 用户退出事件 """
@socketio.on('logoutDisconnect', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def logoutDisconnect(message, user_info):
    user_id = user_info['data']['id']
    UsersService.edit({'online': 0}, {Users.id == str(user_id)})
    delayQueue.client.zrem('onlineUsers', str(user_id))
    return Utils.formatBody({'action': "logoutDisconnect"})


def background_thread():
    """启动一个后台线程来处理所有的延时任务
    """
    while True:
        socketio.sleep(2)
        # 延迟推送
        d_list = delayQueue.consumer()
        for item in d_list:
            if item["action"] == 'invite':
                socketio.emit('beg', Utils.formatBody(
                    item), namespace='/api', room='@broadcast.'+str(item["id"]))
        # 查询用户是否在线
        onlineUsers = delayQueue.client.zrange(
            'onlineUsers', 0, -1, withscores=True)
        for onlineUser in onlineUsers:
            nowTime = int(time.time())
            onlineTime = int(onlineUser[1])+10
            if onlineTime < nowTime:
                UsersService.edit({'online': 0}, {Users.id == onlineUser[0]})
                delayQueue.client.zrem('onlineUsers', onlineUser[0])
            else:
                UsersService.edit({'online': 1}, {Users.id == onlineUser[0]})
