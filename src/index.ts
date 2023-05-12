import { Context, Schema, Logger } from "koishi";
import { RPixiv } from "runtu-pixiv-sdk";
import { logger } from './logger'
import {
  rPixivIllustsSearch,
  rPixivAuthorSearch,
  datePush,
  weekPush,
  monthPush,
} from "./middleware/index";

export const name = "rpixiv";

export interface Config {
  token: string;
  start: string;
  instr: {
    day: string;
    week: string;
    month: string;
    searchIllusts: string;
    searchAuthor: string;
  },
  proxy: {
    isOpen: boolean;
    host: string;
    port: number;
  }
}

export const Config = Schema.intersect([
  Schema.object({
    token: Schema.string().description("pixiv令牌").role("secret").required(),
  }),

  Schema.object({}).description("机器人触发语设置"),
  
  Schema.object({
    start: Schema.string().description("机器人启示触发语").default("rPixiv酱"),
  }),

  Schema.object({
    instr: Schema.object({
      
      day: Schema.string()
        .description("每日推荐榜的触发语，紧跟着start字段触发词")
        .default("查询每日排行榜"),
      week: Schema.string()
        .description("每周推荐榜的触发语，紧跟着start字段触发词")
        .default("查询每周排行榜"),
      month: Schema.string()
        .description("每月推荐榜的触发语，紧跟着start字段触发词")
        .default("查询每月排行榜"),
      searchIllusts: Schema.string()
        .description("输入关键字，获取关键字相关插画")
        .default("搜索插画"),
      searchAuthor: Schema.string()
        .description("输入作者pid号，获取作者相关信息")
        .default("搜索作者"),
      }),
  }),
  Schema.object({}).description("代理设置"),

  Schema.object({
    proxy: Schema.object({
      isOpen: Schema.boolean().default(false).description("是否开启代理"),
      host: Schema.string().default("").description("代理的host"),
      port: Schema.number().default(0).description("代理端口"),
    })
  }),


]);

const commandFuncGenerate = (
  keywords: Array<{ keyword: string; usage: string; example: string }>,
  funcs: Array<(params: string, r: RPixiv) => any>
) => {
  const funcs_keywords: Array<{
    kInfo: { keyword: string; usage: string; example: string };
    func: (params: string, r: RPixiv) => any;
  }> = [];
  if (keywords.length !== funcs.length) {
    logger.debug("检查指令数和指令功能函数是否一致");
    return funcs_keywords;
  }


  keywords.forEach((item, index) => {
    funcs_keywords.push({
      kInfo: item,
      func: funcs[index],
    });
  });

  return funcs_keywords;
};
   
// TODO 根据Schema进行优化，优化为插件的形式
export function apply(ctx: Context, config: Config) {
  const start = config.start;
  const keywords: Array<{
    keyword: string,
    usage: string,
    example: string
  }> = [];
  for(const [key, value] of Object.entries(config.instr)){
    keywords.push({
      keyword: `${start}/${value}`,
      usage: `${value}`,
      example: `${value}`
    })
  }
 

  logger.info("bot启动中.....");

  const funcs = [
    datePush,
    weekPush,
    monthPush,
    rPixivIllustsSearch,
    rPixivAuthorSearch,
  ];

  const commands = commandFuncGenerate(keywords, funcs);

  const rPixiv = new RPixiv(
    config.proxy.isOpen ? { ...config.proxy } : undefined
  );

  // 环境变量设置
  process.env.REFRESH_TOKEN = config.token;
  // token初始化
  rPixiv.token().then(() => {
    logger.success("已启动")
  });


  

  // 指令设置
  commands.forEach((item) => {
    ctx
      .command(item.kInfo.keyword)
      .usage(item.kInfo.usage)
      .example(item.kInfo.example)
      .action((_, params) => item.func(params, rPixiv));
  });
}
