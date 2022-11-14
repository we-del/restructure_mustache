/* 
 * 2022/11/14 14:20
 * author: xxx
 * @description:
 */

/**
 @description 用于将模板转换为对应的数据结构
 @param
 */
export default class Scanner {
    private readonly template: string
    private first: number
    private last: number

    constructor(template: string) {
        this.template = template
        this.first = 0
        this.last = 1
        console.log('@template', template)
        this.convertTemplate()
    }


    /**
     @description 策略 找出第一个 {{#~^}} 需要递归的函数点位索引，其之前
     @param
     */


    /**
     @description 转换html字符串变为指定数据结构
     @param
     */
    public convertTemplate(): any[] {
        const returnStructure = []
        let patternLeftMustacheNum = 0  // 当等于 2 时说明匹配到了 {{ 此时需要深度搜索
        let patternRightMustacheNum = 0
        const template = this.template
        while (this.last < template.length) {
            // 判断是否时 { 是的话收集之前的字串，接着去匹配连续的下一个 ，
            // 如果下一个还是则看其后的一个是否是{,不是则可以存储，否则以最里层的{当作匹配表示
            if (template[this.last] === '{') {
                patternLeftMustacheNum++
                // 匹配到了 {{ 字符串 ,且下一个不是{ 则说明找到了插入点
                if (patternLeftMustacheNum == 2 && template[this.last + 1] !== '{') {
                    const str = template.substring(this.first, this.last - 1)
                    console.log('@找到了插入点，截取之前的字串，为： ', str)
                    const arr = ['text', str]
                    returnStructure.push(arr)
                    this.first = this.last + 1 // 记录待插入点位的坐标
                } else if (patternLeftMustacheNum == 2) patternLeftMustacheNum-- // 过滤连续的情况
            } else {
                if (patternLeftMustacheNum > 0) patternLeftMustacheNum-- // 不是连续的{直接减去
            }

            // 匹配结束符
            if (template[this.last] === '}') {
                patternRightMustacheNum++
                // 插入完成开始回收插入点
                if (patternRightMustacheNum == 2) {
                    // 检查first指向的是否是特殊字符串
                    const c = this.uniqueSignCheck(template[this.first]);
                    console.log('@##########cccchar', template[this.first])
                    // 重置擦混入点
                    patternLeftMustacheNum = 0
                    patternRightMustacheNum = 0

                    // 是特殊的字符串，需要进一步处理
                    if (c > 0) {
                        const signStr = template[this.first]
                        const targetSubStr = template.substring(this.first + 1, this.last - 1)
                        console.log('@targetSubStr+========', targetSubStr)
                        this.first = this.last + 1
                        const arr = [signStr, targetSubStr, this.convertTemplate()]
                        returnStructure.push(arr)
                    } else if (c < 0) {
                        // 处理闭环逻辑 此时说明第一个字符为 / 表示闭环的结束
                        this.first = this.last + 1
                        return returnStructure // 返回处理完成的部分
                    } else if (c == 0) { // 这个字符串没啥特别的,普通的name项
                        const subStr = template.substring(this.first, this.last)
                        console.log('@____找到的插入字串是', subStr)
                        const arr = ['name', subStr]
                        returnStructure.push(arr)
                        this.first = this.last + 1
                    }
                }
            } else {
                if (patternRightMustacheNum > 1) throw new Error('语法存在错误，请输入连续的两个}}，如{{...}}')
            }
            this.last++

        }
        const str = template.substring(this.first, this.last)
        console.log('@找到了最后的插入点插入点，截取之前的字串，为： ', str)
        const arr = ['text', str]
        returnStructure.push(arr)
        return returnStructure
    }

    private uniqueSignCheck(char: string): number {
        switch (char) {
            case '#':
            case "^":
                return 1
            case '/':
                return -1
            default :
                return 0
        }
    }
}