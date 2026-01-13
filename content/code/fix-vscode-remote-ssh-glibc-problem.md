---
title:      2026新版，远程主机可能不符合 glibc 和 libstdc++ VS Code 服务器的先决条件
date:       2026-01-13T11:38:27+08:00
author:     喵小六
categories: ['Software']
tags:       ['centos', 'vscode', 'glibc']
---

> 公司服务器是远古的 centos7，我一直以来都是旧版 1.86 登录。
>
> 最近公司为我们开通了某 vibe coding 的会员，旧版 vscode 已经不满足这个软件的扩展的最低要求了，正好看到 vscode 官方给了一个解决办法。
>
> 中文网上记录这个解决办法的不多，这里简单写一下。

<!--more-->

## Overview

当我们连接到旧版linux的时候，remote-ssh扩展会报如下错误

```txt
在最近一次远程 - SSH 会话中检测到以下问题 
Ctrl+单击某个问题以在 Copilot 聊天中继续。 
╔══════════════╤════════════════════════════════════════════════════════════════════╤════════════════════════════════════════════════════════════════════╤════════════════════════════════════════════════════════════════════╗
║     状态     │ 消息                                                               │ 缓解措施                                                           │ 资源                                                               ║
╟──────────────┼────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────╢
║ LinuxPrereqs │ 远程主机可能不符合 glibc 和 libstdc++ VS Code 服务器的先决条件 (远 │ • https://aka.ms/vscode-remote/faq/old-linux                       │ • https://aka.ms/vscode-remote/linux-prerequisites                 ║
║              │ 程主机不满足运行VS Code服务器的先决条件)                           │                                                                    │                                                                    ║
╚══════════════╧════════════════════════════════════════════════════════════════════╧════════════════════════════════════════════════════════════════════╧════════════════════════════════════════════════════════════════════╝
在以下位置查看详细信息:  Output Log...
```

点开链接后发现官方给了一个解决办法，通过 Crosstool-ng 编译 glibc，然后通过 patchelf 打补丁的方式。

本教程这里跳过编译，直接通过 mamba 安装 glibc 和 patchelf。

> `mamba` 是 miniforge 的命令，因为 `conda` 源是商业软件，所以用 `miniforge` 替代。
>
> 没有这方面合规性要求的小伙伴可以用 conda 替代，本文中的命令只要用 `conda install` 替代 `mamba install` 即可。
>
> `miniforge` 或者 `conda` 的安装本教程不展开。

## 安装 glibc 和 patchelf

### 1. glibc 2.28

先安装 glibc 2.28

```bash
$ mamba install sysroot_linux-64=2.28

  Package                    Version  Build       Channel         Size
────────────────────────────────────────────────────────────────────────
  Install:
────────────────────────────────────────────────────────────────────────

  + kernel-headers_linux-64   4.18.0  he073ed8_9  conda-forge      1MB
  + sysroot_linux-64            2.28  he3f20f0_9  conda-forge     24MB

  Summary:

  Install: 2 packages

  Total download: 25MB

────────────────────────────────────────────────────────────────────────

```

验证安装，在安装位置的 sysroot 下（默认是 `~/miniforge3/x86_64-conda-linux-gnu/sysroot/lib`）

```bash
$ strings libc.so.6 | grep GLIBC_2.28 # glibc 2.28
GLIBC_2.28
GLIBC_2.28

$ ls ld-linux-x86-64.so.2 # 动态链接器
ld-linux-x86-64.so.2
```

### 2. libstdc++

这个默认有装，在安装位置的 lib 下（默认是 `~/miniforge3/lib`）

```bash
$ strings libstdc++.so | grep GLIBCXX_3.4.21
GLIBCXX_3.4.21
GLIBCXX_3.4.21
```

如果没有，用以下命令安装

```bash
$ mamba install libstdcxx-ng
```

### 3. patchelf

安装 patchelf

```bash
$ mamba install patchelf

  Package     Version  Build       Channel         Size
─────────────────────────────────────────────────────────
  Install:
─────────────────────────────────────────────────────────

  + patchelf   0.17.2  h58526e2_0  conda-forge     94kB

  Summary:

  Install: 1 packages

  Total download: 94kB

─────────────────────────────────────────────────────────
```

验证安装

```bash
$ patchelf --version
patchelf 0.17.2
$ which patchelf
~/miniforge3/bin/patchelf
```

> patchelf v0.17.x is known to cause segfaults with the remote server, we recommend using patchelf >=v0.18.x
>
> vscode 官方给了警告，但我还没遇到问题，所以简单使用 conda 的 patchelf

## 配置环境变量

我们需要创建三个环境变量，在 `.bashrc` 的顶部，一定要用绝对路径

```bash
export VSCODE_SERVER_CUSTOM_GLIBC_LINKER="/home/{YOURNAME}/miniforge3/x86_64-conda-linux-gnu/sysroot/lib/ld-linux-x86-64.so.2"
export VSCODE_SERVER_CUSTOM_GLIBC_PATH="/home/{YOURNAME}/miniforge3/x86_64-conda-linux-gnu/sysroot/lib:/home/{YOURNAME}/miniforge3/lib"
export VSCODE_SERVER_PATCHELF_PATH="/home/{YOURNAME}/miniforge3/bin/patchelf"
```

注意，IMPORTANT，CAUTION，总共有 4 个路径

- 你的动态链接器的路径，用于 `patchelf --set-interpreter` 参数
- 你的 `GLIBC` 的路径，用于 `patchelf --set-rpath` 参数
- `GLIBCXX` 路径，也用于 `patchelf --set-rpath` 参数，一般来讲 lib 是在一起的，但是 `conda` 放在了两个目录下，所以注意看 `VSCODE_SERVER_CUSTOM_GLIBC_PATH` 拼了两个路径
- `patchelf` 路径

为什么要放在顶部

> VS Code 远程连接时会启动非交互式 Shell，你必须确保上述 `export` 语句写在 `~/.bashrc` 的最顶部，或者至少在任何 `[ -z "$PS1" ] && return` 语句之前。

为什么要用绝对路径

> 在 shell 脚本或环境变量中，`~` 是一个 shell 扩展。但是 VS Code Server 在执行打补丁命令时，通常不会对环境变量进行 shell 路径扩展。

## 连接服务器

到这里就可以顺利连接服务器了

glhf
