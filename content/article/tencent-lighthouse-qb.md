---
title: "74元毛的腾讯云轻量服务器做BT下载然后自动上传到阿里云盘"
date: 2021-12-22T15:53:00+08:00
author: 喵小六

categories: ['Other']
tags: ['腾讯云', 'Onedrive', '阿里云盘', 'qBittorrent']
---

> 9 月底 74 块毛的一个腾讯云轻量服务器，CPU 2核，内存 4GB，80GB SSD云硬盘，1TB 流量，到这里都挺好的，关键是上行只有 8Mbps 的带宽，能干个鸡毛。
>
> 也没想好干啥，考虑过整个 mastodon，但是身边的朋友也没玩这个的。
>
> 最后还是拿来挂 PT 的小种子，剩余的空间拿来 RSS 动漫。
>
> 不得不说 8Mbps 这个上行速度真蛋疼，拿回本地速度还不如临时下，所以又摸了个自动上传。
>
> 最初是上传到 Onedrive，不过 Onedrive 这个同步在国内是真的蛋疼，速度时好时烂，偶尔还有下完了，同步失败重新下载的情况。所以就决定是你了，阿里云盘。

## 安装 qBittorrent

```bash
$ sudo dnf install epel-release
$ sudo dnf install qbittorrent-nox
```

我们需要安装 qbittorrent-nox，而不是 qbittorrent，安装完成后启动 qbittorrent。

```bash
$ sudo systemctl enable qbittorrent-nox
$ sudo systemctl start qbittorrent-nox
```

检查是否启动

```bash
$ systemctl status qbittorrent-nox
```

然后到控制台里打开默认端口 8080，在浏览器中就可以访问 qbittorrent 的 web UI 了。默认用户名和密码是 `admin` 和 `adminadmin`。

## 更换 web UI

> 请完成阿里云盘上传脚本后再回来更换 web UI

装完 qbittorrent 的我这时候发现了一个严重的问题，找不到 RSS 界面。原因是默认的 web UI 没做。

随便搜到的一个：[https://github.com/CzBiX/qb-web](https://github.com/CzBiX/qb-web)

到 Release 界面下载下来解压上传到服务器上，我的建议是放在 `~/.config/qBittorrent/dist`，qBittorrent 的其他配置也都是放在这里的。

然后到 web UI 里将 “使用备用 Web UI” 的 “文件路径” 设置为这个目录（不包含 public 后缀）。

点一下保存就 OK 了。

## 阿里云盘上传脚本

[https://github.com/Hidove/aliyundrive-uploader.git](https://github.com/Hidove/aliyundrive-uploader.git)

首先 clone 这个脚本，腾讯云连 github 都连不上，真是喂了狗了。

```bash
# 为了加速用镜像地址
$ git clone https://github.com.cnpmjs.org/Hidove/aliyundrive-uploader.git
$ cd aliyundrive-uploader
# 创建虚拟环境
$ python3 -m venv venv
$ source venv/bin/activate
# 安装依赖（建议使用清华的姊妹站）
(venv) $ pip install -r requirements.txt -i https://mirrors.bfsu.edu.cn/pypi/web/simple
```

重命名 `example.config.json` 为 `config.json`

填写好 `config.json` 的内容：

```json
{
  "REFRESH_TOKEN": "refresh_token",
  "DRIVE_ID": "drive_id",
  "ROOT_PATH": "网盘目录",
  "FILE_PATH": "path/to/your/qbittorrent/downloads",
  "MULTITHREADING": false,
  "MAX_WORKERS": 5,
  "CHUNK_SIZE": 104857600,
  "RESUME": false,
  "OVERWRITE": false,
  "RETRY": 0,
  "RESIDENT": false,
  "ALLOW_REPEAT": true,
  "VERSIONS":"v2021.0919.2000"
}
```

![](https://camo.githubusercontent.com/3675afaef4b523356a136fd01c9b1e6b557b56c43a7d1a6d86fdf3ce31a26ef3/68747470733a2f2f7a332e617831782e636f6d2f323032312f30332f32372f367a42384a412e706e67)

控制台快速获取代码：

```javascript
var data = JSON.parse(localStorage.getItem('token'));
console.log(`refresh_token  =>  ${data.refresh_token}
default_drive_id  =>  ${data.default_drive_id}
`);
```

`config.json` 里各个字段什么意思自己去 github 上看就行了

github 里说的常驻运行对我们来说是没有用的，是作者写给宝塔面板的，咱们要用到的是 qBittorrent 自带的完成后脚本运行。

打开 web UI，在【下载】选项卡里有一个 Torrent 完成时运行外部程序（如果没有，切换到旧 UI），勾上并填入：

```
/home/lighthouse/aliyundrive-uploader/venv/bin/python /home/lighthouse/aliyundrive-uploader/main.py "%F"
```

这里尽量使用完整路径。

点一下保存，这样下载的种子就会自动上传到阿里云盘啦。

## Onedrive 上传脚本

这个我用着不太好用，就不赘述了

[https://github.com/MoeClub/OneList/tree/master/OneDriveUploader](https://github.com/MoeClub/OneList/tree/master/OneDriveUploader)

链接放着自取

```bash
upload.sh
---------------
#!/bin/sh

path_to_file=$1
work_dir=$HOME/OneDriveUploader
path_to_config="$work_dir/auth.json"
path_to_log="$work_dir/logs.log"
remote_dir="ServerUpload/"

while true
do

  echo "start to upload $path_to_file" >> $path_to_log

  $work_dir/OneDriveUploader -f -c $path_to_config -s "$path_to_file" -r $remote_dir -skip

  if [[ $? == '0' ]]; then
    echo "success to upload $path_to_file" >> $path_to_log
    rm -r "$path_to_file";
    break;
  fi

  echo "failed to upload $path_to_file" >> $path_to_log

done
```

因为网络的缘故，Onedrive 经常性上传失败，所以这个脚本会重复上传到天荒地老直到成功。

Torrent 完成时运行外部程序：

```
/path/to/upload.sh "%F"
```
