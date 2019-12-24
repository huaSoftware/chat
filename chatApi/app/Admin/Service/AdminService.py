'''
@Author: hua
@Date: 2019-06-10 10:13:37
@description: 
@LastEditors: hua
@LastEditTime: 2019-12-12 14:24:17
'''
from app import CONST
from app.Models.Admin import Admin
from app.Vendor.Utils import Utils
from app.Vendor.UsersAuthJWT import UsersAuthJWT
from app.Vendor.Decorator import classTransaction
import time, hashlib


class AdminService():
    """  
        登录
        @param string data['name'] 用户名
        @param string data['pwd'] 密码
        @return array
    """
    @classTransaction
    def login(self, data):
        name = data['name']
        #生成一个md5对象
        m1 = hashlib.md5()
        #使用md5对象里的update方法md5转换
        m1.update(data['pwd'].encode("utf-8"))
        pwd = m1.hexdigest()
        #用户名/邮箱/手机登录
        filters = {
            Admin.name == name,
            Admin.pwd  == pwd,
            Admin.delete_time == 0
        }
        admin = Admin().getOne(filters, 'add_time desc')
        if admin == None:
            filters = {
                Admin.email == name,
                Admin.pwd  == pwd,
                Admin.delete_time == 0
            }
            admin = Admin().getOne(filters, 'add_time desc')
            if admin == None:
                filters = {
                    Admin.mobile == name,
                    Admin.pwd  == pwd,
                    Admin.delete_time == 0
                }
                admin = Admin().getOne(filters, 'add_time desc')
        if admin != None:
            #更新登录时间
            filters = {
                Admin.id== admin['id']
            }
            update_time = int(time.time())
            Admin().edit({Admin.update_time: update_time}, filters)
            token = UsersAuthJWT.encode_auth_token(admin['id'], update_time)    
            return Utils.formatBody({'token': token, 'user': admin})   
        return Utils.formatError(CONST['CODE']['ERROR']['value'])
    
    @classTransaction
    def add(self, data = []):
        #添加
        if 'update_time' in data.keys():
            data['update_time'] = int(time.time())
         #判断用户名
        if 'name' in data.keys():
            filters = {
                Admin.delete_time == 0,
                Admin.name        == data['name']
            }
            adminData = Admin().getOne(filters, 'add_time desc')
            if adminData != None:
                return Utils.formatError(CONST['CODE']['ERROR']['value'], '用户名已经存在')
        #判断手机号码
        if 'mobile' in data.keys():
            filters = {
                Admin.delete_time == 0,
                Admin.mobile      == data['mobile']
            }
            admin = Admin().getOne(filters, 'add_time desc')
            if admin:
                return Utils.formatError(CONST['CODE']['ERROR']['value'], '手机号码已经存在') 
        #判断邮箱
        if 'email' in data.keys():
            filters = {
                Admin.delete_time == 0,
                Admin.email      == data['email']
            }
            admin = Admin().getOne(filters, Admin.add_time.desc())
            if admin:
                return Utils.formatError(CONST['CODE']['ERROR']['value'], '邮箱已经存在')
         #生成一个md5对象
        m1 = hashlib.md5()
        #使用md5对象里的update方法md5转换
        m1.update(data['pwd'].encode("utf-8"))
        data['pwd'] = m1.hexdigest()    
        res = Admin().add(data)
        if res:
            return Utils.formatBody(msg = '添加成功')
        return Utils.formatError(CONST['CODE']['ERROR']['value'], '添加失败')

    #修改
    @classTransaction
    def edit(self, data, filters = {}):
    
        if 'update_time' in data.keys():
            data['update_time'] = time.time()
        adminData = Admin().getOne(filters, 'add_time desc')
        if adminData == None:
            return Utils.formatError(CONST['CODE']['ERROR']['value'], '用户不存在')
        #判断用户名
        if 'name' in data.keys():
            filters = {
                Admin.delete_time == 0,
                Admin.name        == data['name'],
                Admin.id          != adminData['id']
            }
            admin = Admin().getOne(filters, 'add_time desc')
            if admin != None:
                return Utils.formatError(CONST['CODE']['ERROR']['value'], '用户名已经存在')


        
        #判断手机号码
        if 'mobile' in data.keys():
            filters = {
                Admin.delete_time == 0,
                Admin.mobile      == data['mobile'],
                Admin.id          != adminData['id']
            }
            admin = Admin().getOne(filters, 'add_time desc')
            if admin != None:
                return Utils.formatError(CONST['CODE']['ERROR']['value'], '手机号码已经存在')
        
        #判断邮箱
        if 'email' in data.keys():
            filters = {
                Admin.delete_time == 0,
                Admin.email       == data['email'],
                Admin.id          != adminData['id']
            }
            admin = Admin().getOne(filters, Admin.add_time.desc())
            if admin != None:
                return Utils.formatError(CONST['CODE']['ERROR']['value'], '邮箱已经存在')
        
        if 'pwd' in data.keys():
            #生成一个md5对象
            m1 = hashlib.md5()
            #使用md5对象里的update方法md5转换
            m1.update(data['pwd'].encode("utf-8"))
            data['pwd'] = m1.hexdigest()      
        res = Admin().edit(data, filters)
        if res==True:
            return Utils.formatBody(msg='编辑成功')
        return Utils.formatError(CONST['CODE']['ERROR']['value'], '编辑失败', 0)