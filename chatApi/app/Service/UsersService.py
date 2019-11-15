'''
@Author: hua
@Date: 2019-06-17 14:14:28
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-15 10:14:37
'''
import time, re
from app.Vendor.Decorator import socketValidator, socketValidator
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Utils import Utils
from app.Vendor.Code import Code
from app.Models.Users import Users
from app.Vendor.Decorator import transaction
from sqlalchemy import or_
from xpinyin import Pinyin

class UsersService():
    """ 
        注册用户
        @param dict 注册数据
        @return dict 返回格式化结果
    """
    @staticmethod
    @transaction
    def register(params):
        userData = Users().getOne({Users.email == params['email']})
        if(userData == None):
            #昵称首字母
            isChinese = re.compile(u"[\u4e00-\u9fa5]+")
            isEnglish = re.compile('[a-zA-Z]')
            nickNameFirstWord = params['nickName'][0]
            nowTime = time.time()
            if isChinese.search(nickNameFirstWord):
                first_word = Pinyin().get_initial(nickNameFirstWord)
            elif isEnglish.search(nickNameFirstWord):
                first_word = nickNameFirstWord.upper()
            else:
                first_word = '#'
            data = {
                'email': params['email'],
                'password': Users.set_password(params['password']),
                'nick_name': params['nickName'],
                'head_img':params['headImg'],
                'first_word':first_word,
                'created_at':nowTime,
                'updated_at':nowTime
            }
            user = Users().add(data)
            if user == False:
                return Utils.formatError(Code.BAD_REQUEST,'注册失败')
            else:
                result = UsersAuthJWT.authenticate(params['email'], params['password'])
                return result
        return Utils.formatError(Code.BAD_REQUEST,'账号已注册')
    
    @staticmethod
    @socketValidator(name='email', rules={'required': True,'type': 'string','minlength': 10,'maxlength': 20})
    @socketValidator(name='password', rules={'required':True,'type':'string','minlength':6,'maxlength':200})
    @transaction
    def login(params):
        return UsersAuthJWT.authenticate(params['email'], params['password'])

    """ 
        根据用户昵称查询
        @param string keywords
        @return list data 
    """
    @staticmethod
    @socketValidator(name='keywords', rules={'required': True,'type': 'string','minlength': 1,'maxlength': 20})
    def search(params):
        filters = {
            Users.nick_name.like('%'+params['keywords']+'%'),
            or_(Users.email.like('%'+params['keywords']+'%'))
        }
        userList = Users().getAll(filters)
        data = {"userList": userList}
        return Utils.formatBody(data)
    
    '''
    *获取用户信息 
    *jwt中修改error处理方法,统一响应头
    *_default_jwt_error_handler
    '''
    @staticmethod
    @UsersAuthJWT.socketAuth
    def get(params, user_info):
        #鉴权
        user_data = Users().getOne({Users.id == user_info['data']['id']})
        return Utils.formatBody(user_data)
    