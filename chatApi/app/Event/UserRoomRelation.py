'''
@Author: hua
@Date: 2019-12-03 14:45:48
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:20:13
'''
from app.Models.UserRoomRelation import UserRoomRelation
from sqlalchemy import event
import time

@event.listens_for(UserRoomRelation, "before_insert")
def user_room_relation_before_insert(mapper, connection, target):
    target.created_at = int(time.time())
    target.updated_at = int(time.time())

@event.listens_for(UserRoomRelation, "before_update")
def user_room_relation_before_update(mapper, connection, target):
    target.updated_at = int(time.time())