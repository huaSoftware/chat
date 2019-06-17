'''
@Author: hua
@Date: 2019-04-02 16:50:55
@LastEditors: hua
@LastEditTime: 2019-06-11 20:59:18
'''
from app import dBSession
from functools import wraps
from flask import request, make_response
from app.Vendor.Utils import Utils
from app.Vendor.CustomErrorHandler import CustomErrorHandler
from app.Vendor.Code import Code
import cerberus, json

''' 
* 验证输入信息根据字段名
* @param  string name
* @param  dict rules
* @param  string error_msg
* @param  string default
* @return response
'''
def validateInputByName(name, rules, error_msg=dict(), default=''):
    #不准使用error关键字作为请求参数,请求参数都会被格式化成string，无法使用int去验证
    if name == 'error':
        error = {}
        error['msg'] = '不能使用error关键字作用请求参数'
        error['error_code'] = Code.ERROR
        error['error'] = True
        return error
    v = cerberus.Validator(
        rules, error_handler=CustomErrorHandler(custom_messages=error_msg))
    #这边修改成json格式接收参数
    method = request.method
    if method == 'GET':
        requests = request.values
    if method == 'POST':
        requests = request.get_json()
    if requests == None:
        requests = dict()
    if name not in requests:
        requests[name] = default
    cookedReqVal = {name: requests[name]}
    if (v.validate(cookedReqVal)):  # validate
        return requests
    error = {}
    error['msg'] = v.errors
    error['error_code'] = Code.ERROR
    error['error'] = True
    return error


""" 
    事务装饰器,不能用于类方法
    @params func
    @return func|False
"""
def transaction(func):
    @wraps(func)
    def inner_wrappar(*args, **kwargs):
        try:
            #print('something before')
            result = func(*args, **kwargs)
            dBSession.commit()
            #print('something after')
            return result
        except  Exception as e:
            dBSession.rollback()  
            raise e
    return inner_wrappar 

""" 
    事务装饰器,用于类方法
    @params func
    @return func|False
"""
def classTransaction(func):
    @wraps(func)
    def wrappar(self, *args, **kwargs):
        try:
            #print('something before')
            result = func(self, *args, **kwargs)
            dBSession.commit()
            #print('something after')
            return result
        except  Exception as e:
            dBSession.rollback()  
            raise e
    return wrappar 

""" 
    验证装饰器 
    @params name 字段名
    @params rules 规则
    @params msg 描述
    @params default 默认值
    @return func|json
"""
def validator(name, rules, msg=dict(), default=""):
    # 装饰器就是把其他函数作为参数的函数
    def wrappar(func):
        @wraps(func)
        def inner_wrappar(*args, **kwargs):
            #18n
            msgFormat = Utils.validateMsgFormat(name, rules, msg)
            error = validateInputByName(name, {name: rules}, {name:msgFormat}, default)
            if 'error' in error:
                res = make_response(json.dumps(error),200)
                res.headers['Content-Type'] = 'application/json'
                return res
            if 'params' in kwargs.keys():
                kwargs['params'][name]=error[name]
                kwargs= kwargs['params']
            else:
                kwargs=error
            return func(params=kwargs)
        return inner_wrappar 
    return wrappar
