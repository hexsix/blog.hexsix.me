---
title:      利用 ssh 隧道实现端口转发
date:       2023-07-19T15:18:22+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'ssh']
---

公司开发机有网，没有 `root` 权限，要配置代理，好难。

公司某台内网服务器的 `8080` 端口上有个服务，但是要通过跳板机才能访问开发机的 `8080` 端口，好难。

不如试试 `ssh` 隧道实现端口转发吧。

<!--more-->

公司开发机要配置代理，我们要把本地的代理端口转发到远程的服务器上，这种叫做反向代理，`nginx` 就是反向代理；

而要把内网的某个端口通过跳板机转发到本地电脑上，这种叫做正向代理，`ss` 和 `v2ray` 都是正向代理。

## 反向代理（Server to Client）

要建立本地到 B 服务器的反向代理，换句话说，把本地的端口转发到 B 服务器

```bash
$ ssh -fCNR [LOCAL_PORT]:[HOST_IP]:[HOST_PORT] [B_USERNAME@B_IP]
```

如果是把本地的 `7890` 端口转发到服务器的 `9870` 端口上，服务器用户名是 `andy`，那么

```bash
$ ssh -fCNR 7890:localhost:9870 andy@remote_server
```

这样你就可以在服务器访问 `localhost:9870` 的流量都会被转发到本地 `7890` 端口的服务上了，这时候你就可以通过命令来检查代理是否生效

```bash
$ ALL_PROXY=http://localhost:9870 curl -vv google.com
```

> 记得打开代理软件的“允许来自局域网的连接”

其中：

```
-f 后台执行 ssh 指令
-C 允许压缩数据 
-N 不执行远程指令
-R 将远程主机（服务器）的某个端口转发到本地端指定机器的指定端口
```

## 正向代理（Client to Server）

要通过 B 代理服务器将 C 服务器的端口转发到本地（B 代理服务器是本地可访问的，C 服务器是本地不可访问的，但是可以通过 B 访问）

```bash
$ ssh -fCNL [LOCAL_PORT]:[C_IP]:[C_PORT] [B_USERNAME@B_IP]
```

如果是把 C 服务器的 `8080` 端口转发到本地的 `8080` 端口上，B 服务器用户名是 `andy`，B 服务器访问 C 服务器的 IP 是 `198.168.98.101`，那么

```bash
$ ssh -fCNR 8080:198.168.98.101:8080 andy@remote_server
```

这样你就可以在本地浏览器打开 `localhost:8080` 来访问 C 服务器上 8080 端口的服务了

## 保持连接

不幸的是这种连接并不稳定。

一种办法是加 ServerAliveInterval 配置来定时报告保持连接，比如

```bash
$ ssh -o ServerAliveInterval=60 -fCNR 7890:localhost:9870 andy@remote_server
$ ssh -o ServerAliveInterval=60 -fCNR 8080:198.168.98.101:8080 andy@remote_server
```

`-o` 参数用于指定配置选项，这里每 60s 向 remote_server 汇报一次来保持连接

另一种办法是使用 `autossh`，隧道断开时 `autossh` 相比 `ssh` 会自动重连，参数是一样的，但是需要在 B 服务器上安装 `autossh` 所以不在我的考虑范围内。

当然我推荐 windows 下是用 bitvise ssh client，这个客户端能自动重连，而且有！日！志！，比 xshell、putty 转发失败也不知道哪里搞错了，要好到不知道哪里去了。
