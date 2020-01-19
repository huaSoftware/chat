'''
@Author: hua
@Date: 2019-06-10 10:02:46
@description: 
@LastEditors  : hua
@LastEditTime : 2020-01-09 21:21:54
'''

from app import app
from app import cache
from flask import make_response
from app.Vendor.Decorator import validator
from app.Vendor.Captcha import validate_picture
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app import delayQueue as redisCache
from app.Admin.Service.AdminService import AdminService
from app.Admin.Controllers.BaseController import BaseController
from app.Vendor.Decorator import transaction
from app.Models.Admin import Admin
from io import BytesIO
import time

""" 登陆处理页面 """
@app.route('/api/v2/admin/login', methods=['POST'])
@validator(name="name", rules={'required': True,'type': 'string'})
@validator(name="pwd", rules={'required': True,'type': 'string'})
@validator(name="captcha", rules={'required': True,'type': 'string'})
def adminLogin(params):
    # 将验证码字符串储存在session中
    captcha = redisCache.client.get('captcha').decode()
    if captcha is None:
        return BaseController().error(msg='验证码错误')
    inputCaptcha = params['captcha'].lower()
    captcha = captcha.lower()
    if captcha != inputCaptcha:
        return BaseController().error(msg='验证码错误')
    res = AdminService().login(params)
    redisCache.client.delete('captcha')
    """ if res['code'] == CONST['CODE']['SUCCESS']['value']:
        return  BaseController.json(res) """
    return BaseController().json(res)


""" 获取验证码 """
@app.route('/api/v2/admin/getCode', methods=['GET'])
def getCode():
    image, data = validate_picture()
    # 将验证码图片以二进制形式写入在内存中，防止将图片都放在文件夹中，占用大量磁盘
    buf = BytesIO()
    image.save(buf, 'jpeg')
    # 将验证码字符串储存在session中
    redisCache.client.set('captcha', data)
    # 把二进制作为response发回前端，并设置首部字段
    response = make_response(buf.getvalue(), 200)
    response.headers['Content-Type'] = 'image/gif'
    return response


""" 退出登录 """
@app.route('/api/v2/admin/logout', methods=['POST'])
@UsersAuthJWT.AdminApiAuth
@transaction
def adminLogout(user_info):
    data = {
        'update_time': int(time.time())
    }
    Admin().edit(data, {Admin.id == user_info['data']['id']})
    return BaseController().successData()