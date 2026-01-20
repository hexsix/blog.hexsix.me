---
title:      限制 docker 容器的内存和 cpu 用量
date:       2021-09-24T18:04:25+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'docker']
---

如何限制 docker 容器的内存和 cpu 用量呢？小编也很好奇。

<!--more-->

## 限制容器对内存的使用：

`-m 300M`

[Docker: 限制容器可用的内存](https://www.cnblogs.com/sparkdev/p/8032330.html)

相关文件：

- 新：`/sys/fs/cgroup/memory.max`
- 旧：`/sys/fs/cgroup/memory/memory.max_usage_in_bytes`

## 限制可用的 CPU 个数:

`-cpus=2`

[Docker: 限制容器可用的 CPU](https://www.cnblogs.com/sparkdev/p/8052522.html)

相关文件：

- 新：`/sys/fs/cgroup/cpu.max`
- 旧：`/sys/fs/cgroup/cpu/cpu.cfs_quota_us` & `/sys/fs/cgroup/cpu/cpu.cfs_period_us`

## 访问本地网络：

`--network host`
