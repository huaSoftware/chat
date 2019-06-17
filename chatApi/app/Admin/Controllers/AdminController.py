'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
@LastEditors: hua
@LastEditTime: 2019-06-12 19:43:08
'''
from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Code import Code
from app.Admin.Controllers.BaseController import BaseController
from app.Models.Admin import Admin
from app.Admin.Service.AdminService import AdminService
from sqlalchemy import or_

@app.route('/api/v2/admin/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="keyword", rules={'type': 'string'})
@UsersAuthJWT.AdminApiAuth
def adminList(*args, **kwargs):
    """ 获取管理员列表 """
    params = kwargs['params']
    filters = {
        Admin.name.like('%'+params['keyword']+'%'),
        or_(Admin.mobile.like('%'+params['keyword']+'%')),
        or_(Admin.email.like('%'+params['keyword']+'%'))
    }
    data = Admin().getList(filters, Admin.update_time.desc(),(),params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/admin/delete', methods=['GET'])
@validator(name="id", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
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
    if data['error_code'] != Code.SUCCESS:
        return BaseController().json(data)
    return BaseController().successData()

@app.route('/api/v2/admin/edit', methods=['POST'])
@validator(name="id", rules={'type': 'integer'}, default='')
@validator(name="pwd", rules={'type': 'string'}, default='')
@UsersAuthJWT.AdminApiAuth
def adminEdit(*args, **kwargs):
    """ 修改管理员密码 """
    params = kwargs['params']
    filters = {
        Admin.id == params['id']
    }
    AdminService().edit(params, filters)
    return BaseController().successData()
