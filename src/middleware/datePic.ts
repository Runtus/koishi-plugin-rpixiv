// 每日推送
import { Context, Element } from "koishi";
import moment from "moment";
import { datePush } from "./index";
import { logger } from "../logger";
import { RPixiv } from "runtu-pixiv-sdk";

const ONE_DAY_GAP = 1000 * 60 * 60 * 24;

// getPicFuncs -> 日常推送的图片来源可能不一样，做一个适配的接口，这一层只做发消息的工作
export const datePicSubscr =
  (ctx: Context, channels: Array<string>) => async (h: Element | string) => {
    await ctx.broadcast([...channels], h);
  };

export const picPushExec =
  (
    timer: string,
    r: RPixiv,
    boardcastFn: (h: string | Element) => Promise<void>,
    getContentFn: (...params) => Promise<Element | string>
  ) =>
  async (...params) => {
    const triggerTimer =
        Number(moment(moment().format(`${moment().format("YYYY-MM-DD")} ${timer}`))
            .format("x"))
        + ONE_DAY_GAP;
    const now = Number(moment().format("x"));
    const gap = triggerTimer - now;

    if (isNaN(gap) || gap < 0) {
      logger.error("推送时间设置错误，请检查设置时间是否符合格式 HH:MM:SS");
      return;
    }

    const exec = async (gap: number) => {
      const h = await getContentFn(params);
      setTimeout(() => {
        // 推送执行
        boardcastFn(h);
        exec(ONE_DAY_GAP);
      }, gap);
    };
    // 执行pic推送
    exec(gap);
  };
