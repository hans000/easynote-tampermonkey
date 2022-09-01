const path = require('path')
const fs = require('fs')

const code = `
import './style.less'
GM_addStyle(GM_getResourceText('font'))
`.trimEnd()

function getTpl(code = '') {
    return (
`//#region importStyle${code}
//#endregion`
    )
}

const filename = path.resolve('./src/main.tsx')
const text = fs.readFileSync(filename).toString()
const newText = text.replace(/\/\/#region importStyle(\s|\S)*\/\/#endregion/, getTpl(process.env.VITE_LOCAL ? code : ''))
fs.writeFileSync(filename, newText)