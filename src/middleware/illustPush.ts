import { Middleware } from 'koishi'
import { RPixiv } from 'runtu-pixiv-sdk'
import { requestBuffers } from '../components'


export const illustsPush: (trigger: string, type: string, r: RPixiv) => Middleware = (trigger, type, rPixiv) => {
    const triggerC = trigger
    let requestFn: RPixiv['getMonthRanks'] | RPixiv['getDayRanks'] | RPixiv['getWeekRanks'] = undefined
    if (type === 'day') {
        requestFn = rPixiv.getDayRanks
    } else if (type === 'week') {
        requestFn = rPixiv.getWeekRanks
    } else if (type === 'month') {
        requestFn = rPixiv.getMonthRanks
    } else {
        requestFn = null
    }
    return (session, next) => {
        if (session.content.startsWith(triggerC)) {
            requestFn.call(rPixiv, "").then(res => {
                console.log(res.illusts.length)
                if (res.illusts.length !== 0) {
                    return requestBuffers(res.illusts, rPixiv)
                } else {
                    session.send("网络出现错误，请联系管理员")
                }
            }).then(info => { 
                session.send(info)
            }).catch((err) => {
                session.send("出现了渣不多得勒的错误")
            })
        } else {
            next()
        }
    }
}
