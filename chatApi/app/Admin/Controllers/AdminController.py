'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-12 14:37:09
'''
from app import app,CONST
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController
from app.Vendor.Decorator import transaction
from app.Models.Admin import Admin
from app.Admin.Service.AdminService import AdminService
from sqlalchemy import or_

@app.route('/api/v2/admin/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="keyword", rules={'type': 'string'})
@validator(name="orderBy", rules={'type': 'string'}, default='update_time')
@validator(name="order", rules={'type': 'string'}, default='desc')
@UsersAuthJWT.AdminApiAuth
def adminList(*args, **kwargs):
    """ 获取管理员列表 """
    params = kwargs['params']
    filters = {
        Admin.name.like('%'+params['keyword']+'%'),
        or_(Admin.mobile.like('%'+params['keyword']+'%')),
        or_(Admin.email.like('%'+params['keyword']+'%'))
    }
    data = Admin().getList(filters,params['orderBy']+" "+params['order'],(),params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/admin/delete', methods=['GET'])
@validator(name="id", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
@transaction
def adminDelete(*args, **kwargs):
    """ 删除管理员 """
    params = kwargs['params']
    filters = {
        Admin.id == params['id']
    }
    Admin().delete(filters)
    return BaseController().successData()

@app.route('/api/v2/admin/add', methods=['POST'])
@validator(name="name", rules={'type': 'string'}, default='')
@validator(name="pwd", rules={'type': 'string'}, default='')
@UsersAuthJWT.AdminApiAuth
def adminAdd(*args, **kwargs):
    """ 增加管理员 """
    params = kwargs['params']
    data = AdminService().add(params)
    if data['error_code'] != CONST['CODE']['SUCCESS']['value']:
        return BaseController().json(data)
    return BaseController().successData()

@app.route('/api/v2/admin/edit', methods=['POST'])
@validator(name="id", rules={'type': 'integer'}, default='')
@validator(name="pwd", rules={'type': 'string'}, default='')
@UsersAuthJWT.AdminApiAuth
@transaction
def adminEdit(*args, **kwargs):
    """ 修改管理员密码 """
    params = kwargs['params']
    filters = {
        Admin.id == params['id']
    }
    AdminService().edit(params, filters)
    return BaseController().successData()
