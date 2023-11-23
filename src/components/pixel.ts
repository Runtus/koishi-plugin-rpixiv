import { WebPixivType } from "runtu-pixiv-sdk";
import { PixelFormatUrls, PixelLevel } from '../type'

// 每个id的插画对应的urls数据结构不一样，需要做统一处理
export const pixelUrlsFormat: (i: WebPixivType["illusts"]) => PixelFormatUrls[] = (illusts) => illusts.map(item => {
    // meta_pages 和 meta_single_page 是互斥有值的
    if (item.meta_pages.length !== 0) {
        // TODO meta_pages有多个，后续看如何把多个images放到一个展示页里
        // TODO bugfix：去查看rpixivsdk中的类型定义是否有误
        return {
            [PixelLevel.ORIGIN]: (item.meta_pages[0] as any).image_urls.original,
            [PixelLevel.LARGE]: (item.meta_pages[0] as any).image_urls.large,
            [PixelLevel.MEDIUM]: (item.meta_pages[0] as any).image_urls.medium,
            [PixelLevel.SMALL]: (item.meta_pages[0] as any).image_urls.square_medium
        }
    } else {
        return {
            [PixelLevel.ORIGIN]: item.meta_single_page.original_image_url,
            [PixelLevel.LARGE]: item.image_urls.large,
            [PixelLevel.MEDIUM]: item.image_urls.medium,
            [PixelLevel.SMALL]: item.image_urls.square_medium
        }
    }
})