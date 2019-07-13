'''
@Author: hua
@Date: 2019-06-05 14:54:18
@description: 
@LastEditors: hua
@LastEditTime: 2019-07-13 20:38:03
'''
from app import app
from app.Controllers.BaseController import BaseController
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Utils import Utils
from app.Service.ChatService import ChatService
from app.Models.AddressBook import AddressBook
from app.Models.Room import Room
from app.Models.UserRoomRelation import UserRoomRelation
from app.Vendor.Decorator import validator
from app.Vendor.Code import Code
from flask import request


@app.route('/api/v2/groupChat/create', methods=['POST'])
@validator(name='ids', rules={'required': True, 'type': 'list', 'minlength': 1, 'maxlength': 20})
def groupChatCreate(params):
    # 加入房间号
    data = ChatService().groupChatCreate(params)
    if data:
        return BaseController().successData(data, msg='创建成功')
    return BaseController().error(msg='创建失败')
    
    
@app.route('/api/v2/userRoomRelation/get', methods=['POST'])
@validator(name='page_no', rules={'required': True,'type': 'integer'})
@validator(name='per_page', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def UserRoomRelationGet(params, user_info):
    """ 获取通讯录列表 """
    filters = {
        UserRoomRelation.user_id == user_info['data']['id']
    }
    data = UserRoomRelation().getList( filters, UserRoomRelation.updated_at.desc())
    return BaseController().successData(data)


@app.route('/api/v2/userRoomRelation/getByRoomUuid', methods=['POST'])
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@UsersAuthJWT.apiAuth
def UserRoomRelationGetByRoomUuid(params, user_info):
    """ 获取群组或单聊信息 """
    filters = {
        Room.room_uuid == params['room_uuid']
    }
    roomData = Room().getOne(filters)
    if roomData['type'] == 0:
        filters = {
            AddressBook.room_uuid == params['room_uuid']
        }
        data = AddressBook().getList( filters, AddressBook.updated_at.desc())
        filters.add(
            AddressBook.be_focused_user_id == user_info['data']['id']
        )
        data['is_alert'] = AddressBook().getOne( filters)['is_alert']
    else:
        filters = {
            UserRoomRelation.room_uuid == params['room_uuid']
        }
        data = UserRoomRelation().getList( filters, UserRoomRelation.updated_at.desc())
        filters.add(
            UserRoomRelation.user_id == user_info['data']['id']
        )
        data['is_alert'] = UserRoomRelation().getOne( filters)['is_alert']
    return BaseController().successData(data)


@app.route('/api/v2/userRoomRelation/updateAlert', methods=['POST'])
@validator(name='is_alert', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def UserRoomRelationUpdateAlert(params, user_info):
    """ 更新对否提醒 """
    filters = {
        Room.room_uuid == params['room_uuid']
    }
    roomData = Room().getOne(filters)
    if roomData['type'] == 0:
        filters = {
            AddressBook.room_uuid == params['room_uuid'],
            AddressBook.be_focused_user_id == user_info['data']['id']
        }
        data = {
            'is_alert': params['is_alert']
        }
        status = AddressBook().edit(data, filters)
    else:
        filters = {
            UserRoomRelation.room_uuid == params['room_uuid'],
            UserRoomRelation.user_id == user_info['data']['id']
        }
        data = {
            'is_alert': params['is_alert']
        }
        status = UserRoomRelation().edit(data, filters)
    if status:
        return BaseController().successData()