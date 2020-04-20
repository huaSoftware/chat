'''
@Author: hua
@Date: 2019-02-26 09:54:21
@LastEditors: hua
@LastEditTime: 2020-04-20 19:20:25
'''
import time
import math
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import desc, asc
from app import dBSession
from app.Models.Base import Base
from app.Models.Model import HtRoom
from app.Vendor.Utils import Utils
import json


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

    def getList(self, filters, order, field=(), offset=0, limit=15):
        res = {}
        res['page'] = {}
        res['page']['count'] = dBSession.query(Room).filter(*filters).count()
        res['list'] = []
        res['page']['total_page'] = self.get_page_number(
            res['page']['count'], limit)
        res['page']['current_page'] = offset
        if offset != 0:
            offset = (offset - 1) * limit

        if res['page']['count'] > 0:
            res['list'] = dBSession.query(Room).filter(*filters)
            order = order.split(' ')
            if order[1] == 'desc':
                res['list'] = res['list'].order_by(
                    desc(order[0])).offset(offset).limit(limit).all()
            else:
                res['list'] = res['list'].order_by(
                    asc(order[0])).offset(offset).limit(limit).all()
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

    def getAll(self, filters, order, field=(), limit=0):
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

    def getOne(self, filters, order='id desc', field=()):
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

    def edit(self, data, filters):
        dBSession.query(Room).filter(
            *filters).update(data, synchronize_session=False)
        return True

    """
        删除
        @paramset filters 条件
        @return bool
    """

    def delete(self, filters):
        dBSession.query(Room).filter(
            *filters).delete(synchronize_session=False)
        return True

    """
        统计数量
        @param set filters 条件
        @param obj field 字段
        @return int
    """

    def getCount(self, filters, field=None):
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
        return dBSession.query(Room).filter(*filter).first()

    # 添加房间记录
    @staticmethod
    def insertRoomData(message):
        room_data = Room(
            room_uuid=message['room_uuid'],
            last_msg=message['last_msg'],
            type=message['type'],
            name='',
            user_id=message['user_id']
        )
        # 实例化后orm添加
        status = room_data.add(room_data)
        if status == False:
            return False
        return True

    # 添加房间记录
    @staticmethod
    def insertAdminRoomData(message):
        room_data = Room(
            room_uuid=message['room_uuid'],
            last_msg=message['last_msg'],
            type=message['type'],
            name=message['name'],
            user_id=message['user_id']
        )
        # 实例化后orm添加
        status = room_data.add(room_data)
        if status == False:
            return False
        return True

    # 更新房间记录
    @staticmethod
    def updateLastMsgRoom(room_uuid, data, updated_at):
        dBSession.query(Room).filter(Room.room_uuid == room_uuid).update({
            'last_msg': json.dumps(data),
            'updated_at': updated_at,
        })
        return True

    # 获取一周数据
    def getWeekData(self):
        result = []
        dataList = Utils.db_t_d(dBSession.execute(
            "SELECT count(*) as c, date_format(from_unixtime(created_at),'%Y-%m-%d') as d  FROM ht_room WHERE YEARWEEK(date_format(from_unixtime(created_at),'%Y-%m-%d'),1) = YEARWEEK(now(),1) GROUP BY date_format(from_unixtime(created_at),'%Y-%m-%d');").fetchall())
        week_list = Utils.getWeekList()
        for i, week in enumerate(week_list):
            for data in dataList:
                if data['d'] == week:
                    result.append(data['c'])
                    dataList.remove(data)
                    break
            if (len(result)) <= i:
                result.append(0)
        return result
