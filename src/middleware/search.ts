import { Element } from "koishi";
import { logger } from '../logger'
import { status } from '../status'
import { WebPixivType } from "runtu-pixiv-sdk";
import { requestBuffers } from "../components";
import { random } from '../tool'
import { RPixivFC, RPixivParamFC, PixelLevel } from '../type'

const DEFAULT_SEAECH = 5
const DEFAULT_PIXEL = PixelLevel.MEDIUM

// params做统一处理，keyword：搜索关键词. pixel_param: 图片画质，num: 本次请求的图片数
const rPixivSearch: RPixivFC = (fc) => (params, rpixiv) => {
  const { getPixel, getDefaultPixel } = status();
  const keyword = params[0], pixel_param = params[1] || getDefaultPixel(), num = isNaN(Number(params[2])) ? undefined : Number(params[2]);
  const pixelSetting = getPixel();
  let pixel_level: PixelLevel | null;
    switch (pixel_param) {
        case pixelSetting.low:
            pixel_level = PixelLevel.SMALL
            break;
        case pixelSetting.medium:
            pixel_level = PixelLevel.MEDIUM
            break;
        case pixelSetting.large:
            pixel_level = PixelLevel.LARGE
            break;
        case pixelSetting.origin:
            pixel_level = PixelLevel.ORIGIN
            break;
      default:
        // 默认是MEDIUM画质
            pixel_level = DEFAULT_PIXEL
            break;
    }
  return fc(rpixiv, keyword, pixel_level, num);
}


const Illusts: RPixivParamFC = async (rpixiv, keyword, pixel_level = PixelLevel.MEDIUM, number = DEFAULT_SEAECH) => {
  let info: string | Element | Element[];
  try {
    const response = (await rpixiv.searchIllusts(keyword)).data;
    if (!response.illusts) {
      info = "搜索的插画数为0，请检查关键字是否正确";
    } else {
      // TODO pixiv-sdk上增加图片搜索的范围
      const randoms = random(number, response.illusts.length);
      const illusts = randoms.map(num => response.illusts[num])
      info = await requestBuffers(illusts, rpixiv, pixel_level);
    }
  } catch (err) {
    logger.error(err);
    info = "出现了未知的错误，请联系管理员";
  }

  return info;
};


// export const rPixivIllustSearchById: RPixivFC = async (params, rpixiv) => {
//   let info: string | Element | Element[] = null;
//   const pid = params[0];

//   try {
//     const response = rpixiv.getAuthorIllusts()
//   } catch (err) {
    
//   }
// }

const Author: RPixivParamFC = async (rpixiv, keyword, pixel_level = PixelLevel.MEDIUM, number = DEFAULT_SEAECH) => {
  let info: string | Element;
  try {
    const response = await Promise.all([
      rpixiv.getAuthorInfo(keyword),
      rpixiv.getAuthorIllusts(keyword, "illust"),
    ]);
    const user = response[0].data.user;
    const illusts = response[1].data.illusts;
    const randoms = random(number, illusts.length);
    const random_illusts = randoms.map(num => illusts[num])
    // @ts-ignore TODO 修复rpixivSDK上的类型
    const comment = user.comment as string;
    info = `<>
        <p> 画师名称: ${user.name} </p>
        <p> 画师介绍: ${comment}  </p>
        <p> 画师主页: https://www.pixiv.net/users/${user.id} </p>
        <div > 画师部分作品: ${await requestBuffers(
          random_illusts,
          rpixiv,
          pixel_level
        )} </div>
    </>`;
  } catch (err) {
    logger.error(err);
    info = "请求画师信息出现错误，请联系管理员";
  }
  return info;
};


export const rPixivIllustsSearch = rPixivSearch(Illusts);
export const rPixivAuthorSearch = rPixivSearch(Author);