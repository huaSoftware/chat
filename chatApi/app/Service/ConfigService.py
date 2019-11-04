'''
@Author: hua
@Date: 2019-11-04 10:54:31
@description: 
@LastEditors: hua
@LastEditTime: 2019-11-04 13:12:19
'''
import json
import os

from app.Vendor.Utils import Utils


class ConfigService():
    
    '''
    @description: 获取常量配置
    @return: dict
    '''
    @staticmethod
    def getConst(params):
        path = os.getcwd()+'/app/const.json'
        with open(path, "rb") as f:
            const = json.loads(f.read(), encoding='utf-8')
        return Utils.formatBody(const)
