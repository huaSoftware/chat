'''
@Author: hua
@Date: 2019-11-21 16:51:53
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-21 17:06:55
'''


from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Models.Config import Config
from app.Admin.Controllers.BaseController import BaseController
from app.Vendor.Decorator import transaction
from app.Vendor.Code import Code

@app.route('/api/v2/config/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="orderBy", rules={'type': 'string'}, default='updated_at')
@validator(name="order", rules={'type': 'string'}, default='desc')
@UsersAuthJWT.AdminApiAuth
def configList(*args, **kwargs):
    """ 获取配置列表 """
    params = kwargs['params']
    data = Config().getList({},params['orderBy']+" "+params['order'],(),params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/config/delete', methods=['GET'])
@validator(name="id", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
@transaction
def configDelete(*args, **kwargs):
    """ 删除配置 """
    params = kwargs['params']
    filters = {
        Config.id == params['id']
    }
    Config().delete(filters)
    return BaseController().successData()

@app.route('/api/v2/config/add', methods=['POST'])
@validator(name="name", rules={'type': 'string'}, default='')
@validator(name="type", rules={'type': 'string'}, default='')
@validator(name="description", rules={'type': 'string'}, default='')
@validator(name="code", rules={'type': 'string'}, default='')
@validator(name="config", rules={'type': 'string'}, default='')
@validator(name="status", rules={'type': 'integer'}, default=0)
@UsersAuthJWT.AdminApiAuth
def configAdd(*args, **kwargs):
    """ 增加配置 """
    params = kwargs['params']
    data = Config().addByClass(params)
    if data['error_code'] != Code.SUCCESS:
        return BaseController().json(data)
    return BaseController().successData()

@app.route('/api/v2/config/edit', methods=['POST'])
@validator(name="id", rules={'type': 'string'}, default=0)
@validator(name="name", rules={'type': 'string'}, default='')
@validator(name="type", rules={'type': 'string'}, default='')
@validator(name="description", rules={'type': 'string'}, default='')
@validator(name="code", rules={'type': 'string'}, default='')
@validator(name="config", rules={'type': 'string'}, default='')
@validator(name="status", rules={'type': 'integer'}, default=0)
@UsersAuthJWT.AdminApiAuth
@transaction
def configEdit(*args, **kwargs):
    """ 修改配置 """
    params = kwargs['params']
    filters = {
        Config.id == params['id']
    }
    Config().edit(params, filters)
    return BaseController().successData()