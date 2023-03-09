import { Middleware, h } from 'koishi'
import { RPixiv } from 'runtu-pixiv-sdk'
import { requestBuffers } from '../components'


export const rPixivIllustsSearch: (trigger: string, r: RPixiv) => Middleware = (trigger, rpixiv) => {
    return  (session, next) => {
        // 指定前缀
        if (session.content.startsWith(trigger)) {
            const words = session.content.slice(trigger.length)
            rpixiv.searchIllusts(words)
                .then((res) => {
                    if (res.code === 400) {
                        session.send("网络出现问题，请联系管理员")
                    } else {
                        return requestBuffers(res.data.illusts, rpixiv)
                    }
                })
                .then(info => {
                    session.send(info)
                })
                .catch((err) => {
                    console.log(err)
                    session.send("出现了渣不多得勒的错误，请联系管理员")
                })
            
        } else {
            next()
        }
    }
}

