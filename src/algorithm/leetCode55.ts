/* 
 * 2022/12/6 9:38
 * author: xxx
 * @description:
 */

/**
 @description 跳跃游戏
 给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。

 数组中的每个元素代表你在该位置可以跳跃的最大长度。

 判断你是否能够到达最后一个下标。
 @example [2,3,1,1,4] true    [3,2,1,0,4] false
 @strategy 找出一个步长的最大长度使用他进行跨域，无需递归去对比某一个点位
 */
export default function (arr: number[]): boolean {
    if (arr.length == 1) return true
    return process(0, arr)
}

// 无脑递归(超时)
function process(index: number, arr: number[]): boolean {
    if (index >= arr.length -1) return true
    const step = arr[index]
    for (let i = index + step; i > index; i--) {
        if (process(i, arr)) return true

        if (i == 1) return false
    }
    return false
}

/**
 @strategy  找出一个总和超出当前步长中最大的数，通过其来进行跨越以次达到最优（如果其不能成功则找第二大的进行跨越，而非最远的）
 */
// function process(index: number, arr: number[]) {
//     // const cache = {}
//     let cache = []
//     const step = arr[index]
//     if (index + step >= arr.length - 1 || index >= arr.length - 1) return true
//     for (let i = index + step; i > index; i--) {
//         // 记录有效的移动 移动索引位置的值加上他的索引位置要大于最初的移动步长值
//         if (arr[i] + i > step && arr[i]) cache.push(i)
//     }
//     cache.sort((a, b) => b - a)
//     cache = cache.filter((n: number) => n)
//     for (let i = 0; i < cache.length; i++) {
//         if (process(cache[i], arr)) return true
//         if (index == 0 && i == cache.length - 1) return false
//     }
//     return false
// }