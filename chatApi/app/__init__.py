'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2019-06-12 15:32:42
'''
from flask import Flask
#权限模块 https://github.com/raddevon/flask-permissions
#from flask_permissions.core import Permissions
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from flask_socketio import SocketIO
from app.Vendor.Code import Code
from app.Vendor.ExceptionApi import ExceptionApi

from app.env import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS, UPLOAD_FOLDER, MAX_CONTENT_LENGTH
import pymysql,os,time
from cacheout import Cache

pymysql.install_as_MySQLdb()
#普通json带error_code风格使用此app示例
app = Flask(__name__,static_folder=os.getcwd()+'/uploads')
cache = Cache(maxsize=2560, ttl=86400, timer=time.time, default=None)  # defaults
# 实例化websocket
async_mode = 'gevent'
socketio = SocketIO(app, async_mode=async_mode, logger=True, engineio_logger=True)
# 配置 sqlalchemy  数据库驱动://数据库用户名:密码@主机地址:端口/数据库?编码
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
#上传文件配置
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER #上传目录 
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH #上传大小
#创建数据库及连接
engine = create_engine(SQLALCHEMY_DATABASE_URI)
# 创建DBSession类型:
DBSession = sessionmaker(bind=engine)
dBSession = DBSession()
#挂载500异常处理,并记录日志
@app.errorhandler(Exception)
def error_handler(e):
    return ExceptionApi(Code.ERROR, e)

@socketio.on_error_default       # Handles the default namespace
def error_handler(e):
    return ExceptionApi(Code.ERROR, e)
  
#引入使用的控制器
from app.Controllers import  (UsersController, SocketController, AddressBookController, 
                            RoomController, UploadController,UserRoomRelationController)
#引入后台
from app.Admin.Controllers import (LoginController, RoomController, AddressBookController,
                                UserController, AdminController)

