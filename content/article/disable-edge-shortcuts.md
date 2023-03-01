---
title: "如何禁用Edge快捷键"
date: 2023-03-01T17:16:00+01:00

tags: ['Microsoft', 'Edge', 'Shortcuts']
author: 喵小六

featuredImage: "https://media.hexsix.me/s/igeuaw"
resizeImages: true
---

最近换 Edge 用用看，理由很简单，想要尽快加入 new bing。（chatGPT 作为生产力工具真的很香，希望 bing 能够尽快过渡到付费方案。）

不过一开始使用，问题就来了，Edge 自定义了很多快捷键而且这些快捷键在设置里并不能配置，本文将通过修改注册表的手段禁用部分快捷键。

<!--more-->

# ConfigureKeyboardShortcuts

> 本文翻译自 [Microsoft文档](https://learn.microsoft.com/en-us/deployedge/edge-learnmore-configurable-edge-commands#configurable-commands)

> Edge 版本 101 及以上

首先我们找到 [可配置的快捷键列表](https://learn.microsoft.com/en-us/deployedge/edge-learnmore-configurable-edge-commands#configurable-commands)

然后打开注册表编辑器，先打开 `HKEY_CURRENT_USER`，如果要所有用户生效，请打开 `HKEY_LOCAL_MACHINE`

然后依次打开 `SOFTWARE`，`Policies`，`Microsoft`，`Edge`，（如果没有 `Edge`，新建一个 `项`，重命名为 `Edge`）

在打开的 `Edge` 中，新建字符串值，看到类型为 `REG_SZ` 就行，重命名这一行为 `ConfigureKeyboardShortcuts`，然后双击 `ConfigureKeyboardShortcuts` 可以打开一个编辑窗口，数值名称为 `ConfigureKeyboardShortcuts`，数值数据为空。

在数值数据中填入

```
{"disabled": ["new_tab", "fullscreen"]}
```

就可以禁用 `new_tab` (`Ctrl + T`) 和 `fullscreen` (`F11`)，其他请参阅 [可配置的快捷键列表](https://learn.microsoft.com/en-us/deployedge/edge-learnmore-configurable-edge-commands#configurable-commands)

```conf
SOFTWARE\Policies\Microsoft\Edge\ConfigureKeyboardShortcuts = {
  "disabled": [
    "new_tab",
    "fullscreen"
  ]
}
```

Compact example value:

```conf
SOFTWARE\Policies\Microsoft\Edge\ConfigureKeyboardShortcuts = {"disabled": ["new_tab", "fullscreen"]}
```

> 顺带一提，禁用 `Alt + Tab` 在选项卡之间切换在 `Windows 设置 > 系统 > 多任务处理` 中。
