import { illustsPush } from './illustPush'
import { RPixiv } from 'runtu-pixiv-sdk'
import { useState } from '../status'
import { PixelLevel } from '../type'

// params: 指令参数
const pushGenearte = (type: string) => async (params: string[], r: RPixiv) => {
    const { getPixel, getDefaultPixel } = useState();
    const pixelSetting = getPixel();
    // 默认是meduim画质
    const pixel_param = params[0] ? params[0].toLowerCase(): getDefaultPixel();
    // 本次推送的插画数
    const illusts_num = isNaN(Number(params[1])) ? undefined: Number(params[1]);
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
            pixel_level = null
            break;
    }

    if (pixel_level !== null) {
        return illustsPush(type, r, pixel_level, illusts_num);
    } else {
        return "命令参数错误，请检查是否输入正确的参数";
    } 
}

export const datePush = pushGenearte('day')
export const weekPush = pushGenearte('week')
export const monthPush = pushGenearte('month')


export * from './illustPush'
export * from './search'

