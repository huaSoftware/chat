'''
@Author: hua
@Date: 2019-06-17 14:14:28
@description: 基础模型，封装一些基础方法 
@LastEditors  : hua
@LastEditTime : 2019-12-30 20:01:42
'''
from app import CONST
import math
from sqlalchemy import desc, asc
from app import dBSession

class Base():

    def getList(self, cls_:object, filters:set, order:str="id desc", field:tuple=(), offset:int = 0, limit:int = 15)->dict:
        """ 
        列表
        @param object cls_ 数据库模型实体类
        @param set filters 查询条件
        @param str order 排序
        @param tuple field 字段
        @param int offset 偏移量
        @param int limit 取多少条
        @return dict
        """
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
            orderArr = order.split(' ')
            if orderArr[1] == 'desc':
                res['list'] = res['list'].order_by(desc(orderArr[0])).offset(offset).limit(limit).all()
            else:
                res['list'] = res['list'].order_by(asc(orderArr[0])).offset(offset).limit(limit).all()
        if not field:
            res['list'] = [c.to_dict() for c in res['list']]
        else:
            res['list'] = [c.to_dict(only=field) for c in res['list']]
        return res

    def getAll(self, cls_:object, filters:set, order:str = 'id desc', field:tuple = (), limit:int = 0)->list:
        """
        查询全部
        @param object cls_ 数据库模型实体类
        @param set filters 查询条件
        @param str order 排序
        @param tuple field 字段
        @param int $limit 取多少条
        @return dict
        """
        if not filters:
            res = dBSession.query(cls_)
        else:   
            res = dBSession.query(cls_).filter(*filters)
        orderArr = order.split(' ')
        if orderArr[1] == 'desc':
            res = res.order_by(desc(orderArr[0]))
        else:
            res = res.order_by(asc(orderArr[0]))
        if limit != 0:
            res = res.limit(limit).all()
        else:
            res = res.all()
        if not field:
            res = [c.to_dict() for c in res]
        else:
            res = [c.to_dict(only=field) for c in res]
        return res

    def getOne(self, cls_:object, filters:set, order:str = 'id desc', field :tuple= ()):
        """
        获取一条
        @param object cls_ 数据库模型实体类
        @param set filters 查询条件
        @param str order 排序 
        @param tuple field 字段
        @return dict
        """
        res = dBSession.query(cls_).filter(*filters)
        orderArr = order.split(' ')
        if orderArr[1] == 'desc':
            res = res.order_by(desc(orderArr[0])).first()
        else:
            res = res.order_by(asc(orderArr[0])).first()
        if res == None:
            return None
        if not field:
            res = res.to_dict() 
        else:
           res = res.to_dict(only=field) 
        return res
  
    def add(self, cls_, data:dict)->int:
        """
        添加
        @param object cls_ 数据库模型实体类
        @param dict data 数据
        @return bool
        """
        users = cls_(**data)
        dBSession.add(users)
        dBSession.flush()
        return users.id

    def edit(self, cls_:object, data:dict, filters:set)->bool:
        """
        修改
        @param object cls_ 数据库模型实体类
        @param dict data 数据
        @param set filters 条件
        @return bool
        """
        return dBSession.query(cls_).filter(*filters).update(data, synchronize_session=False)
    
    def delete(self, cls_:object, filters:set)->int:
        """
        删除
        @param object cls_ 数据库模型实体类
        @param set filters 条件
        @return int
        """
        return dBSession.query(cls_).filter(*filters).delete(synchronize_session=False)
    
    def getCount(self, cls_:object, filters:set, field = None)->int:
        """
        统计数量
        @param object cls_ 数据库模型实体类
        @param set filters 条件
        @param obj field 字段
        @return int
        """  
        if field == None:
            return dBSession.query(cls_).filter(*filters).count()
        else:
            return dBSession.query(cls_).filter(*filters).count(field)
        
    @staticmethod
    def get_page_number(count:int, page_size:int)->int:
        """ 
        * 获取总页数
        * @param int count 
        * @param int page_size
        * @return int 
        """
        page_size = abs(page_size)
        if page_size != 0:
            total_page = math.ceil(count / page_size)
        else:
            total_page = math.ceil(count / 5)
        return total_page
    
    @staticmethod
    def formatPaged(page:int, size:int, total:int)->dict:
        """ 
        * 格式化分页
        * @param int page
        * @param int size
        * @param int total
        * @return dict 
        """
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

    @staticmethod
    def formatBody(data:dict={}, msg:str='', show:bool=True)->dict:
        """ 
        * 格式化返回体
        * @param dict data
        * @param str  msg
        * @param bool show
        * @return dict
        """
        dataformat = {}
        dataformat['error_code'] = CONST['CODE']['SUCCESS']['value']
        dataformat['data'] = data
        dataformat['msg'] = msg
        dataformat['show'] = show
        return dataformat

    @staticmethod
    def formatError(code:int, message:str='', show:bool=True)->dict:
        """ 
        * 格式化错误返回体
        * @param int code
        * @param str message
        * @param bool show
        * @return dict
        """
        if code == CONST['CODE']['BAD_REQUEST']['value']:
            message = 'Bad request.'
        elif code == CONST['CODE']['NOT_FOUND']['value']:
            message = 'No result matched.'
        body = {}
        body['error'] = True
        body['error_code'] = CONST['CODE']['BAD_REQUEST']['value']
        body['msg'] = message
        body['show'] = show
        return body