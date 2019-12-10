'''
@Author: hua
@Date: 2019-09-29 11:30:28
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-10 15:53:10
'''
from app import app
from app import cache
from flask import request
from app import socketio
from app.Controllers.BaseController import BaseController
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import socketValidator
from app.Models.AddressBook import AddressBook
from app.Models.Users import Users
from app.Models.Room import Room
from app.Vendor.Decorator import transaction
from flask_socketio import emit, join_room
from app.Vendor.Code import Code
import time

class AddressBookService:
    
    @staticmethod
    @socketValidator(name='be_focused_user_id', rules={'required': True, 'type': 'integer', 'minlength': 1, 'maxlength': 20})
    @UsersAuthJWT.socketAuth
    def beg(params,user_info):
        if user_info['data']['id'] == params['be_focused_user_id']:
            return Utils.formatError(Code.BAD_REQUEST,'无法添加自己为新朋友')
        addressBookdata = AddressBook.getAdddressBookByFocusedUserId(user_info['data']['id'], params['be_focused_user_id'])
        if addressBookdata != None:
            return Utils.formatError(Code.BAD_REQUEST,'已添加')
        msg_uuid = Utils.unique_id()
        userData = Users().getOne({Users.id == user_info['data']['id']})
        data = {
            'data':userData, 
            'action':'beg_add', 
            'msg_uuid': msg_uuid, 
            'be_focused_user_id': params['be_focused_user_id'],
            'focused_user_id': user_info['data']['id']
        }
        socketio.emit('beg', Utils.formatBody(data), namespace='/api', room='@broadcast.'+str(params['be_focused_user_id']))#,callback=success)
        #只缓存最新的一条
        cache.set('@broadcast.beg'+str(params['be_focused_user_id']),data)
        return Utils.formatBody({},msg='发送成功')
    
    @staticmethod
    @socketValidator(name='focused_user_id', rules={'required': True, 'type': 'integer', 'minlength': 1, 'maxlength': 20})
    @UsersAuthJWT.socketAuth
    @transaction
    def add(params,user_info):
        ''' 添加通讯录 '''
        if params['focused_user_id'] == user_info['data']['id']:
            return Utils.formatError(Code.BAD_REQUEST,msg='无法添加自己为新朋友')
        filters = {
            AddressBook.focused_user_id == params['focused_user_id'],
            AddressBook.be_focused_user_id == user_info['data']['id']
        }
        addressBookData = AddressBook().getOne(filters)
        if(addressBookData == None):
            # 加入房间号
            room_uuid = Utils.unique_id()
            # 建立通讯录关系
            status = AddressBook.addRoomAndAddressBook(
                room_uuid, params['focused_user_id'], user_info['data']['id'])
            if status == False:
                return Utils.formatError(Code.BAD_REQUEST,msg='添加失败')
        
            #回复被添加用户
            socketio.emit('beg', Utils.formatBody({
                'action':'beg_add_success',
                'focused_user_id' : user_info['data']['id']
            }), namespace='/api', room='@broadcast.'+str(params['focused_user_id']))
            #添加后同步房间
            addressBookData = AddressBook.get(room_uuid)
            for item in addressBookData:
                roomList = AddressBook.getRoomList(item.be_focused_user_id)['list']
                socketio.emit('room',Utils.formatBody(roomList), namespace="/api",room='@broadcast.'+str(item.be_focused_user_id))   
            return Utils.formatBody({},msg='添加成功')
        return Utils.formatError(Code.BAD_REQUEST,msg='已添加')
    
    
    @staticmethod
    @socketValidator(name='page_no', rules={'required': True,'type': 'integer'})
    @socketValidator(name='per_page', rules={'required': True, 'type': 'integer'})
    @UsersAuthJWT.socketAuth
    def get(params, user_info):
        """ 获取通讯录列表 """
        filters = {
            AddressBook.be_focused_user_id == user_info['data']['id']
        }
        return Utils.formatBody(AddressBook.rawGetList(params['page_no'], params['per_page'], filters))
       
    
    @staticmethod
    @UsersAuthJWT.socketAuth
    def begCache(params, user_info):
        """ 获取添加好友缓存 """
        data = cache.get('@broadcast.beg'+str(user_info['data']['id']))
        if data is None:
            return Utils.formatBody()
        else:
            cache.delete('@broadcast.beg'+str(user_info['data']['id']))
            return Utils.formatBody(data)
        
    @staticmethod
    @UsersAuthJWT.socketAuth
    def begCacheDel(params, user_info):
        cache.delete('@broadcast.beg'+str(user_info['data']['id']))
        return Utils.formatBody()