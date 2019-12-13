'''
@Author: hua
@Date: 2019-12-12 14:03:17
@description:  https://www.cnblogs.com/luxiaojun/p/6567132.html
@LastEditors: hua
@LastEditTime: 2019-12-13 13:24:09
'''
from app import sched, delayQueue, socketio
import time
from app.Vendor.Utils import Utils
#循环执行
@sched.scheduled_job('interval', seconds=5)
def interval_job():
    #获取任务
  """   d_list = delayQueue.consumer()
    for item in d_list:
        if item["action"] == 'invite':
            socketio.emit('beg', Utils.formatBody(item), namespace='/api', room='@broadcast.'+str(item["id"])) """