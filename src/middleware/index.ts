import { illustsPush } from './illustPush'
import { RPixiv } from 'runtu-pixiv-sdk'
import { status } from '../status'
import { PixelLevel } from '../type'


// params: 指令参数
const pushGenearte = (type: string) => async (params: string[], r: RPixiv) => {
    if (params.length !== 1) {
        return "缺少指令参数，请检查是否正确或输入help查看使用案例。"
    }

    const { getPixel } = status();
    const pixelSetting = getPixel();
    const pixel_param = params[0].toLowerCase();
    let pixel_keyword: PixelLevel | null;
    switch (pixel_param) {
        case pixelSetting.low:
            pixel_keyword = PixelLevel.SMALL
            break;
        case pixelSetting.medium:
            pixel_keyword = PixelLevel.MEDIUM
            break;
        case pixelSetting.large:
            pixel_keyword = PixelLevel.LARGE
            break;
        default:
            pixel_keyword = null
            break;
    }

    if (pixel_keyword !== null) {
        return illustsPush(type, r, pixel_keyword);
    } else {
        return "命令参数错误，请检查是否输入正确的参数";
    } 
}

export const datePush = pushGenearte('day')
export const weekPush = pushGenearte('week')
export const monthPush = pushGenearte('month')


export * from './illustPush'
export * from './search'
export * from './datePic'

