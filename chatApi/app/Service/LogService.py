'''
@Author: hua
@Date: 2019-07-23 15:36:31
@description: 
@LastEditors: hua
@LastEditTime: 2019-07-24 10:00:28
'''
from app.Models.Model import HtLog
from app import dBSession
import time

class LogService:
    """ 
        日志服务层 
    """
    def add(self, data, type=1, level=1):
        """ 
        添加
        @param: string  data
        @param: integer type
        @param: integer level
        @retrun integer boolean
        """
        data = {
            'data': data,
            'type': type,
            'level': level,
            'create_time': int(time.time())
        }
        try:
            log = HtLog(**data)
            dBSession.add(log)
            dBSession.flush()
            id = log.id
            dBSession.commit()
            return id
        except  Exception as e:
            dBSession.rollback()  
            return 0
    
        
        