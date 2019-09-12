'''
@Author: hua
@Date: 2019-02-14 11:04:59
@LastEditors: hua
@LastEditTime: 2019-09-11 15:37:52
'''
from app import app
from app.Controllers.BaseController import BaseController
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import validator
from app.Models.AddressBook import AddressBook
from app.Models.Users import Users
from app.Models.Room import Room
from flask import request
from app import socketio
from flask_socketio import emit, join_room
from app.Vendor.Code import Code
import time

""" 获取通讯录列表 """
@app.route('/api/v2/addressBook/get', methods=['POST'])
@validator(name='page_no', rules={'required': True,'type': 'integer'})
@validator(name='per_page', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def addressBookGet(params, user_info):
    filters = {
        AddressBook.be_focused_user_id == user_info['data']['id']
    }
    data = AddressBook.rawGetList(params['page_no'], params['per_page'], filters)
    return BaseController().json(data)

