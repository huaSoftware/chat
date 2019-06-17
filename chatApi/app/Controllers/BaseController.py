''' author:hua
    date:2018.2.6
    基础控制器，封装一些基础方法 
    验证库https://cerberus.readthedocs.io/en/stable/index.html
'''
from app.env import DEBUG_LOG, MAX_CONTENT_LENGTH, ALLOWED_EXTENSIONS
from app.Vendor.Code import Code
from app.Vendor.CustomErrorHandler import CustomErrorHandler
from app.Vendor.Log import log
from app.Vendor.Utils import Utils
from flask import request, jsonify
import cerberus
import time
import json


class BaseController:

    ''' 
    * 验证输入信息
    * @param  dict rules
    * @param  string error_msg
    * @return response
    '''

    def validateInput(self, rules, error_msg=None):
        v = cerberus.Validator(
            rules, error_handler=CustomErrorHandler(custom_messages=error_msg))
        #v = ObjectValidator(rules)
        #这边修改成json格式接收参数
        try:
            requests = request.values()
        except TypeError:
            requests = request.get_json()
        if (v.validate(requests)):  # validate
            return requests
        error = {}
        error['msg'] = v.errors
        error['error_code'] = Code.BAD_REQUEST
        error['error'] = True
        return self.json(error)

    ''' 
    * 验证输入信息根据字段名
    * @param  dict rules
    * @param  string error_msg
    * @return response
    '''

    def validateInputByName(self, name, rules, error_msg=None):
        v = cerberus.Validator(
            rules, error_handler=CustomErrorHandler(custom_messages=error_msg))
        #v = ObjectValidator(rules)
        #这边修改成json格式接收参数
        try:
            requests = request.values()
        except TypeError:
            requests = request.get_json()
        if (v.validate({name: requests[name]})):  # validate
            return requests
        error = {}
        error['msg'] = v.errors
        error['error_code'] = Code.BAD_REQUEST
        error['error'] = True
        return self.json(error)

    '''
    * 返回Json数据
    * @param  dict body
    * @return json
    '''
    def json(self, body={}):
        if (DEBUG_LOG):
            debug_id = Utils.unique_id()
            log().debug(
                json.dumps({
                    'LOG_ID': debug_id,
                    'IP_ADDRESS': request.remote_addr,
                    'REQUEST_URL': request.url,
                    'REQUEST_METHOD': request.method,
                    'PARAMETERS': request.args,
                    'RESPONSES': body
                }))
        body['debug_id'] = debug_id
        return jsonify(body)

    '''
    * 返回错误信息
    * @param  msg string
    * @return json
    '''
    def error(self, msg='', show=True , code=Code.BAD_REQUEST ):
        return self.json({'error_code': code, 'error': True, 'msg': msg, 'show': show})

    '''
    * 返回成功信息
    * @param  msg string
    * @return json
    '''
    def successData(self, data='', msg='', show=True):
        return self.json({'error_code': Code.SUCCESS, 'data': data,'msg': msg, 'show': show})


