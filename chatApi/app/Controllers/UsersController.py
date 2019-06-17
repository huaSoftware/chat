'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2019-06-17 10:52:24
'''
from app import app
from app.Controllers.BaseController import BaseController
from app.Vendor.Utils import Utils
from app.Models.Users import Users
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import validator
from flask import request
from werkzeug.utils import secure_filename
from xpinyin import Pinyin
import os, base64, time, re
from app.env import UPLOAD_FOLDER

from app.Service.UsersService import UsersService


''' 注册 '''
@app.route('/api/v2/register', methods=['POST'])
@validator(name='nickName', rules={'required':True,'type':'string','minlength':1,'maxlength':20})
@validator(name='email', rules={'required': True,'type': 'string','minlength': 10,'maxlength': 20})
@validator(name='password', rules={'required': True,'type': 'string','minlength': 6,'maxlength': 200})
@validator(name='headImg', rules={'required': True,'type': 'string','minlength': 1})
def register(params):
    data = UsersService().register(params)
    return BaseController().json(data)


''' 登录 '''
@app.route('/api/v2/login', methods=['POST'])
@validator(name='email', rules={'required': True,'type': 'string','minlength': 10,'maxlength': 20})
@validator(name='password', rules={'required':True,'type':'string','minlength':6,'maxlength':200})
def login(params):
    result = UsersAuthJWT.authenticate(params['email'], params['password'])
    return BaseController().json(result)


""" 搜索用户 """
@app.route('/api/v2/search', methods=['POST'])
@validator(name='keywords', rules={'required': True,'type': 'string','minlength': 1,'maxlength': 20})
def search(params):
    result = UsersService().getByNickName(params['keywords'])
    return BaseController().successData(result)


'''
*获取用户信息 
*jwt中修改error处理方法,统一响应头
*_default_jwt_error_handler
'''
@app.route('/api/v2/user.info', methods=['GET'])
@UsersAuthJWT.apiAuth
def get(user_info):
    #鉴权
    if (user_info['data']):
        user_data = Users().getOne({Users.id == user_info['data']['id']})
    return BaseController().successData(user_data)


""" 不通过鉴权获取用户信息 """
@app.route('/api/v2/userInfo', methods=['POST'])
def getInfo():
    id = request.json.get('id')
    filters = {
        Users.id == id
    }
    data = Users().getOne(filters)
    return BaseController().successData(data)
    


