import { Context, h } from 'koishi';
import { Config } from '..'
import { RPixiv } from "runtu-pixiv-sdk";


export const PixelComandsInit = (ctx: Context, commands: Config, rpixiv: RPixiv) => {
    const { pixel } = commands
    // 画质查询指令
    ctx.command("pixel", "画质参数指令", { authority: 1 })
        .action(() => h('p', `当前画质参数设置: \n低画质: ${pixel.low} \n中等画质: ${pixel.medium} \n高画质: ${pixel.large} \n原画质: ${pixel.origin}`))
}