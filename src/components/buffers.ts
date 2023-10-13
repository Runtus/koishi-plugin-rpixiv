import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { h } from "koishi";
import { logger } from '../logger'
import { PixelLevel } from '../type'


export const requestBuffers = (resp: WebPixivType["illusts"], r: RPixiv, pixel: PixelLevel = PixelLevel.MEDIUM) => {
  const promise = [];
  const urls = resp.map((item) => {
    if (pixel === PixelLevel.LARGE) {
      return {
        url: item.image_urls.large,
        title: item.title
      }
    } else if (pixel === PixelLevel.MEDIUM) {
      return {
        url: item.image_urls.medium,
        title: item.title
      }
    } else {
      return {
        url: item.image_urls.square_medium,
        title: item.title
      }
    }
  })

  urls.forEach((item) => {
    promise.push(r.getPixivStream(item.url, "arraybuffer").catch(err => {
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
