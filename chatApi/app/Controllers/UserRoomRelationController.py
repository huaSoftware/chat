'''
@Author: hua
@Date: 2019-06-05 14:54:18
@description: 
@LastEditors  : hua
@LastEditTime : 2020-01-19 14:28:41
'''
from app import app
from app import socketio
from app.Controllers.BaseController import BaseController
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Utils import Utils
from app.Service.ChatService import ChatService
from app.Models.AddressBook import AddressBook
from app.Models.Room import Room
from app.Models.UserRoomRelation import UserRoomRelation
from app.Vendor.Decorator import validator


@app.route('/api/v2/groupChat/create', methods=['POST'])
@validator(name='ids', rules={'required': True, 'type': 'list', 'minlength': 1, 'maxlength': 20})
@UsersAuthJWT.apiAuth
def groupChatCreate(user_info, params):
    # 加入房间号
    data = ChatService().groupChatCreate(user_info, params)
    if data:
        #添加后同步房间
        user_room_relation_data = Utils.db_l_to_d(UserRoomRelation.get(data['room_uuid']))
        for item in user_room_relation_data:
            roomList = UserRoomRelation.getRoomList(item['user_id'])
            socketio.emit('groupRoom', Utils.formatBody(roomList), namespace='/api', room='@broadcast.'+str(item['user_id']))
        return BaseController().successData(data, msg='创建成功')
    return BaseController().error(msg='创建失败')
    
    
@app.route('/api/v2/userRoomRelation/get', methods=['GET'])
@UsersAuthJWT.apiAuth
def userRoomRelationGet(user_info):
    """ 获取通讯录列表 """
    filters = {
        UserRoomRelation.user_id == user_info['data']['id']
    }
    data = UserRoomRelation().getAll(filters, 'updated_at desc')
    return BaseController().successData(data)


@app.route('/api/v2/userRoomRelation/getByRoomUuid', methods=['POST'])
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@UsersAuthJWT.apiAuth
def userRoomRelationGetByRoomUuid(params, user_info):
    """ 获取群组或单聊信息 """
    filters = {
        Room.room_uuid == params['room_uuid']
    }
    roomData = Room().getOne(filters)
    if roomData['type'] == 0:
        filters = {
            AddressBook.room_uuid == params['room_uuid']
        }
        data = AddressBook().getList( filters, 'updated_at desc')
        filters.add(
            AddressBook.be_focused_user_id == user_info['data']['id']
        )
        data['room'] = AddressBook().getOne( filters)
    else:
        filters = {
            UserRoomRelation.room_uuid == params['room_uuid']
        }
        data = UserRoomRelation().getList( filters, 'updated_at desc')
        filters.add(
            UserRoomRelation.user_id == user_info['data']['id']
        )
        data['room'] = UserRoomRelation().getOne( filters)
    return BaseController().successData(data)


@app.route('/api/v2/userRoomRelation/updateAlert', methods=['POST'])
@validator(name='is_alert', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def userRoomRelationUpdateAlert(params, user_info):
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
    
@app.route('/api/v2/userRoomRelation/updateSaveAction', methods=['POST'])
@validator(name='save_action', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.apiAuth
def userRoomRelationUpdateSaveAction(params, user_info):
    """ 更新是否云端保存 """
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
            'save_action': params['save_action']
        }
        status = AddressBook().edit(data, filters)
    else:
        filters = {
            UserRoomRelation.room_uuid == params['room_uuid'],
            UserRoomRelation.user_id == user_info['data']['id']
        }
        data = {
            'save_action': params['save_action']
        }
        status = UserRoomRelation().edit(data, filters)
    if status:
        return BaseController().successData()