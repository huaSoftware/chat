<!--
 * @Author: hua
 * @Date: 2019-02-01 13:57:47
 * @LastEditors: hua
 * @LastEditTime: 2020-10-06 18:41:02
 -->

### 工具鸡-聊天室

    兼容web,android,ios的聊天室。一次开发多端使用。

### 单机并发性能测试

```
[root@VM_65_181_centos ~]# websocket-bench -a 1000 -c 1000   http://212.64.83.121:501/room
Launch bench with 1000 total connection, 1000 concurent connection
0 message(s) send by client
1 worker(s)
WS server : socket.io

#### steps report ####
┌────────┬─────────────┬────────┬──────────────┐
│ Number │ Connections │ Errors │ Duration(ms) │
├────────┼─────────────┼────────┼──────────────┤
│ 1000   │ 1000        │ 0      │ 27790        │
└────────┴─────────────┴────────┴──────────────┘
#### total report ####
┌────────┬─────────────┬────────┬──────────────┬──────────────┬──────────────┐
│ Number │ Connections │ Errors │ Message Send │ Message Fail │ Duration(ms) │
├────────┼─────────────┼────────┼──────────────┼──────────────┼──────────────┤
│ 1000   │ 1000        │ 0      │ 0            │ 0            │ 27790        │
└────────┴─────────────┴────────┴──────────────┴──────────────┴──────────────┘

```

### 客户端体验地址

https://im.zhuhui.store

### 后台体验地址

http://admin.zhuhui.store  
账户: admin888
密码：123456

### 安卓版下载地址

http://down.zhuhui.store/chat.apk

### 文档地址

http://doc.zhuhui.store

### 项目架构

    app是前端,基于vue开发，
    chatAdmin是后台，基于vue开发，
    chatApi是接口，基于flask开发，
    前后端完全分离项目，适用于多端聊天应用。

### 前端项目功能

- [x] 登录注册
- [x] 用户界面
- [x] 设置界面
- [x] 聊天消息列表
- [x] 联系人列表
- [x] 聊天界面
- [x] 群聊
- [x] 聊天未收到重发
- [x] 增加聊天记录云端存储
- [x] rsa 加密数据
- [x] H5 语音
- [x] 视频聊天 2020/06/27 video分支

### 后台项目功能

- [x] 登录
- [x] 房间管理
- [x] 通讯录管理
- [x] 用户管理
- [x] 管理员管理
- [x] 管理员发起用户会话

### 项目截图

![输入图片说明](https://images.gitee.com/uploads/images/2019/0617/142434_ce5fed5e_1588193.png "8AO2N23X(AT%YCKU~)ZDICY.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0617/142442_df240c6e_1588193.png "8XFNDJCM46U)VSCZNI~(MZW.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0617/142449_b130cf60_1588193.png "153}QG8F60OV8HI27ZDMSN6.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0617/142458_11de22a5_1588193.png "C}EI)WI9VH$GD~XK15IH}}5.png")
![输入图片说明](https://images.gitee.com/uploads/images/2019/0617/142505_7fc25269_1588193.png "K~2G@NU~8WZG7WR0`FGS2]H.png")
<img src="https://images.gitee.com/uploads/images/2020/0627/185024_08caa957_1588193.jpeg " width="324px" >
### 前端项目安装

    cnpm install

### 前端项目开发环境

    npm run dev

### 前端项目生产环境

    npm run build

### 后端项目安装

    1.运行环境python3.5+, mysql5.6+, redis3+, centos7+
    2.数据库sql文件在doc目录下，运行安装
    3.centos运行install下面的脚本进行安装python3及扩展
        ./install_py3.sh
        ./install_vendor.sh

    4.将uwsgi的配置文件放在后端根目录下并执行命令
        uwsgi uwsgi.ini
        uwsgi uwsgiWeb.ini
    5.测试运行
        python socketRun.py
        python run.py

### win10安装工具鸡-聊天室视频
https://www.bilibili.com/video/BV1154y1y7H3

### centos安装工具鸡-聊天室视频
https://www.bilibili.com/video/BV1yD4y1R738


#### 作者其他开源产品

1. <a href="https://gitee.com/huashiyuting/flask " target="_blank">mvc 分层,json api 载体(中庸)的 flask</a>
2. <a href="https://gitee.com/huashiyuting/tool_chicken" target="_blank">工具鸡前端 app 项目 </a>
3. <a href="https://gitee.com/huashiyuting/status_bar_monitor" target="_blank">状态栏监听安卓客户端 </a>
4. <a href="https://gitee.com/huashiyuting/plainCms" target="_blank">plainCms</a>

#### 群内交流

![群内交流](https://images.gitee.com/uploads/images/2019/0724/121735_03ee3000_1588193.png "temp_qrcode_share_566438779.png")

#### 捐助作者

![捐助作者](https://images.gitee.com/uploads/images/2019/0124/105407_661d1190_1588193.png "mm_facetoface_collect_qrcode_1548297043215.png")

### 购买实时最新版

[淘宝链接](https://item.taobao.com/item.htm?ft=t&id=627987350463).

### 二次开发

    如果你对此项目有什么好的想法，可以联系作者定制开发。
