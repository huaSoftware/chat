'''
@Author: hua
@Date: 2019-02-26 09:54:21
@LastEditors: hua
@LastEditTime: 2019-06-11 20:45:17
'''
import time, math

from sqlalchemy import and_, or_
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import desc, asc
from app import dBSession
from app.Models.Base import Base
from app.Models.Users import Users
from app.Models.Model import HtRoom
from app.Vendor.Decorator import transaction, classTransaction
from app.Vendor.Utils import Utils


class Room(Base, HtRoom, SerializerMixin):
    """ 
        列表
        @param set filters 查询条件
        @param obj order 排序
        @param tuple field 字段
        @param int offset 偏移量
        @param int limit 取多少条
        @return dict
    """
    def getList(self, filters, order, field=(), offset = 0, limit = 15):
        res = {}
        res['page'] ={}
        res['page']['count'] = dBSession.query(Room).filter(*filters).count()
        res['list'] = []
        res['page']['total_page'] = self.get_page_number(res['page']['count'], limit)
        res['page']['current_page'] = offset
        if offset != 0:
            offset = (offset - 1) * limit

        if res['page']['count'] > 0:
            res['list'] = dBSession.query(Room).filter(*filters)
            res['list'] = res['list'].order_by(order).offset(offset).limit(limit).all()
        if not field:
            res['list'] = [c.to_dict() for c in res['list']]
        else:
            res['list'] = [c.to_dict(only=field) for c in res['list']]
        return res

    """
        查询全部
        @param set filters 查询条件
        @param obj order 排序
        @param tuple field 字段
        @param int $limit 取多少条
        @return dict
    """
    def getAll(self, filters, order, field = (), limit = 0):
        if not filters:
            res = dBSession.query(Room)
        else:   
            res = dBSession.query(Room).filter(*filters)
        if limit != 0:
            res = res.limit(limit)
        order = order.split(' ')
        if order[1] == 'desc':
            res = res.order_by(desc(order[0])).all()
        else:
            res = res.order_by(asc(order[0])).all()
        if not field:
            res = [c.to_dict() for c in res]
        else:
            res = [c.to_dict(only=field) for c in res]
        return res


    
    """
        获取一条
        @param set filters 查询条件
        @param obj order 排序
        @param tuple field 字段
        @return dict
    """
    def getOne(self, filters, order = 'id desc', field = ()):
        res = dBSession.query(Room).filter(*filters)
        order = order.split(' ')
        if order[1] == 'desc':
            res = res.order_by(desc(order[0])).first()
        else:
            res = res.order_by(asc(order[0])).first()
        if res == None:
            return None
        if not field:
            res = res.to_dict()
        else:
           res = res.to_dict(only=field) 
        return res
  
    """
        添加
        @param obj data 数据
        @return bool
    """
    @classTransaction
    def addByClass(self, data):
        room = Room(**data)
        dBSession.add(room)
        dBSession.flush()
        return room.id

    
    """
        修改
        @param dict data 数据
        @param set filters 条件
        @return bool
    """
    @classTransaction
    def edit(self, data, filters):
        dBSession.query(Room).filter(*filters).update(data, synchronize_session=False)
        return True
    
    """
        删除
        @paramset filters 条件
        @return bool
    """
    @classTransaction
    def delete(self, filters):
        dBSession.query(Room).filter(*filters).delete(synchronize_session=False)
        return True
    
    """
        统计数量
        @param set filters 条件
        @param obj field 字段
        @return int
    """  
    def getCount(self, filters, field = None):
        if field == None:
            return dBSession.query(Room).filter(*filters).count()
        else:
            return dBSession.query(Room).filter(*filters).count(field)
        
    @staticmethod
    def get_page_number(count, page_size):
        count = float(count)
        page_size = abs(page_size)
        if page_size != 0:
            total_page = math.ceil(count / page_size)
        else:
            total_page = math.ceil(count / 5)
        return total_page
    
    """ 转服务层 """

    # 增加房间
    @staticmethod
    @transaction
    def add(room_data):
        dBSession.add(room_data)
        return True

    @staticmethod
    def get(room_uuid):
        return dBSession.query(Room).filter(Room.room_uuid == room_uuid).first()

    @staticmethod
    def filters(message):
        filter = {
            Room.focused_user_id == message['focused_user_id']
        }
        return  dBSession.query(Room).filter(*filter).first()

    @staticmethod
    def getCount(room_uuid):
        return  dBSession.query(Room).filter(Room.room_uuid == room_uuid).count()

    @staticmethod
    def getAll():
        return  dBSession.query(Room).order_by(Room.created_at.desc()).all()


    #添加房间记录
    @staticmethod
    @classTransaction
    def insertRoomData(message):
        room_data = Room(
            room_uuid          = message['room_uuid'],
            last_msg           = message['last_msg'],
            type               = 0,
            name               = '',
            updated_at         = time.time(),
            created_at         = time.time()
        )
        #实例化后orm添加
        status = room_data.add(room_data)
        if status == False:
            return False
        return True

    #更新房间记录
    @staticmethod
    @classTransaction
    def updateLastMsgRoom(room_uuid, msg):
        dBSession.query(Room).filter(Room.room_uuid == room_uuid).update({
            'last_msg':    msg,
            'updated_at': time.time()
        })
        return True
