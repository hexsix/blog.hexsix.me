---
title:      Nginx Proxy Manager 管理的容器访问日志在哪里
date:       2023-02-28T18:36:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'nginx-proxy-manager', 'nginx', 'npm']
---

刚把 mastodon 升级到了 v4.1.0，结果 502 了，翻了翻 mastodon 日志发现一切正常；

然后去翻 nginx 日志，我用的 nginx proxy manager 管理的，一看发现它还在访问旧的容器 ip 地址，重启了 npm 然后就上来了。

宿主机 nginx 反代确实没这问题，npm 属于容器访问容器。

<!--more-->

日志位置在 `/data/logs/` 下，按照你在 npm 中创建的顺序，比如 `/data/logs/proxy_host-10.log`

如果你觉得容器太多了，想自定义名称方便查找，可以修改 nginx 配置，位置在 `/data/nginx/proxy_host` 文件名大概是 `10.conf` 之类的，修改其中的 `access_log /data/logs/proxy_host-10.log` 即可。

error 日志同理。
