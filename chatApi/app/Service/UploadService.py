'''
@Author: hua
@Date: 2019-09-28 20:50:59
@description: 
@LastEditors: hua
@LastEditTime: 2019-10-06 09:15:10
'''
from app import app
from app.Controllers.BaseController import BaseController
from app.Vendor.Utils import Utils
from app.Vendor.Decorator import socketValidator
from flask import request
from werkzeug.utils import secure_filename
import os, base64, time, re
from app.env import UPLOAD_FOLDER
from app.Vendor.Code import Code

class UploadService():
    @staticmethod
    @socketValidator(name='imgDatas', rules={'required': True,'type': 'string'}, msg= {'required': u'base64是必须的','type': u'base64必须是字符串'})
    def uploadBase64(params):
        userImg = params['imgDatas'].split(',')[1]
        typeImg = params['imgDatas'].split(',')[0]
        if 'png' in typeImg:
            typeImg = 'png'
        elif 'gif' in typeImg:
            typeImg = 'gif'
        elif 'jpeg' in typeImg:
            typeImg = 'jpeg'
        imgdata = base64.b64decode(userImg)
        path = UPLOAD_FOLDER+Utils.unique_id()+'.'+typeImg
        file = open( os.getcwd()+path, 'wb')
        file.write(imgdata)
        file.close()
        return  Utils.formatBody({'path': path}, '上传成功')
    
    @staticmethod
    def upload(params):
        filename = secure_filename(params['name'])
        base64Data = params['dataUrl'].split(',')[1]
        if(base64Data and Utils.allowed_file(filename)):
            file_suffix = params['name'].split('.')[1]
            path = UPLOAD_FOLDER+Utils.unique_id()+'.'+file_suffix
            full_path = os.getcwd()+path
            f = open(full_path,'wb')
            data = base64.b64decode(base64Data)
            f.write(data)
            #f.write(params['arrayBuffer'])
            f.close
            return Utils.formatBody({'path': path, 'name': filename}, msg='上传成功')
        return Utils.formatError(Code.BAD_REQUEST,'文件类型不允许')


