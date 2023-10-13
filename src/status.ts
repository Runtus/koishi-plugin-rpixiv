import { Config } from './'

const statusFunc = () => {
    // 利用闭包来实现简单的状态管理 TODO: 找一个Node端的状态管理库或者自己完善下这个库 
    let pixel: Config["pixel"] = null;

    return  () => {
        const setPixel = (p: Config["pixel"]) => {
            pixel = p
        }
    
        const getPixel = () => pixel
    
        return {
            setPixel,
            getPixel
        }
    }   
}

export const status = statusFunc();