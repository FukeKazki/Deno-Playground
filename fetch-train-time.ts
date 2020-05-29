import cheerio from "https://dev.jspm.io/cheerio@0.22.0"
import { moment } from "https://deno.land/x/moment/moment.ts"
// const url = 'https://kenkoooo.com/atcoder/atcoder-api/results?user=kazki'
// const url = 'https://gitpress.io/@fukke0906/2020-05-29'

interface url_parameter {
    from: string
    to: string
    y: string
    m: string
    d: string
    hh: string
    m2: string
    m1: string
}
// TODO 料金安い順になってる -> 切り替えれるようにする
const setUrl = ({from, to, y, m, d, hh, m2, m1}: url_parameter): string => {
    return encodeURI(`https://transit.yahoo.co.jp/search/result?flatlon=&fromgid=&from=${from}&tlatlon=&togid=&to=${to}&viacode=&via=&viacode=&via=&viacode=&via=&y=${y}&m=${m}&d=${d}&hh=${hh}&m2=${m2}&m1=${m1}&type=1&ticket=ic&expkind=1&userpass=1&ws=1&s=1&kw=${to}`)
}

const parameter: url_parameter = {
    from: '新大阪',
    to: '大国町',
    y: moment().year().toString(),
    m: (moment().month() + 1).toString().padStart(2, '0'),
    d: moment().date().toString().padStart(2, '0'),
    hh: moment().hour().toString().padStart(2, '0'),
    m2: moment().minute().toString().padStart(2, '0')[1],
    m1: moment().minute().toString().padStart(2, '0')[0] 
}

const url = setUrl(parameter)
// console.log(url)
const data = await fetch(url)
const html = await data.text()
const $ = cheerio.load(html)
const result = Array.from($('#rsltlst ul li.time'), (x: string) => $(x).text().match(/\d{2}/g))
const createText = (result: Array<Array<string>>): Array<string> => {
    return result.map(x => {
        return `${x[0]}時${x[1]}分発\n${x[2]}時${x[3]}分着`
    })
}
const sentence = createText(result)
console.log(`${parameter.from} -> ${parameter.to}`)
sentence.map(x => {
    console.log('---------------')
    console.log(x)
})
