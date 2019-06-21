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

 Date: 21/06/2019 15:45:44
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
  `is_alert` int(1) NOT NULL COMMENT '是否提醒',
  `unread_number` int(11) UNSIGNED NOT NULL COMMENT '未读取信息次数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `focused_user_id`(`focused_user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ht_address_book
-- ----------------------------
INSERT INTO `ht_address_book` VALUES (7, 2, 1, 1554102100, 1560749465, '5ca1b753d1667', 1, 0);
INSERT INTO `ht_address_book` VALUES (8, 1, 2, 1554102100, 1560749465, '5ca1b753d1667', 1, 3);
INSERT INTO `ht_address_book` VALUES (17, 4, 1, 1554259531, 1559961321, '5ca41e4a5b571', 1, 40);
INSERT INTO `ht_address_book` VALUES (18, 1, 4, 1554259531, 1559961321, '5ca41e4a5b571', 1, 0);

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
-- Records of ht_admin
-- ----------------------------
INSERT INTO `ht_admin` VALUES (1, 1, 'admin888', 'e10adc3949ba59abbe56e057f20f883e', '', 'admin@qq.com', '', 0, 1558572227, 4294967295, 1560415645, 0);
INSERT INTO `ht_admin` VALUES (2, 0, 'admin8888', 'e10adc3949ba59abbe56e057f20f883e', '', '', '', 0, 0, 0, 0, 0);
INSERT INTO `ht_admin` VALUES (3, 0, 'admin8881', 'e10adc3949ba59abbe56e057f20f883e', '', '', '', 0, 0, 0, 0, 0);

-- ----------------------------
-- Table structure for ht_room
-- ----------------------------
DROP TABLE IF EXISTS `ht_room`;
CREATE TABLE `ht_room`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `room_uuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间编号',
  `last_msg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '最后一条消息',
  `updated_at` int(10) UNSIGNED NOT NULL COMMENT '最后一条消息时间',
  `created_at` int(10) UNSIGNED NOT NULL COMMENT '创建时间',
  `type` int(10) UNSIGNED NOT NULL COMMENT '类型，0是单聊，1是群聊',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间名',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `room_uuid`(`room_uuid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ht_room
-- ----------------------------
INSERT INTO `ht_room` VALUES (11, '763986aa6589435b8fb8c57a8afd6073', '44', 1554036970, 1552553847, 0, '');
INSERT INTO `ht_room` VALUES (13, '5ca1b2a84fd64', '', 1554100904, 1554100904, 0, '');
INSERT INTO `ht_room` VALUES (14, '5ca1b63823008', '', 1554101816, 1554101816, 0, '');
INSERT INTO `ht_room` VALUES (16, '5ca1b753d1667', '<img src=\"static/icons/more/5.gif\">', 1560749465, 1554102100, 0, '');
INSERT INTO `ht_room` VALUES (18, '5ca41e4a5b571', '<img src=\"static/icons/more/6.gif\"><img src=\"static/icons/more/12.gif\"><img src=\"static/icons/more/20.gif\">', 1559961321, 1554259531, 0, '');
INSERT INTO `ht_room` VALUES (19, '5cf784b2524b1', '<img src=\"static/icons/more/7.gif\"><img src=\"static/icons/more/7.gif\"><img src=\"static/icons/more/15.gif\">', 1559725322, 1559725234, 1, '');
INSERT INTO `ht_room` VALUES (20, '5cf78702cf627', '<img src=\"static/icons/more/6.gif\">', 1559725830, 1559725827, 1, '');
INSERT INTO `ht_room` VALUES (21, '5cf788162e1f1', '', 1559726102, 1559726102, 1, '');
INSERT INTO `ht_room` VALUES (22, '5cf78834c39df', '', 1559726132, 1559726132, 1, '');
INSERT INTO `ht_room` VALUES (23, '5cf86cdb1d8aa', '424', 1559786810, 1559784667, 1, '');
INSERT INTO `ht_room` VALUES (24, '5cf8754d5fdbb', '535', 1559786918, 1559786830, 1, '');
INSERT INTO `ht_room` VALUES (25, '5cf875b143a69', '<img src=\"static/icons/more/22.gif\">', 1559787131, 1559786929, 1, '');
INSERT INTO `ht_room` VALUES (26, '5cf8775926030', '4242', 1559787367, 1559787354, 1, '');
INSERT INTO `ht_room` VALUES (27, '5cf8c68fe4c64', '4242', 1559807640, 1559807632, 1, '');
INSERT INTO `ht_room` VALUES (28, '5cf8cbe6c3001', '3232', 1559809000, 1559808999, 1, '');
INSERT INTO `ht_room` VALUES (29, '5cf8d5a3f780f', 'shei', 1560749405, 1559811493, 1, 'zzzz,zvvd,bbb');
INSERT INTO `ht_room` VALUES (30, '5cfdaa7eaa364', '<img src=\"static/icons/more/8.gif\">', 1560128161, 1560128127, 0, '');

