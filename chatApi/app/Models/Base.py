'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2019-10-29 20:17:25
'''
''' author:hua
    date:2018.2.6
    基础模型，封装一些基础方法 
'''
import logging, math
from app.Vendor.Code import Code
from sqlalchemy import desc, asc
from app import dBSession

class Base():

    """ 
        列表
        @param object cls_ 数据库模型实体类
        @param set filters 查询条件
        @param obj order 排序
        @param tuple field 字段
        @param int offset 偏移量
        @param int limit 取多少条
        @return dict
    """
    def getList(self, cls_, filters, order, field=(), offset = 0, limit = 15):
        res = {}
        res['page'] ={}
        res['page']['count'] = dBSession.query(cls_).filter(*filters).count()
        res['list'] = []
        res['page']['total_page'] = self.get_page_number(res['page']['count'], limit)
        res['page']['current_page'] = offset
        if offset != 0:
            offset = (offset - 1) * limit

        if res['page']['count'] > 0:
            res['list'] = dBSession.query(cls_).filter(*filters)
            res['list'] = res['list'].order_by(order).offset(offset).limit(limit).all()
        if not field:
            res['list'] = [c.to_dict() for c in res['list']]
        else:
            res['list'] = [c.to_dict(only=field) for c in res['list']]
        return res

    """
        查询全部
        @param object cls_ 数据库模型实体类
        @param set filters 查询条件
        @param obj order 排序
        @param tuple field 字段
        @param int $limit 取多少条
        @return dict
    """
    def getAll(self, cls_, filters, order = 'id desc', field = (), limit = 0):
        if not filters:
            res = dBSession.query(cls_)
        else:   
            res = dBSession.query(cls_).filter(*filters)
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
        @param object cls_ 数据库模型实体类
        @param set filters 查询条件
        @param obj order 排序
        @param tuple field 字段
        @return dict
    """
    def getOne(self, cls_, filters, order = 'id desc', field = ()):
        res = dBSession.query(cls_).filter(*filters)
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
        @param object cls_ 数据库模型实体类
        @param obj data 数据
        @return bool
    """
    def add(self, cls_, data):
        users = cls_(**data)
        dBSession.add(users)
        dBSession.flush()
        return users.id

    """
        修改
        @param object cls_ 数据库模型实体类
        @param dict data 数据
        @param set filters 条件
        @return bool
    """
    def edit(self, cls_, data, filters):
        dBSession.query(cls_).filter(*filters).update(data, synchronize_session=False)
        return True
    
    """
        删除
        @param object cls_ 数据库模型实体类
        @paramset filters 条件
        @return bool
    """
    def delete(self, cls_, filters):
        dBSession.query(cls_).filter(*filters).delete(synchronize_session=False)
        return True
    
    """
        统计数量
        @param object cls_ 数据库模型实体类
        @param set filters 条件
        @param obj field 字段
        @return int
    """  
    def getCount(self, cls_, filters, field = None):
        if field == None:
            return dBSession.query(cls_).filter(*filters).count()
        else:
            return dBSession.query(cls_).filter(*filters).count(field)
        
    @staticmethod
    def get_page_number(count, page_size):
        count = float(count)
        page_size = abs(page_size)
        if page_size != 0:
            total_page = math.ceil(count / page_size)
        else:
            total_page = math.ceil(count / 5)
        return total_page
    
    """ 
    * 格式化分页
    * @param int page
    * @param int size
    * @param int total
    * @return dict 
    """
    @staticmethod
    def formatPaged(page, size, total):
        if int(total) > int(page) * int(size):
            more = 1
        else:
            more = 0
        return {
            'total': int(total),
            'page': int(page),
            'size': int(size),
            'more': more
        }

    """ 
    * 格式化返回体
    * @param dict data
    * @return dict
    """
    @staticmethod
    def formatBody(data={}, msg='', show=True):
        dataformat = {}
        dataformat['error_code'] = Code.SUCCESS
        dataformat['data'] = data
        dataformat['msg'] = msg
        dataformat['show'] = show
        return dataformat

    """ 
    * 格式化错误返回体
    * @param int code
    * @param string message
    * @return dict
    """
    @staticmethod
    def formatError(code, message='', show=True):
        if code == Code.BAD_REQUEST:
            message = 'Bad request.'
        elif code == Code.NOT_FOUND:
            message = 'No result matched.'
        body = {}
        body['error'] = True
        body['error_code'] = Code.BAD_REQUEST
        body['msg'] = message
        body['show'] = show
        return body




