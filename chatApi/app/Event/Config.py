'''
@Author: hua
@Date: 2019-12-03 14:44:23
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:18:24
'''
from app.Models.Config import Config
from sqlalchemy import event
import time

@event.listens_for(Config, "before_insert")
def config_before_insert(mapper, connection, target):
    target.created_at = int(time.time())
    target.updated_at = int(time.time())

@event.listens_for(Config, "before_update")
def config_before_update(mapper, connection, target):
    target.updated_at = int(time.time())