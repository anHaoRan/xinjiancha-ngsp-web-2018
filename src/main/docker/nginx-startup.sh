#/bin/bash
profile=$nginx_profile
if [ "$profile" = "pro" ] ; then
`mv ngsp-web/docker/conf/nginx-pro.conf /etc/nginx/conf.d/default.conf`
elif [ "$profile" = "protemp" ] ; then
`mv ngsp-web/docker/conf/nginx-protemp.conf /etc/nginx/conf.d/default.conf`
elif [ "$profile" = "test" ] ; then
`mv ngsp-web/docker/conf/nginx-test.conf /etc/nginx/conf.d/default.conf`
elif [ "$profile" = "dev" ] ; then
`mv ngsp-web/docker/conf/nginx-dev.conf /etc/nginx/conf.d/default.conf`
elif [ "$profile" = "integ" ] ; then
`mv ngsp-web/docker/conf/nginx-integ.conf /etc/nginx/conf.d/default.conf`
elif [ "$profile" = "awe" ] ; then
`mv ngsp-web/docker/conf/nginx-awe.conf /etc/nginx/conf.d/default.conf`
else
`mv ngsp-web/docker/conf/nginx-dev.conf /etc/nginx/conf.d/default.conf`
fi

`nginx -g "daemon off;"`
