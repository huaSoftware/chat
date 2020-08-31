'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
LastEditors: hua
LastEditTime: 2020-08-31 19:58:05
'''
from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController
from app.Models.UserRoomRelation import UserRoomRelation
from app.Models.Users import Users
from app.Vendor.Decorator import transaction
from sqlalchemy import or_

@app.route('/api/v2/admin/userRoomRelation/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="orderBy", rules={'type': 'string'}, default='updated_at')
@validator(name="order", rules={'type': 'string'}, default='desc')
@UsersAuthJWT.AdminApiAuth
def adminUserRoomRelationList(*args, **kwargs):
    """ 获取群组关联列表 """
    params = kwargs['params']
    filters = {
        or_(Users.nick_name.like('%'+params['keyword']+'%'),UserRoomRelation.room_uuid.like('%'+params['keyword']+'%'))
    }
    data = UserRoomRelation().getListByGroup(filters, params['orderBy']+" "+params['order'], UserRoomRelation.id,(),params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/admin/userRoomRelation/delete', methods=['GET'])
@validator(name="id", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
@transaction
def adminUserRoomRelationDelete(*args, **kwargs):
    """ 删除群组关联 """
    params = kwargs['params']
    filters = {
        UserRoomRelation.id == params['id']
    }
    UserRoomRelation().delete(filters)
    return BaseController().successData()