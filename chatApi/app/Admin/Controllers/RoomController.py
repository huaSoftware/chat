'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
@LastEditors: hua
@LastEditTime: 2019-06-11 21:10:05
'''
from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController
from app.Models.Admin import Admin
from app.Models.Room import Room
from app.Models.UserRoomRelation import UserRoomRelation

@app.route('/api/v2/admin/room/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="keyword", rules={'type': 'string'})
@UsersAuthJWT.AdminApiAuth
def adminRoomList(*args, **kwargs):
    """ 获取房间列表 """
    params = kwargs['params']
    filters = {
        Room.name.like('%'+params['keyword']+'%')
    }
    data = Room().getList(filters, Room.updated_at.desc(),(),params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/admin/room/delete', methods=['GET'])
@validator(name="room_uuid", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
def adminRoomDelete(*args, **kwargs):
    """ 删除房间 """
    params = kwargs['params']
    filters = {
        Room.room_uuid == params['room_uuid']
    }
    Room().delete(filters)
    filters = {
        UserRoomRelation.room_uuid == params['room_uuid']
    }
    UserRoomRelation().delete(filters)
    return BaseController().successData()

