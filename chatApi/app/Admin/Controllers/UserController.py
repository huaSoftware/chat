'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
@LastEditors: hua
@LastEditTime: 2020-04-20 14:48:56
'''
from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController
from app.Vendor.Decorator import transaction
from app.Models.Users import Users


@app.route('/api/v2/admin/user/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="keyword", rules={'type': 'string'})
@validator(name="orderBy", rules={'type': 'string'}, default='updated_at')
@validator(name="order", rules={'type': 'string'}, default='desc')
@UsersAuthJWT.AdminApiAuth
def adminUserList(*args, **kwargs):
    """ 获取用户列表 """
    params = kwargs['params']
    if params['keyword'] != '':
        filters = {
            Users.nick_name.like('%'+params['keyword']+'%')
        }
    else:
        filters = set()
    data = Users().getList(filters,
                           params['orderBy']+" "+params['order'], (), params['page_no'], params['per_page'])
    return BaseController().successData(data)


@app.route('/api/v2/admin/user/delete', methods=['GET'])
@validator(name="id", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
@transaction
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
@transaction
def adminUserAdd(*args, **kwargs):
    """ 增加用户 to do"""


@app.route('/api/v2/admin/user/edit', methods=['POST'])
@validator(name="id", rules={'type': 'integer'}, default='')
@validator(name="pwd", rules={'type': 'string'}, default='')
@UsersAuthJWT.AdminApiAuth
@transaction
def adminUserEdit(*args, **kwargs):
    """ 修改用户密码 to do"""
