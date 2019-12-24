'''
@Author: hua
@Date: 2019-12-03 14:44:23
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:19:39
'''
from app.Models.Room import Room
from sqlalchemy import event
import time

@event.listens_for(Room, "before_insert")
def room_before_insert(mapper, connection, target):
    target.created_at = int(time.time())
    target.updated_at = int(time.time())

@event.listens_for(Room, "before_update")
def room_before_update(mapper, connection, target):
    target.updated_at = int(time.time())