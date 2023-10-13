/**
 * 
 * @param num number
 * @description 随机数的个数
 * @param top number
 * @description 随机数的上限
 */
export const random: (num: number, top: number) => number[] = (num, top) => {
    const randomNumbers = [];
    for (let i = 0; i < num; i++) {
        const randomNumber = Math.floor(Math.random() * top);
        randomNumbers.push(randomNumber);
    }
    return randomNumbers;
}
