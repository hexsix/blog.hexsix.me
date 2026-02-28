---
title: "解决 unzip 解压日语乱码"
pubDatetime: 2021-10-28T19:32:41+08:00
author: "喵小六"
type: "code"
tags: ["CS", "unzip", "archlinux", "Study"]
description: "`unzip` 没有 `-O` 选项，用 `unzip-iconv` 替代"
---

`unzip` 没有 `-O` 选项，用 `unzip-iconv` 替代



```bash
$ unzip -O Shift_JIS filename.zip
```
