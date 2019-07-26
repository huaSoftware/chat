<!--
 * @Author: hua
 * @Date: 2019-06-05 17:03:40
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-07-25 14:01:58
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

