'''
@Author: hua
@Date: 2019-02-26 15:40:50
@description: 
@LastEditors: hua
@LastEditTime: 2019-07-15 16:40:32
'''
from app import app
from flask import request
from app import socketio
from app.Controllers.BaseController import BaseController
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Models.AddressBook import AddressBook
from app.Vendor.Decorator import validator
from app.Models.UserRoomRelation import UserRoomRelation
from app.Models.Users import Users
from flask_socketio import emit, join_room
from app.Vendor.Code import Code
import time

""" 获取房间列表 """
@app.route('/api/v2/room/get', methods=['GET'])
@UsersAuthJWT.apiAuth
def roomGet(user_info):
    data = AddressBook.getRoomList(user_info['data']['id'])
    return BaseController().json(data)

@app.route('/api/v2/room/details', methods=['GET'])
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@UsersAuthJWT.apiAuth
def roomDetails(user_info, params):
    """ 获取群聊用户信息 """
    filters = {
        UserRoomRelation.room_uuid == params['room_uuid']
    }
    data = UserRoomRelation().getAll(filters, UserRoomRelation.created_at.desc)
    return data