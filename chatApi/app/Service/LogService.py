'''
@Author: hua
@Date: 2019-07-23 15:36:31
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-07 13:29:46
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
        @param: int type
        @param: int level
        @retrun int boolean
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
            #dBSession.flush()
            dBSession.commit()
            id = log.id
            return id
        except  Exception as e:
            dBSession.rollback()  
            return 0

    
        
        