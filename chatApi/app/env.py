'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors  : hua
@LastEditTime : 2020-01-21 20:23:16
'''
#mysql
SQLALCHEMY_DATABASE_URI = 'mysql://root:1993524@127.0.0.1:3306/chat?charset=utf8'
SQLALCHEMY_TRACK_MODIFICATIONS = True
#debug
DEBUG_LOG = True
#log save 1为文件形式，2为数据库形式，默认数据库
SAVE_LOG = 2
#upload
UPLOAD_FOLDER = '/uploads/'# 允许目录
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 允许大小16MB
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'amr'])  # 允许文件
#jwt
SECRET_KEY = '7PXsHcHGfa4e3kEs8Rvcv8ymjI0UeauX'
JWT_LEEWAY = 604800
#redis
REDIS_PAS = 'asila19990'
REDIS_IP  = '118.25.6.169'
REDIS_PORT = '56379'
REDIS_DB = '0'