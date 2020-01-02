'''
@Author: hua
@Date: 2019-07-25 14:22:49
@description: 
@LastEditors  : hua
@LastEditTime : 2019-12-30 19:59:08
'''
'''
@Author: hua
@Date: 2019-07-25 14:22:49
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-21 16:42:18
'''
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import desc, asc
from sqlalchemy import update
from app.Models.Base import Base
from app.Models.Model import HtMsg
from app import dBSession
import math,json

class Msg(Base, HtMsg, SerializerMixin):
    serialize_rules =('msg', 'formatMsg')    

    def formatMsg(self):
        return json.loads(super().msg)
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
        res['page']['count'] = dBSession.query(Msg).filter(*filters).count()
        res['list'] = []
        res['page']['total_page'] = self.get_page_number(res['page']['count'], limit)
        res['page']['current_page'] = offset
        if offset != 0:
            offset = (offset - 1) * limit

        if res['page']['count'] > 0:
            res['list'] = dBSession.query(Msg).filter(*filters)
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
    def getAll(self, filters, order = 'id desc', field = (), limit = 0):
        if not filters:
            res = dBSession.query(Msg)
        else:   
            res = dBSession.query(Msg).filter(*filters)
        order = order.split(' ')
        if order[1] == 'desc':
            res = res.order_by(desc(order[0]))
        else:
            res = res.order_by(asc(order[0]))
        if limit != 0:
            res = res.limit(limit).all()
        else:
            res = res.all()
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
        res = dBSession.query(Msg).filter(*filters)
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
    def add(self, data):
        msg = Msg(**data)
        dBSession.add(msg)
        dBSession.flush()
        return msg.id

    """
        修改
        @param dict data 数据
        @param set filters 条件
        @return bool
    """
    def edit(self, data, filters):
        dBSession.query(Msg).filter(*filters).update(data, synchronize_session=False)
        return True
    
    """
        修改前十条数据
        @param dict data 数据
        @param set filters 条件
        @return bool
    """
    def editByLimit(self, data, filters, limit):
        ids = [ i['id'] for i in self.getAll(filters, 'created_at desc', ("id", ), 10)]
        dBSession.query(Msg).filter(Msg.id.in_(ids)).update(data, synchronize_session=False)
        ''' dBSession.execute('update `ht_msg` set `read_status` = 0 order by created_at desc limit 10;') '''
        return True
    
    """
        删除
        @paramset filters 条件
        @return bool
    """
    def delete(self, filters):
        dBSession.query(Msg).filter(*filters).delete(synchronize_session=False)
        return True
    
    """
        统计数量
        @param set filters 条件
        @param obj field 字段
        @return int
    """  
    def getCount(self, filters, field = None):
        if field == None:
            return dBSession.query(Msg).filter(*filters).count()
        else:
            return dBSession.query(Msg).filter(*filters).count(field)
        
    @staticmethod
    def get_page_number(count, page_size):
        count = float(count)
        page_size = abs(page_size)
        if page_size != 0:
            total_page = math.ceil(count / page_size)
        else:
            total_page = math.ceil(count / 5)
        return total_page