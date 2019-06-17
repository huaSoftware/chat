from app import app, socketio
from flask_cors import CORS
# https://www.cnblogs.com/franknihao/p/7202253.html uwsgi配置
app = app
CORS(app, supports_credentials=True)
if __name__ == '__main__':
    app.debug = False
    app.run(host='0.0.0.0', port=500)
