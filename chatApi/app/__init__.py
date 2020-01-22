'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors  : hua
@LastEditTime : 2020-01-21 20:30:10
'''
from flask import Flask
from apscheduler.schedulers.blocking import BlockingScheduler# type: ignore
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from flask_socketio import SocketIO
from app.Vendor.DelayQueue import DelayQueue
from cacheout import Cache
import environment as e
from app.env import (SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, UPLOAD_FOLDER, MAX_CONTENT_LENGTH,REDIS_PAS, REDIS_IP, REDIS_PORT, REDIS_DB)
import os, time, json

environment = e.read()
app = Flask(__name__,static_folder=os.getcwd()+'/uploads')
# 动态设置全局常量
with open(os.getcwd()+'/app/const.json', "rb") as f:
    CONST = json.loads(f.read(), encoding='utf-8')
cache = Cache(maxsize=2560, ttl=86400, timer=time.time, default=None)  # defaults
# 实例化websocket
async_mode = 'gevent'
socketio = SocketIO(app, async_mode=async_mode, logger=True, engineio_logger=True,cors_allowed_origins="*")#message_queue="redis://:{}@{}:{}/{}".format(REDIS_PAS,REDIS_IP,REDIS_PORT,REDIS_DB), async_mode=async_mode, logger=True, engineio_logger=True,cors_allowed_origins="*")
# 配置 sqlalchemy  数据库驱动://数据库用户名:密码@主机地址:端口/数据库?编码
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
# 上传文件配置
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER #上传目录 
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH #上传大小
# 创建数据库及连接
engine = create_engine(SQLALCHEMY_DATABASE_URI,pool_recycle=7200,pool_size=5,max_overflow=10)
# 创建DBSession类型:
DBSession = scoped_session(sessionmaker(bind=engine))
dBSession = DBSession()
# 初始化延时队列
delayQueue = DelayQueue(host=REDIS_IP, port=int(REDIS_PORT), password=REDIS_PAS)

from app.Vendor.ExceptionApi import ExceptionApi, SocketExceptionApi
@app.teardown_appcontext
def shutdown_session(exception=None):
    dBSession.close() 
    
#挂载500异常处理,并记录日志,这里要做判断，如果是socket的则不挂载这个
if environment == 'admin':
    @app.errorhandler(Exception)
    def error_handler(e):
        return ExceptionApi(CONST['CODE']['ERROR']['value'], e)
if environment == 'app':
    @socketio.on_error_default       # Handles the default namespace
    def socketio_error_handler(e):
        return SocketExceptionApi(CONST['CODE']['ERROR']['value'], e)

#引入使用的控制器
if environment == 'app':
    from app.Controllers import  SocketController
    #socketio后台任务
    socketio.start_background_task(target = SocketController.background_thread)
if environment == 'admin':
    #引入后台
    from app.Admin.Controllers import (LoginController, RoomController, AddressBookController,
                                    UserController, AdminController, IndexController,LogController,
                                    ConfigController)
#数据库事件
from app.Event import AddressBook, Admin, Config, Log, Msg, Room, UserRoomRelation, Users

if environment == 'job':
    #任务调剂
    sched = BlockingScheduler()
    #引入任务
    from app.Job import Cron, Interval
    #开始任务
    sched.start()