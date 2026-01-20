---
title:      用rclone和坚果云webdav自动备份服务器文件
date:       2025-04-21T14:31:21+08:00
author:     喵小六
categories: ['Study']
tags:       ['rclone', 'webdav']
---

简单记录一下配置坚果云webdav的过程

<!--more-->

## 前言

坚果云提供WebDAV服务，可以方便地与rclone工具配合使用，实现服务器文件的自动备份。本文将介绍具体配置步骤。

## 一、安装rclone

首先需要在服务器上安装rclone工具：

```bash
sudo apt install rclone
```

安装输出：
```
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Suggested packages:
  fuse | fuse3
The following NEW packages will be installed:
  rclone
0 upgraded, 1 newly installed, 0 to remove and 86 not upgraded.
Need to get 14.6 MB of archives.
After this operation, 58.7 MB of additional disk space will be used.
Get:1 http://mirrors.tencentyun.com/debian bookworm/main amd64 rclone amd64 1.60.1+dfsg-2+b5 [14.6 MB]
Fetched 14.6 MB in 0s (48.2 MB/s)
Selecting previously unselected package rclone.
(Reading database ... 78796 files and directories currently installed.)
Preparing to unpack .../rclone_1.60.1+dfsg-2+b5_amd64.deb ...
Unpacking rclone (1.60.1+dfsg-2+b5) ...
Setting up rclone (1.60.1+dfsg-2+b5) ...
Processing triggers for man-db (2.11.2-2) ...
```

## 二、配置坚果云WebDAV

运行以下命令开始配置：

```bash
rclone config
```

当首次运行时，会提示没有找到配置文件，并询问是否创建新的远程连接：

```
2025/04/21 11:10:04 NOTICE: Config file "/home/lighthouse/.config/rclone/rclone.conf" not found - using defaults
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n
```

输入`n`创建新的远程连接，然后为连接命名（这里使用`jianguoyun`）：

```
Enter name for new remote.
name> jianguoyun
```

在存储类型选项中，选择`42`（WebDAV）：

```
Option Storage.
Type of storage to configure.
Choose a number from below, or type in your own value.
 1 / 1Fichier
   \ (fichier)
 2 / Akamai NetStorage
   \ (netstorage)
 3 / Alias for an existing remote
   \ (alias)
 4 / Amazon Drive
   \ (amazon cloud drive)
 5 / Amazon S3 Compliant Storage Providers including AWS, Alibaba, Ceph, China Mobile, Cloudflare, ArvanCloud, Digital Ocean, Dreamhost, Huawei OBS, IBM COS, IDrive e2, IONOS Cloud, Lyve Cloud, Minio, Netease, RackCorp, Scaleway, SeaweedFS, StackPath, Storj, Tencent COS, Qiniu and Wasabi
   \ (s3)
 6 / Backblaze B2
   \ (b2)
 7 / Better checksums for other remotes
   \ (hasher)
 8 / Box
   \ (box)
 9 / Cache a remote
   \ (cache)
10 / Citrix Sharefile
   \ (sharefile)
11 / Combine several remotes into one
   \ (combine)
12 / Compress a remote
   \ (compress)
13 / Dropbox
   \ (dropbox)
14 / Encrypt/Decrypt a remote
   \ (crypt)
15 / Enterprise File Fabric
   \ (filefabric)
16 / FTP
   \ (ftp)
17 / Google Cloud Storage (this is not Google Drive)
   \ (google cloud storage)
18 / Google Drive
   \ (drive)
19 / Google Photos
   \ (google photos)
20 / HTTP
   \ (http)
21 / Hadoop distributed file system
   \ (hdfs)
22 / HiDrive
   \ (hidrive)
23 / In memory object storage system.
   \ (memory)
24 / Internet Archive
   \ (internetarchive)
25 / Jottacloud
   \ (jottacloud)
26 / Koofr, Digi Storage and other Koofr-compatible storage providers
   \ (koofr)
27 / Local Disk
   \ (local)
28 / Mail.ru Cloud
   \ (mailru)
29 / Microsoft Azure Blob Storage
   \ (azureblob)
30 / Microsoft OneDrive
   \ (onedrive)
31 / OpenDrive
   \ (opendrive)
32 / OpenStack Swift (Rackspace Cloud Files, Memset Memstore, OVH)
   \ (swift)
33 / Pcloud
   \ (pcloud)
34 / Put.io
   \ (putio)
35 / SMB / CIFS
   \ (smb)
36 / SSH/SFTP
   \ (sftp)
37 / Sia Decentralized Cloud
   \ (sia)
38 / Sugarsync
   \ (sugarsync)
39 / Transparently chunk/split large files
   \ (chunker)
40 / Union merges the contents of several upstream fs
   \ (union)
41 / Uptobox
   \ (uptobox)
42 / WebDAV
   \ (webdav)
43 / Yandex Disk
   \ (yandex)
44 / Zoho
   \ (zoho)
45 / premiumize.me
   \ (premiumizeme)
46 / seafile
   \ (seafile)
Storage> 42
```

