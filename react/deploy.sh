#!/bin/bash
# ZCM 构建脚本
set -eo pipefail

export LANG=en_US.UTF-8

# 输出时间以便观察各步骤耗时
date --rfc-3339=seconds

yum -y install make
#yum install gcc-c++

# 预装的 nodejs, yarn 版本较旧，删除并重新安装
unset NODE_PATH NODE_HOME

rm -rf /usr/local/bin/node /usr/local/bin/npm
yum install -q -y http://gitlab.iwhalecloud.com/bianjp/static/raw/master/files/nodejs-latest.rpm
yum install -q -y http://gitlab.iwhalecloud.com/bianjp/static/raw/master/files/yarn-latest.rpm


date --rfc-3339=seconds

# 内网 NPM 源
#NPM_REGISTRY=http://npm.iwhalecloud.com:8081/repository/npm-external/
# 淘宝 NPM 源
NPM_REGISTRY=https://registry.npm.taobao.org

yarn config set registry $NPM_REGISTRY
npm config set registry $NPM_REGISTRY

# ZCM 尚未提供 npm, yarn 缓存，借用一下 maven 缓存目录
#if [[ -d "$MAVEN_LOCAL_REPOS_CACHE" ]]; then
 #   yarn config set cache-folder "$MAVEN_LOCAL_REPOS_CACHE/yarn"
  #  npm config set cache "$MAVEN_LOCAL_REPOS_CACHE/npm"
#fi

# CI 镜像预装的 nodejs 配置有问题
# npm config set user $(id -u)

yarn install
npm run build