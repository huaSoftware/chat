'''
@Author: hua
@Date: 2019-12-03 14:46:46
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-05 13:20:34
'''
from app.Models.Users import Users
from sqlalchemy import event
import time
from app.Models.Config import Config

@event.listens_for(Users, "before_insert")
def users_before_insert(mapper, connection, target):
    target.created_at = int(time.time())
    target.updated_at = int(time.time())
    if target.head_img == '':
        default_head_img = Config().getOne({Config.type == 'img', Config.code == 'default.admin.img', Config.status == 1})['config']
        target.head_img = default_head_img

@event.listens_for(Users, "before_update")
def users_before_update(mapper, connection, target):
    target.updated_at = int(time.time())