'''
@Author: hua
@Date: 2019-02-10 09:55:10
@LastEditors: hua
@LastEditTime: 2020-04-19 16:53:10
'''
from app import CONST
from app.Vendor.Utils import Utils
from flask import request, make_response, jsonify
from functools import wraps
from app.env import SECRET_KEY, JWT_LEEWAY
from app.Models.Users import Users
from app.Models.Admin import Admin
import datetime
import jwt
import time
''' JWT工具函数在这 '''


class UsersAuthJWT():
    @staticmethod
    def encode_auth_token(user_id, updated_at):
        """
        生成认证Token
        :param user_id: int
        :param login_time: int(timestamp)
        :return: string
        """
        try:
            payload = {
                'exp':
                datetime.datetime.utcnow() +
                datetime.timedelta(seconds=JWT_LEEWAY),
                'iat':
                datetime.datetime.utcnow(),
                'iss':
                'ken',
                'data': {
                    'id': user_id,
                    'updated_at': updated_at
                }
            }
            return jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode()
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        验证Token
        :param auth_token:
        :return: integer|string
        """
        try:
            # payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'), leeway=datetime.timedelta(seconds=10))
            # 取消过期时间验证
            payload = jwt.decode(auth_token, SECRET_KEY)
            if ('data' in payload and 'id' in payload['data']):
                return payload
            else:
                raise jwt.InvalidTokenError
        except jwt.ExpiredSignatureError:
            return 'Token过期'
        except jwt.InvalidTokenError:
            return '无效Token'
        except Exception:
            return '无效Token'

    @staticmethod
    def authenticate(email, password):
        """
        用户登录，登录成功返回token，写将登录时间写入数据库；登录失败返回失败原因
        :param password:
        :return: json
        """
        userInfo = Users().getOne({Users.email == email}, 'id desc',
                                  ('email', 'password', 'id', 'nick_name', 'head_img'))
        if(userInfo is None):
            return Utils.formatError(CONST['CODE']['BAD_REQUEST']['value'], '找不到用户')
        else:
            if (Users.check_password(userInfo['password'], password)):
                updated_at = int(time.time())
                Users().edit({'updated_at': updated_at},
                             {Users.email == email})
                token = UsersAuthJWT.encode_auth_token(
                    userInfo['id'], updated_at)
                userInfo.pop('password')  # 删除密码
                return Utils.formatBody({'token': token, 'user': userInfo}, '登陆成功')
            else:
                return Utils.formatError(CONST['CODE']['BAD_REQUEST']['value'], '密码不正确')

    def identify(self, auth_header):
        """
        用户鉴权
        :return: list
        """
        if (auth_header):
            auth_tokenArr = auth_header.split(" ")
            if (not auth_tokenArr or auth_tokenArr[0] != 'JWT'
                    or len(auth_tokenArr) != 2):
                return '请传递正确的验证头信息'
            else:
                auth_token = auth_tokenArr[1]
                payload = self.decode_auth_token(auth_token)
                if not isinstance(payload, str):
                    user = Users().getOne({Users.id == payload['data']['id']})
                    if (user is None):
                        return '找不到该用户信息'
                    else:
                        if (user['updated_at'] == payload['data']['updated_at']):
                            result = payload
                        else:
                            return '令牌失效'
                else:
                    result = payload
        else:
            return '没有提供认证令牌'
        return result

    def adminIdentify(self, auth_header):
        """
        用户鉴权
        :return: list
        """
        if (auth_header):
            auth_tokenArr = auth_header.split(" ")
            if (not auth_tokenArr or auth_tokenArr[0] != 'JWT'
                    or len(auth_tokenArr) != 2):
                return '请传递正确的验证头信息'
            else:
                auth_token = auth_tokenArr[1]
                payload = self.decode_auth_token(auth_token)
                if not isinstance(payload, str):
                    user = Admin().getOne({Admin.id == payload['data']['id']})
                    if (user is None):
                        return '找不到该用户信息'
                    else:
                        if (user['update_time'] == payload['data']['updated_at']):
                            result = payload
                        else:
                            return '令牌失效'
                else:
                    result = payload
        else:
            return '没有提供认证令牌'
        return result

    """ 
    jwt认证装饰器,用于api
        @params func
        @return func|False
    """
    @staticmethod
    def apiAuth(func):
        @wraps(func)
        def inner_wrappar(*args, **kwargs):
            result = UsersAuthJWT().identify(request.headers.get('Authorization'))
            kwargs['user_info'] = result
            if isinstance(result, str):
                return make_response(jsonify(Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'])))
            res = func(*args, **kwargs)
            return res
        return inner_wrappar

    """ 
    jwt认证装饰器,用于socketio
        @return func|False
    """
    @staticmethod
    def socketAuth(func):
        @wraps(func)
        def inner_wrappar(*args, **kwargs):
            if 'Authorization' in args[0].keys():
                result = UsersAuthJWT().identify(args[0]['Authorization'])
            else:
                return Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'], '令牌失效')
            kwargs['user_info'] = result
            if isinstance(result, str):
                # socketio.emit(name,Utils.formatError(CONST['CODE']['ERROR']['value']_AUTH_CHECK_TOKEN_FAIL, '令牌失效'), room='@api.'+str(request.sid))
                return Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'], '令牌失效')
            res = func(*args, **kwargs)
            return res
        return inner_wrappar

    """ 
    后台jwt认证装饰器,用于api
        @params func
        @return func|False
    """
    @staticmethod
    def AdminApiAuth(func):
        @wraps(func)
        def inner_wrappar(*args, **kwargs):
            result = UsersAuthJWT().adminIdentify(request.headers.get('Authorization'))
            kwargs['user_info'] = result
            if isinstance(result, str):
                return make_response(jsonify(Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'], result)))
            res = func(*args, **kwargs)
            return res
        return inner_wrappar

    """ 
    jwt认证装饰器,用于socketio
        @return func|False
    """
    @staticmethod
    def adminSocketAuth(func):
        @wraps(func)
        def inner_wrappar(*args, **kwargs):
            if 'Authorization' in args[0].keys():
                result = UsersAuthJWT().adminIdentify(args[0]['Authorization'])
            else:
                return Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'], '令牌失效')
            kwargs['user_info'] = result
            if isinstance(result, str):
                # socketio.emit(name,Utils.formatError(CONST['CODE']['ERROR']['value']_AUTH_CHECK_TOKEN_FAIL, '令牌失效'), room='@api.'+str(request.sid))
                return Utils.formatError(CONST['CODE']['ERROR_AUTH_CHECK_TOKEN_FAIL']['value'], '令牌失效')
            res = func(*args, **kwargs)
            return res
        return inner_wrappar
