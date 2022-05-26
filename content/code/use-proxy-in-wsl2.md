---
title:      在 WSL2 中使用代理
date:       2022-05-26T23:36:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'v2ray', 'proxychains', 'wsl', 'wsl2']
---

在网上搜到的清一色都是使用 windows 的代理，可是使用 windows 代理不仅麻烦，而且还要开放防火墙，同时监听本地地址，坏处显而易见

本文教你如何在 WSL2 中安装配置 v2ray 和 proxychains 来使用代理

<!--more-->

## 首先安装 v2ray

> 本节参考 [https://github.com/v2fly/fhs-install-v2ray](https://github.com/v2fly/fhs-install-v2ray)

Debian 和 Arch 系有自己软件仓库，这里以 ubuntu 举例

```bash
// 安装可执行文件和 .dat 数据文件
# bash <(curl -L https://raw.githubusercontent.com/v2fly/fhs-install-v2ray/master/install-release.sh)
```

> 这时候就会陷入死循环，我没有代理怎么访问 raw.githubusercontent.com 呢
>
> 你 windows 有代理啊，先用浏览器把文件下载下来再 copy 到 WSL 里不就好了

v2ray 会在以下位置安装

```
installed: /usr/local/bin/v2ray
installed: /usr/local/bin/v2ctl
installed: /usr/local/share/v2ray/geoip.dat
installed: /usr/local/share/v2ray/geosite.dat
installed: /usr/local/etc/v2ray/config.json
installed: /var/log/v2ray/
installed: /var/log/v2ray/access.log
installed: /var/log/v2ray/error.log
installed: /etc/systemd/system/v2ray.service
installed: /etc/systemd/system/v2ray@.service
```

不幸的是，WSL 没有 systemd

你可以找一些替代品，或者和我一样，要用代理的时候，运行一下 v2ray 的可执行文件

```
/usr/local/bin/v2ray --config /usr/local/etc/v2ray/config.json
```

至于 config.json 怎么配置，这里有大量的样例可供参考，每个人情况都不一样，挑一个适合你的，[https://github.com/v2fly/v2ray-examples](https://github.com/v2fly/v2ray-examples)

## 然后安装 proxychains

要在命令行再去配置 v2ray 的代理规则着实麻烦，我选择用 proxychains 来代理我要执行的命令，反正 WSL 也只有命令行

安装 proxychains

```
sudo apt install proxychains
```

然后编辑配置

```
# 启用 quiet_mode
quiet_mode
# 禁用 proxy_dns
#proxy_dns
# 配置 v2ray 端口
socks5   127.0.0.1 1089
http     127.0.0.1 8889
```

然后在你想运行的命令前加上 proxychains 就好了，比如

```
proxychains curl -vv https://google.com/
```

> 端口号配置在 /usr/local/etc/v2ray/config.json 里的 inbounds 字段，找不到就是你没配，去 v2ray-examples 看看怎么配
> 
> 如果没有走代理，先去看看 v2ray 的日志走的是 proxy 还是 direct
