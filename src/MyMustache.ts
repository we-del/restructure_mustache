/*
  @description 整合自己的Mustache
  @param
*/

import Parser from "@/Parser";
import Scanner from "@/Scanner";

export default class MyMustache {
    private parser: Parser
    private scanner: Scanner
    private ele: HTMLElement

    constructor(htmlTemplate: string, data: { [props: string]: any }, ele: HTMLElement) {
        this.scanner = new Scanner(htmlTemplate)
        const htmlStructure = this.scanner.convertTemplate()
        this.parser = new Parser(htmlStructure, data)
        this.ele = ele
    }

    renderer() {
        this.ele.innerHTML = this.parser.parse()
    }
}