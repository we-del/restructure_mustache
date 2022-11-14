/* 
 * 2022/11/14 9:46
 * author: xxx
 * @description:
 */
import Parser from '@/Parser'
import Scanner from '@/Scanner'
import mustache from "@/mustache";


const str = `{{{{ a}}}`
const obj = {
    a: '张三'
}
//@ts-ignore
console.log('@mustache', mustache.render(str, obj));


let htmlTemplate = `
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

function trim(str: string) {
    const reg = /\s+/g;
    return str.replace(reg, '')
}

htmlTemplate = trim(htmlTemplate)
const scanner = new Scanner(htmlTemplate);
console.log('@convert_result,转换结果为：\n', scanner.convertTemplate());

/**
 @description 创建parser实例需要的数据
 */
const template = [
    ['text', '<div><ol><h1>'],
    ['name', 'title'],
    ['text', '</h1>'],
    ['#', 'students', [
        ['text', '<li>学生'],
        ['name', 'name'],
        ['text', '的爱好是<ol>'],
        ['#', 'hobbies', [
            ['text', '<li>'],
            ['name', '.'],
            ['text', '</li>'],

        ]],
        ['text', '</ol></li>'],
    ]],
    ['text', '</ol></div>']
]
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

const parser: Parser = new Parser(template, data);
const h1 = document.querySelector('h1')
//@ts-ignore
h1.innerHTML = parser.parse()
