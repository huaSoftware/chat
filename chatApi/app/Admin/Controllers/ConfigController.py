'''
@Author: hua
@Date: 2019-11-21 16:51:53
@description: 
@LastEditors  : hua
@LastEditTime : 2020-01-19 15:15:32
'''


from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Models.Config import Config
from app.Admin.Controllers.BaseController import BaseController
from app.Vendor.Decorator import transaction
import json, os

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
@transaction
def configAdd(*args, **kwargs):
    """ 增加配置 """
    params = kwargs['params']
    id = Config().addByClass(params)
    if id:
        return BaseController().successData({'id':id})
    return BaseController().error()

@app.route('/api/v2/config/edit', methods=['POST'])
@validator(name="id", rules={'type': 'integer'}, default=0)
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

@app.route('/api/v2/configConstJson', methods=['POST'])
@UsersAuthJWT.AdminApiAuth
def configConstJson(*args, **kwargs):
    """ 获取JSON配置列表 """
    with open(os.getcwd()+'/app/const.json', "rb") as f:
        CONST = json.loads(f.read(), encoding='utf-8')
    return BaseController().successData(CONST)

@app.route('/api/v2/configConstJson/edit', methods=['POST'])
@validator(name="ADDFRIEND",rules={'required': True})
@validator(name="CHAT",rules={'required': True})
@validator(name="CODE",rules={'required': True})
@validator(name="LOG",rules={'required': True})
@validator(name="ROOM",rules={'required': True})
@validator(name="SAVE",rules={'required': True})
@validator(name="STATUS",rules={'required': True})
@validator(name="TIME",rules={'required': True})
@UsersAuthJWT.AdminApiAuth
def configConstJsonEdit(*args, **kwargs):
    params = kwargs['params']
    """ 修改JSON配置列表 """
    with open(os.getcwd()+'/app/const.json', "w", encoding='utf-8') as f:
        f.write(json.dumps(params,ensure_ascii=False))
    return BaseController().successData("修改成功")