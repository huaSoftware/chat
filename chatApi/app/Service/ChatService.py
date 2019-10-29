'''
@Author: hua
@Date: 2019-06-01 11:49:33
@description: 
@LastEditors: hua
@LastEditTime: 2019-10-29 19:49:44
'''
from flask_socketio import emit
from app.Models.AddressBook import AddressBook
from app.Models.UserRoomRelation import UserRoomRelation
from app.Vendor.Decorator import classTransaction
from app.Models.Users import Users
from app.Models.Room import Room
from app.Vendor.Code import Code
from app.Vendor.Utils import Utils
from app import socketio
import time

class ChatService():
    
    @classTransaction
    def chat(self, message, user_info):
        """
            @param  dict message
            @param  dict user_info
            @return dict 
        """
        msg = message['data']['msg']
        room_uuid = message['data']['room_uuid']
        Type = message['data']['type']
        room_data = Room.get(room_uuid)
        room_type = room_data.type
        created_at = message['data']['created_at']  
        user_data = Users().getOne({Users.id == user_info['data']['id']})
        data = {
            'msg': msg, 
            'name': user_data['nick_name'], 
            'user_id': user_data['id'], 
            'type':  Type,
            'head_img':user_data['head_img'],
            'room_uuid': room_uuid,
            'created_at': created_at
        }
        if room_data != None and room_type == 0:
            address_book_data = AddressBook.get(room_uuid)
            #发送消息
            emit('chat',  Utils.formatBody(data), room=room_uuid)
            #聊天时同步房间信息
            Room.updateLastMsgRoom(room_uuid, data, created_at)
            #更新聊天提示数字
            AddressBook.updateUnreadNumber(room_uuid, user_data['id'])
            AddressBook.cleanUnreadNumber(room_uuid, user_data['id'])
            #更新客户端房间信息
            for item in address_book_data:
                roomList = AddressBook.getRoomList(item.be_focused_user_id)['data']
                socketio.emit('room', Utils.formatBody(roomList), namespace='/api', room='@broadcast.'+str(item.be_focused_user_id))
        elif room_data != None and room_type == 1:
            user_room_relation_data = UserRoomRelation.get(room_uuid)
            #发送消息
            emit('chat', Utils.formatBody(data), room=room_uuid)
            #聊天时同步房间信息
            Room.updateLastMsgRoom(room_uuid, data, created_at)
            #更新聊天提示数字
            UserRoomRelation.updateUnreadNumber(room_uuid, user_data['id'])
            UserRoomRelation.cleanUnreadNumber(room_uuid, user_data['id'])
            #更新客户端房间信息
            for item in user_room_relation_data:
                #if item.user_id != user_id:
                roomList = UserRoomRelation.getRoomList(item.user_id)['data']
                socketio.emit('groupRoom', Utils.formatBody(roomList), namespace='/api', room='@broadcast.'+str(item.user_id))
        return  Utils.formatBody({'action':"chat"})
        
    @classTransaction
    def groupChatCreate(self,user_info, params):
        """ 
            创建聊天群组
            @Param dict userInfo
            @param dict params
            @return bool
        """
        room_uuid = Utils.unique_id()
        name = ''
        now_item = int(time.time())
        for id in params['ids']:
            user_data = Users().getOne({Users.id == id})
            name = name + ',' + user_data['nick_name']
            userRoomRelationData = {
                'user_id'      : id,
                'room_uuid'    : room_uuid,
                'is_alert'     : 0,
                'unread_number': 0,
                'updated_at': now_item,
                'created_at': now_item
            }
            UserRoomRelation().add(userRoomRelationData)
        room_data = {
            'room_uuid' : room_uuid,
            'last_msg'  : '',
            'type'      : 1,
            'updated_at': now_item,
            'created_at': now_item,
            'name': name.strip(','),
            'user_id': user_info['data']['id']
        }
        room = Room().addByClass(room_data)
        return {'room_uuid' : room_uuid,'name':name.strip(',')}
    
