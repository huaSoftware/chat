'''
@Author: hua
@Date: 2019-06-17 14:14:29
@description: 
@LastEditors: hua
@LastEditTime: 2019-10-24 14:35:19
'''
import os,json
path = os.getcwd()+'/.runtime/environment.json'
data = {"environment":"admin"}
with open(path, "w") as f:
    f.write(json.dumps(data))

from app import app
from flask_cors import CORS
# https://www.cnblogs.com/franknihao/p/7202253.html uwsgi配置
app = app
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    app.debug = False
    app.run(host='0.0.0.0', port=500)
