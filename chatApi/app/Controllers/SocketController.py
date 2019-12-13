
'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2019-12-13 13:28:04
'''
from flask_socketio import join_room, leave_room
from app import socketio, CONST, delayQueue
from flask import request
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import decryptMessage
from app.Service.ChatService import ChatService
from app.Service.ConfigService import ConfigService
from app.Service.UsersService import UsersService
from app.Service.UploadService import UploadService
from app.Service.AddressBookService import AddressBookService
from app.Service.RoomService import RoomService
from app.Service.UserRoomRelationService import UserRoomRelationService
import time

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
    elif message['type'] == CONST['ROOM']['NOTIFY']['value']:
        join_room('@broadcast.'+str(user_info['data']['id']))
    return  Utils.formatBody({'action':"join"})
        
""" 2,3的离开事件是否要写？ """
@socketio.on('leave', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def leave(message, user_info):
    room_uuid = message['room_uuid']
    leave_room(room_uuid)
    return  Utils.formatBody({'action': "leave"})

@socketio.on('chat', namespace='/api')
@decryptMessage
@UsersAuthJWT.socketAuth
def chat(message, user_info):
    return ChatService().chat(message, user_info) # 客户端回调函数的参数
    
""" 普通交互接口 """
@socketio.on('send', namespace='/api')
def send(message):
    message = Utils.decrypt(message)
    """ {c:'控制',a:'行为',Authorization:'行为',data:'JSON数据‘} """
    if 'data' in message.keys():
        if 'Authorization' in message.keys():
            message['data']['Authorization'] = message['Authorization']
        return getattr(globals()[message['c']],message['a'])(message['data'])
    else:
        return getattr(globals()[message['c']],message['a'])(message)

    
""" 连接事件 """
@socketio.on('connect', namespace='/api')
def connect():
    #emit('my response', {'data': 'Connected'})
    return  Utils.formatBody({'action': "connect"})

""" 断开事件 """
@socketio.on('disconnect', namespace='/api')
def disconnect():
    #thread_pool[request.sid]['thread'].join()
    #print('Client disconnected')
    return  Utils.formatBody({'action': "disconnect"})

def background_thread():
    """启动一个后台线程来处理所有的延时任务
    """
    while True:
        socketio.sleep(1)
        d_list = delayQueue.consumer()
        for item in d_list:
            if item["action"] == 'invite':
                socketio.emit('beg', Utils.formatBody(item), namespace='/api', room='@broadcast.'+str(item["id"])) 