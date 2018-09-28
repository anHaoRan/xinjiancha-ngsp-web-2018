FROM  registry.ssecloud.com/library/nginx:1.10
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone
copy ngsp-web.tar.gz /usr/share/nginx/ngsp-web.tar.gz
WORKDIR /usr/share/nginx/
RUN tar -zxvf ngsp-web.tar.gz && \
    rm -rf ngsp-web.tar.gz
#ADD conf /etc/nginx/conf.d
ADD certs /etc/nginx/certs
RUN chmod +x ngsp-web/docker/nginx-startup.sh
ENTRYPOINT sh ngsp-web/docker/nginx-startup.sh