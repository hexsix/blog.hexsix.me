---
title:      利用 Github Action 自动更新 submodule
date:       2021-12-23T20:00:00+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'git', 'Github']
---

> 每次本博客的上游主题更新的时候，都要手动更新一下 submodule，都 2021 年了，我选择自动化。

<!--more-->

{{< toc >}}

## 一、设置 token

### 1.1 生成一个新的 token

在配置 Github Action 之前，我们需要新建一个供脚本使用的 token。

- 在任何页面的右上角，单击您的个人资料照片，然后单击 Settings（设置）。

![](https://docs.github.com/assets/cb-34573/images/help/settings/userbar-account-settings.png)

- 在左侧边栏中，单击 Developer settings。

![](https://docs.github.com/assets/cb-6064/images/help/settings/developer-settings.png)

- 在左侧边栏中，单击 Personal access tokens（个人访问令牌）。

![](https://docs.github.com/assets/cb-7169/images/help/settings/personal_access_tokens_tab.png)

- 单击 Generate new token（生成新令牌）。

![](https://docs.github.com/assets/cb-6922/images/help/settings/generate_new_token.png)

- 给 token 取一个好记忆的名字。

比如 `Auto Update Submodule of blog.hexsix.me`

![](https://docs.github.com/assets/cb-3882/images/help/settings/token_description.png)

- 设置 token 使用期限。

![](https://docs.github.com/assets/cb-39860/images/help/settings/token_expiration.png)

- 选择 token 使用范围。

把 repo 全部勾上，我们需要 repo 的读写权限。

- 点击 Click Generate token。

![](https://docs.github.com/assets/cb-10912/images/help/settings/generate_token.png)

![](https://docs.github.com/assets/cb-33660/images/help/settings/personal_access_tokens.png)

记住 token，马上就要用了

> PS. 本节内容翻译自 [https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

### 1.2 在项目内配置 token 变量

- 在你的仓库页面点击 Settings。

![](https://docs.github.com/assets/cb-21851/images/help/repository/repo-actions-settings.png)

- 在侧边栏点击 Secrets。
- 点击 New repository secret（新建仓库 secret）。
- 给 secret 取一个名字。
  这里我们取 `CI_TOKEN`，之后会用到。如果你换了这个变量名，那之后也需要替换对应的地方。
- 填上我们上一节生成的 token。
- 最后点击 Add secret。

> PS. 本节内容翻译自 [https://docs.github.com/en/actions/security-guides/encrypted-secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## 二、配置 Github Action

1. 在 Actions 页面新建 workflow。
2. 找到 `Skip this and set up a workflow yourself`。

```yaml
name: 'Submodules Sync'

on:
  schedule:
  - cron: "0 2 * * *"
  # Allows you to run this workflow manually from the Actions tab or through HTTP API
  workflow_dispatch:

jobs:
  sync:
    name: 'Submodules Sync'
    runs-on: ubuntu-latest

    # Use the Bash shell regardless whether the GitHub Actions runner is ubuntu-latest, macos-latest, or windows-latest
    defaults:
      run:
        shell: bash

    steps:
    # Checkout the repository to the GitHub Actions runner
    - name: Checkout
      uses: actions/checkout@v2
      with:
        token: ${{ secrets.CI_TOKEN }}
        submodules: true

    # Update references
    - name: Git Sumbodule Update
      run: |
        git pull --recurse-submodules
        git submodule update --remote --recursive

    - name: Commit update
      run: |
        git config --global user.name 'Git bot'
        git config --global user.email 'bot@noreply.github.com'
        git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}
        git commit -am "Auto updated submodule references" && git push || echo "No changes to commit"
```

其中

- `${{ secrets.CI_TOKEN }}` 是我们刚刚配置的 token
- `${{ secrets.GITHUB_TOKEN }}` 和 `${{ github.repository }}` 都是默认变量，不需要配置
- `cron: "0 2 * * *"` 表示每天 2:00 UTC 运行一次，你可以自定义这个时间

完成创建后立即运行一次，看看有没有问题吧。

> PS. 本节内容翻译自 [https://stackoverflow.com/questions/64407333/using-github-actions-to-automatically-update-the-repos-submodules](https://stackoverflow.com/questions/64407333/using-github-actions-to-automatically-update-the-repos-submodules)

> 如果你的 submodule 是自己的，链接里还展示了一种 submodule 里创建 Actions 主动推送形式更新 submodule 的方法，本文就不展开了。
