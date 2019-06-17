'''
@Author: hua
@Date: 2019-06-05 14:54:18
@description: 
@LastEditors: hua
@LastEditTime: 2019-06-08 21:42:01
'''
from app import app
from app.Controllers.BaseController import BaseController
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Utils import Utils
from app.Service.ChatService import ChatService
from app.Models.AddressBook import AddressBook
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

