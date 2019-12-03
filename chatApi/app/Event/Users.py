'''
@Author: hua
@Date: 2019-12-03 14:46:46
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:20:33
'''
from app.Models.Users import Users
from sqlalchemy import event
import time

@event.listens_for(Users, "before_insert")
def users_before_insert(mapper, connection, target):
    target.created_at = int(time.time())
    target.updated_at = int(time.time())

@event.listens_for(Users, "before_update")
def users_before_update(mapper, connection, target):
    target.updated_at = int(time.time())