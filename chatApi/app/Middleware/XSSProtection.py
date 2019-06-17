from app import app
from flask import request, make_response, jsonify
import re

''' 请求钩子, 又称中间件，生命周期 
    过滤后的变量放入g全局中
    xss保护,弃用，响应后前端模板进行过滤
    from app.Middleware.XSSProtection import XSSProtection进行载入使用
'''


@app.before_request
def XSSProtection():
    dr = re.compile(r'<[^>]+>', re.S)
    for (k, v) in request.args.items():
        if(re.search(dr, v) is not None):
            return make_response(jsonify({"error_code": 400, "error": True, "msg": "请不要使用html标签"}))
