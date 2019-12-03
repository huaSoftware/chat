'''
@Author: hua
@Date: 2019-07-23 15:36:31
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-03 15:12:46
'''
from app.Models.Model import HtLog
from app import dBSession
import time
class LogService:
    """ 
        日志服务层 
    """
    def add(self, data:str, type:int=1, level:int=1)->int:
        """ 
        添加
        @param: string  data
        @param: int type
        @param: int level
        @retrun int boolean
        """
        insertData = {
            'data': data,
            'type': type,
            'level': level
        }
        try:
            log = HtLog(**insertData)
            dBSession.add(log)
            #dBSession.flush()
            dBSession.commit()
            id = log.id
            return id
        except  Exception as e:
            dBSession.rollback()  
            return 0

    @staticmethod
    def clientAdd(data:dict)->int:
        """ 
        客户端添加日志
        @param: string  data
        @retrun int boolean
        """
        insertData = {
            'data': data['data'],
            'type': data['type'],
            'level': data['level']
        }
        try:
            log = HtLog(**insertData)
            dBSession.add(log)
            dBSession.commit()
            id = log.id
            return id
        except  Exception as e:
            dBSession.rollback()  
            return 0