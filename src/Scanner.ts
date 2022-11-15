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
    private readonly parsedTemplate: any[]
    private first: number
    private last: number

    constructor(template: string) {
        this.template = this.trim(template)
        this.first = 0
        this.last = 1
        this.parsedTemplate = this.convertTemplate()
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
        // 判断是否已经解析过模板，如果解析过则直接返回，（单例思想）
        if (!!this.parsedTemplate) return this.parsedTemplate
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
                    // 重置擦混入点
                    patternLeftMustacheNum = 0
                    patternRightMustacheNum = 0

                    // 是特殊的字符串，需要进一步处理
                    if (c > 0) {
                        const signStr = template[this.first]
                        let targetSubStr = template.substring(this.first + 1, this.last - 1)
                        // 找到的是一个 item.name  则截取他的name值 ， 本代码只允许一层解析
                        const findStr = this.parseObjCheck(targetSubStr)
                        if (!!findStr) targetSubStr = findStr
                        this.last++
                        this.first = this.last
                        const arr = [signStr, targetSubStr, this.convertTemplate()]
                        returnStructure.push(arr)
                    } else if (c < 0) {
                        // 处理闭环逻辑 此时说明第一个字符为 / 表示闭环的结束
                        this.last++
                        this.first = this.last
                        return returnStructure // 返回处理完成的部分
                    } else if (c == 0) { // 这个字符串没啥特别的,普通的name项
                        let subStr = template.substring(this.first, this.last - 1)
                        const findStr = this.parseObjCheck(subStr)
                        if (!!findStr) subStr = findStr
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
        //  此时说明余下的都是普通节点
        const str = template.substring(this.first, this.last)
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

    private parseObjCheck(str: string): string {
        const findIndex = str.indexOf('.')
        console.log('@find____string', str)
        console.log('@find____string', findIndex)
        if (findIndex != -1) {
            const strArr = str.split('.')
            const strLen = strArr.length
            return strArr[strLen - 1]
        }
        return ''
    }

    /*
      @description 匹配所有空格字符串将他们移除
      @param
    */
    private trim(str: string) {
        const reg = /\s+/g;
        return str.replace(reg, '')
    }
}