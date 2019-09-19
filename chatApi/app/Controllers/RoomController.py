'''
@Author: hua
@Date: 2019-02-26 15:40:50
@description: 
@LastEditors: hua
@LastEditTime: 2019-09-19 10:35:10
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
from app.Models.Msg import Msg
from app.Models.Room import Room
from flask_socketio import emit, join_room
from app.Vendor.Code import Code
import time,json

""" 获取房间列表 """
@app.route('/api/v2/room/get', methods=['GET'])
@UsersAuthJWT.apiAuth
def roomGet(user_info):
    data = AddressBook.getRoomList(user_info['data']['id'])
    return BaseController().json(data)

@app.route('/api/v2/room/del', methods=['POST'])
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@UsersAuthJWT.apiAuth
def roomDel(user_info, params):
    filters = {
        Room.room_uuid == params['room_uuid']
    }
    roomData = Room().getOne(filters)
    if roomData['type'] == 0:
        address_book_data = Utils.db_l_to_d(AddressBook.get(params['room_uuid']))
        filters = {
            AddressBook.room_uuid == params['room_uuid']
        }
        AddressBook().delete(filters)
        filters = {
            Room.room_uuid == params['room_uuid']
        }
        Room().delete(filters)
        for item in address_book_data:
            print('用户编号：'+str(item['be_focused_user_id']))
            print('用户编号：'+str(item['focused_user_id']))
            roomList = AddressBook.getRoomList(item['be_focused_user_id'])['data']
            socketio.emit('room',Utils.formatBody(roomList), namespace="/room",room='@broadcast.'+str(item['be_focused_user_id']))
            roomList = AddressBook.getRoomList(item['focused_user_id'])['data']
            socketio.emit('room',Utils.formatBody(roomList), namespace="/room",room='@broadcast.'+str(item['focused_user_id']))
    else:
        user_room_relation_data = Utils.db_l_to_d(UserRoomRelation.get(params['room_uuid']))
        filters = {
            UserRoomRelation.room_uuid == params['room_uuid'],
            UserRoomRelation.user_id == user_info['data']['id']
        }
        data = UserRoomRelation().delete(filters)
        filters = {
            Room.room_uuid == params['room_uuid']
        }
        Room().delete(filters)
        filters = {
            UserRoomRelation.room_uuid == params['room_uuid']
        }
        UserRoomRelation().delete(filters)
        for item in user_room_relation_data:
            roomList = UserRoomRelation.getRoomList(item['user_id'])['data']
            socketio.emit('groupRoom', Utils.formatBody(roomList), namespace='/room', room='@broadcast.'+str(item['user_id']))
    return BaseController().successData()

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

@app.route('/api/v2/room/msg/add', methods=['POST'])
@validator(name='created_at', rules={'required': True, 'type': 'integer'})
@validator(name='head_img', rules={'required': True, 'type': 'string'})
@validator(name='msg', rules={'required': True})
@validator(name='name', rules={'required': True, 'type': 'string'})
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@validator(name='send_status', rules={'required': True, 'type': 'integer'})
@validator(name='type', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def addRoomMsg(user_info, params):
    """ 
        添加聊天数据
        :param dict user_info
        :param dict params
        :return dict 
    """
    res = Msg().getOne({Msg.room_uuid == params['room_uuid'],Msg.created_at == params['created_at'],Msg.user_id==user_info['data']['id']})
    if res == None:
        params['user_id'] = user_info['data']['id']
        params['msg'] = json.dumps( params['msg'])
        Msg().add(params)
    return BaseController().successData()

@app.route('/api/v2/room/msg/del', methods=['POST'])
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@UsersAuthJWT.apiAuth
def delRoomMsg(user_info, params):
    """ 删除聊天数据
        :param dict user_info
        :param dict params
        :return dict
    """
    filters = {
        Msg.room_uuid == params['room_uuid'],
        Msg.user_id == user_info['data']['id']
    }
    Msg().delete(filters)
    return BaseController().successData()

@app.route('/api/v2/room/msg/update', methods=['POST'])
@validator(name='created_at', rules={'required': True, 'type': 'integer'})
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@validator(name='send_status', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def updateRoomMsg(user_info, params):
    """ 
        更新聊天数据
        :param dict user_info
        :param dict params
        :return dict
    """
    filters = {
        Msg.room_uuid == params['room_uuid'],
        Msg.created_at == params['created_at'],
        Msg.user_id == user_info['data']['id']
    }
    Msg().edit({'send_status': params['send_status']}, filters)
    return BaseController().successData()

@app.route('/api/v2/room/msg/get', methods=['POST'])
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@validator(name='page_no', rules={'required': True, 'type': 'integer'})
@validator(name='per_page', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def getRoomMsg(user_info, params):
    """
    查询聊天数据
    :param dict user_info
    :param dict params
    :return dict
    """
    filters = {
        Msg.room_uuid == params['room_uuid']
    }
    data = Msg().getList(filters, Msg.created_at.desc(), (), params['page_no'], params['per_page'])
    return BaseController().successData(data)
    