---
title:      ffmpeg 提取视频文件中的多轨音频
date:       2022-04-30T13:58:38+08:00
author:     喵小六
categories: ['Study']
tags:       ['CS', 'ffmpeg']
---

老说我剪的视频的音乐声音太大、人声太小了，反正就是多轨音频调音量呗

用的剪辑软件不支持多轨，但是可以先导入视频再导入音轨，那就先用 ffmpeg 把音轨分离出来

<!--more-->

先看看视频的音轨信息

```bash
ffmpeg -i filename.mp4
```

```output
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '2022-04-30 11-47-06.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 512
    compatible_brands: isomiso2avc1mp41
    encoder         : Lavf59.16.100
  Duration: 00:01:10.18, start: 0.000000, bitrate: 1421 kb/s
  Stream #0:0[0x1](und): Video: h264 (Main) (avc1 / 0x31637661), yuv420p(tv, bt709, progressive), 1920x1080 [SAR 1:1 DAR 16:9], 1086 kb/s, 60 fps, 60 tbr, 15360 tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 320 kb/s (default)
    Metadata:
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 320 kb/s
    Metadata:
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]
```

根据显示的音轨信息写出分离音轨的脚本

```sh
filename=$1
ffmpeg -i "$filename" -map 0:1 -b:a 320k -f mp3 "${filename%%.*}.1.mp3"
ffmpeg -i "$filename" -map 0:2 -b:a 320k -f mp3 "${filename%%.*}.2.mp3"
```

然后执行就好了

```bash
sh script.sh filename.mp4
```
