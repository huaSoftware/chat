'''
@Author: hua
@Date: 2019-05-24 14:13:23
@LastEditors: hua
@LastEditTime: 2019-10-29 19:59:19
'''
import time, re
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import classTransaction
from app.Models.Users import Users
from app.Vendor.Utils import Utils
from app.Vendor.Code import Code
from xpinyin import Pinyin

class UsersService():
    """ 
        注册用户
        @param dict 注册数据
        @return dict 返回格式化结果
    """
    @classTransaction
    def register(self, params):
        userData = Users().getOne({Users.email == params['email']})
        if(userData == None):
            #昵称首字母
            isChinese = re.compile(u"[\u4e00-\u9fa5]+")
            isEnglish = re.compile('[a-zA-Z]')
            nickNameFirstWord = params['nickName'][0]
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
                'created_at':time.time(),
                'updated_at':time.time()
            }
            user = Users().add(data)
            if user == False:
                return Utils.formatError(Code.BAD_REQUEST,'注册失败')
            else:
                result = UsersAuthJWT.authenticate(params['email'], params['password'])
                return result
            return Utils.formatError(Code.BAD_REQUEST,'注册失败')
        return Utils.formatError(Code.BAD_REQUEST,'账号已注册')