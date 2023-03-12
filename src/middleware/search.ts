import { Middleware } from 'koishi'
import { RPixiv, WebPixivType } from 'runtu-pixiv-sdk'
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

export const rPixivAuthorSearch: (trigger: string, r: RPixiv) => Middleware = (trigger, rpixiv) => {
    return (session, next) => {
        if (session.content.startsWith(trigger)) {
            const words = session.content.slice(trigger.length)
            if (isNaN(Number(words))) {
                session.send("作者的pid应该只包含数字")
            } else {
                Promise.all(
                    [
                        rpixiv.getAuthorInfo(words),
                        rpixiv.getAuthorIllusts(words, "illust")
                    ]
                ).then(async (res) => {
                    const { user } = res[0].data
                    const { illusts } = res[1].data
                    session.send(
                        `<>
                        <p> 画师名称: ${user.name} </p>
                        <p> 画师介绍: ${user.comment}  </p>
                        <p> 画师主页: https://www.pixiv.net/users/${user.id} </p>
                        <div style="width='200px'"> 画师部分作品: ${await requestBuffers((illusts as WebPixivType["illusts"]).slice(0,5), rpixiv)} </div>
                    </>
                    `
                    )
                }).catch(err => {
                    console.log(err)
                    session.send("请求画师信息出现错误，请联系管理员")
                })
            }
        } else {
            next()
        }
    }
}