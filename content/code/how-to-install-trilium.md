---
title:      自建笔记服务器 Trilium
date:       2022-04-09T14:34:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'Trilium', 'CentOS', 'nginx', 'docker']
---

Trilium 真的很好用，我用了两天就爱上了。

- 支持同一篇笔记放在多个位置下
- 支持 tag
- 支持笔记关联和内联，内联的意思是插入另一篇笔记到当前笔记中，另一篇改动会实时在当前笔记修改
- 支持相当丰富的 markdown，包括 mermaid 和 latex，而且即时渲染，和 typora 一样
- 支持代码类型的笔记，有高亮，不过内联代码没有高亮比较可惜
- 支持自定义脚本，这个比较强我暂时摸索一下

接下来我们来安装 trilum 到我的 CentOS 下吧

<!--more-->

## 一、安装 Docker

上[官网](https://docs.docker.com/engine/install/centos/)去找到合适的安装教程一步一步走，这里以全新的 CentOS 安装为例

### 1.添加 repo

```bash
 $ sudo yum install -y yum-utils
 
 $ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

### 2.安装 Docker 并启动服务

```bash
$ sudo yum install docker-ce docker-ce-cli containerd.io

$ sudo systemctl enable --now docker
```

### 3.(optional)配置非 root 用户使用 Docker

- 将你自己加入 docker 用户组，如果不存在 docker 组就创建一个
- 登出再登陆就 ok 了

```bash
$ sudo usermod -aG docker $USER
```

## 二、安装 Trilium

[https://github.com/baddate/trilium/wiki/Docker安装服务器](https://github.com/baddate/trilium/wiki/Docker%E5%AE%89%E8%A3%85%E6%9C%8D%E5%8A%A1%E5%99%A8)

### 1.拉取镜像

本文以 0.50.3 版本为例

```bash
$ docker pull zadam/trilium:0.50.3
```

### 2.在主机系统上准备数据目录

Trilium 需要一个可以存储其数据的目录，然后需要将其挂载到 docker 容器中。容器作为用户“节点”运行，因此我们需要使该目录可供该用户使用：

```bash
$ mkdir ~/trilium-data
$ chmod 777 ~/trilium-data
```

### 3.运行镜像

直接推荐 Local only 的方式，如果你没有配置 nginx 反代想直接用 ip 的话，把下述命令中的 127.0.0.1 改为 0.0.0.0

```bash
$ docker run -d --restart=always --name trilium -p 127.0.0.1:8080:8080 -v ~/trilium-data:/home/node/trilium-data zadam/trilium:0.50.3
```

和官网教程有出入，主要是添加了 `--restart=always` 自动重启参数

## 三、配置 NGINX 反代

创建配置文件

```bash
$ sudo vim /etc/nginx/conf.d/default.conf
```

使用如下所示的上下文填写文件，部分设置显示被更改。然后，您可以使用 HTTPS 强制和代理来享受您的网络。

```nginx
# This part is for proxy and HTTPS configure
server {
  listen 443;
  server_name trilium.example.net; # change trilium.example.net to your domain
  ssl_certificate /etc/ssl/note/example.crt; # path to your crt file.
  ssl_certificate_key /etc/ssl/note/example.net.key; # path to your key file.
  ssl on;
  ssl_session_cache builtin:1000 shared:SSL:10m;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
  ssl_prefer_server_ciphers on;
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;
        
  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:8080; # change it to your IP and port
    proxy_read_timeout 90;
    proxy_redirect http://127.0.0.1:8080 https://trilium.example.net; #change them based on your IP, port and domain
  }
}

# This part is for HTTPS forced
server {
  listen 80;
  server_name trilium.example.net; # change to your domain
  return 301 https://$server_name$request_uri;
}
```

然后启动/重启 nginx

```bash
$ sudo systemctl enable --now nginx
$ sudo systemctl reload nginx
```

最后记得把端口打开

```bash
$ sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
$ sudo firewall-cmd --zone=public --add-port=443/tcp --permanent
$ sudo firewall-cmd --reload
```

## 附录：配置 nginx 过程中踩的 selinux 的坑

### 1.启动 nginx 的时候遇到的坑

[nginx permission denied to certificate files for ssl configuration](https://serverfault.com/questions/540537/nginx-permission-denied-to-certificate-files-for-ssl-configuration)

总之就是用 amce.sh 安装好证书之后 nginx 访问证书遇到 Permission denied

#### 原因

原因是 SELinux 在 enforcing mode 下

当 SELinux 处于 enforcing 模式时，它会强制 SELinux 策略并根据 SELinux 策略规则拒绝访问

用下列命令查看 SELinux 是否处于 enforcing mode

```bash
sestatus -v
```

我们用 -Z 看 /etc/nginx 的扩展属性

```bash
ls -lrtZ /etc/nginx
```

观察到 nginx 里的文件的扩展属性，其中 `httpd_config_t` 是数据类型(type)，SELinux target 策略就是根据 type 属性的值，控制可以/不可以访问资源

```txt
unconfined_u:object_r:httpd_config_t:s0
```

再来看证书安装位置的扩展属性

```bash
ls -lrtZ /path/to/cert
```

是 `admin_home_t`

```txt
unconfined_u:object_r:admin_home_t:s0
```

这就是 permission denied 的原因了

#### 解决办法

如果你的证书安装在 /etc/nginx 目录下，可以直接修复整个目录的扩展属性

```bash
restorecon -v -R /etc/nginx
```

如果不是，那就修改证书所在目录的数据类型

```bash
chcon httpd_config_t /path/to/cert
```

(不推荐)关闭 SELinux enforcing mode

```bash
setenforce 0
```

### 启动完 nginx 访问不了 trilium，503 错误

[(13: Permission denied) while connecting to upstream:[nginx]](https://stackoverflow.com/questions/23948527/13-permission-denied-while-connecting-to-upstreamnginx)

还是 SELinux 的锅

It is due to SELinux.

This should solve the problem:

```bash
setsebool -P httpd_can_network_connect 1
```

Another solution: (untested, but probably more secure)

```bash
setsebool -P httpd_can_network_relay 1
```
