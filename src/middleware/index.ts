import { illustsPush } from './illustPush'
import { RPixiv } from 'runtu-pixiv-sdk'

// params: 指令参数

const pushGenearte = (type: string) => (params: string, r: RPixiv) => illustsPush(type, r)

export const datePush = pushGenearte('day')
export const weekPush = pushGenearte('week')
export const monthPush = pushGenearte('month')



export * from './illustPush'
export * from './search'


