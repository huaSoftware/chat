'''
@Author: hua
@Date: 2019-12-03 14:44:44
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:17:20
'''
from app.Models.AddressBook import AddressBook
from sqlalchemy import event
import time

@event.listens_for(AddressBook, "before_insert")
def addressBook_before_insert(mapper, connection, target):
    target.created_at = int(time.time())
    target.updated_at = int(time.time())

@event.listens_for(AddressBook, "before_update")
def addressBook_before_update(mapper, connection, target):
    target.updated_at = int(time.time())