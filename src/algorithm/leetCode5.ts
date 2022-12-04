/*
  @description 最长回文子串
  @tips 回文的意思是正着念和倒着念一样，如：上海自来水来自海上
  @example 1
        输入：s = "babad"
        输出："bab"
        解释："aba" 同样是符合题意的答案。
  @example 2
        输入：s = "cbbd"
        输出："bb"
*/
export default function (str: string) {
    // if (isSingleSubStr(str) || str.length === 1) return str[0]
    let point = 0
    let left = 0
    let strLen = str.length
    let res = ''
    while (left < strLen) {
        point = left + 1
        while (point < strLen) {
            let c = str.substring(left, point)
            let substr = str.substring(left)
            // 有连续和非连续两种情况需要处理
            const reg = new RegExp(`^${c}.?${c.split('').reverse().join('')}`)
            const pattern = reg.exec(substr)

            if (pattern && pattern[0].length > res.length) {
                res = pattern[0]
            }
            point++
        }
        left++
    }

    return res ? res : str[0]
}

function isSingleSubStr(str: string) {
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j < str.length; j++) {
            if (str[i] == str[j]) return false
        }
    }
    return true
}