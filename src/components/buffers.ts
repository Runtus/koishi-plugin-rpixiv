import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { h } from "koishi";
import { logger } from '../logger'


export const requestBuffers = (resp: WebPixivType["illusts"], r: RPixiv) => {
  const promise = [];
  resp.slice(0, 10).forEach((item) => {
    promise.push(r.getPixivStream(item.image_urls.medium, "arraybuffer").catch(err => {
      logger.error(err);
      logger.error(`网络问题，请求图片${item.title}失败`);
      return null;
    }));
  });

  return Promise.all(promise).then((res) => res.map((item, index) =>
  {
    const image = !item ? "网络问题，图片下载失败" : h.image(item, "image/png");
    return h("div", {}, h("p", {}, `Seq: ${index + 1}, Title: ${resp[index].title}, Pid: ${resp[index].id}`), image)
  }
  ))
};
