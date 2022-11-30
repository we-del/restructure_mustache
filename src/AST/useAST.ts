import parse from "@/AST/parse";

export default function () {
    const template = `
        <div class="box">
            <h3 class="title">我是一个标题</h3>
            <ul>
                <li v-for="item in arr" :key="index">
                    {{item}}
                </li>
            </ul>
        </div>
    `
    parse(template)
}