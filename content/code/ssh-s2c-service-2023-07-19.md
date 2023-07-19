---
title:      利用 ssh 隧道将本地服务映射到远程服务器
date:       2023-07-19T15:18:22+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'ssh']
---

公司开发机有网，没有 root 权限，要配置代理，好难。

不如试试把本地的代理服务通过 ssh 端口转发到服务器上吧。

<!--more-->

```bash
$ ssh -fCNR <local_port>:<remote_ip>:<remote_port> <remote_user>@<remote_server>
```

其中：

```
-f 后台执行ssh指令
-C 允许压缩数据 
-N 不执行远程指令
-R 将远程主机(服务器)的某个端口转发到本地端指定机器的指定端口
-L 将本地机(客户机)的某个端口转发到远端指定机器的指定端口 
-p 指定远程主机的端口
```

比如你要把本地的 8889 端口转发到服务器的 8899 端口上，用户名是 andy

```bash
$ ssh -fCNR 8889:localhost:8899 andy@remote_server
```

这样你就可以在服务器访问 localhost:8889 的流量都会被转发到本地 8889 端口的服务上了。

当然我推荐是用 bitvise ssh client 的 s2c 服务，这个客户端有日志，比 xshell、putty 转发失败也不知道好到哪里去了。
