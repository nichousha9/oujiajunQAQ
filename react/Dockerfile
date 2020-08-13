FROM 10.45.80.1/public/centos7-java-base:openjdk1.8.0.151
MAINTAINER lisisi

RUN  mkdir -p /home/ire-fe && mkdir -p /home/ire/ire \
 && yum -y install make gcc-c++ zlib zlib-devel

ENV LANG en_US.UTF-8

COPY react/nginx-1.16.1.tar.gz /home/ire-fe/
RUN cd /home/ire-fe/ \
 && tar zxvf nginx-1.16.1.tar.gz > /dev/null \
 && cd nginx-1.16.1 \
 && ./configure --prefix=../nginx --without-http_rewrite_module   > /dev/null \
 && make && make install > ins_nginx.log
 
COPY react/nginx.conf /home/ire-fe/nginx/conf
COPY dist/* /home/ire/ire/
COPY react/docker-app.def /root/



COPY react/start.sh /home/ire-fe/


RUN  chmod +x /home/ire-fe/*.sh

EXPOSE 9002
