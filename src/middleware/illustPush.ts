import { Element, h } from "koishi";
import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { requestBuffers } from "../components";
import { logger } from "../logger";
import { PixelLevel } from "../type";

enum TypesToChinese {
  "day" = "每日",
  "week" = "每周",
  "month" = "每月",
}

const DEFAULT_NUM = 10;

export const illustsPush: (
  type: string,
  r: RPixiv,
  p?: PixelLevel,
  l?: number
) => Promise<string | Element> = async (type, rPixiv, pixel, num = DEFAULT_NUM) => {
  let requestFn:
    | RPixiv["getMonthRanks"]
    | RPixiv["getDayRanks"]
    | RPixiv["getWeekRanks"] = undefined;
  if (type === "day") {
    requestFn = rPixiv.getDayRanks;
  } else if (type === "week") {
    requestFn = rPixiv.getWeekRanks;
  } else if (type === "month") {
    requestFn = rPixiv.getMonthRanks;
  } else {
    requestFn = null;
  }

  let info: string | Element;
  try {
    const response = (await requestFn.call(rPixiv, "")).data as WebPixivType;
    if (response.illusts) {
      const date = response.next_url.split("&")[2].split("=")[1];
      const illusts = response.illusts.slice(0, num);
      info = h(
        "div",
        {},
        h("h3", {}, `🌟Pixiv${TypesToChinese[type]}排行榜🌟  📅${date}`),
        await requestBuffers(illusts, rPixiv, pixel)
      );
    } else {
      info = "请求的插画数为0";
    }
  } catch (err) {
    logger.error(err);
    info =
      "出现未知错误，可能是token失效或网络问题导致图片请求失败，请联系管理员";
  }
  return info;
};
