# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个使用 Hugo 静态网站生成器构建的个人博客，主题为 Bilberry Hugo Theme v4（作为 Git submodule 引入）。博客地址：https://blog.hexsix.me/

## 常用命令

```bash
# 构建站点（需要 Hugo Extended 版本）
hugo

# 本地开发服务器
hugo server

# 带草稿的本地开发
hugo server -D

# 创建新文章（type 可选: article, code, page, status, video, quote, link, gallery）
hugo new code/your-post-name.md

# 更新主题 submodule
git submodule update --remote --recursive
```

## 架构说明

### 目录结构

- `content/` - 博客内容，按类型分类：
  - `article/` - 一般文章
  - `code/` - 技术教程和指南
  - `page/` - 静态页面（如 About）
  - `status/`, `video/`, `quote/`, `link/`, `gallery/` - 其他内容类型
- `layouts/` - 自定义模板覆盖
  - `partials/` - 自定义 favicon、footer（包含 Sakana 小部件）
  - `shortcodes/` - 自定义短代码（about-me-hexsix, arcaea-timeline）
- `static/` - 静态资源（favicon、错误页图片等）
- `themes/bilberry-hugo-theme/` - 主题 submodule
- `algolia/` - 搜索索引上传脚本

### 配置

主配置文件为 `config.toml`，包含：
- 站点元数据和 SEO 设置
- Algolia 搜索配置（App ID: I54MTIWIV7, Index: blog_hexsix_me）
- Giscus 评论系统配置（基于 GitHub Discussions）
- 主题颜色和样式设置

### CI/CD

GitHub Actions 自动化：
- `upload_index.yml` - push 到 master 时自动构建并上传 Algolia 搜索索引
- `manual.yml` - 每月6日自动同步主题 submodule

### 文章格式

```yaml
---
title: 文章标题
date: 2025-01-13T11:38:27+08:00
author: 喵小六
categories: ['分类']
tags: ['标签1', '标签2']
---
```

## 注意事项

- 构建输出到 `/public` 目录（已在 .gitignore 中忽略）
- 搜索索引由 Hugo 生成 `public/index.json`，通过 `algolia/data-upload.js` 上传
- 主题更新通过 submodule 管理，不要直接修改 `themes/` 目录内容
