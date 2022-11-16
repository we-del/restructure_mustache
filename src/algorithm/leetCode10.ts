/* 
 * 2022/11/16 9:24
 * author: xxx
 * @description:
 */

;

/**
 @description 正则匹配
 @tips 只考虑单个正则字符，
 如 ^(以其后一个字符开头) $(以前面一个字符结尾)*(匹配前面多个或0个).（匹配任意一个字符）?(匹配前面一个或0个) 不考虑 /w /d 等
 */
export default function leetCode10() {
    function isMatch(s: string, p: string): boolean {
        // 判断是否存在特殊字符，如 /d /w  * . ? ^ $
        const flag = isPlainReg(p);
        if (flag) return s.indexOf(p) !== -1
        else {
            const uniqueArgObj = searchUniqueStr(p)
            const errorHandler = errorHandle(uniqueArgObj, p, s)
            if (errorHandler) return false
            return workMatch(s, p, uniqueArgObj)

        }
    }

    /**
     @description 判断是否是一个普通的匹配子串
     */
    function isPlainReg(exp: string): boolean {
        let flag = true
        for (let i = 0; i < exp.length; i++) {
            flag = !uniqueExpCheck(exp[i])
            if (!flag) return false
        }
        return true

    }

    /**
     @description 判断 $^使用是否正确，判断 ?? ** 不可连续使用
     */
    function errorHandle(regObj: any, reg: string, str: string): boolean {
        if (!regObj['$'] && !regObj['^'] && !regObj['?'] && !regObj['*']) return false
        const endIndex = reg.length - 1
        if (regObj['$'] && reg[endIndex] !== '$')
            return true

        if (regObj['^'] && reg[0] !== '^') return true
        if (regObj['^'] && reg[1] !== '.' && reg[1] !== str[0]) return true
        // if (regObj['$'] && reg[reg.length - 2] !== '.' && reg[reg.length - 2] !== str[str.length - 1]) return true

        if (regObj['?'] && regObj['?'] instanceof Array && regObj['?'].length > 1) {
            const targetArr = regObj['?']
            let pre = targetArr[0]
            for (let i = 1; i < targetArr.length; i++) {
                if (targetArr[i] - pre === 1) return true
                pre = targetArr[i]
            }
        }

        if (regObj['*'] && regObj['*'] instanceof Array && regObj['*'].length > 1) {
            const targetArr = regObj['*']
            let pre = targetArr[0]
            for (let i = 1; i < targetArr.length; i++) {
                if (targetArr[i] - pre === 1) return true
                pre = targetArr[i]
            }
        }
        return false
    }

    function uniqueExpCheck(subStr: string): boolean {
        switch (subStr) {
            case '?':
            case '*':
            case '.':
            case '^':
            case '$':
                return true
            default:
                return false

        }
    }

    function searchUniqueStr(str: string): { [props: string]: any } {
        const res: { [props: string]: any } = {}
        for (let i = 0; i < str.length; i++) {
            const targetStr = str[i]
            const flag = uniqueExpCheck(targetStr)
            if (flag) {
                if (Reflect.has(res, targetStr)) {
                    if (res[targetStr] instanceof Array) {
                        res[targetStr].push(i)
                    } else {
                        const tmp = res[targetStr]
                        res[targetStr] = []
                        res[targetStr].push(tmp)
                        res[targetStr].push(i)
                    }
                } else {
                    res[targetStr] = i
                }
            }
        }
        return res
    }

    /**
     @description 匹配子串方法
     @param str 匹配的对象
     @param reg 匹配的正则
     @param regObj 特殊字符所处的位置对象
     @example 1avs223  ^1a..*?23
     @strategy 双指针位移做判断，判断结尾字符用于判断是否完成对比
     @issue 没有想出匹配策略，待下次在想
     */
    function workMatch(str: string, reg: string, regObj: { [props: string]: any }): boolean {

        if (reg[0] === '^' && reg[reg.length - 1] === '$') {
            return workProcess(0, 1, str, reg)
        } else if (reg[0] === '^') {
            return workProcess(0, 1, str, reg)
        } else {

            return workProcess(0, 0, str, reg)
        }


        return true
    }

    function workProcess(first: number, last: number, str: string, reg: string): boolean {
        let expectStr = ''
        const strLimitBoundary = str.length
        const regLimitBoundary = reg[reg.length - 1] === '$' ? reg.length - 1 : reg.length
        while (first < strLimitBoundary && last < reg.length) {
            if (reg[last] == '.' && reg[last + 1] == '*') {
                last += 2
            } else if (reg[last] == '.') {
                last++
            } else if (reg[last] == '*') {
                // * 算法精髓 记录之前一个值 ，并记录此次 * 共匹配了 str中子串的长度 ，然后记录 reg串中 *前的字符在其后出现的个数
                // 如果reg的记录个数小于 str移动的个数，则说明 * 帮助匹配了多用的次数，且reg * 后的次数也处理完毕，移动到最新的位置上继续匹配
                let recordChar = reg[last - 1]
                let recordCount = 0
                while (recordChar == str[first]) {
                    first++
                    // 应该记录 *之前的值并记录移动次数，然后去遍历 * 号后有多少相同的数，少则移动到这些数之前，多则匹配为完成
                    recordCount++
                }
                let regRecordCount = 0
                let tmpLast = last + 1
                while (recordChar === reg[tmpLast]) {
                    tmpLast++
                    regRecordCount++
                }
                // 记录得到 reg移动次数 小于等于  str时，说明 *帮助匹配了多个char此时移动到最新位置，否则还有多余的子串为匹配返回false
                if (regRecordCount <= recordCount) last = tmpLast
                else return false
            }
            if (reg[last] == str[first]) last++
            first++
        }
        if (last >= regLimitBoundary) return true

        return false
    }

    console.log('匹配字符', isMatch('a', 'aa'))
}