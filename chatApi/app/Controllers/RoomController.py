'''
@Author: hua
@Date: 2019-02-26 15:40:50
@description: 
@LastEditors: hua
@LastEditTime: 2019-06-08 21:42:04
'''
from app import app
from flask import request
from app import socketio
from app.Controllers.BaseController import BaseController
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Models.AddressBook import AddressBook
from app.Models.Users import Users
from flask_socketio import emit, join_room
from app.Vendor.Code import Code
import time

""" 获取房间列表 """
@app.route('/api/v2/room/get', methods=['POST'])
@UsersAuthJWT.apiAuth
def roomGet(user_info):
    data = AddressBook.getRoomList(user_info['data']['id'])
    return BaseController().json(data)