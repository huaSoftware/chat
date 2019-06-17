'''
@Author: hua
@Date: 2019-06-01 11:49:33
@description: 
@LastEditors: hua
@LastEditTime: 2019-06-17 10:48:31
'''
from flask_socketio import emit
from app.Models.AddressBook import AddressBook
from app.Models.UserRoomRelation import UserRoomRelation
from app.Models.Users import Users
from app.Models.Room import Room
from app.Vendor.Code import Code
from app.Vendor.Utils import Utils
from app import socketio
import time

class ChatService():
    def chat(self, message, user_info):
        msg = message['data']['msg']
        room_uuid = message['data']['uuid']
        Type = message['data']['type']
        room_data = Room.get(room_uuid)
        room_type = room_data.type
        user_data = Users().getOne({Users.id == user_info['data']['id']})
        if room_data != None and room_type == 0:
            address_book_data = AddressBook.get(room_uuid)
            #发送消息
            emit('chat',  Utils.formatBody({
                'msg': msg, 
                'name': user_data['nick_name'], 
                'user_id': user_data['id'], 
                'type': Type,
                'head_img':user_data['head_img'],
                'room_uuid': room_uuid,
                'created_at': time.time()
            }), room=room_uuid)
            #聊天时同步房间信息
            Room.updateLastMsgRoom(room_uuid, msg)
            #更新聊天提示数字
            AddressBook.updateUnreadNumber(room_uuid, user_data['id'])
            AddressBook.cleanUnreadNumber(room_uuid, user_data['id'])
            #更新客户端房间信息
            for item in address_book_data:
                roomList = AddressBook.getRoomList(item.be_focused_user_id)['data']
                socketio.emit('room', Utils.formatBody(roomList), namespace='/room', room=item.be_focused_user_id)
        elif room_data != None and room_type == 1:
            user_room_relation_data = UserRoomRelation.get(room_uuid)
            #发送消息
            emit('chat', Utils.formatBody({
                    'msg': msg, 
                    'name': user_data['nick_name'], 
                    'user_id': user_data['id'], 
                    'type': Type,
                    'head_img':user_data['head_img'],
                    'room_uuid': room_uuid,
                    'created_at': time.time()
                }), room=room_uuid)
            #聊天时同步房间信息
            Room.updateLastMsgRoom(room_uuid, msg)
            #更新聊天提示数字
            UserRoomRelation.updateUnreadNumber(room_uuid, user_data['id'])
            UserRoomRelation.cleanUnreadNumber(room_uuid, user_data['id'])
            #更新客户端房间信息
            for item in user_room_relation_data:
                #if item.user_id != user_id:
                roomList = UserRoomRelation.getRoomList(item.user_id)['data']
                socketio.emit('groupRoom', Utils.formatBody(roomList), namespace='/room', room=item.user_id)
                
    def groupChatCreate(self, params):
        """ 
            创建聊天群组
            @param dict
            @return bool
        """
        room_uuid = Utils.unique_id()
        name = ''
        for id in params['ids']:
            user_data = Users().getOne({Users.id == id})
            name = name + ',' + user_data['nick_name']
            userRoomRelationData = {
                'user_id'      : id,
                'room_uuid'    : room_uuid,
                'is_alert'     : 0,
                'unread_number': 0,
                'updated_at':time.time(),
                'created_at':time.time()
            }
            UserRoomRelation().add(userRoomRelationData)
        room_data = {
            'room_uuid' : room_uuid,
            'last_msg'  : '',
            'type'      : 1,
            'updated_at':time.time(),
            'created_at':time.time(),
            'name': name.strip(',')
        }
        room = Room().addByClass(room_data)
        return {'room_uuid' : room_uuid}
        