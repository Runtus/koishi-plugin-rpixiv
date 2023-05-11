import { Element } from "koishi";
import { logger } from '../logger'
import { RPixiv, WebPixivType } from "runtu-pixiv-sdk";
import { requestBuffers } from "../components";

export const rPixivIllustsSearch: (
  params: string,
  r: RPixiv
) => Promise<string | Element> = async (params, rpixiv) => {
  let info: string | Element;

  try {
    const response = await rpixiv.searchIllusts(params);
    if (!response.illusts) {
      info = "搜索的插画数为0，请检查关键字是否正确";
    } else {
      info = await requestBuffers(response.illusts, rpixiv);
    }
  } catch (err) {
    console.error("error",err);
    logger.error(err);
    info = "出现了未知的错误，请联系管理员";
  }

  return info;
};

export const rPixivAuthorSearch: (
  params: string,
  r: RPixiv
) => Promise<string | Element> = async (params, rpixiv) => {
  let info: string | Element;

  try {
    const response = await Promise.all([
      rpixiv.getAuthorInfo(params),
      rpixiv.getAuthorIllusts(params, "illust"),
    ]);
    const user = response[0].user;
    const illusts = response[1].illusts;

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
