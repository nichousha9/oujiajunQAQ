#!/bin/bash
cd /home/ire-fe/nginx/
nohup sbin/nginx  > nginx.log 2>&1 &

echo "启动脚本执行中"