<!--
 * @Author: hua
 * @Date: 2019-06-05 17:03:40
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-07-27 09:08:21
 -->
## 房间类型
```
type 0 单聊
     1 群聊
     2 通知
```
## 聊天类型
```
type 0 录音
     1 文字图片
     2 重发
```
## 发送状态
```
send_status 0 发送中
            1 发送成功
            2 发送失败
```
## 聊天数据结构
```
{
    created_at: 1561425786.7109258,
    head_img: "http://127.0.0.1:501/uploads/5c88c7c09020d.png",
    id: 36,
    msg: "3423423",
    name: "bbb",
    room_uuid: "5ca1b753d1667",
    type: 1,
    user_id: 2,
    send_status: 0
}
```

### 保存方式
```
save_action: 0是存本地
             1是存数据库
```

### 快捷生成数据库模型
```
sqlacodegen mysql+pymysql://root:1993524@127.0.0.1:3306/chat > Model.py
```

### 架设
```
pip3 install uwsgi #安装
uwsgi uwsgi.ini  #启动
# 重启 后面路径是uwsgi.pid的文件位置
uwsgi --reload /tmp/ocean_monitor_master.pid
# 结束
uwsgi --stop /tmp/ocean_monitor_master.pid

/usr/local/python3/bin/uwsgi 
```

### 分布式部署
```
https://www.jianshu.com/p/3c3e18456ccc
```
