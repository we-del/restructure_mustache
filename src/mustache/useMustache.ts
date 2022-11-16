/* 
 * 2022/11/16 10:05
 * author: xxx
 * @description:
 */

import MyMustache from "@/mustache/MyMustache";


export default function useMustach() {
    let htmlTemplate = `
    <h1>今天我们来学习{{title}}</h1>
    <div>
        <ol>
            {{#students}}
            <li>
                学生{{item.name}}的爱好是
                <ol>
                    {{#item.hobbies}}
                    <li>{{.}}</li>
                    {{/item.hobbies}}
                </ol>
            </li>
            {{/students}}
        </ol>
    </div>
`
    const data = {
        title: '我来自定义模板',
        students: [
            {

                name: '张三',
                hobbies: ['java', '吃饭', '睡觉']
            },
            {

                name: '李四',
                hobbies: ['web', '敲代码', '睡觉']
            }
        ]
    }


    const h1 = document.querySelector('h1')
    if (h1 instanceof HTMLElement) {
        const myMustache = new MyMustache(htmlTemplate, data, h1);
        myMustache.renderer()
    }
}
