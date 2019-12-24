'''
@Author: hua
@Date: 2019-12-12 13:46:55
@description: https://www.cnblogs.com/luxiaojun/p/6567132.html
@LastEditors: hua
@LastEditTime: 2019-12-12 14:04:44
'''
from app import sched
import time
#循环执行
""" @sched.scheduled_job('cron', second=5)
def cron_job():
    print("<cron_job>"+time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))) """