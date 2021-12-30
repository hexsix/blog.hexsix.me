---
title:      利用 ssh 隧道将远程服务映射到本地
date:       2021-01-22T15:06:22+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'ssh']
---

今天做 ssh 隧道，简直了。

就是说，如果你要访问一个经过跳板机才访问的服务，比如 Gitlab，你可以用以下命令把服务端口映射到本地来。

<!--more-->

```bash
$ ssh -L <local port>:<remote ip>:<local port> <jumpbox username>@<jumpbox ip>
```

一些 windows 客户端可能自带这种功能，linux 下我是没找到。

这样连接过了一小会儿就会断开，新增一些参数使它保持连接，该参数每 60s 向 server 报告一次。

```bash
$ ssh -o ServerAliveInterval=60 -L <local port>:<remote ip>:<local port> <jumpbox username>@<jumpbox ip>
```
