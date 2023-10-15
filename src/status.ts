import { Config } from './'

const statusFunc = () => {
    // 利用闭包来实现简单的状态管理 TODO: 找一个Node端的状态管理库或者自己完善下这个库 
    let pixel: Config["pixel"] = null;
    let defaultPixel: string = "";

    return  () => {
        const setPixel = (p: Config["pixel"]) => {
            pixel = p
        }
    
        const getPixel = () => pixel

        const setDefaultPixel = (d: string) => {
            let formatD = ""
            switch (d) {
                case "低画质":
                    formatD = pixel.low
                    break;
                case "中等画质":
                    formatD = pixel.medium
                    break;
                case "高画质":
                    formatD = pixel.large
                    break;
                case "原画质":
                    formatD = pixel.origin
                    break;
                default:
                    break;
            }
            defaultPixel = formatD;
        }

        const getDefaultPixel = () => defaultPixel
    
        return {
            setPixel,
            getPixel,
            setDefaultPixel,
            getDefaultPixel
        }
    }   
}

export const status = statusFunc();