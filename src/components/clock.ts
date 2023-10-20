import { Context, Element } from "koishi";
import moment from "moment";
import { logger } from "../logger";

// 时钟类
export class Clock {
  private channels: string[];
  private clock: string;
  // 记录timeout的id，用于取消
  private timeout: NodeJS.Timeout;
  static clockInstance: Clock;
  static ONE_DAY_GAP = 1000 * 60 * 60 * 24;

  static getInstance() {
    if (!Clock.clockInstance) {
      Clock.clockInstance = new Clock([], "");
    }
    return Clock.clockInstance;
  }

  constructor(channels: string[], clock: string) {
    this.channels = [...channels];
    this.clock = this.clock;
  }

  private getCurrentGap() {
      const that = this;
    const formatMoment = moment(
      moment().format("YYYY-MM-DD") + " " + that.clock
    ).valueOf();
    let triggerTimer = Number(formatMoment);
      const now = moment().valueOf();
    if (isNaN(triggerTimer)) {
      return 0;
    }

    // 如果设置的时间今天已经过了，则设置在第二天
    if (now > triggerTimer) {
      triggerTimer = moment(triggerTimer).add(1, "day").valueOf();
    }
    

    const gap = triggerTimer - now;
    if (isNaN(gap) || gap < 0) {
      return 0;
    }
    return gap;
  }

  setClock(clock: string) {
    this.clock = clock;
  }

  removeChannel(channel: string) {
    const removeIndex = this.channels.findIndex((item) => item === channel);
    this.channels.splice(removeIndex, 1);
  }

  addChannel(channel: string | string[]) {
    this.channels.push(...(typeof channel === "string" ? [channel] : channel));
  }

  // ctx: 聊天上下文 contentFn: 获得内容函数
  start(ctx: Context, getContentFn: () => Promise<Element | string>) {
    const that = this;
    const gap = this.getCurrentGap();

    if (!gap) {
        logger.error("启动失败，检查时钟设置是否正确。");
        return;
    }

    const exec = async (gap: number) => {
      that.timeout = setTimeout(() => {
        // 获取每日推荐内容 + 推送
        getContentFn().then(async (content) => {
          await ctx.broadcast([...that.channels], content);
          exec(Clock.ONE_DAY_GAP);
        });
      }, gap);
    };
    exec(gap);
  }

  restart(
    newClock: string,
    ctx: Context,
    getContentFn: () => Promise<Element | string>
  ) {
    const that = this;
    this.setClock(newClock);
    this.cancel();
    // 能够让start获取道最新的clock
    setTimeout(() => {
      that.start(ctx, getContentFn);
    }, 500);
  }

  cancel() {
    const timeout = this.timeout;
    clearTimeout(timeout);
  }
}
