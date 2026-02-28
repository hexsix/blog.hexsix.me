---
title: "在aarch64机子上编译rocketmq-client-cpp"
pubDatetime: 2022-11-16T17:15:00+08:00
author: "喵小六"
type: "code"
tags: ["CS", "arm", "rocketmq", "rocketmq-client-cpp", "openeuler", "Study"]
description: "这段时间一直在折腾 arm 机子的编译，很痛苦，非常痛苦，用了华为云之后就更加痛苦了。"
---

这段时间一直在折腾 arm 机子的编译，很痛苦，非常痛苦，用了华为云之后就更加痛苦了。

我开通了一个按需付费的华为云 arm 机子，开通过程也没有要求付费，然后我就直接登录开始用了，使用过程也没有提醒我要交钱，然后一个小时后，我正在编译呢，啪！给我关机了，很快啊。我正纳闷怎么终端没反应了，滴滴两个短信来了，说您已欠费。（血压UP.jpg）

大概华为他妈在 ICU 急救的时候，推进去急诊了，然后抢救了一半，医生突然出门说刚把他妈管子拔了，请你先去前台交个钱起。



> 📌 commit: `de41701d7e9a6a78bbe4d34578e444e27a499394`

> > 🛠 编译环境
> > - arch: `aarch64`
> > - OS: `OpenEuler 20.03 SP3`
> > - gcc: `8.5.0`


## Prepare

根据文档安装依赖（[https://github.com/apache/rocketmq-client-cpp#linux-and-mac-os](https://github.com/apache/rocketmq-client-cpp#linux-and-mac-os)）

```bash
$ sudo dnf -y install gcc-c++ cmake automake autoconf libtool bzip2-devel zlib-devel
......
Upgraded:
  cpp-8.5.0-4.el8_5.aarch64        gcc-8.5.0-4.el8_5.aarch64        libgcc-8.5.0-4.el8_5.aarch64        libgomp-8.5.0-4.el8_5.aarch64        libstdc++-8.5.0-4.el8_5.aarch64
Installed:
  autoconf-2.69-29.el8.noarch            automake-1.16.1-7.el8.noarch          bzip2-devel-1.0.6-26.el8.aarch64  cmake-3.20.2-4.el8.aarch64             cmake-data-3.20.2-4.el8.noarch
  cmake-filesystem-3.20.2-4.el8.aarch64  cmake-rpm-macros-3.20.2-4.el8.noarch  gcc-c++-8.5.0-4.el8_5.aarch64     libstdc++-devel-8.5.0-4.el8_5.aarch64  libtool-2.4.6-25.el8.aarch64
  libuv-1:1.41.1-1.el8_4.aarch64         perl-Thread-Queue-3.13-1.el8.noarch   zlib-devel-1.2.11-17.el8.aarch64
```

> ⚠️ 如果你的网络不通，还需要准备如下包放到项目根目录
> 
> - openssl-1.1.1d.tar.gz
> - libevent-release-2.1.11-stable.zip
> - jsoncpp-0.10.7.zip
> - boost_1_58_0.tar.gz

## Build

修改 `build.sh` 给 boost 编译指定 arm 相关的选项 `-architecture=arm` 和 `address-model=64` 

```bash
BuildBoost() {
  ......
  if [ $verbose -eq 0 ]; then
    echo "build boost without detail log."
    ./b2 architecture=arm address-model=64 -j$cpu_num cflags=-fPIC cxxflags=-fPIC --with-atomic --with-thread --with-system --with-chrono --with-date_time --with-log --with-regex --with-serialization --with-filesystem --with-locale --with-iostreams threading=multi link=static release install --prefix=${install_lib_dir} &> boostbuild.txt
  else
    ./b2 architecture=arm address-model=64 -j$cpu_num cflags=-fPIC cxxflags=-fPIC --with-atomic --with-thread --with-system --with-chrono --with-date_time --with-log --with-regex --with-serialization --with-filesystem --with-locale --with-iostreams threading=multi link=static release install --prefix=${install_lib_dir}
  fi
  ......
}
```

修改 `CMakeList.txt` 删除 x86_64 的相关编译选项 `-m64`和 `-m32`

```bash
        #    if (CMAKE_BUILD_BITS EQUAL 32)
        #        list(APPEND CXX_FLAGS "-m32")
        #    else () #not-condition
        #        list(APPEND CXX_FLAGS "-m64")
        #    endif ()
```

最后执行

```bash
$ sh ./build.sh
```

## Troubleshooting

### g++: error: unrecognized command line option ‘-m64’

openssl 和 libevent 和 jsoncpp 的编译过程都很顺利，但是 boost-1.58.0 的编译时有如下错误

```bash
g++: error: unrecognized command line option ‘-m64’
```

`-m64` 是 x86_64 机器的编译选项，很显然它没有识别到这是台 arm 机子，观察日志也证实了这个猜想

```bash
Performing configuration checks

    - 32-bit                   : no
    - 64-bit                   : yes
    - arm                      : no
    - mips1                    : no
    - power                    : no
    - sparc                    : no
    - x86                      : no
    - combined                 : no
```

根据 [stackoverflow 相关问题](https://stackoverflow.com/questions/31508320/boost-1-58-0-build-with-ndk-build-for-arm64-v8a) 的回答，有两个解决办法，本文选择了后者，手动指定 arch 类型

rocketmq-client-cpp 编译的时候也报了相同的错误，解决办法是注释 `CMakeList.txt` 中相关的内容。（ref: [RocketMQ-cpp-client 在arm下的安装[blog.csdn.net]](https://blog.csdn.net/qq_34174198/article/details/120663608)）
