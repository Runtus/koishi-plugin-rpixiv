import { Context, Schema } from 'koishi'
import { RPixiv } from 'runtu-pixiv-sdk'
import { rPixivIllustsSearch, illustsPush } from './middleware/index'


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
    host: string,
    port: number
  }
}

export const Config: Schema<Config> = Schema.object({
  refresh: Schema.string().required().default("").description("Pixiv的RefreshToken"),
  keywords: Schema.object({
    start: Schema.string().default("rpixiv酱").description("机器人的触发词。"),
    day: Schema.string().default("查询每日推荐榜").description("每日推荐榜的触发语，紧跟着start字段触发词"),
    week: Schema.string().default("查询每周推荐榜").description("每周推荐榜的触发语，紧跟着start字段触发词"),
    month: Schema.string().default("查询每月推荐榜").description("每周推荐榜的触发语，紧跟着start字段触发词"),
    searchIllusts: Schema.string().default("查询作品").description("每周推荐榜的触发语，紧跟着start字段触发词"),
    searchAuthor:  Schema.string().default("查询作者").description("每周推荐榜的触发语，紧跟着start字段触发词"),
  }),
  proxy: Schema.object({
    host: Schema.string().default("").description("代理的host"),
    port: Schema.number().default(0).description("代理端口")
  })
})




export function apply(ctx: Context, config: Config) {

  const keywords = {
    ...config.keywords
  }
  
  for (const [key, word] of Object.entries(config.keywords)) {
    if (key !== config.keywords.start) {
      keywords[key] = config.keywords.start + word
    }
  }

  const rPixiv = new RPixiv({
    host: "127.0.0.1",
    port: 7890
  })

  // 环境变量设置
  process.env.REFEESH_TOKEN = config.refresh
  // token初始化
  rPixiv.token()

  // 触发
  console.log(keywords)
  ctx.middleware(illustsPush(keywords.day, 'day', rPixiv))
  ctx.middleware(illustsPush(keywords.week, 'week', rPixiv))
  ctx.middleware(illustsPush(keywords.month, 'month', rPixiv))
  ctx.middleware(rPixivIllustsSearch(keywords.searchIllusts, rPixiv))



}


