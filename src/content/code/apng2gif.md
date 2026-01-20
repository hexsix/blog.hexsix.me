---
title:      apng 转 gif 的 shell 脚本
date:       2022-04-17T10:08:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'apng', 'gif']
---

要先安装 `apng2gif`，网址：[apng2gif.sf.net](http://apng2gif.sourceforge.net/)

linux 的二进制版本需要在左侧的 Browse all files 里找到，或者可以通过源码编译

<!--more-->

直接复制到 `/usr/local/bin` 目录下，当作安装的软件用

打包者没有静态链接 libpng12 的库，如果报错额外安装一下（需要启用 multilib）

```bash
sudo pacman -S libpng12 lib32-libpng12 lib32-gcc-libs
```

删除 apng

```sh
for i in *.png;

  do apng2gif "$i" "${i%.png}.gif";rm -f "$i" ;

done
```

不删除 apng

```sh
for i in *.png;

  do apng2gif "$i" "${i%.png}.gif";

done
```
