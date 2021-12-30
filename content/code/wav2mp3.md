---
title:      wav 转 mp3 的 shell 脚本
date:       2021-04-24T18:25:07+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'lame']
---

要先安装 `lame`

<!--more-->

```sh
for i in *.wav; 

  do lame -V1 "$i" "${i%.wav}.mp3";rm -f "$i" ;

done
```