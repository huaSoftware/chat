'''
@Author: hua
@Date: 2019-06-11 14:59:11
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-21 14:52:41
'''
from app import app
from app.Vendor.Decorator import validator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController
from app.Vendor.Decorator import transaction
from app.Models.Room import Room
from app.Models.UserRoomRelation import UserRoomRelation
from app.Models.Msg import Msg
from app.Vendor.Utils import Utils

@app.route('/api/v2/admin/room/list', methods=['POST'])
@validator(name="page_no", rules={'type': 'integer'}, default=0)
@validator(name="per_page", rules={'type': 'integer'}, default=15)
@validator(name="keyword", rules={'type': 'string'})
@validator(name="orderBy", rules={'type': 'string'}, default='updated_at')
@validator(name="order", rules={'type': 'string'}, default='desc')
@UsersAuthJWT.AdminApiAuth
def adminRoomList(*args, **kwargs):
    """ 获取房间列表 """
    params = kwargs['params']
    filters = {
        Room.name.like('%'+params['keyword']+'%')
    }
    data = Room().getList(filters, params['orderBy']+" "+params['order'], (), params['page_no'], params['per_page'])
    return BaseController().successData(data)

@app.route('/api/v2/admin/room/delete', methods=['GET'])
@validator(name="room_uuid", rules={'type': 'string'}, default=0)
@UsersAuthJWT.AdminApiAuth
@transaction
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

@app.route('/api/v2/admin/msg/get', methods=['POST'])
@validator(name='room_uuid', rules={'required': True, 'type': 'string'})
@validator(name='page_no', rules={'required': True, 'type': 'integer'})
@validator(name='per_page', rules={'required': True, 'type': 'integer'})
@UsersAuthJWT.AdminApiAuth
def getMsg(params, user_info):
    """
    查询聊天数据
    :param dict user_info
    :param dict params
    :return dict
    """
    filters = {
        Msg.room_uuid == params['room_uuid']
    }
    data = Msg().getList(filters, Msg.created_at.desc(), (), params['page_no'], params['per_page'])
    """ def format(x):
        x['msg'] = json.loads(x['msg'])
        return x
    data['list'] = list(map(format, data['list'])) """
    return Utils.formatBody(data)

