'''
@Author: hua
@Date: 2019-04-02 16:50:55
@LastEditors  : hua
@LastEditTime : 2020-01-19 15:41:54
'''
from app import dBSession,CONST
from functools import wraps
from flask import request, make_response
from app.Vendor.Utils import Utils
from app.Vendor.CustomErrorHandler import CustomErrorHandler
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
        error['error_code'] = CONST['CODE']['ERROR']['value']
        error['error'] = True
        error['show'] = True
        return error
    #这边修改成json格式接收参数
    method = request.method
    requests = None
    if method == 'GET':
        requests = request.values
    if method == 'POST':
        requests = request.get_json()
    if requests == None:
        requests = dict()
    if 'required' in rules[name].keys():
        if rules[name]['required'] == False:
            if name not in requests:
                #requests[name] = default
                return requests
    v = cerberus.Validator(
        rules, error_handler=CustomErrorHandler(custom_messages=error_msg))
    if name not in requests:
        requests[name] = default
    cookedReqVal = {name: requests[name]}
    if (v.validate(cookedReqVal)):  # validate
        return requests
    error = {}
    error['msg'] = v.errors
    error['error_code'] = CONST['CODE']['ERROR']['value']
    error['error'] = True
    error['show'] = True
    return error

''' 
* 验证输入信息根据字段名
* @param  string name
* @param  dict params
* @param  dict rules
* @param  string error_msg
* @param  string default
* @return response
'''
def validateSocketDataByName(name, params, rules, error_msg=dict(), default=''):
    #不准使用error关键字作为请求参数,请求参数都会被格式化成string，无法使用int去验证
    if name == 'error':
        error = {}
        error['msg'] = '不能使用error关键字作用请求参数'
        error['error_code'] = CONST['CODE']['ERROR']['value']
        error['error'] = True
        error['show'] = True
        return error
    v = cerberus.Validator(
        rules, error_handler=CustomErrorHandler(custom_messages=error_msg))
    #这边修改成json格式接收参数
    
    cookedReqVal = {name: params[name]}
    if (v.validate(cookedReqVal)):  # validate
        return params
    error = {}
    error['msg'] = v.errors
    error['error_code'] = CONST['CODE']['ERROR']['value']
    error['error'] = True
    error['show'] = True
    return error


""" 
    事务装饰器,不能用于类方法
    @params func
    @return func|False
"""
def transaction(func):
    @wraps(func)
    def inner_wrapper(*args, **kwargs):
        try:
            #print('something before')
            result = func(*args, **kwargs)
            dBSession.commit()
            #print('something after')
            return result
        except  Exception as e:
            dBSession.rollback() 
            raise e
    return inner_wrapper 

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
        def inner_wrapper(*args, **kwargs):
            #18n
            msgFormat = Utils.validateMsgFormat(name, rules, msg)
            error = validateInputByName(name, {name: rules}, {name:msgFormat}, default)
            if 'error' in error:
                res = make_response(json.dumps(error),200)
                res.headers['Content-Type'] = 'application/json'
                return res
            if 'params' in kwargs.keys():
                if 'required' in rules.keys():
                    if rules['required'] != False:
                        kwargs['params'][name]=error[name]
                else:
                    kwargs['params'][name]=error[name]
                kwargs= kwargs['params']
            else:
                kwargs=error
            return func(params=kwargs)
        return inner_wrapper 
    return wrappar

""" 
    验证装饰器 
    @params name 字段名
    @params rules 规则
    @params msg 描述
    @params default 默认值
    @return func|json
    tobe 全局化socketio传入的参数
"""
def socketValidator(name, rules, msg=dict(), default=""):
    # 装饰器就是把其他函数作为参数的函数
    def wrappar(func):
        @wraps(func)
        def inner_wrapper(*args, **kwargs):
            #18n
            msgFormat = Utils.validateMsgFormat(name, rules, msg)
            error = validateSocketDataByName(name, args[0], {name: rules}, {name:msgFormat}, default)
            if 'error' in error:
                return json.dumps(error)#socketio.emit('unAuthSend',json.dumps(error), room='@api.'+str(request.sid))
            return func(args[0])
        return inner_wrapper 
    return wrappar


# rsa解密
def decryptMessage(func):
    @wraps(func)
    def inner_wrapper(*args, **kwargs):
        args = Utils.decrypt(args[0])
        return func(args)
    return inner_wrapper 