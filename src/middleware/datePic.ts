// 每日推送
import { Context, Element } from "koishi";
import moment from "moment";
import { logger } from "../logger";

const ONE_DAY_GAP = 1000 * 60 * 60 * 24;

// getPicFuncs -> 日常推送的图片来源可能不一样，做一个适配的接口，这一层只做发消息的工作
export const datePicSubscr =
  (ctx: Context, channels: Array<string>) => async (h: Element | string) => {
    await ctx.broadcast([...channels], h);
  };

export const picPushExec =
  (
    timer: string,
    boardcastFn: (h: string | Element) => Promise<void>,
    getContentFn: (...params) => Promise<Element | string>
  ) =>
  async (...params) => {
    const formatMoment = moment(
      moment().format("YYYY-MM-DD") + " " + timer
    ).valueOf();
    let triggerTimer = Number(formatMoment);
    const now = moment().valueOf();
    if (isNaN(triggerTimer)) {
      logger.error("推送时间设置错误，请检查设置时间是否符合格式 HH:MM:SS");
      return;
    }

    // 如果设置的时间今天已经过了，则设置在第二天
    if (now > triggerTimer) {
      triggerTimer = moment(triggerTimer).add(1, "day").valueOf();
    }

    console.log(moment(triggerTimer).format(), moment(now).format());
    const gap = triggerTimer - now;

    if (isNaN(gap) || gap < 0) {
      logger.error("推送时间设置错误，请检查设置时间是否符合格式 HH:MM:SS");
      return;
    }

    const exec = async (gap: number) => {
      setTimeout(() => {
        getContentFn(...params).then((h) => {
          boardcastFn(h);
          exec(ONE_DAY_GAP);
        });
      }, gap);
    };
    // 执行pic推送
    console.log(gap);
    exec(gap);
  };
