import { Context } from 'koishi';
import { Config } from '..'
import { RPixiv } from "runtu-pixiv-sdk";
import { RPixivReturnFc, SubCommandKeys, SubCommandsConfig } from '../type'
import {
    rPixivIllustsSearch,
    rPixivAuthorSearch,
    datePush,
    weekPush,
    monthPush,
} from "../middleware/index";

// 每个指令对应的执行函数
const CommandsFuncMapping: { [key in SubCommandKeys]: RPixivReturnFc } = {
    day: datePush,
    week: weekPush,
    month: monthPush,
    searchIllusts: rPixivIllustsSearch,
    searchAuthor: rPixivAuthorSearch
}

// // 现在需求是 => 有不同的command需要进行注册
// export const commandsInit: (ctx: Context, commands: Config, rpixiv: RPixiv, fc: CommandsGenerateFC) => void =
//     (ctx, commands, rpixiv, fc) => fc(ctx, commands, rpixiv);


export const SubCommandsInit = (ctx: Context, commands: Config, rpixiv: RPixiv) => {
    const { subcommand, pixel } = commands;
    // commands配置
    const commandsSettings: SubCommandsConfig = {
        day: {
            desc: "获取pixiv每日排行榜作品",
            usage: `${subcommand.day} <pic_quality> <pic_num>, 输入命令 pixel 查询画质参数(pic_quality)设置`,
            example: `${subcommand.day} ${pixel.origin} 10   将获得10张原画质的pixiv图片推送`,
            func: CommandsFuncMapping['day'],
            subcmd: subcommand.day
        },
        week: {
            desc: "获取pixiv每周排行榜作品",
            usage: `${subcommand.week} <pic_quality> <pic_num>, 输入命令 pixel 查询画质参数(pic_quality)设置`,
            example: `${subcommand.week} ${pixel.origin} 10  将获得10张原画质的pixiv图片推送`,
            func: CommandsFuncMapping['week'],
            subcmd: subcommand.week
        },
        month: {
            desc: "获取pixiv每月排行榜作品",
            usage: `${subcommand.month} <pic_quality> <pic_num>, 输入命令 pixel 查询画质参数(pic_quality)设置`,
            example: `${subcommand.month} ${pixel.origin} 10   将获得10张原画质的pixiv图片推送`,
            func: CommandsFuncMapping['month'],
            subcmd: subcommand.month
        },
        searchIllusts: {
            desc: "根据关键字查询作品",
            usage: `${subcommand.searchIllusts} <keyword> <pic_quality> <pic_num>, 输入命令 pixel 查询画质参数(pic_quality)设置`,
            example: `${subcommand.searchIllusts} 原神 ${pixel.origin} 10  将获得10张原画质的原神主题相关pixiv图片推送`,
            func: CommandsFuncMapping['searchIllusts'],
            subcmd: subcommand.searchIllusts
        },
        searchAuthor: {
            desc: "根据作者id查询作者信息（包括介绍和相关作品）",
            usage: `${subcommand.searchAuthor} <author_id> <pic_quality> <pic_num>, 输入命令 pixel 查询画质参数(pic_quality)设置`,
            example: `${subcommand.searchAuthor} 114514 ${pixel.origin} 10  将获得pixiv作者id为114514的作者相关信息，并附带它的10张相关原画质pixiv作品`,
            func: CommandsFuncMapping['searchAuthor'],
            subcmd: subcommand.searchAuthor
        }
    };

    // 注册commands
    for (const [_, configs] of Object.entries(commandsSettings)) {
        ctx.
            // 触发命令
            command(commands.command, configs.desc, { authority: 1 }).
            subcommand(configs.subcmd, { authority: 1 }).
            usage(configs.usage).
            example(configs.example).
            action((_, ...params) => configs.func(params, rpixiv))
    }
}


