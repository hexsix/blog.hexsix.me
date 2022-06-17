---
title:      SSH禁用ROOT登录和密码登录
date:       2022-06-17T10:13:59+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'ssh', 'self-host']
---

只要你有一台公网服务器，用 `lastb -n 30` 查看登录失败日志，你就会发现几乎每分钟都有机器人在尝试登录你的服务器。

前段时间群友的腾讯云服务器还真给人把密码给破了，客服还给他发了邮件。

为了增强服务器安全性，这里介绍 SSH 禁用 ROOT 登录和密码登录的方式。

<!--more-->

> 在文章开头简单提一嘴，命令以 `#` 开头表示 root 用户，以 `$` 开头表示非 root 用户

## 1. 新增一个非 root 用户 (Serverside)

既然我们要禁用 root 登录，那自然需要一个非 root 用户，用户名以 andy 为例，创建一个 `sudo` 组的用户

```shell
# useradd -m -G "sudo" -s "/bin/bash" andy
```

> 如果是 CentOS 系统，sudo 的用户组并非 `sudo`，而是 `wheel`：
> `# useradd -m -G "wheel" -s "/bin/bash" andy`

然后为 andy 设置密码

```shell
# passwd andy
```

切换到 andy

```shell
# su - andy
```

接下来使用 sudo 基本都需要 andy 的密码，如果你不希望输入密码，编辑 sudo 的配置文件

```shell
$ EDITOR=vim sudo visudo
```

找到如下配置并解注释 `NOPASSWD: ALL` 这一行，强迫症可以把之前这行注释掉，但没必要

```properties
## Allows people in group wheel to run all commands
#%wheel ALL=(ALL)       ALL

## Same thing without a password
%wheel  ALL=(ALL)       NOPASSWD: ALL
```

我们推荐接下来都使用 andy 来操作，这样你的服务器更不容易玩坏，当然 root 权限更高，你更喜欢掌控一切的感觉

```shell
$ sudo su -
```

## 2. 配置免密登录

配置免密登录有两种方式

- 其一：在本地生成 ssh key，然后将公钥发给服务器
- 其二：在服务器生成 ssh key，然后将密钥下载到本地

无论哪种方案，我们都需要妥善保管密钥，建议多地备份，如果失去了密钥，那么我们就没有办法登录服务器了。

### 2.1 方案一

#### 2.1.1 生成 SSH key

给你的 SSH key 随便签个名，这里以 foobar@dagugugji.com 为例，2022 年了我们推荐 ed25519 加密 (Localside)

```shell
$ ssh-keygen -t ed25519 -C "foobar@dagugugji.com"
```

#### 2.1.2 将公钥交给服务器

用 ssh-copy-id 命令将公钥交给服务器 (Localside)

```shell
$ ssh-copy-id andy@{serverip}
```

或者以手动的方式将公钥交给服务器

查看本地公钥 (Localside)

```shell
$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAXXXXXXXXXXXXXAAAAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX foobar@dagugugji.com
```

编辑远程 auth 文件 (Serverside)

```shell
$ vim ~/.ssh/authorized_keys
```

将公钥写在文件末尾，如果已经有其他公钥，需要另起一行 (Serverside)

```plaintext
ssh-ed25519 AAAAXXXXXXXXXXXXXAAAAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX foobar@dagugugji.com
```

保存退出后修改 auth 文件权限，`ssh-copy-id` 命令会自动设置权限无需额外操作 (Serverside)

```shell
$ chmod 600 ~/.ssh/authorized_keys
```

### 2.2 方案二

#### 2.2.1 生成 SSH key (Serverside)

```shell
$ ssh-keygen -t ed25519 -C "foobar@dagugugji.com"
```

#### 2.2.2 将密钥下载到本地 (Localside)

随便设置一个文件名，这里以 foobar 为例

```shell
$ scp andy@{serverip}:~/.ssh/id_ed25519 ~/.ssh/foobar
```

修改密钥权限

```shell
$ chmod 600 ~/.ssh/foobar
```

接下来有两种方案，
- 其一：将密钥添加到 ssh-agent
- 其二：配置 ssh config

Linux/macOS 推荐第一种，因为 ssh agent 服务会在登录时自动运行；WSL/windows 则推荐第二种，免去配置 ssh-agent 的烦恼

将密钥添加到 ssh-agent

```shell
$ ssh-add ~/.ssh/foobar
```

编辑 ssh config

```shell
vim ~/.ssh/config
```

添加如下内容，Host 一行可以取一个好记得名字，之后可以用简写登录 `ssh {servername}`，这里以 andy_server 为例

```plaintext
Host andy_server
    HostName {serverip}
    Port 22
    User andy
    IdentityFile /home/cmos/.ssh/foobar
    IdentitiesOnly yes
```

> 都可以配置 ssh config 来达到简写登录的目的

## 3. 测试免密登录 (Localside)

```shell
$ ssh andy@{serverip}
```

或者你配置过了 `~/.ssh/config`

```shell
$ ssh andy_server
```

## 4. 禁用 root 用户登录和密码登录 (Serverside)

修改 sshd 配置

```shell
$ sudo vim /etc/ssh/sshd_config
```

找到如下配置并修改，从上至下分别是：禁用 root 登录、允许密钥登录和禁用密码登录

```properties
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
```

改完后重启 sshd

```shell
$ sudo systemctl restart sshd
```

再次测试能否免密登录

## 5. 问题排查

首先排查文件权限，查看以下文件权限是否正确

服务器上：

```plaintext
-rw-------. 1 andy andy   88 Jun 15 21:29 authorized_keys
-rw-------. 1 andy andy  399 Jun 15 21:29 id_ed25519
-rw-r--r--. 1 andy andy   88 Jun 15 21:29 id_ed25519.pub
```

如果不对

```shell
$ chmod 600 authorized_keys
$ chmod 600 id_ed25519
$ chmod 644 id_ed25519.pub
```

本地：

```plaintext
-rw------- 1 {username} {username}  399 Jun 15 18:53 foobar
```

如果不对

```shell
$ chmod 600 foobar
```

然后排查 sshd 配置

```properties
PermitRootLogin no
PubkeyAuthentication yes
AuthorizedKeysFile  .ssh/authorized_keys
PasswordAuthentication no
ChallengeResponseAuthentication no
GSSAPIAuthentication yes
GSSAPICleanupCredentials no
UsePAM yes
```

如果你还在使用 RSA 密钥，则需要

```properties
RSAAuthentication yes
```

如果还是有问题，先百度（Google）一下看看，如果还是不行，那就找个论坛问问小伙伴吧，记得附上 debug 日志：

```shell
$ ssh -vvv {username}@{server_ip}
```
