import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { pixelUrlsFormat } from './pixel'
import { h } from "koishi";
import { logger } from '../logger'
import { PixelLevel } from '../type'


export const requestBuffers = (resp: WebPixivType["illusts"], r: RPixiv, pixel: PixelLevel = PixelLevel.MEDIUM) => {
  const promise = [];
  const urls = pixelUrlsFormat(resp);
  urls.forEach((item, index) => {
    
    promise.push(r.getPixivStream(item[pixel], "arraybuffer").catch(err => {
      logger.error(err);
      logger.error(`网络问题，请求图片${resp[index].title}失败`);
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