-- ----------------------------
-- Table structure for ht_user_room_relation
-- ----------------------------
DROP TABLE IF EXISTS `ht_user_room_relation`;
CREATE TABLE `ht_user_room_relation`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '编号',
  `user_id` int(11) UNSIGNED NOT NULL COMMENT '用户编号',
  `room_uuid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '房间编号',
  `is_alert` int(1) UNSIGNED NOT NULL COMMENT '是否提醒',
  `unread_number` int(11) UNSIGNED NOT NULL COMMENT '未读取信息次数',
  `created_at` int(11) UNSIGNED NOT NULL COMMENT '创建时间',
  `updated_at` int(11) UNSIGNED NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ht_user_room_relation
-- ----------------------------
INSERT INTO `ht_user_room_relation` VALUES (22, 1, '5cf8d5a3f780f', 0, 0, 1559811493, 1560749405);
INSERT INTO `ht_user_room_relation` VALUES (23, 4, '5cf8d5a3f780f', 0, 5, 1559811493, 1560749405);
INSERT INTO `ht_user_room_relation` VALUES (24, 2, '5cf8d5a3f780f', 0, 2, 1559811493, 1560749405);

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
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ht_users
-- ----------------------------
INSERT INTO `ht_users` VALUES (1, '584425439@qq.com', 'pbkdf2:sha256:50000$fMBTVCSA$7ee57fb5b8f9508f0bd0f79646b3069f4f70e1099c7c7f27c173f6c4bddb10e5', 'zzzz', 'http://127.0.0.1:501/uploads/5c88c32b34009.png', 'Z', 1560749353, 1552466761);
INSERT INTO `ht_users` VALUES (2, '584425430@qq.com', 'pbkdf2:sha256:50000$HrMFURCf$e9d8f8b891b9c4899402764919707698cf4fe3a5956313efce034cb80b77ba8c', 'bbb', 'http://127.0.0.1:501/uploads/5c88c7c09020d.png', 'Z', 1560748788, 1552467921);
INSERT INTO `ht_users` VALUES (3, '584425431@qq.com', 'pbkdf2:sha256:50000$t68lFfvv$4f523b9d087674e02394c9a2c94e35d59a962d5a3560e46e3d0a9c129775630f', '整整齐齐', 'http://127.0.0.1:501/uploads/5ca402c98455c.png', 'Z', 1554252922, 1554252922);
INSERT INTO `ht_users` VALUES (4, '5811@qq.com', 'pbkdf2:sha256:50000$cFfZQYE4$325b5855bb8b947f84de3592f2c016c51e441a9f183b64cd69aaaeac9d4122f7', 'zvvd', 'http://127.0.0.1:501/uploads/5ca405359a5f5.png', 'Z', 1560081636, 1554253143);
INSERT INTO `ht_users` VALUES (5, '581111@qq.com', 'pbkdf2:sha256:50000$bwGHUjiV$a47827db01cdb52fd5432526d328de9f11d3fd19a9ef59a60f71f9d873cf2e41', 'zvvd', 'http://127.0.0.1:501/uploads/5ca405359a5f5.png', 'Z', 1554472414, 1554255476);
INSERT INTO `ht_users` VALUES (6, '5823@qq.com', 'pbkdf2:sha256:50000$nYyfdEwB$f8f7a290d9cfa8e8a03d693bee572d451824322f81cdbe446d27095837dd31ef', 'zczqwe', 'http://127.0.0.1:501/uploads/5ca45e96e14b3.png', 'Z', 1554276572, 1554276572);
INSERT INTO `ht_users` VALUES (7, '121211.com', 'pbkdf2:sha256:50000$K3ykaL67$dc344ef151e49b91a40606392f4b53351d864c73432715686670dbed3d8a50d7', '3131', 'http://127.0.0.1:501/uploads/5ca461156425f.png', '#', 1554276838, 1554276838);
INSERT INTO `ht_users` VALUES (8, '1212e11@qq.com', 'pbkdf2:sha256:50000$eIF3exbS$4127eb339e6a1652a64247ed9ed1e3a4b87fa917d7c0aa3d8c0221f0316273a4', 'rrrer', 'http://127.0.0.1:501/uploads/5ca461156425f.png', 'R', 1554281685, 1554281685);
INSERT INTO `ht_users` VALUES (9, '5844215439@qq.com', 'pbkdf2:sha256:50000$B8EqpUVy$fb6f090667f82de8ab824bf3bf73e6c29f38619e8db159ef450de9ff85c608d8', '测试', 'http://127.0.0.1:501/uploads/5cee81358957.png', 'C', 1560127123, 1559134711);
INSERT INTO `ht_users` VALUES (10, 'zfafs@qq.com', 'pbkdf2:sha256:50000$UlI3cG72$2a52ca1bc690ad2b98eef12af7cb6f9af83c69927b1bc870ed12cae578a5ce44', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559193757, 1559193757);
INSERT INTO `ht_users` VALUES (11, 'zfaf1s@qq.com', 'pbkdf2:sha256:50000$pIqt1jL2$d81e519ee7abe193f442546438d728a54cd97cfe6f26d0ad004b022b95c90cdd', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559193824, 1559193824);
INSERT INTO `ht_users` VALUES (12, 'zfafw1s@qq.com', 'pbkdf2:sha256:50000$k9utkbrn$b8176cfd7fb4775a5ac4b7fc705661f4bda3d478206d511eb44fbdff80b88732', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559193856, 1559193856);
INSERT INTO `ht_users` VALUES (13, 'zfafw11s@qq.com', 'pbkdf2:sha256:50000$HzQwX7Py$e5bafb5f2c9e906eea96702c81b2b48f00ce05c051dc9bb4b796b281fa299163', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559193872, 1559193872);
INSERT INTO `ht_users` VALUES (14, 'zfafs3@qq.com', 'pbkdf2:sha256:50000$eZgDr12L$8f61e1a778f4bcf94e0a546119742f8fdd48e9b5ea2540e6d22dc2a0b34e547c', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559193929, 1559193929);
INSERT INTO `ht_users` VALUES (15, 'z3fafs3@qq.com', 'pbkdf2:sha256:50000$feKfujwG$57171417c4543fd523242b42e505ca018e20626dfc2a69d61298b8d03db3d8d7', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559193933, 1559193933);
INSERT INTO `ht_users` VALUES (16, 'z3faf3s3@qq.com', 'pbkdf2:sha256:50000$ETzOa5YG$efeb348f9832c23b08a9c2df5aa4f1e597326693cf9df27002efd1bc2c717543', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559193946, 1559193946);
INSERT INTO `ht_users` VALUES (17, 'z3fa1f3s3@qq.com', 'pbkdf2:sha256:50000$vhU3CsTz$fc0a01d72438baf4c639c57e9369b8a5ba4ec5ce7833f8dd57c10f9a5ab9df9c', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559194135, 1559194135);
INSERT INTO `ht_users` VALUES (18, 'z313fa1f3s3@qq.com', 'pbkdf2:sha256:50000$6e534uvH$15a8b56e7951db936f565417dea332b0d4919b8f23db6942bbb62bf8d7871f56', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559194219, 1559194219);
INSERT INTO `ht_users` VALUES (19, 'z3131fa1f3s3@qq.com', 'pbkdf2:sha256:50000$egCXpLSp$099ad64e98893bc7c79fa9efc28ec01d581a7c2c6972c2573588b1715b6c1173', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559194280, 1559194280);
INSERT INTO `ht_users` VALUES (20, 'z3131fa1f1s3@qq.com', 'pbkdf2:sha256:50000$5WkXus62$0790e46c02637d89e1caf51c5da3f01c9f9ac50f8fd17c33e9007b2b2bc05503', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559194349, 1559194349);
INSERT INTO `ht_users` VALUES (21, 'z31314a1f1s3@qq.com', 'pbkdf2:sha256:50000$KKwQkX0q$c3a64ebcadc2617953017ea6ac9c90323ddc6d29b0fdac8f209d36b8abcd4772', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559194745, 1559194745);
INSERT INTO `ht_users` VALUES (22, 'z3131f1s3@qq.com', 'pbkdf2:sha256:50000$yqR3OO20$195f9db78be103fbe33eafec62737638a29661e5a5c51cbd21be90db2dd9ccc4', 'zc', 'http://127.0.0.1:501/uploads/5cef6787dad33.png', 'Z', 1559194952, 1559194952);
INSERT INTO `ht_users` VALUES (23, '123456@qq.com', 'pbkdf2:sha256:50000$tA5MtVRY$ea741919f4753c443dd16ad5374fdce6187ebfd4b0558dc4ff9d3988186a6ab2', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559205408, 1559205408);
INSERT INTO `ht_users` VALUES (24, '1234516@qq.com', 'pbkdf2:sha256:50000$q49H8ccn$b305574e427b1b3a9300bc49ee042639b835e3ac258467f6513ec91fc25aed01', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559205621, 1559205621);
INSERT INTO `ht_users` VALUES (25, '12345116@qq.com', 'pbkdf2:sha256:50000$wBDDNv7q$50feaa9fb439277e7f19856613ee7cebb28af3c581a5e8bc55c57349e159e98e', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559205797, 1559205797);
INSERT INTO `ht_users` VALUES (28, '182346@qq.com', 'pbkdf2:sha256:50000$xszaGZPK$b5e70f62f1ee19030ca7f180241a1439f321bbf877d4a781ec353e61d7736c4f', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559206222, 1559206222);
INSERT INTO `ht_users` VALUES (29, '182566@qq.com', 'pbkdf2:sha256:50000$6f8357Qz$63133aec2ed142e4102c026bd14f32df9636127e9c0b29bd24f974a5fa76a5f8', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559206939, 1559206939);
INSERT INTO `ht_users` VALUES (30, '145566@qq.com', 'pbkdf2:sha256:50000$Do83K7QP$0cb701cd9bd943ac6e9e5a6479aa2472f66079d9c2b0d6b4fbc2d398fb7d3b9c', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559206969, 1559206969);
INSERT INTO `ht_users` VALUES (31, '453566@qq.com', 'pbkdf2:sha256:50000$FqP1Da1B$3c96ae92cce5500ed3c56251aec81bb0d50228f81a4f57662fa8aa5ae4a64ea6', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559207013, 1559207013);
INSERT INTO `ht_users` VALUES (32, '4531566@qq.com', 'pbkdf2:sha256:50000$k74Qdr3t$b6e7e02adafad73068b9390f8ed51756329e3187a0b29596debd4d2d8514b422', '风一样的', 'http://127.0.0.1:501/uploads/5cef961bc5062.png', 'F', 1559207113, 1559207113);

SET FOREIGN_KEY_CHECKS = 1;
