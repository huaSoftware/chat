'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2019-06-17 13:24:54
'''
from flask_socketio import emit, join_room, leave_room
from app import socketio
from flask import session,request
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from threading import Lock
from app.Models.Room import Room
from app.Models.AddressBook import AddressBook
from app.Models.Users import Users
from app.Vendor.Code import Code
from app.Service.ChatService import ChatService
import time

''' 聊天室模式，进入，离开，聊天
'''
@socketio.on('join', namespace='/room')
@UsersAuthJWT.socketAuth('join')
def join(message, user_info):
    if message['type'] == 0:
        name = message['name']
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == 1:
        room_uuid = message['room_uuid']
        join_room(room_uuid)
    elif message['type'] == 2:
        join_room(user_info['data']['id'])
        
            
@socketio.on('leave', namespace='/room')
@UsersAuthJWT.socketAuth('leave')
def leave(message, user_info):
    room_uuid = message['room_uuid']
    leave_room(room_uuid)


@socketio.on('chat', namespace='/room')
@UsersAuthJWT.socketAuth('chat')
def chat(message, user_info):
    ChatService().chat(message, user_info)
    

""" 连接事件 """
@socketio.on('connect', namespace='/room')
def connect():
    emit('my response', {'data': 'Connected'})


""" 断开事件 """
@socketio.on('disconnect', namespace='/room')
def disconnect():
    #thread_pool[request.sid]['thread'].join()
    print('Client disconnected')

