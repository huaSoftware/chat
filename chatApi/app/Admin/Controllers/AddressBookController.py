'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
LastEditors: hua
LastEditTime: 2020-08-31 20:03:09
'''
from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController
from app.Models.AddressBook import AddressBook
from app.Vendor.Decorator import transaction
from app.Models.Users import Users
from sqlalchemy import or_

@app.route('/api/v2/admin/addressBook/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="orderBy", rules={'type': 'string'}, default='updated_at')
@validator(name="order", rules={'type': 'string'}, default='desc')
@UsersAuthJWT.AdminApiAuth
def adminAddressBookList(*args, **kwargs):
    """ 获取通讯录列表 """
    params = kwargs['params']
    filters = {
        or_(Users.nick_name.like('%'+params['keyword']+'%'),AddressBook.room_uuid.like('%'+params['keyword']+'%'))
    }
    data = AddressBook().getListByGroup(filters, params['orderBy']+" "+params['order'], AddressBook.id,(),params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/admin/addressBook/delete', methods=['GET'])
@validator(name="id", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
@transaction
def adminAddressBookDelete(*args, **kwargs):
    """ 删除通讯录 """
    params = kwargs['params']
    filters = {
        AddressBook.id == params['id']
    }
    AddressBook().delete(filters)
    return BaseController().successData()

