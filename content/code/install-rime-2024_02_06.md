---
title:      自定义安装 Rime
date:       2024-02-26T10:34:00+08:00
author:     喵小六
categories: ['Software']
tags:       ['software', 'rime', 'windows', 'linux']
---

我们今天来在 Windows 下安装 Rime。

除了基础的 Rime 以外，我还要使用两套方案和两个词库，分别是

- [雾凇拼音](https://github.com/iDvel/rime-ice)
- [rime-japanese](https://github.com/gkovacs/rime-japanese)
- [肥猫百万大词库](https://github.com/felixonmars/fcitx5-pinyin-zhwiki)
- [萌娘百科词库](https://github.com/outloudvi/mw2fcitx)

<!--more-->

1. 安装 Rime 本体

在官网（[rime.im](https://rime.im/download/)）下载最新版一路回车安装即可

默认配置目录是 `~\AppData\Roaming\Rime`

2. 安装雾凇拼音

有很多安装方式，我们选手动安装

将仓库所有文件复制粘贴到配置目录，重新部署。

3. 安装 rime-japanese

将仓库所有文件复制粘贴到配置目录，修改 `default.yaml` 文件，在 `schema_list` 下新增 `schema: japanese`

重新部署。

4. 安装肥猫百万大词库

在 [Release](https://github.com/felixonmars/fcitx5-pinyin-zhwiki/releases) 页面下载最新的词库文件，比如 `zhwiki-20240210.dict.yaml`

放到 `cn_dict` 目录下重命名为 `zhwiki.dict.yaml`，然后在 `rime_ice.dict.yaml` 文件中的 `import_tables` 下面添加 `cn_dicts/zhwiki` 项，重新部署。

5. 安装 moegirl 词库

在 [Release](https://github.com/outloudvi/mw2fcitx/releases) 页面下载最新的词库文件，比如 `moegirl.dict.yaml`

放到 `cn_dict` 目录下，然后在 `rime_ice.dict.yaml` 文件中的 `import_tables` 下面添加 `cn_dicts/moegirl` 项，重新部署。

6. 配置界面

最后右键托盘图标，选择「输入法设定」，选择自己喜欢的方案和配色就好了，我比较喜欢谷歌的配色。

7. 其他修改

- 删除不用的方案
- 候选词个数
- 方案选单快捷键

```bash
$ diff --git a/default.yaml b/default.yaml
index 8c75106..680fcef 100644
--- a/default.yaml
+++ b/default.yaml
@@ -11,18 +11,19 @@ schema_list:
   # 可以直接删除或注释不需要的方案，对应的 *.schema.yaml 方案文件也可以直接删除
   # 除了 t9，它依赖于 rime_ice，用九宫格别删 rime_ice.schema.yaml
   - schema: rime_ice               # 雾凇拼音（全拼）
-  - schema: t9                     # 雾凇拼音（九宫格）
-  - schema: double_pinyin          # 自然码双拼
-  - schema: double_pinyin_abc      # 智能 ABC 双拼
-  - schema: double_pinyin_mspy     # 微软双拼
-  - schema: double_pinyin_sogou    # 搜狗双拼
-  - schema: double_pinyin_flypy    # 小鹤双拼
-  - schema: double_pinyin_ziguang  # 紫光双拼
+  - schema: japanese               # 日语
+  # - schema: t9                     # 雾凇拼音（九宫格）
+  # - schema: double_pinyin          # 自然码双拼
+  # - schema: double_pinyin_abc      # 智能 ABC 双拼
+  # - schema: double_pinyin_mspy     # 微软双拼
+  # - schema: double_pinyin_sogou    # 搜狗双拼
+  # - schema: double_pinyin_flypy    # 小鹤双拼
+  # - schema: double_pinyin_ziguang  # 紫光双拼


 # 菜单
 menu:
-  page_size: 5  # 候选词个数
+  page_size: 6  # 候选词个数
   # alternative_select_labels: [ ①, ②, ③, ④, ⑤, ⑥, ⑦, ⑧, ⑨, ⑩ ]  # 修改候选项标签
   # alternative_select_keys: ASDFGHJKL  # 如编码字符占用数字键，则需另设选字键

@@ -32,9 +33,9 @@ switcher:
   caption: 「方案选单」
   hotkeys:
     - F4
-    - Control+grave
+    # - Control+grave
     # - Alt+grave
-    - Control+Shift+grave
+    # - Control+Shift+grave
   save_options:  # 开关记忆（方案中的 switches），从方案选单（而非快捷键）切换时会记住的选项，需要记忆的开关不能设定 reset
     - ascii_punct
     - traditionalization
```
