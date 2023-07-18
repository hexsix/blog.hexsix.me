---
title:      git push 用错名字和邮箱怎么办
date:       2023-07-17T16:10:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'git']
---

> 公司电脑的 git 默认设置了自己的名字拼音和公司邮箱作为 `user.name` 和 `user.email`，
>
> 结果写这个博客的时候忘了改设置，把错误的名字邮箱提交到 github 上了。

之前写过一个用 `git rebase` 修改 author 的博文，不过已经过时咧。

<!--more-->

如果您想撤销提交并使用正确的作者名称和电子邮件重新推送，您可以执行以下操作：

1. 使用以下命令配置新的用户名和电子邮件：

```
git config user.name <用户名>
git config user.email <电子邮件>
```

2. 运行此命令以使用新的作者信息修改最后一次提交：

```
git commit --amend --reset-author
```

3. 强制将更改推送到远程存储库：

```
git push --force
```

这将更改最后一次提交中的作者信息 。
