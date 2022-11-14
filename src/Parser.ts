/* 
 * 2022/11/14 10:44
 * author: xxx
 * @description:
 */

/**
 @description 用于扫描Scanner数据结构转换的html字符串
 @param
 */
export default class Parser {
    public template: any[]
    public data: { [props: string]: any }

    constructor(template: any[], data: { [props: string]: any }) {
        this.data = data
        this.template = template
    }

    /**
     @description 对每个外层结构进行遍历
     */
    public parse(): string {
        let result = ''
        const template = this.template
        template.forEach((node: any) => {
            const type = node[0]
            result += this.typeParse(type, node)
        })
        return result
    }

    /**
     @description 分配数据下方单元
     @param
     */
    private typeParse(type: string, node: any, data: any = this.data): string {
        let result = ''
        switch (type) {
            case 'text':
                result = node[1]
                break
            case 'name':
                const value = node[1]
                result = data[value]
                switch (value) {
                    case '.':
                        result = data
                        break
                }
                break
            case '#':
                const prop = node[1]
                const renderTemplate = node[2]
                result = this.parseDeep(renderTemplate, this.data[prop] || data[prop])
        }
        return result
    }

    /**
     @description 对数据源进行深度遍历完善数据
     @param
     */
    private parseDeep(template: any, data?: any): string {
        let result = ''
        data.forEach((item: any) => {
            template.forEach((node: any) => {
                const type = node[0]
                result += this.typeParse(type, node, item)
            })
        })
        return result
    }
}