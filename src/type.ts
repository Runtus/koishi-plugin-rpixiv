import { RPixiv } from "runtu-pixiv-sdk";
import { Element } from "koishi";

export enum PixelLevel {
    SMALL,
    MEDIUM,
    LARGE,
    ORIGIN
}

export type RPixivParamFC = (rpixiv: RPixiv, keyword: string, pixel_level: PixelLevel, num: number) => Promise<string | Element | Element[]>;
export type RPixivFC<T = string[]> = (fc: RPixivParamFC) => ((params: T, r: RPixiv) => Promise<string | Element | Element[]>)

export type PixelFormatUrls = {
    [PixelLevel.SMALL]: string,
    [PixelLevel.MEDIUM]: string,
    [PixelLevel.LARGE]: string,
    [PixelLevel.ORIGIN]: string
}
