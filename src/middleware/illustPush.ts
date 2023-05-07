import { Middleware, Element } from "koishi";
import { RPixiv } from "runtu-pixiv-sdk";
import { requestBuffers } from "../components";

export const illustsPush: (
  type: string,
  r: RPixiv
) => Promise<string | Element> = async (type, rPixiv) => {
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

    let info: string | Element
    try {
        const response = await requestFn.call(rPixiv, "")
        if (response.illusts.length !== 0) {
            info = await requestBuffers(response.illusts, rPixiv)
        } else {
            info = "网络出现错误，请联系管理员"
        }
    } catch (err) {
        console.error(err)
        info = "出现未知错误，请联系管理员"
    }
    return info
};
