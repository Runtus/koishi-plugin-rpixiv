import { Middleware } from 'koishi'
import { RPixiv } from 'runtu-pixiv-sdk'
import { requestBuffers } from '../components'


export const illustsPush: (trigger: string, type: string, r: RPixiv) => Middleware = (trigger, type, rPixiv) => {
    const triggerC = trigger
    console.log("sdsdsds",trigger)
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
            console.log('触发了')
            requestFn.call(rPixiv, "").then(res => {
                if (res.code === 200) {
                    return requestBuffers(res.data.illusts, rPixiv)
                } else {
                    session.send("网络出现错误，请联系管理员")
                }
            }).then(info => { 
                session.send(info)
            }).catch(() => {
                session.send("出现了渣不多得勒的错误")
            })
        } else {
            next()
        }
    }
}