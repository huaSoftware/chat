'''
@Author: hua
@Date: 2019-12-03 14:44:23
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:18:00
'''
from app.Models.Admin import Admin
from sqlalchemy import event
import time

@event.listens_for(Admin, "before_insert")
def admin_before_insert(mapper, connection, target):
    target.add_time = int(time.time())
    target.update_time = int(time.time())

@event.listens_for(Admin, "before_update")
def admin_before_update(mapper, connection, target):
    target.update_time = int(time.time())