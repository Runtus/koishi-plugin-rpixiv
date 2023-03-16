import { Context, Schema } from 'koishi'
import { RPixiv } from 'runtu-pixiv-sdk'
import { rPixivIllustsSearch, illustsPush, rPixivAuthorSearch } from './middleware/index'


export const name = 'rpixiv'


export interface Config {
  token: string,
    start: string,
    day: string,
    week: string,
    month: string,
    searchIllusts: string,
    searchAuthor: string,
    isOpen: boolean,
    host: string,
    port: number
}

export const Config = Schema.intersect([
  Schema.object({
    token: Schema.string().description("pixiv令牌").role("secret").required()
  }),

  Schema.object({}).description("机器人触发语设置"),

  Schema.object({
    start: Schema.string().description("机器人启示触发语").required().default("rPixiv酱"),
    day: Schema.string().description("每日推荐榜的触发语，紧跟着start字段触发词").required().default("查询每日排行榜"),
    week: Schema.string().description("每周推荐榜的触发语，紧跟着start字段触发词").required().default("查询每周排行榜"),
    month: Schema.string().description("每月推荐榜的触发语，紧跟着start字段触发词").required().default("查询每月排行榜"),
    searchIllusts: Schema.string().description("输入关键字，获取关键字相关插画").required().default("搜索插画"),
    searchAuthor: Schema.string().description("输入作者pid号，获取作者相关信息").required().default("搜索作者"),
  }),

  Schema.object({}).description("代理设置"),

  Schema.object({
    isOpen: Schema.boolean().default(false).description("是否开启代理"),
    host: Schema.string().default("").description("代理的host"),
    port: Schema.number().default(0).description("代理端口")
  })
])




export function apply(ctx: Context, config: Config) {

  // trigger keywords设置
  const keywords = {
    ...{
      start: config.start,
      day: config.day,
      week: config.week,
      month: config.month,
      searchIllusts: config.searchIllusts,
      searchAuthor: config.searchAuthor
    }
  }

 
  
  for (const [key, value] of Object.entries(keywords)) {
    if (value !== keywords.start) {
      keywords[key] = keywords.start + value
    }
  }

  const rPixiv = new RPixiv(config.isOpen ? {host: config.host, port: config.port} : undefined)

  // 环境变量设置
  process.env.REFEESH_TOKEN = config.token
  // token初始化
  rPixiv.token()

  ctx.middleware(illustsPush(keywords.day, 'day', rPixiv))
  ctx.middleware(illustsPush(keywords.week, 'week', rPixiv))
  ctx.middleware(illustsPush(keywords.month, 'month', rPixiv))
  ctx.middleware(rPixivIllustsSearch(keywords.searchIllusts, rPixiv))
  ctx.middleware(rPixivAuthorSearch(keywords.searchAuthor, rPixiv))
}


