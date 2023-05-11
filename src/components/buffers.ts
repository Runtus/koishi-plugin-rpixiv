import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { h } from "koishi";


export const requestBuffers = (resp: WebPixivType["illusts"], r: RPixiv) => {
  const promise = [];
  resp.slice(0, 10).forEach((item) => {
    promise.push(r.getPixivStream(item.image_urls.medium, "arraybuffer"));
  });

  return Promise.all(promise).then((res) => res.map((item, index) =>
    h("div", {}, h("p", {}, `Seq: ${index + 1}, Title: ${resp[index].title}, Pid: ${resp[index].id}`), h.image(item, "image/png"))))
};
