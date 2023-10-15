# koishi-plugin-rpixiv

[![npm](https://img.shields.io/npm/v/koishi-plugin-rpixiv?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-rpixiv)

* 能够获取pixiv图片的插件。


## 机器人配置的一些说明
1. `refresh`配置指的是pixiv的refreshtoken的获取，该token的获取请参考程序[pixiv-refreshtoken获取](https://github.com/Runtus/pixiv_refresh_token)
2. keywores.start**整个指令的父指令**，而其余触发语设置则是**子指令**，关于子指令的触发请参考koishi官方说明。
3. proxy.isOpen设置为true时，下方的代理配置才会生效，否则会默认为undefined

> 该机器人的pixiv爬取程序基于[runtus-pixiv-sdk](https://github.com/Runtus/runtu-pixiv-sdk)


### TODO List
- [x] 增加日常推送功能，给指定群聊或指定用户推送
- [ ] 增加随机图片功能
- [ ] 搜索图片命令增加图片展示区间和上限功能（搜索的图片有很多，可以指定其中的第n张到m张展示） 


### Verion: v0.1.5 -> v0.2.0
1. feat: 增设了图片清晰度参数，可以根据需求来选择获取四种不同清晰度的pixiv作品。
2. feat: 为搜索的图片增加了随机的选项，获得的图片每次不一样。
3. feat: 增设了图片数量参数，每次获取图片可设置图片数量参数来获取对应数量的作品。
4. feat: 增加了`pixel`命令，可查看当前设置的各个图片清晰度级别的参数。