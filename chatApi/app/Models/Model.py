# coding: utf-8
from sqlalchemy import CHAR, Column, String, Text, text
from sqlalchemy.dialects.mysql import BIGINT, INTEGER, TEXT, TINYINT, VARCHAR
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class HtAddressBook(Base):
    __tablename__ = 'ht_address_book'

    id = Column(INTEGER(11), primary_key=True, comment='编号')
    be_focused_user_id = Column(String(32), nullable=False, comment='被关注者用户编号')
    focused_user_id = Column(VARCHAR(
        32), nullable=False, index=True, server_default=text("''"), comment='关注者用户编号')
    created_at = Column(INTEGER(11), nullable=False, comment='创建时间')
    updated_at = Column(INTEGER(11), nullable=False, comment='更新时间')
    room_uuid = Column(VARCHAR(255), nullable=False,
                       server_default=text("''"), comment='房间唯一编号')
    save_action = Column(TINYINT(1), nullable=False,
                         server_default=text("'0'"), comment='保存方式')
    is_alert = Column(TINYINT(1), nullable=False, comment='是否提醒')
    unread_number = Column(INTEGER(11), nullable=False,
                           server_default=text("'0'"), comment='未读取信息次数')
    is_input = Column(TINYINT(1), nullable=False,
                      server_default=text("'0'"), comment='是否在输入')
    type = Column(INTEGER(11), nullable=False,
                  server_default=text("'0'"), comment='0是普通用户，1是后台用户')


class HtAdmin(Base):
    __tablename__ = 'ht_admin'

    id = Column(INTEGER(11), primary_key=True)
    role_id = Column(INTEGER(11), nullable=False,
                     server_default=text("'0'"), comment='角色ID')
    name = Column(String(30), nullable=False,
                  server_default=text("''"), comment='admin888')
    pwd = Column(CHAR(32), nullable=False,
                 server_default=text("''"), comment='admin')
    mobile = Column(String(20), nullable=False,
                    server_default=text("''"), comment='手机号')
    email = Column(String(30), nullable=False,
                   server_default=text("''"), comment='邮箱')
    avatar = Column(String(150), nullable=False,
                    server_default=text("''"), comment='头像')
    status = Column(TINYINT(1), nullable=False, server_default=text(
        "'0'"), comment='用户状态 0：正常； 1：禁用 ；2：未验证')
    login_time = Column(INTEGER(11), nullable=False,
                        server_default=text("'0'"), comment='登录时间')
    add_time = Column(INTEGER(11), nullable=False,
                      server_default=text("'0'"), comment='添加时间')
    update_time = Column(INTEGER(11), nullable=False,
                         server_default=text("'0'"), comment='更新时间')
    delete_time = Column(INTEGER(11), nullable=False,
                         server_default=text("'0'"), comment='删除时间')
    nick_name = Column(String(255), nullable=False,
                       server_default=text("''"), comment='昵称')
    uuid = Column(String(32), nullable=False, unique=True,
                  server_default=text("''"), comment='唯一编号')


class HtConfig(Base):
    __tablename__ = 'ht_config'

    id = Column(INTEGER(10), primary_key=True)
    name = Column(String(50), nullable=False, comment='名字')
    type = Column(String(50), nullable=False, comment='类型')
    description = Column(String(255), nullable=False, comment='描述')
    code = Column(String(50), nullable=False, comment='编号')
    config = Column(Text, nullable=False, comment='配置')
    status = Column(TINYINT(4), nullable=False,
                    server_default=text("'0'"), comment='状态')
    created_at = Column(INTEGER(11), comment='创建时间')
    updated_at = Column(INTEGER(11), comment='更新时间')


