'''
@Author: hua
@Date: 2019-12-12 15:04:35
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-13 09:12:05
'''
# coding: utf8
"""Delay Queue"""
import json, time, uuid, redis
class DelayQueue(object):
    """延迟队列"""
    QUEUE_KEY = 'delay_queue'
    DATA_PREFIX = 'queue_data'
    def __init__(self, host:str, port:int, password:str):
        """ 初始化redis """
        self.client = redis.Redis(host=host, port=port, password=password)
        
    def product(self, data:dict, t:int)->bool:
        """生产数据
        :param data: 数据体
        :param t: 延迟时间
        """
        # 唯一ID
        task_id = str(uuid.uuid4())
        data_key = '{}_{}'.format(self.DATA_PREFIX, task_id)
        # save string
        self.client.set(data_key, json.dumps(data))
        #计算延迟时间
        delay_time = int(time.time())+t
        self.client.zadd(self.QUEUE_KEY, {data_key:delay_time})
        return True
      
        
    def consumer(self, num:int=5)->list:
        """消费多条数据
        :param num: 消费多少个
        """
        until_ts = int(time.time()) 
        task_ids = self.client.zrangebyscore(
            self.QUEUE_KEY, 0, until_ts, start=0, num=num)
        if not task_ids:
            return []
        # 利用删除的原子性,防止并发获取重复数据
        pipe = self.client.pipeline()
        for task_id in task_ids:
            pipe.zrem(self.QUEUE_KEY, task_id)
        data_keys = [
            data_key
            for data_key, flag in zip(task_ids, pipe.execute())
            if flag
        ]
        if not data_keys:
            return []
        # load data
        data = [
            json.loads(item)
            for item in self.client.mget(data_keys)
        ]
        # delete string key
        self.client.delete(*data_keys)
        return data

#定义数据结构
""" class Struct:
    action:str
    id:str  """


#实例化延迟队列
""" delayQueue = DelayQueue(host='', port=1, password='')

#实例化结构
struct = Struct()
struct.id = "1"
struct.action = "1" 
#往队列内存入数据
delayQueue.product(struct.__dict__,10)
delayQueue.product(struct.__dict__,10)
#消费队列内数据
print(delayQueue.consumer()) """