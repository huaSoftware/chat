# coding: utf-8
from sqlalchemy import BigInteger, Column, Integer, String, Text
from sqlalchemy.schema import FetchedValue
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()
metadata = Base.metadata


class HtAddressBook(Base):
    __tablename__ = 'ht_address_book'

    id = Column(Integer, primary_key=True)
    be_focused_user_id = Column(Integer, nullable=False)
    focused_user_id = Column(Integer, nullable=False, index=True)
    created_at = Column(Integer, nullable=False)
    updated_at = Column(Integer, nullable=False)
    room_uuid = Column(String(255), nullable=False, server_default=FetchedValue())
    save_action = Column(Integer, nullable=False, server_default=FetchedValue())
    is_alert = Column(Integer, nullable=False)
    unread_number = Column(Integer, nullable=False)


class HtAdmin(Base):
    __tablename__ = 'ht_admin'

    id = Column(Integer, primary_key=True)
    role_id = Column(Integer, nullable=False, server_default=FetchedValue())
    name = Column(String(30), nullable=False, server_default=FetchedValue())
    pwd = Column(String(32), nullable=False, server_default=FetchedValue())
    mobile = Column(String(20), nullable=False, server_default=FetchedValue())
    email = Column(String(30), nullable=False, server_default=FetchedValue())
    avatar = Column(String(150), nullable=False, server_default=FetchedValue())
    status = Column(Integer, nullable=False, server_default=FetchedValue())
    login_time = Column(Integer, nullable=False, server_default=FetchedValue())
    add_time = Column(Integer, nullable=False, server_default=FetchedValue())
    update_time = Column(Integer, nullable=False, server_default=FetchedValue())
    delete_time = Column(Integer, nullable=False, server_default=FetchedValue())


class HtLog(Base):
    __tablename__ = 'ht_logs'

    id = Column(Integer, primary_key=True)
    type = Column(Integer, nullable=False, server_default=FetchedValue())
    level = Column(Integer, nullable=False, server_default=FetchedValue())
    data = Column(Text, nullable=False)
    create_time = Column(Integer, nullable=False)


class HtMsg(Base):
    __tablename__ = 'ht_msg'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, server_default=FetchedValue())
    msg = Column(Text, nullable=False)
    room_uuid = Column(String(255), nullable=False, server_default=FetchedValue())
    user_id = Column(Integer, nullable=False)
    type = Column(Integer, nullable=False)
    head_img = Column(String(255), nullable=False, server_default=FetchedValue())
    created_at = Column(BigInteger, nullable=False)
    send_status = Column(Integer, nullable=False)


class HtRoom(Base):
    __tablename__ = 'ht_room'

    id = Column(Integer, primary_key=True)
    room_uuid = Column(String(255), nullable=False, unique=True, server_default=FetchedValue())
    last_msg = Column(String(255), nullable=False, server_default=FetchedValue())
    updated_at = Column(Integer, nullable=False)
    created_at = Column(Integer, nullable=False)
    type = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False, server_default=FetchedValue())
    user_id = Column(Integer, nullable=False)


class HtUserRoomRelation(Base):
    __tablename__ = 'ht_user_room_relation'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    room_uuid = Column(String(255), nullable=False, server_default=FetchedValue())
    save_action = Column(Integer, nullable=False, server_default=FetchedValue())
    is_alert = Column(Integer, nullable=False)
    unread_number = Column(Integer, nullable=False)
    created_at = Column(Integer, nullable=False)
    updated_at = Column(Integer, nullable=False)


class HtUser(Base):
    __tablename__ = 'ht_users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True, server_default=FetchedValue())
    password = Column(String(500), nullable=False, server_default=FetchedValue())
    nick_name = Column(String(255), nullable=False, server_default=FetchedValue())
    head_img = Column(String(255), nullable=False)
    first_word = Column(String(1), nullable=False, server_default=FetchedValue())
    updated_at = Column(Integer, nullable=False)
    created_at = Column(Integer, nullable=False)
