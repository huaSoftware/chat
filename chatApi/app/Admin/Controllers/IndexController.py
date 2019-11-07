'''
@Author: hua
@Date: 2019-07-01 20:34:43
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-07 16:24:03
'''
from app import app
from app.Models.Admin import Admin
from app.Models.Users import Users
from app.Models.Room import Room
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Admin.Controllers.BaseController import BaseController

@app.route('/api/v2/admin/index', methods=['GET'])
@UsersAuthJWT.AdminApiAuth
def adminIndex(user_info):
    #获取管理用户总数
    admins = Admin().getCount({})
    #获取注册用户总数
    users = Users().getCount({})
    #获取房间总数
    rooms = Room().getCount({})
    #一周管理用户注册数量
    weekAdminData = Admin().getWeekData()
    #一周注册用户注册数量
    weekUsersData = Users().getWeekData()
    #一周房间总数
    weekRoomData = Room().getWeekData()
    data = {
        'panelGroupData':{
            'adminCount': admins,
            'usersCount': users,
            'roomCount': rooms
        },
        'weekAdminData': weekAdminData,
        'weekUsersData': weekUsersData,
        'weekRoomData': weekRoomData
    }
    return BaseController().successData(data)