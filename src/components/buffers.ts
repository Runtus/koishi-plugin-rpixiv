import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { h } from "koishi";

export const requestBuffers = (urls: WebPixivType["illusts"], r: RPixiv) => {
  const promise = [];
  urls.slice(0, 10).forEach((item) => {
    promise.push(r.getPixivStream(item.image_urls.medium, "arraybuffer"));
  });
  return Promise.all(promise).then((res) => {
    return h(
      "p",
      {},
      res.map((item) => h.image(item, "image/png"))
    );
  });
};
