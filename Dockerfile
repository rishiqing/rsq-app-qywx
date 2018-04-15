FROM registry-internal.cn-beijing.aliyuncs.com/rsq-public/nginx:1.13.12

LABEL name="qywx-isv-access-nginx" \
       description="frontend server for integration of rishiqing and qywx(enterprise version of WeChat)" \
       maintainer="Wallace Mao" \
       org="rishiqing"

# set default time zone to +0800 (Shanghai)
ENV TIME_ZONE=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone

ENV HTML_ROOT /usr/share/nginx/html
ENV CONFIG_ROOT /etc/nginx/conf.d
WORKDIR $HTML_ROOT

COPY nginx.template $CONFIG_ROOT/default.conf
COPY dist .
