'''
@Author: hua
@Date: 2019-06-17 14:14:28
@description: 
@LastEditors: hua
@LastEditTime: 2019-08-28 14:06:13
'''
from gevent import monkey
monkey.patch_all(select=True, socket=True)
from app import app, socketio
# https://www.cnblogs.com/franknihao/p/7202253.html uwsgi配置
app = app
if __name__ == '__main__':
    app.debug = False
    socketio.run(app, host='0.0.0.0', port=501)
    