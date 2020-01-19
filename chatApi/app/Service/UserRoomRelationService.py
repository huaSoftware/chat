'''
@Author: hua
@Date: 2019-09-29 13:15:06
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-12 14:43:39
'''
from app import CONST
from app import socketio
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Utils import Utils
from app.Service.ChatService import ChatService
from app.Models.AddressBook import AddressBook
from app.Models.Room import Room
from app.Models.UserRoomRelation import UserRoomRelation
from app.Vendor.Decorator import socketValidator
from app.Vendor.Decorator import transaction

class UserRoomRelationService:
    
    @staticmethod
    @socketValidator(name='ids', rules={'required': True, 'type': 'list', 'minlength': 1, 'maxlength': 20})
    @UsersAuthJWT.socketAuth
    def create(params, user_info):
        # 加入房间号
        data = ChatService().groupChatCreate(params, user_info)
        if data:
            #添加后同步房间
            user_room_relation_data = Utils.db_l_to_d(UserRoomRelation.get(data['room_uuid']))
            for item in user_room_relation_data:
                roomList = UserRoomRelation.getRoomList(item['user_id'])
                socketio.emit('groupRoom', Utils.formatBody(roomList), namespace='/api', room='@broadcast.'+str(item['user_id']))
            return Utils.formatBody(data, msg='创建成功')
        return Utils.formatError(CONST['CODE']['BAD_REQUEST']['value'],msg='创建失败')
    
    @staticmethod
    @UsersAuthJWT.socketAuth
    def get(params, user_info):
        """ 获取通讯录列表 """
        filters = {
            UserRoomRelation.user_id == user_info['data']['id']
        }
        data = UserRoomRelation().getAll(filters, 'updated_at desc')
        return Utils.formatBody({"list":data})
    
    @staticmethod
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @UsersAuthJWT.socketAuth
    def getByRoomUuid(params, user_info):
        """ 获取群组或单聊信息 """
        filters = {
            Room.room_uuid == params['room_uuid']
        }
        roomData = Room().getOne(filters)
        if roomData['type'] == CONST['ROOM']['ALONE']['value']:
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
        return Utils.formatBody(data)
    
    @staticmethod
    @socketValidator(name='is_alert', rules={'required': True, 'type': 'integer'})
    @UsersAuthJWT.socketAuth
    @transaction
    def updateAlert(params, user_info):
        """ 更新对否提醒 """
        filters = {
            Room.room_uuid == params['room_uuid']
        }
        roomData = Room().getOne(filters)
        if roomData['type'] == CONST['ROOM']['ALONE']['value']:
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
            return Utils.formatBody()
        
    @staticmethod
    @socketValidator(name='save_action', rules={'required': True, 'type': 'integer'})
    @UsersAuthJWT.socketAuth
    @transaction
    def updateSaveAction(params, user_info):
        """ 更新是否云端保存 """
        filters = {
            Room.room_uuid == params['room_uuid']
        }
        roomData = Room().getOne(filters)
        if roomData['type'] == CONST['ROOM']['ALONE']['value']:
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
            return Utils.formatBody()