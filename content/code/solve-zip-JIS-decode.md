---
title:      解决 unzip 解压日语乱码
date:       2021-10-28T19:32:41+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'unzip', 'archlinux']
---

`unzip` 没有 `-O` 选项，用 `unzip-iconv` 替代

<!--more-->

```bash
$ unzip -O Shift_JIS filename.zip
```
