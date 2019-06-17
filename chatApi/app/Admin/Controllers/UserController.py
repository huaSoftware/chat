'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
@LastEditors: hua
@LastEditTime: 2019-06-12 16:02:25
'''
from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController
from app.Models.Users import Users
from app.Admin.Service.AdminService import AdminService
from sqlalchemy import or_

@app.route('/api/v2/admin/user/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="keyword", rules={'type': 'string'})
@UsersAuthJWT.AdminApiAuth
def adminUserList(*args, **kwargs):
    """ 获取用户列表 """
    params = kwargs['params']
    filters = {
        Users.nick_name.like('%'+params['keyword']+'%')
    }
    data = Users().getList(filters, Users.updated_at.desc(),(),params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/admin/user/delete', methods=['GET'])
@validator(name="id", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
def adminUserDelete(*args, **kwargs):
    """ 删除用户 """
    params = kwargs['params']
    filters = {
        Users.id == params['id']
    }
    Users().delete(filters)
    return BaseController().successData()

@app.route('/api/v2/admin/user/add', methods=['POST'])
@validator(name="name", rules={'type': 'string'}, default='')
@validator(name="pwd", rules={'type': 'string'}, default='')
@UsersAuthJWT.AdminApiAuth
def adminUserAdd(*args, **kwargs):
    """ 增加用户 to do"""
  

@app.route('/api/v2/admin/user/edit', methods=['POST'])
@validator(name="id", rules={'type': 'integer'}, default='')
@validator(name="pwd", rules={'type': 'string'}, default='')
@UsersAuthJWT.AdminApiAuth
def adminUserEdit(*args, **kwargs):
    """ 修改用户密码 to do"""