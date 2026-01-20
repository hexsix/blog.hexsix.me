---
title:      自动执行 Algolia 搜索
date:       2025-01-10T21:29:19+08:00
author:     喵小六
categories: ['Study']
tags:       ['Algolia', 'cURL', 'crontab']
---

> 第一个 Algolia APP 因为太久不用被删除了。
>
> 所以就想着能不能每个月自动执行一下搜索。

续命.jpg

<!--more-->

然后就查到了可以通过 http 搜索 [Search API reference | Algolia docs](https://www.algolia.com/doc/rest-api/search/#tag/Search/operation/searchSingleIndex)

也不知道能不能行，总之先放一个 crontab 在服务器上

```bash
curl -X POST --url https://i54mtiwiv7.algolia.net/1/indexes/blog_hexsix_me/query --header 'Accept: application/json' --header 'Content-Type: application/json' --header 'x-algolia-api-key: abcdef' --header 'x-algolia-application-id: 123456' -d '{"params": "query=Rime"}'
```
