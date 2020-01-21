'''
@Author: hua
@Date: 2019-02-10 09:55:10
@description: 工具类，封装一些通用方法 
@LastEditors  : hua
@LastEditTime : 2020-01-21 15:37:52
'''
from app import CONST
from Cryptodome.PublicKey import RSA
from Cryptodome.Cipher import  PKCS1_v1_5
from app.env import ALLOWED_EXTENSIONS
from app.Lang.zh_CN.validation import validation
from datetime import timedelta
import time,os,json,base64, datetime

class Utils:
    @staticmethod
    def getWeekList():
        week_list = []
        now = datetime.datetime.now()
        for i in range(7):
            this_week_start = now - timedelta(days=now.weekday()-i)
            week_list.append(this_week_start.strftime('%Y-%m-%d'))
        return week_list

    @staticmethod
    def getColumn(name, data):
        """ 
        获取指定键的值 
        @param string name
        @param list|dict data
        !return list|dict|bool
        """
        if isinstance(data, list):
            data_list = []
            for data_dict in data:
                for key, val in data_dict.items():
                    if key == name:
                        data_list.append(val)
            return data_list
        if isinstance(data, dict):
            if name in data.keys():
                return data[name]
            return False
        return False  
    
    @staticmethod
    def db_t_d(data):
        """ 
        格式化原生查询结果tuple转dict
        @param list data
        @return list
        """
        data_list = []
        for val in data:
            val_dict = dict(zip(val.keys(), val.values()))
            data_list.append(val_dict)
        data = {}
        data = data_list
        return data
    
    @staticmethod
    def db_l_to_d(data):
        ''' 
        * 用于sql结果列表对象类型转字典
        * @param list data
        * @return dict
        '''
        data_list = []
        for val in data:
            val_dict = val.to_dict()
            data_list.append(val_dict)
        data = {}
        data = data_list
        return data

    @staticmethod
    def class_to_dict(obj):
        ''' 
        * 用于sql结果对象类型转字典
        * @param object obj
        * @return dict
        '''
        '''把对象(支持单个对象、list、set)转换成字典'''
        is_list = obj.__class__ == [].__class__
        is_set = obj.__class__ == set().__class__
        if is_list or is_set:
            obj_arr = []
            for o in obj:
                # 把Object对象转换成Dict对象
                dict = {}
                dict.update(o.__dict__)
                obj_arr.append(dict)
                return obj_arr
        else:
            dict = {}
            dict.update(obj.__dict__)
            return dict

    @staticmethod
    def allowed_file(filename):
        """ 验证文件类型
            @param string filename
            return string path
        """
        return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

    @staticmethod
    def unique_id(prefix=''):
        """ uuid,唯一id 
            return string id
        """
        return prefix + hex(int(time.time()))[2:10] + hex(int(time.time() * 1000000) % 0x100000)[2:7]
      
    @staticmethod
    def formatBody(data={}, msg='', show=True):
        """ 
        * 格式化返回体
        * @param dict data
        * @return dict
        """
        dataformat = {}
        dataformat['error_code'] = CONST['CODE']['SUCCESS']['value']
        dataformat['data'] = data
        dataformat['msg'] = msg
        dataformat['show'] = show
        return dataformat

    @staticmethod
    def formatError(code, msg='', show=True):
        """ 
        * 格式化错误返回体
        * @param int code
        * @param string message
        * @return dict
        """
        body = {}
        body['error'] = True
        body['error_code'] = code
        body['msg'] = msg
        body['show'] = show
        return body
    
    @staticmethod
    def validateMsgFormat(name, rules, msg):
        """ 
        * 格式化验证错误描述
        * @param string name
        * @param dict rules
        * @param dict msg
        * @return string
        """
        #根据规则生成返回
        if not msg:
            msgFormat = dict()
            for key in  rules:
                if key == 'required':
                    ruleMsg = ''
                    actionMsg = validation[key][rules[key]]
                elif key == 'maxlength':
                    ruleMsg = validation[key]
                    actionMsg = rules[key]
                elif key == 'minlength': 
                    ruleMsg = validation[key]
                    actionMsg = rules[key]
                else:
                    ruleMsg = validation[key]
                    actionMsg = validation[rules[key]]
                if name in validation.keys():
                    msgFormat[key] = "{} {} {}".format(validation[name], ruleMsg, actionMsg)
                else:
                    return msg
            return msgFormat
        return msg
    
    @staticmethod
    def create_rsa_key(password="huatinshigedashabi"):
        """
        创建RSA密钥
        步骤说明：
        1、从 Crypto.PublicKey 包中导入 RSA，创建一个密码
        2、生成 1024/2048 位的 RSA 密钥
        3、调用 RSA 密钥实例的 exportKey 方法，传入密码、使用的 PKCS 标准以及加密方案这三个参数。
        4、将私钥写入磁盘的文件。
        5、使用方法链调用 publickey 和 exportKey 方法生成公钥，写入磁盘上的文件。
        """

        key = RSA.generate(1024)
        encrypted_key = key.exportKey(passphrase=password, pkcs=8,
                                    protection="scryptAndAES128-CBC")
        with open("my_private_rsa_key.bin", "wb") as f:
            f.write(encrypted_key)
        with open("my_rsa_public.pem", "wb") as f:
            f.write(key.publickey().exportKey()) 
            
    @staticmethod
    def decrypt(en_data):
        """ 
        @param string en_data
        @param string password
        return dict
        """
        # 读取密钥
        private_key = RSA.import_key(
            open(os.getcwd()+"/app/my_private_rsa_key.bin").read()
        )
        cipher_rsa = PKCS1_v1_5.new(private_key)# type: ignore
        #切割字符串
        en_data_list = en_data.split(",")
        data = ""      
        for en in en_data_list:
            en = base64.b64decode(en)
            if len(en) == 127:
                hex_fixed = '00' + en.hex()
                en = base64.b16decode(hex_fixed.upper())
            try:
                data +=str(cipher_rsa.decrypt(en, None),"utf8")#chardet.detect(cipher_rsa.decrypt(en, None))['encoding'])#推断字符集
            except  Exception as e:
                print(e)
        return json.loads(data, encoding='utf8')
          
    @staticmethod
    def encrypt_and_decrypt_test():
        # 加载公钥
        recipient_key = RSA.import_key(
            open("my_rsa_public.pem").read()
        )
        cipher_rsa = PKCS1_v1_5.new(recipient_key)# type: ignore

        en_data = cipher_rsa.encrypt(b"123456")
        print(len(en_data), en_data)

        # 读取密钥
        private_key = RSA.import_key(
            open("my_private_rsa_key.bin").read()
        )
        cipher_rsa = PKCS1_v1_5.new(private_key)# type: ignore
        data = cipher_rsa.decrypt(en_data, None)

        print(data)