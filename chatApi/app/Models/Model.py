# coding: utf-8
from sqlalchemy import CHAR, Column, String, Text, text
from sqlalchemy.dialects.mysql import BIGINT, INTEGER, TEXT, TINYINT, VARCHAR
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class HtAddressBook(Base):
    __tablename__ = 'ht_address_book'

    id = Column(INTEGER(11), primary_key=True)
    be_focused_user_id = Column(String(32), nullable=False, server_default=text("''"))
    focused_user_id = Column(String(32), nullable=False, server_default=text("''"))
    created_at = Column(INTEGER(11), nullable=False)
    updated_at = Column(INTEGER(11), nullable=False)
    room_uuid = Column(VARCHAR(255), nullable=False, server_default=text("''"))
    save_action = Column(TINYINT(1), nullable=False, server_default=text("'0'"))
    is_alert = Column(TINYINT(1), nullable=False)
    unread_number = Column(INTEGER(11), nullable=False)
    is_input = Column(TINYINT(1), nullable=False, server_default=text("'0'"))
    type = Column(INTEGER(11), nullable=False, server_default=text("'0'"))


class HtAdmin(Base):
    __tablename__ = 'ht_admin'

    id = Column(INTEGER(11), primary_key=True)
    role_id = Column(INTEGER(11), nullable=False, server_default=text("'0'"))
    name = Column(String(30), nullable=False, server_default=text("''"))
    pwd = Column(CHAR(32), nullable=False, server_default=text("''"))
    mobile = Column(String(20), nullable=False, server_default=text("''"))
    email = Column(String(30), nullable=False, server_default=text("''"))
    avatar = Column(String(150), nullable=False, server_default=text("''"))
    status = Column(TINYINT(1), nullable=False, server_default=text("'0'"))
    login_time = Column(INTEGER(11), nullable=False, server_default=text("'0'"))
    add_time = Column(INTEGER(11), nullable=False, server_default=text("'0'"))
    update_time = Column(INTEGER(11), nullable=False, server_default=text("'0'"))
    delete_time = Column(INTEGER(11), nullable=False, server_default=text("'0'"))
    nick_name = Column(String(255), nullable=False, server_default=text("''"))
    uuid = Column(String(32), nullable=False, unique=True, server_default=text("''"))


class HtConfig(Base):
    __tablename__ = 'ht_config'

    id = Column(INTEGER(10), primary_key=True)
    name = Column(String(50), nullable=False)
    type = Column(String(50), nullable=False)
    description = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False)
    config = Column(Text, nullable=False)
    status = Column(TINYINT(4), nullable=False, server_default=text("'0'"))
    created_at = Column(INTEGER(11))
    updated_at = Column(INTEGER(11))


class HtLog(Base):
    __tablename__ = 'ht_logs'

    id = Column(INTEGER(11), primary_key=True)
    type = Column(TINYINT(2), nullable=False, server_default=text("'1'"))
    level = Column(TINYINT(2), nullable=False, server_default=text("'1'"))
    data = Column(TEXT, nullable=False)
    create_time = Column(INTEGER(11), nullable=False)


class HtMsg(Base):
    __tablename__ = 'ht_msg'

    id = Column(INTEGER(11), primary_key=True)
    name = Column(VARCHAR(255), nullable=False, server_default=text("''"))
    msg = Column(Text, nullable=False)
    room_uuid = Column(VARCHAR(255), nullable=False, server_default=text("''"))
    user_id = Column(INTEGER(11), nullable=False)
    type = Column(TINYINT(2), nullable=False)
    head_img = Column(VARCHAR(255), nullable=False, server_default=text("''"))
    created_at = Column(BIGINT(14), nullable=False)
    send_status = Column(TINYINT(1), nullable=False)
    read_status = Column(TINYINT(1), nullable=False, server_default=text("'0'"))
    user_type = Column(INTEGER(11), nullable=False, server_default=text("'0'"))


class HtRoom(Base):
    __tablename__ = 'ht_room'

    id = Column(INTEGER(11), primary_key=True)
    room_uuid = Column(VARCHAR(255), nullable=False, unique=True, server_default=text("''"))
    last_msg = Column(Text, nullable=False)
    updated_at = Column(INTEGER(11), nullable=False)
    created_at = Column(INTEGER(11), nullable=False)
    type = Column(INTEGER(11), nullable=False)
    name = Column(VARCHAR(255), nullable=False, server_default=text("''"))
    user_id = Column(INTEGER(11), nullable=False)


class HtUserRoomRelation(Base):
    __tablename__ = 'ht_user_room_relation'

    id = Column(INTEGER(11), primary_key=True)
    user_id = Column(INTEGER(11), nullable=False)
    room_uuid = Column(VARCHAR(255), nullable=False, server_default=text("''"))
    save_action = Column(TINYINT(1), nullable=False, server_default=text("'0'"))
    is_alert = Column(TINYINT(1), nullable=False)
    unread_number = Column(INTEGER(11), nullable=False)
    created_at = Column(INTEGER(11), nullable=False)
    updated_at = Column(INTEGER(11), nullable=False)
    type = Column(TINYINT(1), nullable=False, server_default=text("'0'"))
    status = Column(TINYINT(1), nullable=False, server_default=text("'0'"))


class HtUser(Base):
    __tablename__ = 'ht_users'

    id = Column(INTEGER(11), primary_key=True)
    email = Column(VARCHAR(255), nullable=False, unique=True, server_default=text("''"))
    password = Column(VARCHAR(500), nullable=False, server_default=text("''"))
    nick_name = Column(VARCHAR(255), nullable=False, server_default=text("''"))
    head_img = Column(String(255), nullable=False)
    first_word = Column(VARCHAR(1), nullable=False, server_default=text("''"))
    online = Column(TINYINT(1), nullable=False, server_default=text("'0'"))
    updated_at = Column(INTEGER(11), nullable=False)
    created_at = Column(INTEGER(11), nullable=False)
