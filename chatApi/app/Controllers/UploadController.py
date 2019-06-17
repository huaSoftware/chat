from app import app
from app.Controllers.BaseController import BaseController
from app.Vendor.Utils import Utils
from app.Vendor.Decorator import validator
from flask import request
from werkzeug.utils import secure_filename
import os, base64, time, re
from app.env import UPLOAD_FOLDER


''' 上传base64图片 '''
@app.route('/v2/api/uploadBase64', methods=['POST'])
@validator(name='imgDatas', rules={'required': True,'type': 'string'}, msg= {'required': u'base64是必须的','type': u'base64必须是字符串'})
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
    return BaseController().successData(data={'path': path}, msg='图片提交成功')


""" 上传文件 """
@app.route('/v2/api/upload', methods=['POST'])
def upload():
    f = request.files['file']
    filename = secure_filename(f.filename)
    if(f and Utils.allowed_file(filename)):
        file_suffix = f.filename.split('.')[1]
        path = UPLOAD_FOLDER+Utils.unique_id()+'.'+file_suffix
        full_path = os.getcwd()+path
        f.save(full_path)
        return BaseController().successData(data={'path': path, 'name': f.filename}, msg='图片提交成功')
    return BaseController().error('文件类型不允许')