输入坚果云WebDAV的URL：

```
Option url.
URL of http host to connect to.
E.g. https://example.com.
Enter a value.
url> https://dav.jianguoyun.com/dav/
```

WebDAV服务提供商选项可以留空（直接按回车）：

```
Option vendor.
Name of the WebDAV site/service/software you are using.
Choose a number from below, or type in your own value.
Press Enter to leave empty.
 1 / Nextcloud
   \ (nextcloud)
 2 / Owncloud
   \ (owncloud)
 3 / Sharepoint Online, authenticated by Microsoft account
   \ (sharepoint)
 4 / Sharepoint with NTLM authentication, usually self-hosted or on-premises
   \ (sharepoint-ntlm)
 5 / Other site/service or software
   \ (other)
vendor> 
```

输入坚果云账号（邮箱）和密码：

```
Option user.
User name.
In case NTLM authentication is used, the username should be in the format 'Domain\User'.
Enter a value. Press Enter to leave empty.
user> your_email_name@domain.ltd

Option pass.
Password.
Choose an alternative below. Press Enter for the default (n).
y) Yes, type in my own password
g) Generate random password
n) No, leave this optional password blank (default)
y/g/n> y
Enter the password:
password:
Confirm the password:
password:
```

Bearer token留空（直接按回车）：

```
Option bearer_token.
Bearer token instead of user/pass (e.g. a Macaroon).
Enter a value. Press Enter to leave empty.
bearer_token> 
```

不需要编辑高级配置（输入`n`或直接按回车）：

```
Edit advanced config?
y) Yes
n) No (default)
y/n> 
```

确认配置信息并保存（输入`y`或直接按回车）：

```
Configuration complete.
Options:
- type: webdav
- url: https://dav.jianguoyun.com/dav/
- user: hexsix@qq.com
- pass: *** ENCRYPTED ***
Keep this "jianguoyun" remote?
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d> 
```

查看当前配置的远程连接并退出配置：

```
Current remotes:

Name                 Type
====                 ====
jianguoyun           webdav

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
```

## 三、测试连接与使用

### 1. 列出坚果云中的文件

使用以下命令可以列出坚果云根目录下的文件：

```bash
rclone ls jianguoyun:/
```

输出结果（已省略部分内容）：
```
 27647047 Books/hello.txt
[...省略其他文件...]
```

### 2. 检查备份目录

可以查看特定目录是否存在：

```bash
rclone ls jianguoyun:/Backups
```

### 3. 上传备份文件

将本地文件上传到坚果云指定目录：

```bash
rclone copy ./hello.txt jianguoyun:/Backups
```

## 四、设置自动备份

可以通过crontab设置定时任务，实现自动备份。例如：

```bash
# 编辑crontab
crontab -e

# 添加定时任务，每天凌晨2点执行备份
0 2 * * * rclone copy /path/to/backup/files jianguoyun:/Backups/path/ --include "*.tar.gz"
```

## 总结

通过以上步骤，我们成功配置了rclone与坚果云WebDAV的连接，并可以方便地进行文件上传和备份操作。这种方法适合需要定期备份重要数据的服务器，既安全又便捷。
