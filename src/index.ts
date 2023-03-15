import { Context, Schema } from 'koishi'
import { RPixiv } from 'runtu-pixiv-sdk'
import { rPixivIllustsSearch, illustsPush, rPixivAuthorSearch } from './middleware/index'


export const name = 'rpixiv'


export interface Config {
  refresh: string,
  keywords: {
    start: string,
    day: string,
    week: string,
    month: string,
    searchIllusts: string,
    searchAuthor: string,
  },
  proxy: {
    isOpen: boolean,
    host: string,
    port: number
  }
}

export const Config: Schema<Config> = Schema.object({
  refresh: Schema.string().required().default("").description("Pixiv的RefreshToken"),
  keywords: Schema.object({
    start: Schema.string().default("").description("机器人的触发词。"),
    day: Schema.string().default("").description("每日推荐榜的触发语，紧跟着start字段触发词"),
    week: Schema.string().default("").description("每周推荐榜的触发语，紧跟着start字段触发词"),
    month: Schema.string().default("").description("每月推荐榜的触发语，紧跟着start字段触发词"),
    searchIllusts: Schema.string().default("").description("输入关键字，获取关键字相关插画"),
    searchAuthor:  Schema.string().default("").description("输入作者pid号，获取作者相关信息"),
  }),
  proxy: Schema.object({
    isOpen: Schema.boolean().default(false).description("是否开启代理"),
    host: Schema.string().default("").description("代理的host"),
    port: Schema.number().default(0).description("代理端口")
  })
})




export function apply(ctx: Context, config: Config) {

  // trigger keywords设置
  const keywords = {
    ...config.keywords
  }
  
  for (const [key, word] of Object.entries(config.keywords)) {
    if (key !== config.keywords.start) {
      keywords[key] = config.keywords.start + word
    }
  }

  const rPixiv = new RPixiv(config.proxy.isOpen ? {...config.proxy} : undefined)

  // 环境变量设置
  process.env.REFEESH_TOKEN = config.refresh
  // token初始化
  rPixiv.token()

  ctx.middleware(illustsPush(keywords.day, 'day', rPixiv))
  ctx.middleware(illustsPush(keywords.week, 'week', rPixiv))
  ctx.middleware(illustsPush(keywords.month, 'month', rPixiv))
  ctx.middleware(rPixivIllustsSearch(keywords.searchIllusts, rPixiv))
  ctx.middleware(rPixivAuthorSearch(keywords.searchAuthor, rPixiv))



}


