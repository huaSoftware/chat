/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50553
 Source Host           : localhost:3306
 Source Schema         : chat

 Target Server Type    : MySQL
 Target Server Version : 50553
 File Encoding         : 65001

 Date: 23/11/2019 15:34:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ht_address_book
-- ----------------------------
DROP TABLE IF EXISTS `ht_address_book`;
CREATE TABLE `ht_address_book`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `be_focused_user_id` int(11) UNSIGNED NOT NULL COMMENT '被关注者用户编号',
  `focused_user_id` int(11) UNSIGNED NOT NULL COMMENT '关注者用户编号',
  `created_at` int(11) UNSIGNED NOT NULL COMMENT '创建时间',
  `updated_at` int(11) NOT NULL COMMENT '更新时间',
  `room_uuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间唯一编号',
  `save_action` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '保存方式',
  `is_alert` tinyint(1) NOT NULL COMMENT '是否提醒',
  `unread_number` int(11) UNSIGNED NOT NULL COMMENT '未读取信息次数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `focused_user_id`(`focused_user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ht_admin
-- ----------------------------
DROP TABLE IF EXISTS `ht_admin`;
CREATE TABLE `ht_admin`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '角色ID',
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'admin888',
  `pwd` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT 'admin',
  `mobile` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '手机号',
  `email` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `avatar` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '头像',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户状态 0：正常； 1：禁用 ；2：未验证',
  `login_time` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '登录时间',
  `add_time` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '添加时间',
  `update_time` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '更新时间',
  `delete_time` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '管理员表' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ht_config
-- ----------------------------
DROP TABLE IF EXISTS `ht_config`;
CREATE TABLE `ht_config`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '名字',
  `type` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类型',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '描述',
  `code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '编号',
  `config` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '配置',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '状态',
  `created_at` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` int(11) UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ht_logs
-- ----------------------------
DROP TABLE IF EXISTS `ht_logs`;
CREATE TABLE `ht_logs`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `type` tinyint(2) UNSIGNED NOT NULL DEFAULT 1 COMMENT '类型，1是普通接口日志',
  `level` tinyint(2) UNSIGNED NOT NULL DEFAULT 1 COMMENT '报错等级，0是normal,1是debug，2是warn，3是error',
  `data` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容',
  `create_time` int(11) UNSIGNED NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 230 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ht_msg
-- ----------------------------
DROP TABLE IF EXISTS `ht_msg`;
CREATE TABLE `ht_msg`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '名字',
  `msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '聊天内容',
  `room_uuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间唯一编号',
  `user_id` int(11) UNSIGNED NOT NULL COMMENT '用户编号',
  `type` tinyint(2) UNSIGNED NOT NULL COMMENT '类型',
  `head_img` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '头像',
  `created_at` bigint(14) UNSIGNED NOT NULL COMMENT '创建时间',
  `send_status` tinyint(2) NOT NULL COMMENT '发送状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ht_room
-- ----------------------------
DROP TABLE IF EXISTS `ht_room`;
CREATE TABLE `ht_room`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `room_uuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间编号',
  `last_msg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '最后一条消息',
  `updated_at` int(11) UNSIGNED NOT NULL COMMENT '最后一条消息时间',
  `created_at` int(11) UNSIGNED NOT NULL COMMENT '创建时间',
  `type` int(11) UNSIGNED NOT NULL COMMENT '类型，0是单聊，1是群聊',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间名',
  `user_id` int(11) UNSIGNED NOT NULL COMMENT '用户编号',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `room_uuid`(`room_uuid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ht_user_room_relation
-- ----------------------------
DROP TABLE IF EXISTS `ht_user_room_relation`;
CREATE TABLE `ht_user_room_relation`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_id` int(11) UNSIGNED NOT NULL COMMENT '用户编号',
  `room_uuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间编号',
  `save_action` tinyint(1) NOT NULL DEFAULT 0 COMMENT '保存方式',
  `is_alert` tinyint(1) UNSIGNED NOT NULL COMMENT '是否提醒',
  `unread_number` int(11) UNSIGNED NOT NULL COMMENT '未读取信息次数',
  `created_at` int(11) UNSIGNED NOT NULL COMMENT '创建时间',
  `updated_at` int(11) UNSIGNED NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ht_users
-- ----------------------------
DROP TABLE IF EXISTS `ht_users`;
CREATE TABLE `ht_users`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `password` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `head_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '头像',
  `first_word` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '首字母',
  `updated_at` int(11) UNSIGNED NOT NULL COMMENT '更新时间',
  `created_at` int(11) UNSIGNED NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
