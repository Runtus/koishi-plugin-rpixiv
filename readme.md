# koishi-plugin-rpixiv

[![npm](https://img.shields.io/npm/v/koishi-plugin-rpixiv?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-rpixiv)

* 能够获取pixiv图片的插件。


## 机器人配置的一些说明
1. `refresh`配置指的是pixiv的refreshtoken的获取，该token的获取请参考程序[pixiv-refreshtoken获取](https://github.com/Runtus/pixiv_refresh_token)
2. keywores.start是一切关键字触发的开头字段，例如
    * start为"**rpixiv酱**"每日推荐榜的触发语为"**查询每日推荐榜**"，则获取pixiv每日排行榜插画的触发语为**rpixiv酱查询每日推荐榜**
3. proxy.isOpen设置为true时，下方的代理配置才会生效，否则会默认为undefined

> 该机器人的pixiv爬取程序基于[runtus-pixiv-sdk](https://github.com/Runtus/runtu-pixiv-sdk)