class HtLog(Base):
    __tablename__ = 'ht_logs'

    id = Column(INTEGER(11), primary_key=True, comment='编号')
    type = Column(TINYINT(2), nullable=False,
                  server_default=text("'1'"), comment='类型，1是普通接口日志')
    level = Column(TINYINT(2), nullable=False, server_default=text(
        "'1'"), comment='报错等级，1是debug，2是warn，3是error')
    data = Column(TEXT, nullable=False, comment='内容')
    create_time = Column(INTEGER(11), nullable=False, comment='创建时间')


class HtMsg(Base):
    __tablename__ = 'ht_msg'

    id = Column(INTEGER(11), primary_key=True, comment='编号')
    name = Column(VARCHAR(255), nullable=False,
                  server_default=text("''"), comment='名字')
    msg = Column(Text, nullable=False, comment='聊天内容')
    room_uuid = Column(VARCHAR(255), nullable=False,
                       server_default=text("''"), comment='房间唯一编号')
    user_id = Column(INTEGER(11), nullable=False, comment='用户编号')
    type = Column(TINYINT(2), nullable=False, comment='类型')
    head_img = Column(VARCHAR(255), nullable=False,
                      server_default=text("''"), comment='头像')
    created_at = Column(BIGINT(14), nullable=False, comment='创建时间')
    send_status = Column(TINYINT(1), nullable=False, comment='发送状态')
    read_status = Column(TINYINT(1), nullable=False,
                         server_default=text("'0'"), comment='读取状态')
    user_type = Column(INTEGER(11), nullable=False,
                       server_default=text("'0'"), comment='0是普通用户，1是管理员')


class HtRoom(Base):
    __tablename__ = 'ht_room'

    id = Column(INTEGER(11), primary_key=True, comment='编号')
    room_uuid = Column(VARCHAR(255), nullable=False, unique=True,
                       server_default=text("''"), comment='房间编号')
    last_msg = Column(Text, nullable=False, comment='最后一条消息')
    updated_at = Column(INTEGER(11), nullable=False, comment='最后一条消息时间')
    created_at = Column(INTEGER(11), nullable=False, comment='创建时间')
    type = Column(INTEGER(11), nullable=False, comment='类型，0是单聊，1是群聊')
    name = Column(VARCHAR(255), nullable=False,
                  server_default=text("''"), comment='房间名')
    user_id = Column(INTEGER(11), nullable=False, comment='用户编号')


class HtUserRoomRelation(Base):
    __tablename__ = 'ht_user_room_relation'

    id = Column(INTEGER(11), primary_key=True, comment='编号')
    user_id = Column(INTEGER(11), nullable=False, comment='用户编号')
    room_uuid = Column(VARCHAR(255), nullable=False,
                       server_default=text("''"), comment='房间编号')
    save_action = Column(TINYINT(1), nullable=False,
                         server_default=text("'0'"), comment='保存方式')
    is_alert = Column(TINYINT(1), nullable=False, comment='是否提醒')
    unread_number = Column(INTEGER(11), nullable=False, comment='未读取信息次数')
    created_at = Column(INTEGER(11), nullable=False, comment='创建时间')
    updated_at = Column(INTEGER(11), nullable=False, comment='更新时间')


class HtUser(Base):
    __tablename__ = 'ht_users'

    id = Column(INTEGER(11), primary_key=True, comment='编号')
    email = Column(VARCHAR(255), nullable=False, unique=True,
                   server_default=text("''"), comment='邮箱')
    password = Column(VARCHAR(500), nullable=False,
                      server_default=text("''"), comment='密码')
    nick_name = Column(VARCHAR(255), nullable=False,
                       server_default=text("''"), comment='昵称')
    head_img = Column(String(255), nullable=False, comment='头像')
    first_word = Column(VARCHAR(1), nullable=False,
                        server_default=text("''"), comment='首字母')
    online = Column(TINYINT(1), nullable=False,
                    server_default=text("'0'"), comment='在线状态')
    updated_at = Column(INTEGER(11), nullable=False, comment='更新时间')
    created_at = Column(INTEGER(11), nullable=False, comment='创建时间')
