/*
Navicat MySQL Data Transfer

Source Server         : alis
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : alis

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2019-10-17 09:24:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for gouwuche
-- ----------------------------
DROP TABLE IF EXISTS `gouwuche`;
CREATE TABLE `gouwuche` (
  `cid` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `color` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `imgs` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `total` varchar(255) NOT NULL,
  `oid` int(255) NOT NULL,
  `dian` varchar(255) NOT NULL,
  `kucun` varchar(255) NOT NULL,
  `yid` int(11) NOT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of gouwuche
-- ----------------------------
INSERT INTO `gouwuche` VALUES ('65', '红色', '5', '桐乐儿 迷你复古休闲半圆马鞍包 ES289', '../img/xq/nuo1.jpg', '58.5', '292.50', '2', '诺豹箱包', '210', '48');

-- ----------------------------
-- Table structure for gwc
-- ----------------------------
DROP TABLE IF EXISTS `gwc`;
CREATE TABLE `gwc` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `names` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `imgs` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `quantity` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `oid` int(11) DEFAULT NULL,
  `yid` int(11) DEFAULT NULL,
  `pirce` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of gwc
-- ----------------------------
INSERT INTO `gwc` VALUES ('6', '华为 Mate 30 Pro 全网通5G版 亮黑色 8GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20190922155151203.jpg.webp', '1', '7', '48', '6899');
INSERT INTO `gwc` VALUES ('8', '小米9 Pro 5G版 梦之白 12GB+512GB', 'https://img2.yaya.cn/pic/product/440x440/20190923100026167.jpg.webp', '1', '6', '48', '4299');

-- ----------------------------
-- Table structure for list
-- ----------------------------
DROP TABLE IF EXISTS `list`;
CREATE TABLE `list` (
  `﻿uid` int(11) NOT NULL,
  `names` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `imgs` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pirce` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `minimg1` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `minimg2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `minimg3` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `minimg4` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `kucun` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pinglun` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`﻿uid`,`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of list
-- ----------------------------
INSERT INTO `list` VALUES ('1', '华为 Mate 30 全网通4G版 亮黑色 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190929112422213.jpg.webp', '3999', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '200', '31', '1');
INSERT INTO `list` VALUES ('2', '华为 Mate 30 Pro 全网通4G版 亮黑色', 'https://img2.yaya.cn/pic/product/440x440/20190919223500606.jpg.webp', '5799', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '310', '12', '2');
INSERT INTO `list` VALUES ('3', 'Apple iPhone 11 全网通 黑色 64GB', 'https://img2.yaya.cn/pic/product/440x440/20190911103416335.jpg.webp', '5499', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '420', '32', '3');
INSERT INTO `list` VALUES ('4', 'Apple iPhone 11 Pro Max 全网通版 银色 64GB', 'https://img2.yaya.cn/pic/product/440x440/201910091748408.jpg.webp', '9299', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '530', '24', '4');
INSERT INTO `list` VALUES ('5', 'vivo NEX 3 5G版 深空流光 8GB+256GB ', 'https://img2.yaya.cn/pic/product/440x440/20190916202050147.jpg.webp', '5698', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '640', '23', '5');
INSERT INTO `list` VALUES ('6', '小米9 Pro 5G版 梦之白 12GB+512GB', 'https://img2.yaya.cn/pic/product/440x440/20190923100026167.jpg.webp', '4299', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '750', '22', '6');
INSERT INTO `list` VALUES ('7', '华为 Mate 30 Pro 全网通5G版 亮黑色 8GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20190922155151203.jpg.webp', '6899', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '860', '68', '7');
INSERT INTO `list` VALUES ('8', '华为 Mate 30 全网通5G版 翡冷翠 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190922152716663.jpg.webp', '4999', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '970', '23', '8');
INSERT INTO `list` VALUES ('9', 'Apple iPhone 11 Pro 全网通 金色 64GB', 'https://img2.yaya.cn/pic/product/440x440/20191009174146261.jpg.webp', '8399', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '1080', '24', '9');
INSERT INTO `list` VALUES ('10', '小米9 全网通版 幻彩蓝 8GB+256GB ', 'https://img2.yaya.cn/pic/product/440x440/20190618233637915.jpg.webp', '2850', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '1190', '25', '10');
INSERT INTO `list` VALUES ('11', '三星 Galaxy Note 10+ 5G版 莫奈彩 12GB+256GB ', 'https://img2.yaya.cn/pic/product/440x440/20191008112306673.jpg.webp', '7999', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '1300', '26', '11');
INSERT INTO `list` VALUES ('12', '华为 Mate 20 X 5G版 翡冷翠 8GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20190726154446263.jpg.webp', '6199', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '1410', '27', '12');
INSERT INTO `list` VALUES ('13', '华为 荣耀9X 全网通版 幻夜黑 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190723161722265.jpg.webp', '1899', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '1520', '28', '13');
INSERT INTO `list` VALUES ('14', '华为 nova 5 Pro 全网通版 亮黑色 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190614143102844.jpg.webp', '2999', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '1630', '29', '14');
INSERT INTO `list` VALUES ('15', '华为 荣耀 Play 3 全网通版 幻夜黑 4GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190904202828700.jpg.webp', '1299', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '1740', '30', '15');
INSERT INTO `list` VALUES ('16', '华为 畅享10 Plus 全网通版 翡冷翠 6GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/2019092911250449.jpg.webp', '1799', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '1850', '31', '16');
INSERT INTO `list` VALUES ('17', 'OPPO Reno 2 全网通版 深海夜光 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20191008113759261.jpg.webp', '2998', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '1960', '32', '17');
INSERT INTO `list` VALUES ('18', 'vivo iQOO Pro 5G版 竞速黑 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190822203851127.jpg.webp', '3798', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '2070', '33', '18');
INSERT INTO `list` VALUES ('19', '华为 P30 全网通版 天空之境 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190929112618850.jpg.webp', '3688', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '2180', '34', '19');
INSERT INTO `list` VALUES ('20', '华为 荣耀 20 全网通版 幻夜黑 8GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20190618233212736.jpg.webp', '2699', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '2290', '35', '20');
INSERT INTO `list` VALUES ('21', '华为 P30 Pro 全网通版 亮黑色 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190929140609326.jpg.webp', '4988', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '2400', '36', '21');
INSERT INTO `list` VALUES ('22', 'vivo U3x 全网通版 赤茶红 4GB+64GB', 'https://img2.yaya.cn/pic/product/440x440/20190916204921308.jpg.webp', '9989', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '2510', '37', '22');
INSERT INTO `list` VALUES ('23', 'OPPO A11x全网通版 湖光绿 8GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/201909161016190.jpg.webp', '1798', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '2620', '38', '23');
INSERT INTO `list` VALUES ('24', '努比亚 红魔3S 游戏手机 红蓝竞技 12GB+256GB 高通骁龙855Plus', 'https://img2.yaya.cn/pic/product/440x440/2019073110013366.jpg.webp', '3750', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '2730', '39', '24');
INSERT INTO `list` VALUES ('25', '红米 Redmi Note 8 Pro 全网通版 电光灰 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190929112422213.jpg.webp', '1699', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '2840', '40', '25');
INSERT INTO `list` VALUES ('26', '魅族 16s Pro 全网通版 白色物语 8GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/20190919223500606.jpg.webp', '3099', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '2950', '41', '26');
INSERT INTO `list` VALUES ('27', 'vivo Z5x 全网通版 幻彩粉 6GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/20190911103416335.jpg.webp', '1598', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '3060', '42', '27');
INSERT INTO `list` VALUES ('28', '华为 麦芒8 全网通版 幻夜黑 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/201910091748408.jpg.webp', '1599', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '3170', '43', '28');
INSERT INTO `list` VALUES ('29', '一加手机7 Pro 全网通版 星雾蓝 8GB+256GB ', 'https://img2.yaya.cn/pic/product/440x440/20190916202050147.jpg.webp', '4299', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '3280', '44', '29');
INSERT INTO `list` VALUES ('30', 'OPPO Reno 全网通版 雾海绿 6GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20190923100026167.jpg.webp', '2498', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '3390', '45', '30');
INSERT INTO `list` VALUES ('31', 'OPPO K5 全网通版 极地阳光 8GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20190922155151203.jpg.webp', '2499', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '3500', '46', '31');
INSERT INTO `list` VALUES ('32', 'OPPO Reno Ace 全网通版 星际蓝 12GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20190922152716663.jpg.webp', '3798', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '3610', '47', '32');
INSERT INTO `list` VALUES ('33', '一加手机 7T 新品10月15日发布', 'https://img2.yaya.cn/pic/product/440x440/20191009174146261.jpg.webp', '1234', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '3720', '48', '33');
INSERT INTO `list` VALUES ('34', '红米 Redmi K20 Pro 尊享版 碳纤黑 8GB+512GB', 'https://img2.yaya.cn/pic/product/440x440/20190618233637915.jpg.webp', '2993', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '3830', '49', '34');
INSERT INTO `list` VALUES ('35', '小米 MIX Alpha 黑色 12GB+512GB', 'https://img2.yaya.cn/pic/product/440x440/20191008112306673.jpg.webp', '1999', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '3940', '50', '35');
INSERT INTO `list` VALUES ('36', 'realme X2 全网通版 银白翼 8GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/20190726154446263.jpg.webp', '1799', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '4050', '51', '36');
INSERT INTO `list` VALUES ('37', '华为 Mate 30 RS 保时捷版 玄黑 12GB+512GB', 'https://img2.yaya.cn/pic/product/440x440/20190723161722265.jpg.webp', '1299', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '4160', '52', '37');
INSERT INTO `list` VALUES ('38', 'realme Q 全网通版 光钻绿 6GB+64GB', 'https://img2.yaya.cn/pic/product/440x440/20190614143102844.jpg.webp', '1198', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '4270', '53', '38');
INSERT INTO `list` VALUES ('39', '红米 Redmi Note 8 全网通版 梦幻蓝 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190904202828700.jpg.webp', '1399', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '4380', '54', '39');
INSERT INTO `list` VALUES ('40', '华为 荣耀 20S 全网通版 蝶羽白 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/2019092911250449.jpg.webp', '2199', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '4490', '55', '40');
INSERT INTO `list` VALUES ('41', '华为 荣耀9X Pro 全网通版 幻影紫 8GB+256GB', 'https://img2.yaya.cn/pic/product/440x440/20191008113759261.jpg.webp', '2399', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '4600', '56', '41');
INSERT INTO `list` VALUES ('42', 'vivo iQOO 全网通版 羽光白 12GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/20190822203851127.jpg.webp', '3198', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '4710', '57', '42');
INSERT INTO `list` VALUES ('43', '小米 CC9 全网通版 暗夜王子 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190929112618850.jpg.webp', '1850', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '4820', '58', '43');
INSERT INTO `list` VALUES ('44', '华为 nova 5 全网通版 亮黑色 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190618233212736.jpg.webp', '2799', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '4930', '59', '44');
INSERT INTO `list` VALUES ('45', '三星 Galaxy S10 全网通版 烟波蓝 8GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/20190929140609326.jpg.webp', '4999', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '5040', '60', '45');
INSERT INTO `list` VALUES ('46', '华为 nova 5i 全网通版 幻夜黑 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190916204921308.jpg.webp', '1999', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '5150', '61', '46');
INSERT INTO `list` VALUES ('47', 'vivo X27 全网通版 雀羽蓝 8GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/201909161016190.jpg.webp', '2698', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '5260', '62', '47');
INSERT INTO `list` VALUES ('48', '华为 nova 4e 全网通版 雀翎蓝 4GB+128GB ', 'https://img2.yaya.cn/pic/product/440x440/2019073110013366.jpg.webp', '1499', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '5370', '63', '48');
INSERT INTO `list` VALUES ('49', '华为 nova 4 全网通标配版 苏音蓝 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190929112422213.jpg.webp', '1799', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '5480', '64', '49');
INSERT INTO `list` VALUES ('50', '三星 Galaxy S10+ 全网通版 皓玉白 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190919223500606.jpg.webp', '5599', 'https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114737756.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190911114738755.jpg', '5590', '65', '50');
INSERT INTO `list` VALUES ('51', '小米9 SE 全网通版 幻彩蓝 6GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/20190911103416335.jpg.webp', '1799', 'https://img2.yaya.cn/pic/product/800x800/20190916202050147.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202104873.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105198.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190916202105533.jpg', '5700', '66', '51');
INSERT INTO `list` VALUES ('52', '华为 荣耀 V20 全网通高配版 幻夜黑 8GB+128GB', 'https://img2.yaya.cn/pic/product/440x440/201910091748408.jpg.webp', '2180', 'https://img2.yaya.cn/pic/product/800x800/20190923100026167.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163958226.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190924163959206.jpg', '5810', '67', '52');
INSERT INTO `list` VALUES ('53', '华为 Mate 20 Pro 全网通版 亮黑色 8GB+128GB（UD）', 'https://img2.yaya.cn/pic/product/440x440/20190916202050147.jpg.webp', '5099', 'https://img2.yaya.cn/pic/product/800x800/20190919213347466.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221002424.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', 'https://img2.yaya.cn/pic/product/800x800/20190919221003403.jpg', '5920', '68', '53');
INSERT INTO `list` VALUES ('54', '华为 Mate 20 全网通版 亮黑色 6GB+64GB,https://img2.yaya.cn/pic/product/440x440/20190923100026167.jpg.webp,3199,https://img2.yaya.cn/pic/product/800x800/201910091748408.jpg,https://img2.yaya.cn/pic/product/800x800/20190911114736754.jpg,https://img2.yaya.cn/pic/prod', '', '', '', '', '', '', '', '', '0');

-- ----------------------------
-- Table structure for shangpin
-- ----------------------------
DROP TABLE IF EXISTS `shangpin`;
CREATE TABLE `shangpin` (
  `cid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `names` varchar(255) DEFAULT NULL,
  `dianjia` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `imgs` varchar(255) DEFAULT NULL,
  `sales` varchar(255) DEFAULT NULL,
  `iny` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `color2` varchar(255) DEFAULT NULL,
  `color3` varchar(255) DEFAULT NULL,
  `minimg1` varchar(255) DEFAULT NULL,
  `minimg2` varchar(255) DEFAULT NULL,
  `minimg3` varchar(255) DEFAULT NULL,
  `minimg4` varchar(255) DEFAULT NULL,
  `minimg5` varchar(255) DEFAULT NULL,
  `cheng` varchar(255) DEFAULT NULL,
  `kuan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shangpin
-- ----------------------------
INSERT INTO `shangpin` VALUES ('1', '桐乐儿 迷你复古休闲半圆马鞍包 ES289', '桐乐儿', '71.3', '../img/alis/alis1 (1).jpg', '407', '3213', '黑色', '白色', '蓝色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '200', '马鞍包');
INSERT INTO `shangpin` VALUES ('2', '桐乐儿 迷你复古休闲半圆马鞍包 ES289', '诺豹箱包', '58.5', '../img/alis/alis1 (2).jpg', '837', '231', '绿色', '黄色', '红色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '210', '双肩包');
INSERT INTO `shangpin` VALUES ('3', '诺豹 欧美时尚双肩包 1129', '诺豹箱包', '85.1', '../img/alis/alis1 (3).jpg', '812', '4214', '黑色', '白色', '蓝色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '250', '单肩包');
INSERT INTO `shangpin` VALUES ('4', '至缘Q181', '妙薇，柏丽雅诗', '35.1', '../img/alis/alis1 (4).jpg', '1062', '123', '绿色', '黄色', '红色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '270', '斜跨包');
INSERT INTO `shangpin` VALUES ('5', '起风了 至缘斜跨手提包Q176', '桐乐儿', '24.5', '../img/alis/alis1 (5).jpg', '123', '421', '黑色', '白色', '蓝色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '295', '手提包');
INSERT INTO `shangpin` VALUES ('6', '2019新品韩版百搭时尚包包单肩斜跨百搭小方包春夏上新撞色小女包   GT024', '桐乐儿', '35.1', '../img/alis/alis1 (6).jpg', '779', '4124', '绿色', '黄色', '红色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '320', '马鞍包');
INSERT INTO `shangpin` VALUES ('7', '至缘皮具包邮 新款时尚单肩斜挎包 Q057', '诺豹箱包', '30.9', '../img/alis/alis1 (7).jpg', '589', '41', '黑色', '白色', '蓝色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '345', '双肩包');
INSERT INTO `shangpin` VALUES ('8', '2019新款ins超火的双肩包女背包软皮学院韩版百搭时尚书包SJB002', '诺豹箱包', '25.5', '../img/alis/alis1 (8).jpg', '685', '3213', '绿色', '黄色', '红色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '370', '单肩包');
INSERT INTO `shangpin` VALUES ('9', '2019新款ins超火的双肩包女小背包软皮百搭时尚女SJB003', '妙薇，柏丽雅诗', '25.5', '../img/alis/alis1 (9).jpg', '378', '1898', '黑色', '白色', '蓝色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '395', '斜跨包');
INSERT INTO `shangpin` VALUES ('10', '至缘斜挎包Q208', '桐乐儿', '44.7', '../img/alis/alis1 (10).jpg', '974', '1887', '绿色', '黄色', '红色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '420', '手提包');
INSERT INTO `shangpin` VALUES ('11', '双肩包女软皮书包两用2019新款多功能韩版手提背包潮休闲大容量包SJB004', '桐乐儿', '24.5', '../img/alis/alis1 (11).jpg', '637', '1876', '黑色', '白色', '蓝色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '445', '马鞍包');
INSERT INTO `shangpin` VALUES ('12', '至缘斜挎包ZK023', '诺豹箱包', '31.9', '../img/alis/alis1 (12).jpg', '534', '1865', '绿色', '黄色', '红色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '470', '双肩包');
INSERT INTO `shangpin` VALUES ('13', '2019年至缘优雅潮流软皮经典时尚双肩包ZK037', '诺豹箱包', '27.7', '../img/alis/alis1 (13).jpg', '382', '1854', '黑色', '白色', '蓝色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '495', '单肩包');
INSERT INTO `shangpin` VALUES ('14', '至缘透明包  Q164', '妙薇，柏丽雅诗', '23.4', '../img/alis/alis1 (14).jpg', '314', '1843', '绿色', '黄色', '红色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '520', '斜跨包');
INSERT INTO `shangpin` VALUES ('15', '潮流优雅时尚经典大方双肩包女SJB006', '桐乐儿', '26.6', '../img/alis/alis1 (15).jpg', '1551', '1832', '黑色', '白色', '蓝色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '545', '手提包');
INSERT INTO `shangpin` VALUES ('16', '2019新款双肩包女牛津布韩版潮百搭背包时尚休闲书包女包包旅行包SJB001', '桐乐儿', '30.9', '../img/alis/alis1 (16).jpg', '1326', '1821', '绿色', '黄色', '红色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '570', '马鞍包');
INSERT INTO `shangpin` VALUES ('17', '至缘皮具 新款韩版单肩包P013', '诺豹箱包', '10.6', '../img/alis/alis1 (17).jpg', '921', '1810', '黑色', '白色', '蓝色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '595', '双肩包');
INSERT INTO `shangpin` VALUES ('18', '2019至缘新款GT027', '诺豹箱包', '28.7', '../img/alis/alis1 (18).jpg', '939', '1799', '绿色', '黄色', '红色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '620', '单肩包');
INSERT INTO `shangpin` VALUES ('19', '2019至缘新款包包XB018', '妙薇，柏丽雅诗', '9.8', '../img/alis/alis1 (19).jpg', '568', '1788', '黑色', '白色', '蓝色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '645', '斜跨包');
INSERT INTO `shangpin` VALUES ('20', '至缘 斜挎包Q207', '桐乐儿', '40.4', '../img/alis/alis1 (20).jpg', '495', '1777', '绿色', '黄色', '红色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '670', '手提包');
INSERT INTO `shangpin` VALUES ('21', '至缘斜挎包  J112', '桐乐儿', '34', '../img/alis/alis1 (21).jpg', '466', '1766', '黑色', '白色', '蓝色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '695', '马鞍包');
INSERT INTO `shangpin` VALUES ('22', '潮流时尚优雅软皮精致潮双肩包SJB005', '诺豹箱包', '25.5', '../img/alis/alis1 (22).jpg', '631', '1755', '绿色', '黄色', '红色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '720', '双肩包');
INSERT INTO `shangpin` VALUES ('23', '至缘 小包XB032', '诺豹箱包', '10.6', '../img/alis/alis1 (23).jpg', '589', '1744', '黑色', '白色', '蓝色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '745', '单肩包');
INSERT INTO `shangpin` VALUES ('24', '至缘 小清新女包QZH-8516#', '妙薇，柏丽雅诗', '36.2', '../img/alis/alis1 (24).jpg', '3906', '1733', '绿色', '黄色', '红色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '770', '斜跨包');
INSERT INTO `shangpin` VALUES ('25', '至缘 小包XB031', '桐乐儿', '8', '../img/alis/alis1 (25).jpg', '824', '1722', '黑色', '白色', '蓝色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '795', '手提包');
INSERT INTO `shangpin` VALUES ('26', '2019年至缘新款小包包女款斜跨P023-1', '桐乐儿', '9.4', '../img/alis/alis1 (26).jpg', '603', '1712', '绿色', '黄色', '红色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '820', '马鞍包');
INSERT INTO `shangpin` VALUES ('27', '至缘 斜跨菱格女包QZH-8496#', '诺豹箱包', '29.8', '../img/alis/alis1 (27).jpg', '863', '1701', '黑色', '白色', '蓝色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '845', '双肩包');
INSERT INTO `shangpin` VALUES ('28', '至缘 软皮双肩包SJB010', '诺豹箱包', '27.7', '../img/alis/alis1 (28).jpg', '629', '1690', '绿色', '黄色', '红色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '870', '单肩包');
INSERT INTO `shangpin` VALUES ('29', '至缘 简约百搭小方包 ZS-H6078#', '妙薇，柏丽雅诗', '42.6', '../img/alis/alis1 (29).jpg', '2029', '1679', '黑色', '白色', '蓝色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '895', '斜跨包');
INSERT INTO `shangpin` VALUES ('30', '2019至缘新款复古包包XB013', '桐乐儿', '11.7', '../img/alis/alis1 (30).jpg', '677', '1668', '绿色', '黄色', '红色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '920', '手提包');
INSERT INTO `shangpin` VALUES ('31', '至缘 XB006', '桐乐儿', '8.8', '../img/alis/alis1 (31).jpg', '3618', '1657', '黑色', '白色', '蓝色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '945', '马鞍包');
INSERT INTO `shangpin` VALUES ('32', '至缘单肩包 Q054', '诺豹箱包', '19', '../img/alis/alis1 (32).jpg', '620', '1646', '绿色', '黄色', '红色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '970', '双肩包');
INSERT INTO `shangpin` VALUES ('33', '至缘 Q189', '诺豹箱包', '28.7', '../img/alis/alis1 (33).jpg', '523', '1635', '黑色', '白色', '蓝色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '995', '单肩包');
INSERT INTO `shangpin` VALUES ('34', '至缘 猫咪软皮双肩包SJB009', '妙薇，柏丽雅诗', '29.3', '../img/alis/alis1 (34).jpg', '504', '1624', '绿色', '黄色', '红色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '1020', '斜跨包');
INSERT INTO `shangpin` VALUES ('35', '至缘 半圆小包 ZS-H9192#', '桐乐儿', '41.5', '../img/alis/alis1 (35).jpg', '833', '1613', '黑色', '白色', '蓝色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '1045', '手提包');
INSERT INTO `shangpin` VALUES ('36', '2019至缘新款包包AK013', '桐乐儿', '22.3', '../img/alis/alis1 (36).jpg', '3958', '1602', '绿色', '黄色', '红色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '1070', '马鞍包');
INSERT INTO `shangpin` VALUES ('37', '至缘 ZK026', '诺豹箱包', '10.6', '../img/alis/alis1 (37).jpg', '802', '1591', '黑色', '白色', '蓝色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '1095', '双肩包');
INSERT INTO `shangpin` VALUES ('38', '至缘 时尚信封包HQZ-A208#', '诺豹箱包', '30.9', '../img/alis/alis1 (38).jpg', '808', '1580', '绿色', '黄色', '红色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '1120', '单肩包');
INSERT INTO `shangpin` VALUES ('39', '至缘 软皮双肩包SJB008', '妙薇，柏丽雅诗', '35.6', '../img/alis/alis1 (39).jpg', '2077', '1569', '黑色', '白色', '蓝色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '1145', '斜跨包');
INSERT INTO `shangpin` VALUES ('40', '至缘 时尚手机包 ZS-H9562#', '桐乐儿', '35.1', '../img/alis/alis1 (40).jpg', '448', '1558', '绿色', '黄色', '红色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '1170', '手提包');
INSERT INTO `shangpin` VALUES ('41', '至缘 MR020', '桐乐儿', '18.1', '../img/alis/alis1 (41).jpg', '409', '1547', '黑色', '白色', '蓝色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '1195', '马鞍包');
INSERT INTO `shangpin` VALUES ('42', '至缘 小包XB047', '诺豹箱包', '9', '../img/alis/alis1 (42).jpg', '651', '1536', '绿色', '黄色', '红色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '1220', '双肩包');
INSERT INTO `shangpin` VALUES ('43', '至缘 斜跨菱格链条包D001', '诺豹箱包', '35.1', '../img/alis/alis1 (43).jpg', '573', '1525', '黑色', '白色', '蓝色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '1245', '单肩包');
INSERT INTO `shangpin` VALUES ('44', '至缘 时尚锁扣小包 ZS-H313#', '妙薇，柏丽雅诗', '44.7', '../img/alis/alis1 (44).jpg', '500', '1514', '绿色', '黄色', '红色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '1270', '斜跨包');
INSERT INTO `shangpin` VALUES ('45', '2019至缘新款女包Q201', '桐乐儿', '39.4', '../img/alis/alis1 (45).jpg', '406', '1503', '黑色', '白色', '蓝色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '1295', '手提包');
INSERT INTO `shangpin` VALUES ('46', '至缘斜挎包 ZK010', '桐乐儿', '18.1', '../img/alis/alis1 (46).jpg', '859', '1492', '绿色', '黄色', '红色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '1320', '马鞍包');
INSERT INTO `shangpin` VALUES ('47', '至缘 ZK037', '诺豹箱包', '27.7', '../img/alis/alis1 (47).jpg', '572', '1481', '黑色', '白色', '蓝色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '1345', '双肩包');
INSERT INTO `shangpin` VALUES ('48', '至缘 小包XB046', '诺豹箱包', '9', '../img/alis/alis1 (48).jpg', '908', '1470', '绿色', '黄色', '红色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '1370', '单肩包');
INSERT INTO `shangpin` VALUES ('49', '至缘 小CK女斜跨包 ZK052', '妙薇，柏丽雅诗', '29.8', '../img/alis/alis1 (49).jpg', '811', '1459', '黑色', '白色', '蓝色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '1395', '斜跨包');
INSERT INTO `shangpin` VALUES ('50', '2019小圆包+赠品XB018', '桐乐儿', '11.1', '../img/alis/alis1 (50).jpg', '855', '1448', '绿色', '黄色', '红色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '1420', '手提包');
INSERT INTO `shangpin` VALUES ('51', '2019至缘新款女包小方包AK014', '桐乐儿', '35.1', '../img/alis/alis1 (51).jpg', '1037', '1437', '黑色', '白色', '蓝色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '1445', '马鞍包');
INSERT INTO `shangpin` VALUES ('52', '至缘p069', '诺豹箱包', '10.6', '../img/alis/alis1 (52).jpg', '479', '1426', '绿色', '黄色', '红色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '1470', '双肩包');
INSERT INTO `shangpin` VALUES ('53', '至缘 小包XB045', '诺豹箱包', '8.5', '../img/alis/alis1 (53).jpg', '766', '1415', '黑色', '白色', '蓝色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '1495', '单肩包');
INSERT INTO `shangpin` VALUES ('54', '至缘 油蜡皮斜跨包ZK051', '妙薇，柏丽雅诗', '30.9', '../img/alis/alis1 (54).jpg', '745', '1404', '绿色', '黄色', '红色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '1520', '斜跨包');
INSERT INTO `shangpin` VALUES ('55', '2019至缘女包斜跨包BL-0021', '桐乐儿', '24.5', '../img/alis/alis1 (55).jpg', '930', '1393', '黑色', '白色', '蓝色', '../img/xq/qfl1.jpg', '../img/xq/qfl2.jpg', '../img/xq/qfl3.jpg', '../img/xq/qfl4.jpg', '../img/xq/qfl5.jpg', '1545', '手提包');
INSERT INTO `shangpin` VALUES ('56', '至缘 Q192', '桐乐儿', '28.7', '../img/alis/alis1 (56).jpg', '1234', '1382', '绿色', '黄色', '红色', '../img/xq/tong1.jpg', '../img/xq/tong2.jpg', '../img/xq/tong3.jpg', '../img/xq/tong4.jpg', '../img/xq/tong5.jpg', '1570', '马鞍包');
INSERT INTO `shangpin` VALUES ('57', '至缘 ZK012', '诺豹箱包', '25.5', '../img/alis/alis1 (57).jpg', '3583', '1371', '黑色', '白色', '蓝色', '../img/xq/nuo1.jpg', '../img/xq/nuo2.jpg', '../img/xq/nuo3.jpg', '../img/xq/nuo4.jpg', '../img/xq/nuo5.jpg', '1595', '双肩包');
INSERT INTO `shangpin` VALUES ('58', '2019至缘小包包斜跨女包ZK024', '诺豹箱包', '8.5', '../img/alis/alis1 (58).jpg', '828', '1360', '绿色', '黄色', '红色', '../img/xq/nuo6.jpg', '../img/xq/nuo7.jpg', '../img/xq/nuo8.jpg', '../img/xq/nuo9.jpg', '../img/xq/nuo10.jpg', '1620', '单肩包');
INSERT INTO `shangpin` VALUES ('59', '至缘 圆形小包XB0045', '妙薇，柏丽雅诗', '9.3', '../img/alis/alis1 (59).jpg', '1243', '1349', '黑色', '白色', '蓝色', '../img/xq/yuan1.jpg', '../img/xq/yuan2.jpg', '../img/xq/yuan3.jpg', '../img/xq/yuan4.jpg', '../img/xq/yuan5.jpg', '1645', '斜跨包');

-- ----------------------------
-- Table structure for spliebiao
-- ----------------------------
DROP TABLE IF EXISTS `spliebiao`;
CREATE TABLE `spliebiao` (
  `﻿cid` int(11) NOT NULL,
  `names` varchar(255) DEFAULT NULL,
  `pic` varchar(255) DEFAULT NULL,
  `shou` varchar(255) DEFAULT NULL,
  `imgs` varchar(255) DEFAULT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`﻿cid`,`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of spliebiao
-- ----------------------------
INSERT INTO `spliebiao` VALUES ('1', '桐乐儿 迷你复古休闲半圆马鞍包 ES289', '￥44.90', '400', '../img/sp/bb1.jpg', '1');
INSERT INTO `spliebiao` VALUES ('2', '桐乐儿 迷你复古休闲半圆马鞍包 ES289', '￥45.90', '401', '../img/sp/bb2.jpg', '2');
INSERT INTO `spliebiao` VALUES ('3', '诺豹 欧美时尚双肩包 1129', '￥46.90', '402', '../img/sp/bb3.jpg', '3');
INSERT INTO `spliebiao` VALUES ('4', '至缘Q181', '￥47.90', '403', '../img/sp/bb4.jpg', '4');

-- ----------------------------
-- Table structure for xinxi
-- ----------------------------
DROP TABLE IF EXISTS `xinxi`;
CREATE TABLE `xinxi` (
  `cid` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `passw` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `num` varchar(13) COLLATE utf8_unicode_ci NOT NULL,
  `times` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of xinxi
-- ----------------------------
INSERT INTO `xinxi` VALUES ('35', '123456', '1313', '321312', '3123123', '2019-08-23 15:22:25');
INSERT INTO `xinxi` VALUES ('45', '123', '32131', '321321', '321321', '2019-08-23 15:53:44');
INSERT INTO `xinxi` VALUES ('48', 'o123456', '123456', '1140177424@qq.com', '13542180356', '2019-10-09 17:14:45');
INSERT INTO `xinxi` VALUES ('49', '', '', '', '', '2019-10-12 14:41:13');

-- ----------------------------
-- Table structure for zhuye
-- ----------------------------
DROP TABLE IF EXISTS `zhuye`;
CREATE TABLE `zhuye` (
  `﻿cid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT NULL,
  `bigimg` varchar(255) DEFAULT NULL,
  `minimg1` varchar(255) DEFAULT NULL,
  `minimg2` varchar(255) DEFAULT NULL,
  `minimg3` varchar(255) DEFAULT NULL,
  `minimg4` varchar(255) DEFAULT NULL,
  `fenlei1` varchar(255) DEFAULT NULL,
  `fenlei2` varchar(255) DEFAULT NULL,
  `fenlei3` varchar(255) DEFAULT NULL,
  `fenlei4` varchar(255) DEFAULT NULL,
  `fenlei5` varchar(255) DEFAULT NULL,
  `fenlei6` varchar(255) DEFAULT NULL,
  `fenlei7` varchar(255) DEFAULT NULL,
  `fenlei8` varchar(255) DEFAULT NULL,
  `fenlei9` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`﻿cid`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of zhuye
-- ----------------------------
INSERT INTO `zhuye` VALUES ('1', '女装', '../img/zhuye/nz1.jpg', '../img/zhuye/nz2.jpg', '../img/zhuye/nz3.jpg', '../img/zhuye/nz4.jpg', '../img/zhuye/nz5.jpg', 't桖', '卫衣', '衬衫', '雪纺/蕾丝衫', '连衣裙', '半身裙', '套装裙', '开衫', '套头');
INSERT INTO `zhuye` VALUES ('2', '箱包', '../img/zhuye/bb1.jpg', '../img/zhuye/bb2.jpg', '../img/zhuye/bb3.jpg', '../img/zhuye/bb4.jpg', '../img/zhuye/bb5.jpg', '真皮包', '单肩包', '女士钱包', '小方包', '手提包', '斜挎包', '晚宴包', '手拿包', '出街潮搭');
INSERT INTO `zhuye` VALUES ('3', '美妆', '../img/zhuye/hf1.jpg', '../img/zhuye/hf2.jpg', '../img/zhuye/hf3.jpg', '../img/zhuye/hf4.jpg', '../img/zhuye/hf5.jpg', '面膜', '护肤套装', '乳液面霜', '洁面面部精华', '化妆水', '眼部护理', 'T区护理', '洗发露', '沐浴露');
INSERT INTO `zhuye` VALUES ('4', '童装母婴', '../img/zhuye/tong1.jpg', '../img/zhuye/tong2.jpg', '../img/zhuye/tong3.jpg', '../img/zhuye/tong4.jpg', '../img/zhuye/tong5.jpg', '宝宝辅食', '奶粉', '宝宝营养', '童内衣裤', '童裤子', '儿童套装', '童裙', '奶嘴', '餐具');
INSERT INTO `zhuye` VALUES ('5', '男装', '../img/zhuye/nan1.jpg', '../img/zhuye/nan2.jpg', '../img/zhuye/nan3.jpg', '../img/zhuye/nan4.jpg', '../img/zhuye/nan5.jpg', '卫衣', '针织衫/毛衣', '西装', '呢外套', '棉服/风衣', '棒球服', '上衣', '裤子', '奶嘴');
INSERT INTO `zhuye` VALUES ('6', '内衣', '../img/zhuye/nei1.jpg', '../img/zhuye/nei2.jpg', '../img/zhuye/nei3.jpg', '../img/zhuye/nei4.jpg', '../img/zhuye/nei5.jpg', '文胸套装', '女士内裤', '男士内裤', '女士睡衣', '睡裙', '塑身内衣', '运动内衣', '休闲棉袜', '内裤');
INSERT INTO `zhuye` VALUES ('7', '家具', '../img/zhuye/jia1.jpg', '../img/zhuye/jia2.jpg', '../img/zhuye/jia3.jpg', '../img/zhuye/jia4.jpg', '../img/zhuye/jia5.jpg', '火锅', '煎锅', '炒锅', '保温壶', '烧水壶', '便当盒', '刀具', '锅餐漏勺', '洗衣护理');
INSERT INTO `zhuye` VALUES ('8', '家电', '../img/zhuye/dian1.jpg', '../img/zhuye/dian2.jpg', '../img/zhuye/dian3.jpg', '../img/zhuye/dian4.jpg', '../img/zhuye/dian5.jpg', '电风扇', '空气净化器', '灭蚊灯', '电锅/煲类', '电热水器', '电热饭煲', '豆浆机', '电磁炉', '茶具');
SET FOREIGN_KEY_CHECKS=1;
