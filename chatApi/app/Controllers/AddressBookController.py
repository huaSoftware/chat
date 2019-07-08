'''
@Author: hua
@Date: 2019-02-14 11:04:59
@LastEditors: hua
@LastEditTime: 2019-07-08 15:09:10
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



""" 发送添加好友请求 """
def success(data):
    socketio.emit('beg', Utils.formatBody({
        'data':{}, 
        'action':'beg_success'})
    , namespace='/room', room='@broadcast.'+str(data['data']['id']))

@app.route('/api/v2/addressBook/beg', methods=['POST'])
@validator(name='focused_user_id', rules={'required': True, 'type': 'integer', 'minlength': 1, 'maxlength': 20})
@validator(name='be_focused_user_id', rules={'required': True, 'type': 'integer', 'minlength': 1, 'maxlength': 20})
def addressBookBeg(params):
    if params['focused_user_id'] == params['be_focused_user_id']:
        return BaseController().error(msg='无法添加自己为新朋友')
    addressBookdata = AddressBook.getAdddressBookByFocusedUserId(params['focused_user_id'], params['be_focused_user_id'])
    if addressBookdata != None:
        return BaseController().error(msg='已添加')
    msg_uuid = Utils.unique_id()
    userData = Users().getOne({Users.id == params['focused_user_id']})
    socketio.emit('beg', Utils.formatBody({
        'data':userData, 
        'action':'beg_add', 
        'msg_uuid': msg_uuid, 
        'be_focused_user_id': params['be_focused_user_id']
    }), namespace='/room', room='@broadcast.'+str(params['be_focused_user_id']), callback=success)
    return BaseController().successData(msg='发送成功')


''' 添加通讯录 '''
@app.route('/api/v2/addressBook/add', methods=['POST'])
@validator(name='focused_user_id', rules={'required': True, 'type': 'integer', 'minlength': 1, 'maxlength': 20})
@validator(name='be_focused_user_id', rules={'required': True, 'type': 'integer', 'minlength': 1, 'maxlength': 20})
def addressBookAdd(params):
    if params['focused_user_id'] == params['be_focused_user_id']:
        return BaseController().error(msg='无法添加自己为新朋友')
    filters = {
        AddressBook.focused_user_id == params['focused_user_id'],
        AddressBook.be_focused_user_id == params['be_focused_user_id']
    }
    addressBookData = AddressBook().getOne(filters)
    if(addressBookData == None):
        # 加入房间号
        room_uuid = Utils.unique_id()
        # 建立通讯录关系
        status = AddressBook.addRoomAndAddressBook(
            room_uuid, params['focused_user_id'], params['be_focused_user_id'])
        if status == False:
            return BaseController().error(msg='添加失败')
      
        #回复被添加用户
        socketio.emit('beg', Utils.formatBody({
            'action':'beg_add_success'
        }), namespace='/room', room='@broadcast.'+str(params['focused_user_id']))
        return BaseController().successData(msg='添加成功')
    return BaseController().error(msg='已添加')


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

