'''
@Author: hua
@Date: 2019-06-17 14:14:29
@description: 
@LastEditors  : hua
@LastEditTime : 2020-01-07 19:53:45
'''
import environment
environment.init("admin")
from app import app
from flask_cors import CORS
# https://www.cnblogs.com/franknihao/p/7202253.html uwsgi配置
app = app
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    app.debug = False
    app.run(host='0.0.0.0', port=500)
