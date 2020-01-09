'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors  : hua
@LastEditTime : 2020-01-09 20:49:26
'''
import math
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import desc, asc
from werkzeug.security import check_password_hash, generate_password_hash
from app.Models.Base import Base
from app.Models.Model import HtUser
from app.Vendor.Utils import Utils
from app import dBSession


class Users(Base, HtUser, SerializerMixin):
    serialize_rules = ('-password',)
 
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
        res['page']['count'] = dBSession.query(Users).filter(*filters).count()
        res['list'] = []
        res['page']['total_page'] = self.get_page_number(res['page']['count'], limit)
        res['page']['current_page'] = offset
        if offset != 0:
            offset = (offset - 1) * limit
        if res['page']['count'] > 0:
            res['list'] = dBSession.query(Users).filter(*filters)
            order = order.split(' ')
            if order[1] == 'desc':
                res['list'] = res['list'].order_by(desc(order[0])).offset(offset).limit(limit).all()
            else:
                res['list'] = res['list'].order_by(asc(order[0])).offset(offset).limit(limit).all()
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
            res = dBSession.query(Users)
        else:   
            res = dBSession.query(Users).filter(*filters)
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
        res = dBSession.query(Users).filter(*filters)
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
        users = Users(**data)
        dBSession.add(users)
        dBSession.flush()
        return users.id

    """
        修改
        @param dict data 数据
        @param set filters 条件
        @return bool
    """
    def edit(self, data, filters):
        dBSession.query(Users).filter(*filters).update(data, synchronize_session=False)
        return True
    
    """
        删除
        @paramset filters 条件
        @return bool
    """
    def delete(self, filters):
        dBSession.query(Users).filter(*filters).delete(synchronize_session=False)
        return True
    
    """
        统计数量
        @param set filters 条件
        @param obj field 字段
        @return int
    """  
    def getCount(self, filters, field = None):
        if field == None:
            return dBSession.query(Users).filter(*filters).count()
        else:
            return dBSession.query(Users).filter(*filters).count(field)
        
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

    #设置密码
    @staticmethod
    def set_password(password):
        return generate_password_hash(password)

    #校验密码
    @staticmethod
    def check_password(hash_password, password):
        return check_password_hash(hash_password, password)
    
    #获取一周数据
    def getWeekData(self):
        result = []
        dataList = Utils.db_t_d(dBSession.execute("SELECT count(id) as c, date_format(from_unixtime(created_at),'%Y-%m-%d') as d FROM ht_users WHERE YEARWEEK(date_format(from_unixtime(created_at),'%Y-%m-%d'),1) = YEARWEEK(now(),1) GROUP BY date_format(from_unixtime(created_at),'%Y-%m-%d');").fetchall())
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
