'''
@Author: hua
@Date: 2019-12-03 14:44:23
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:02:10
'''
from app.Models.Msg import Msg
from sqlalchemy import event
import time

@event.listens_for(Msg, "before_insert")
def msg_before_insert(mapper, connection, target):
    target.created_at = int(time.time())