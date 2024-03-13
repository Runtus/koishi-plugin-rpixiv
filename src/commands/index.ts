import { Context } from 'koishi';
import { Config } from '..'
import { RPixiv } from "runtu-pixiv-sdk";
import { PixelComandsInit } from './pixel'
import { SubCommandsInit } from './subcommands'

export const CommandsInit = (ctx: Context, commands: Config, rpixiv: RPixiv) => {
    PixelComandsInit(ctx, commands, rpixiv);
    SubCommandsInit(ctx, commands, rpixiv);
}

export * from './type'