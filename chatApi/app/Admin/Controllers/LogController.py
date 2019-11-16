'''
@Author: hua
@Date: 2019-10-08 14:54:03
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-16 15:55:37
'''
from app import app
from app.Models.Log import Log
from app.Vendor.Decorator import validator
from app.Admin.Controllers.BaseController import BaseController
from app.Vendor.UsersAuthJWT import UsersAuthJWT


@app.route('/api/v2/admin/log/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="type", rules={'required': False, 'type': 'string'})
@validator(name="level", rules={'required': False, 'type': 'string'})
@validator(name="orderBy", rules={'type': 'string'}, default='create_time')
@validator(name="order", rules={'type': 'string'}, default='desc')
@UsersAuthJWT.AdminApiAuth
def logList(*args, **kwargs):
    """ 获取房间列表 """
    params = kwargs['params']
    filters = set()
    if 'type' in params.keys():
        filters.add(Log.type.like('%'+params['type']+'%'))
    if 'level' in params.keys():
        filters.add(Log.level.like('%'+params['level']+'%'))
    data = Log().getList(filters, params['orderBy']+" "+params['order'],(),params['page_no'], params['per_page'])
    return BaseController().successData(data)