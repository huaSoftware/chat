'''
@Author: hua
@Date: 2019-09-29 12:03:29
@description: 
@LastEditors  : hua
@LastEditTime : 2020-01-19 14:28:58
'''
from app import CONST
from app import socketio
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Models.AddressBook import AddressBook
from app.Vendor.Decorator import socketValidator
from app.Models.UserRoomRelation import UserRoomRelation
from app.Models.Msg import Msg
from app.Models.Room import Room
from app.Vendor.Decorator import transaction
import json

class RoomService:
    
    @staticmethod
    @UsersAuthJWT.socketAuth
    def get(params, user_info):
        """ 获取房间列表 """
        return Utils.formatBody(AddressBook.getRoomList(user_info['data']['id']))
    
    @staticmethod
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @UsersAuthJWT.socketAuth
    @transaction
    def delete(params, user_info):
        filters = {
            Room.room_uuid == params['room_uuid']
        }
        roomData = Room().getOne(filters)
        if roomData['type'] == CONST['ROOM']['ALONE']['value']:
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
                roomList = AddressBook.getRoomList(item['be_focused_user_id'])
                socketio.emit('room',Utils.formatBody(roomList), namespace="/api",room='@broadcast.'+str(item['be_focused_user_id']))
                """  roomList = AddressBook.getRoomList(item['focused_user_id'])['list']
                socketio.emit('room',Utils.formatBody(roomList), namespace="/api",room='@broadcast.'+str(item['focused_user_id'])) """
        else:
            user_room_relation_data = Utils.db_l_to_d(UserRoomRelation.get(params['room_uuid']))
            filters = {
                UserRoomRelation.room_uuid == params['room_uuid'],
                UserRoomRelation.user_id == user_info['data']['id']
            }
            UserRoomRelation().delete(filters)
            filters = {
                Room.room_uuid == params['room_uuid']
            }
            Room().delete(filters)
            filters = {
                UserRoomRelation.room_uuid == params['room_uuid']
            }
            UserRoomRelation().delete(filters)
            for item in user_room_relation_data:
                roomList = UserRoomRelation.getRoomList(item['user_id'])
                socketio.emit('groupRoom', Utils.formatBody(roomList), namespace='/api', room='@broadcast.'+str(item['user_id']))
        return  Utils.formatBody({},msg='删除成功')
    
    @staticmethod
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @UsersAuthJWT.socketAuth
    @transaction
    def details(params, user_info):
        """ 获取群聊用户信息 """
        filters = {
            UserRoomRelation.room_uuid == params['room_uuid']
        }
        data = UserRoomRelation().getAll(filters, UserRoomRelation.created_at.desc)
        return data
    
    @staticmethod
    @socketValidator(name='created_at', rules={'required': True, 'type': 'integer'})
    @socketValidator(name='head_img', rules={'required': True, 'type': 'string'})
    @socketValidator(name='msg', rules={'required': True})
    @socketValidator(name='name', rules={'required': True, 'type': 'string'})
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @socketValidator(name='send_status', rules={'required': True, 'type': 'integer'})
    @socketValidator(name='type', rules={'required': True, 'type': 'integer'})
    @socketValidator(name='user_id', rules={'required': True, 'type': 'integer'})
    @UsersAuthJWT.socketAuth
    @transaction
    def addMsg(params, user_info):
        """ bug
            添加聊天数据
            :param dict user_info
            :param dict params
            :return dict 
        """
        res = Msg().getOne({Msg.room_uuid == params['room_uuid'],Msg.created_at == params['created_at'],Msg.user_id==params['user_id']})
        if res == None:
            params['msg'] = json.dumps(params['msg'])
            del params['Authorization']
            Msg().add(params)
        return Utils.formatBody({},msg='添加成功')
    
    @staticmethod
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @UsersAuthJWT.socketAuth
    @transaction
    def delMsg(params, user_info):
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
        return Utils.formatBody()
    
    @staticmethod
    @socketValidator(name='created_at', rules={'required': True, 'type': 'integer'})
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @socketValidator(name='send_status', rules={'required': True, 'type': 'integer'})
    @UsersAuthJWT.socketAuth
    @transaction
    def updateMsg(params, user_info):
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
        return Utils.formatBody({}, msg='更新成功')

    @staticmethod
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @socketValidator(name='user_id', rules={'required': True, 'type': 'integer'})
    @UsersAuthJWT.socketAuth
    @transaction
    def updateReadStatusCloudRoomMsgByRoomIdAndUserId(params, user_info):
        """ 
            更新聊天数据
            :param dict user_info
            :param dict params
            :return dict
        """
        filters = {
            Msg.room_uuid == params['room_uuid'],
            Msg.user_id == params['user_id']
        }
        Msg().edit({'read_status': 1}, filters)
        return Utils.formatBody({}, msg='更新成功')

    @staticmethod
    @socketValidator(name='room_uuid', rules={'required': True, 'type': 'string'})
    @socketValidator(name='page_no', rules={'required': True, 'type': 'integer'})
    @socketValidator(name='per_page', rules={'required': True, 'type': 'integer'})
    @UsersAuthJWT.socketAuth
    def getMsg(params, user_info):
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
        """ def format(x):
            x['msg'] = json.loads(x['msg'])
            return x
        data['list'] = list(map(format, data['list'])) """
        return Utils.formatBody(data, msg='获取成功')