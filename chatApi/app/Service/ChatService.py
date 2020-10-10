'''
@Author: hua
@Date: 2019-06-01 11:49:33
@description: 
LastEditors: hua
LastEditTime: 2020-10-10 23:21:17
'''
from flask_socketio import emit
from app.Models.AddressBook import AddressBook
from app.Models.UserRoomRelation import UserRoomRelation
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import transaction
from app.Models.Users import Users
from app.Models.Room import Room
from app.Models.Msg import Msg
from app.Models.Config import Config
from app.Models.Admin import Admin
from app.Vendor.Utils import Utils
from app import socketio, CONST
import json
import time


class ChatService():
    @staticmethod
    @transaction
    def sendChatMessage(msg, room_uuid, Type, room_data, room_type, created_at, save_action, user_data, user_type=0):
        data = {
            'msg': msg,
            'name': user_data['nick_name'],
            'user_id': user_data['id'],
            'type':  Type,
            'head_img': user_data['head_img'],
            'room_uuid': room_uuid,
            'created_at': created_at,
            'read_status': 0,
            'user_type': user_type
            }
        if room_data != None and room_type == CONST['ROOM']['ADMIN']['value']:
            address_book_data = AddressBook.get(room_uuid)
            # 发送消息
            socketio.emit('chat',  Utils.formatBody(data),
                          namespace='/api', room=room_uuid)
            # 视频消息则直接返回
            if Type ==  CONST['CHAT']['VIDEO']['value']:
                return
            # 如果是云端存储则记录，这边判断不判断都存储
            # if save_action == CONST['SAVE']['CLOUD']['value']:
            res = Msg().getOne({Msg.room_uuid == room_uuid, Msg.created_at ==
                                created_at, Msg.user_id == user_data['id']})
            if res == None:
                copy_data = data.copy()
                copy_data['msg'] = json.dumps(msg)
                copy_data['send_status'] = CONST['STATUS']['SUCCESS']['value']
                Msg().add(copy_data)
            else:
                copy_data = data.copy()
                copy_data['msg'] = json.dumps(msg)
                copy_data['send_status'] = CONST['STATUS']['SUCCESS']['value']
                filters = {
                    Msg.name == copy_data['name'],
                    Msg.created_at == copy_data['created_at'],
                    Msg.room_uuid == room_uuid
                }
                Msg().edit(copy_data, filters)
            # 聊天时同步房间信息
            Room.updateLastMsgRoom(room_uuid, data, created_at)
            # 更新聊天提示数字
            AddressBook.updateUnreadNumber(room_uuid, user_data['id'])
            AddressBook.cleanUnreadNumber(room_uuid, user_data['id'])
            # 更新客户端房间信息
            for item in address_book_data:
                roomList = AddressBook.getRoomList(item.be_focused_user_id)
                socketio.emit('room', Utils.formatBody(
                    roomList), namespace='/api', room='@broadcast.'+str(item.be_focused_user_id))
        if room_data != None and room_type == CONST['ROOM']['ALONE']['value']:
            address_book_data = AddressBook.get(room_uuid)
            # 视频消息则直接返回
            if Type ==  CONST['CHAT']['VIDEO']['value']:
                videoData = data
                videoData["room_type"] = room_type
                # 发送消息
                for item in address_book_data:
                    if item['be_focused_user_id'] != user_data['id']:
                        emit('video',  Utils.formatBody(videoData), room='@broadcast.'+str(item.be_focused_user_id))
                return 
            # 发送消息
            emit('chat',  Utils.formatBody(data), room=room_uuid)
            # 如果是云端存储则记录，这边判断不判断都存储
            # if save_action == CONST['SAVE']['CLOUD']['value']:
            res = Msg().getOne({Msg.room_uuid == room_uuid, Msg.created_at ==
                                created_at, Msg.user_id == user_data['id']})
            if res == None:
                copy_data = data.copy()
                copy_data['msg'] = json.dumps(msg)
                copy_data['send_status'] = CONST['STATUS']['SUCCESS']['value']
                Msg().add(copy_data)
            else:
                copy_data = data.copy()
                copy_data['msg'] = json.dumps(msg)
                copy_data['send_status'] = CONST['STATUS']['SUCCESS']['value']
                filters = {
                    Msg.name == copy_data['name'],
                    Msg.created_at == copy_data['created_at'],
                    Msg.room_uuid == room_uuid
                }
                Msg().edit(copy_data, filters)
            # 聊天时同步房间信息
            Room.updateLastMsgRoom(room_uuid, data, created_at)
            # 更新聊天提示数字
            AddressBook.updateUnreadNumber(room_uuid, user_data['id'])
            AddressBook.cleanUnreadNumber(room_uuid, user_data['id'])
            # 更新客户端房间信息
            for item in address_book_data:
                print(AddressBook,item)
                roomList = AddressBook.getRoomList(item.be_focused_user_id)
                socketio.emit('room', Utils.formatBody(
                    roomList), namespace='/api', room='@broadcast.'+str(item.be_focused_user_id))
        elif room_data != None and room_type == CONST['ROOM']['GROUP']['value']:
            # 获取用户的权限，如果禁言状态返回错误
            filters = {
                UserRoomRelation.user_id == user_data['id'],
                UserRoomRelation.room_uuid == room_uuid
            }
            selfUserRoomRelationData = UserRoomRelation().getOne(filters)
            if selfUserRoomRelationData['status'] == CONST['GROUP']['BLOCK']['value']:
                return Utils.formatError(CONST['CODE']['ERROR']['value'], '禁言中')
            # 获取群组内用户
            user_room_relation_data = UserRoomRelation.get(room_uuid)
            # 发送消息
            emit('chat', Utils.formatBody(data), room=room_uuid)
            # 如果是云端存储则记录
            # if save_action == CONST['SAVE']['CLOUD']['value']:
            res = Msg().getOne({Msg.room_uuid == room_uuid, Msg.created_at ==
                                created_at, Msg.user_id == user_data['id']})
            if res == None:
                copy_data = data.copy()
                copy_data['msg'] = json.dumps(msg)
                copy_data['send_status'] = CONST['STATUS']['SUCCESS']['value']
                Msg().add(copy_data)
            else:
                copy_data = data.copy()
                copy_data['msg'] = json.dumps(msg)
                copy_data['send_status'] = CONST['STATUS']['SUCCESS']['value']
                filters = {
                    Msg.name == copy_data['name'],
                    Msg.created_at == copy_data['created_at'],
                    Msg.room_uuid == room_uuid
                }
                Msg().edit(copy_data, filters)
            # 聊天时同步房间信息
            Room.updateLastMsgRoom(room_uuid, data, created_at)
            # 更新聊天提示数字
            UserRoomRelation.updateUnreadNumber(room_uuid, user_data['id'])
            UserRoomRelation.cleanUnreadNumber(room_uuid, user_data['id'])
            # 更新客户端房间信息
            for item in user_room_relation_data:
                roomList = UserRoomRelation.getRoomList(item.user_id)
                socketio.emit('groupRoom', Utils.formatBody(
                    roomList), namespace='/api', room='@broadcast.'+str(item.user_id))
        return Utils.formatBody({'action': "chat", "data": data})

    @staticmethod
    @transaction
    def adminCreateRoom(message):
        admin_user_info = UsersAuthJWT().adminIdentify(
            message['Authorization'])
        if isinstance(admin_user_info, str):
            return Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'], admin_user_info)
        filters = {
            Admin.id == admin_user_info['data']['id'],
        }
        admin_user_info = Admin().getOne(filters)
        filters = {
            AddressBook.be_focused_user_id == message['user_id'],
            AddressBook.focused_user_id == admin_user_info['id'],
            AddressBook.type == 1
        }
        addressBookInfo = AddressBook().getOne(filters)
        if addressBookInfo == None:
            room_uuid = Utils.unique_id()
            # 建立通讯录关系
            status = AddressBook.adminAddRoomAndAddressBook(
                room_uuid, admin_user_info, message['user_id'])
            if status == False:
                return Utils.formatError(CONST['CODE']['BAD_REQUEST']['value'], msg='添加失败')
            # 添加后同步房间
            addressBookData = AddressBook.get(room_uuid)
            for item in addressBookData:
                roomList = AddressBook.getRoomList(
                    item.be_focused_user_id)['list']
                if item['type'] == CONST['ADDRESSBOOK']['ADMIN']['value']:
                    socketio.emit('room', Utils.formatBody(
                        roomList), namespace="/api", room='@broadcast.'+str(item.be_focused_user_id))
                else:
                    socketio.emit('room', Utils.formatBody(
                        roomList), namespace="/api", room='@broadcast.'+str(item.be_focused_user_id))
        else:
            room_uuid = addressBookInfo['room_uuid']
        return Utils.formatBody({'room_uuid': room_uuid})

    @staticmethod
    def adminChat(message: dict) -> dict:
        admin_user_info = UsersAuthJWT().adminIdentify(
            message['Authorization'])
        if isinstance(admin_user_info, str):
            return Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'], admin_user_info)
        # 整合数据信息
        filters = {
            Admin.id == admin_user_info['data']['id'],
        }
        admin_user_info = Admin().getOne(filters)
        default_img_data = Config().getOne(
            {Config.type == 'img', Config.code == 'default.img', Config.status == 1})
        if default_img_data == None:
            default_img = 'static/img/about/python.jpg'
        else:
            default_img = default_img_data['config']

        admin_user_info['nick_name'] = '系统管理-'+admin_user_info['nick_name']
        admin_user_info['head_img'] = default_img  # 这里后期改成配置的
        # 使用0作为系统id
        msg = message['data']['msg']
        room_uuid = message['data']['room_uuid']
        Type = message['data']['type']
        room_data = Room.get(room_uuid)
        if room_data == None:
            return Utils.formatError(CONST['CODE']['ROOM_NO_EXIST']['value'], "房间不存在")
        room_type = room_data.type
        created_at = int(time.time())
        save_action = message['data']['save_action']
        return ChatService.sendChatMessage(msg, room_uuid, Type, room_data, room_type, created_at, save_action, admin_user_info, 1)

    @staticmethod
    def chat(message, user_info):
        """
            @param  dict message
            @param  dict user_info
            @return dict 
        """
        msg = message['data']['msg']
        room_uuid = message['data']['room_uuid']
        Type = message['data']['type']
        room_data = Room.get(room_uuid)
        if room_data == None:
            return Utils.formatError(CONST['CODE']['ROOM_NO_EXIST']['value'], "房间不存在")
        room_type = room_data.type
        created_at = message['data']['created_at']
        save_action = message['data']['save_action']
        user_data = Users().getOne({Users.id == user_info['data']['id']})
        return ChatService.sendChatMessage(msg, room_uuid, Type, room_data, room_type, created_at, save_action, user_data)

    @staticmethod
    @transaction
    def groupChatCreate(params, user_info):
        """ 
            创建聊天群组，userInfo.id是群主
            @Param dict userInfo
            @param dict params
            @return bool
        """
        room_uuid = Utils.unique_id()
        name = ''
        userRoomRelationData = {
                'user_id': user_info['data']['id'],
                'room_uuid': room_uuid,
                'is_alert': 0,
                'unread_number': 0,
                'type':CONST['GROUP']['MASTER']['value']
            }
        UserRoomRelation().add(userRoomRelationData)
        for id in params['ids']:
            user_data = Users().getOne({Users.id == id})
            name = name + ',' + user_data['nick_name']
            userRoomRelationData = {
                'user_id': id,
                'room_uuid': room_uuid,
                'is_alert': 0,
                'unread_number': 0
            }
            UserRoomRelation().add(userRoomRelationData)
        room_data = {
            'room_uuid': room_uuid,
            'last_msg': '',
            'type': CONST['CHAT']['TEXT']['value'],
            'name': name.strip(','),
            'user_id': user_info['data']['id']
        }
        Room().addByClass(room_data)
        return {'room_uuid': room_uuid, 'name': name.strip(',')}

    @staticmethod
    @transaction
    def input(params, user_info):
        filters = {
            AddressBook.focused_user_id == user_info['data']['id'],
            AddressBook.room_uuid == params['room_uuid']
        }
        AddressBook().edit({'is_input': 1}, filters)
        # 发送消息
        data = AddressBook().getOne(filters)
        data['even'] = params['even']
        emit('input',  Utils.formatBody(data),
             room='@broadcast.'+str(data['be_focused_user_id']))
        return Utils.formatBody({'action': "input", "data": data})
