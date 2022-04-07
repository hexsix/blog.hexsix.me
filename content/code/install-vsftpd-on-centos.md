---
title:      CentOS 云服务器搭建 FTP 服务
date:       2022-04-07T15:38:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'FTP', 'CentOS']
---

CentOS 云服务器搭建 FTP 服务是怎么回事呢？CentOS 云服务器相信大家都很熟悉，但是搭建 FTP 服务是怎么回事呢？下面就让小编带大家一起了解吧。 

CentOS 云服务器搭建 FTP 服务，其实就是搭建 FTP 服务了。那么CentOS 云服务器为什么会搭建 FTP 服务，相信大家都很好奇是怎么回事。大家可能会感到很惊讶，CentOS 云服务器怎么会搭建 FTP 服务呢？但事实就是这样，小编也感到非常惊讶。那么这就是关于CentOS 云服务器搭建 FTP 服务的事情了，大家有没有觉得很神奇呢？

看了今天的内容，大家有什么想法呢？欢迎在评论区告诉小编一起讨论哦。

<!--more-->

## 一、安装 vsftpd

执行以下命令，安装 vsftpd

```bash
yum install -y vsftpd
```

启动 FTP 服务，并设置 vsftpd 开机自启动

```bash
systemctl start vsftpd
systemctl enable vsftpd
```

确认服务是否启动

```bash
netstat -antup | grep ftp
```

显示结果如下，则说明 FTP 服务已成功启动。

![](https://main.qcloudimg.com/raw/2a7abf80253a8469c9340878d89b452a.png)

此时，vsftpd 已默认开启匿名访问模式，无需通过用户名和密码即可登录 FTP 服务器。使用此方式登录 FTP 服务器的用户没有修改或上传文件的权限。

## 二、配置 vsftpd

为 FTP 服务创建一个 Linux 用户，本文以 ftpuser 为例

并设置 ftpuser 用户的密码，输入密码后请按 Enter 确认设置，密码默认不显示，本文以 `tf7295TFY` 为例

```bash
useradd ftpuser
passwd ftpuser
```

创建 FTP 服务使用的文件目录，本文以 `/var/ftp/test` 为例，并修改目录权限

```bash
mkdir /var/ftp/test
chown -R ftpuser:ftpuser /var/ftp/test
```

然后编辑 `vsftpd.conf` 文件

```bash
vim /etc/vsftpd/vsftpd.conf
```

> FTP 可通过主动模式和被动模式与客户端机器进行连接并传输数据。由于大多数客户端机器的防火墙设置及无法获取真实 IP 等原因，这里仅配置被动模式。

- 修改以下配置参数，设置匿名用户和本地用户的登录权限，设置指定例外用户列表文件的路径，并开启监听 IPv4 sockets

```conf
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
chroot_list_enable=YES
chroot_list_file=/etc/vsftpd/chroot_list
listen=YES
```

- 关闭监听 IPv6 sockets

```conf
# listen_ipv6=YES
```

- 添加以下配置参数，开启被动模式，设置本地用户登录后所在目录，以及云服务器建立数据传输可使用的端口范围值。

```conf
local_root=/var/ftp/test
allow_writeable_chroot=YES
pasv_enable=YES
pasv_address=xxx.xx.xxx.xx #请修改为您的 Linux 云服务器公网 IP
pasv_min_port=40000
pasv_max_port=45000
```

最后创建并编辑 chroot_list 文件，输入用户名，一个用户名占据一行，本文输入 ftpuser

```bash
vim /etc/vsftpd/chroot_list
```

重启 FTP 服务

```bash
systemctl restart vsftpd
```

## 三、设置安全组

- 被动模式：放通端口 21，及上文 修改配置文件 中设置的 `pasv_min_port` 到 `pasv_max_port` 之间的所有端口，本文放通端口为 `40000 - 45000`

## 四、验证 FTP 服务

您可通过 FTP 客户端软件、浏览器或文件资源管理器等工具验证 FTP 服务，本文以客户端的文件资源管理器为例。

- 打开客户端的 IE 浏览器，选择工具 > Internet 选项 > 高级，根据您选择的 FTP 模式进行修改：

本文使用的是被动模式：勾选“使用被动 FTP”。

- 打开客户端的计算机，在路径栏中访问以下地址。如下图所示：

```
ftp://云服务器公网IP:21
```

![](https://main.qcloudimg.com/raw/01154cd3f3af8c0578e588c29a574216.png)

- 在弹出的“登录身份”窗口中输入 配置 vsftpd 中已设置的用户名及密码。

本文使用的用户名为 ftpuser，密码为 `tf7295TFY`。

- 成功登录后，即可上传及下载文件。
