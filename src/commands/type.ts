import { Config } from '..'
import { RPixivReturnFc } from '../type'

// SubCommands.ts
export type SubCommandKeys = keyof Config['subcommand'];

// 为command设置对应的描述，用法以及实例
export type SubCommandsConfig = { [key in SubCommandKeys]: {
    desc: string,
    usage: string,
    example: string,
    func: RPixivReturnFc,
    subcmd: string
}}
