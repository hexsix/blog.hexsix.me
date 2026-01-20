---
title:      以系统服务的形式运行mega-cmd-server
date:       2024-08-15T11:40:58+08:00
author:     喵小六
categories: ['Software']
tags:       ['software', 'mega-cmd', 'mega', 'linux', 'backup']
---

今天检查备份服务的时候发现备份停在了7月16日，登录服务器一看，`mega-cmd-server` 不知道什么时候死了。

没办法，注册成 service 跑吧，让它自己重启。

<!--more-->

## 编辑 service 文件

编辑 `/etc/systemd/system/mega-cmd-server.service`

```service
[Unit]
Description=mega-cmd-server service
Wants=network-online.target
After=local-fs.target network-online.target nss-lookup.target

[Service]
Type=simple
User=root  # Or the appropriate user
ExecStart=/usr/bin/mega-cmd-server  # Replace with the actual path
Restart=always

[Install]
WantedBy=multi-user.target
```

## 启动服务

```bash
systemctl enable mega-cmd-server.service
systemctl start mega-cmd-server.service
systemctl status mega-cmd-server.service
```
