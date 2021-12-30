---
title:      用 Sprunge 贴上你的日志
date:       2021-11-19T11:09:09+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'Sprunge', 'pastebin']
---

有的时候你需要贴上你的日志方便其他人 debug，往往这个时候我的电脑经常只有命令行。

当 pastebin 关掉了他们的公共 api 后，我就在寻找替代方案。

Sprunge 真不错。

<!--more-->

```bash
<command> | curl -F 'sprunge=<-' http://sprunge.us
```

你也可以用 alias 缩短命令

```bash
alias paste="curl -F 'sprunge=<-' http://sprunge.us"

<command> | paste
```
