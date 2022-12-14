import * as fs from 'fs'
import * as path from 'path'

function removeDirFile(dir) {
  const files = fs.readdirSync(`./${dir}`)
  files
    .filter(s => !s.startsWith('.'))
    .map(s => path.resolve(__dirname, dir, s))
    .forEach(f => fs.unlinkSync(f))
}

removeDirFile('imagemin/input')
removeDirFile('imagemin/output')
removeDirFile('sprites/input')
removeDirFile('sprites/output')

