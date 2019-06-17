#### 项目介绍
一套基于flask，vue的前后端分离的解决方案（献给从事web开发的pythoner）。

人生苦短，我用python!


#### 软件架构
一.后端flask程序:

	1.三个入口文件:

		json api入口启动run.py

		restful api入口启动 restfulRun.py

		websocket入口启动 socketRun.py	
	
	2.运行流程

		run.py->

		app/__init__.py ->

		app/Middleware/XSSProtection.py(抽象一层中间层用于处理一些统一验证的逻辑，根据需求进行添加)

		app/Controllers/UsersController.py(接收前端json参数并分发给模型层处理,参考flask request模块接参方法)->

		app/Models/Users.py(业务逻辑书写成静态方法或类方法给控制层调用)->

		app/Controllers/UsersController.py(接收模型层返回值返回)


二.前端vue程序:

	1.安装，运行，打包:

		采用webpack，vue,mint-ui技术的前端解决方案

		npm install(建议使用淘宝源 cnpm install)

		npm run dev(启动测试环境)

		npm run build(打包成浏览器识别的语法)

	2.一些重要的文件夹及文件:

		路由层:src/router/index.js

		视图层:src/views/*

		组件层:src/components/*

		api层:src/api/*

		资源层:src/assets/*

		仓储层(vuex):src/store/*

		工具层:src/utils/*

#### 作者其他开源产品
1. 工具鸡前端app项目 https://gitee.com/huashiyuting/tool_chicken
2. 状态栏监听安卓客户端 https://gitee.com/huashiyuting/status_bar_monitor

#### 捐助作者
![捐助作者](https://images.gitee.com/uploads/images/2019/0124/105407_661d1190_1588193.png "mm_facetoface_collect_qrcode_1548297043215.png")	
