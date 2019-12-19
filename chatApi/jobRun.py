'''
@Author: hua
@Date: 2019-12-19 09:01:58
@description: 
@LastEditors  : hua
@LastEditTime : 2019-12-19 09:07:09
'''
import environment
environment.init("job")
from app import sched
#开始任务
sched.start()