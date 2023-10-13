import { Element } from "koishi";
import { logger } from '../logger'
import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { requestBuffers } from "../components";
import { random } from '../tool'

export const rPixivIllustsSearch: (
  params: string[],
  r: RPixiv
) => Promise<string | Element | Element[]> = async (params, rpixiv) => {
  let info: string | Element | Element[];
  const keyword = params[0];
  try {
    const response = (await rpixiv.searchIllusts(keyword)).data;
    if (!response.illusts) {
      info = "搜索的插画数为0，请检查关键字是否正确";
    } else {
      const randoms = random(10, 29);
      const illusts = randoms.map(num => response.illusts[num])
      info = await requestBuffers(illusts, rpixiv);
    }
  } catch (err) {
    logger.error(err);
    info = "出现了未知的错误，请联系管理员";
  }

  return info;
};

export const rPixivAuthorSearch: (
  params: string[],
  r: RPixiv
) => Promise<string | Element> = async (params, rpixiv) => {
  let info: string | Element;
  const keyword = params[0];
  try {
    const response = await Promise.all([
      rpixiv.getAuthorInfo(keyword),
      rpixiv.getAuthorIllusts(keyword, "illust"),
    ]);
    const user = response[0].data.user;
    const illusts = response[1].data.illusts;

    // @ts-ignore TODO 修复rpixivSDK上的类型
    const comment = user.comment as string;
    info = `<>
        <p> 画师名称: ${user.name} </p>
        <p> 画师介绍: ${comment}  </p>
        <p> 画师主页: https://www.pixiv.net/users/${user.id} </p>
        <div style="width='200px'"> 画师部分作品: ${await requestBuffers(
          (illusts as WebPixivType["illusts"]).slice(0, 5),
          rpixiv
        )} </div>
    </>`;
  } catch (err) {
    logger.error(err);
    info = "请求画师信息出现错误，请联系管理员";
  }
  return info;
};
