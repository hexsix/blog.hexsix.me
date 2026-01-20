---
title:      没有 root 权限怎么安装 bash-completion
date:       2023-10-24T16:24:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'bash', 'bash-completion']
---

> 公司服务器没有 root 权限用起来确实比较难受。

我们今天来安装 bash-completion。

<!--more-->

1. 下载 bash-completion 源码

```bash
wget https://github.com/scop/bash-completion/releases/download/2.11/bash-completion-2.11.tar.xz
```

2. 解压

```bash
tar -xvf bash-completion-2.11.tar.xz
```

3. 进入目录

```bash
cd bash-completion-2.11
```

4. (optional) autoreconf

```bash
autoreconf -i      # if not installing from prepared release tarball
```

6. 修改 config 目录和 data 目录，原来为 `/etc` 和 `/local/share`

```bash
./configure --sysconfdir=$HOME/.config --datadir=$HOME/.local/share
```

7. 执行安装

```bash
make               # GNU make required
make check         # optional
make install       # as root
make installcheck  # optional, requires python3 with pytest >= 3.6, pexpect
```
