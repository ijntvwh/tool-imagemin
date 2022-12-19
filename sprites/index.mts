import gulp from 'gulp'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import rename from 'gulp-rename'
import spritesmith from 'gulp.spritesmith'
import imageminPngquant from 'imagemin-pngquant'
import imageminWebp from 'imagemin-webp'
import merge from 'merge-stream'
import { fileURLToPath } from 'node:url'
import path from 'path'
import buffer from 'vinyl-buffer'

type ImgTypes = 'jpg' | 'jpeg' | 'png' | 'gif' | 'svg'
const IMG_TYPE: ImgTypes = 'png' as ImgTypes
// ARGB444=4 RGB565=3
const posterize = 3
const TO_WEBP = true
const PNG_LOSS = true

const DIR = path.dirname(fileURLToPath(import.meta.url))
const imgName = `result.${IMG_TYPE}`
const cssName = 'result.json'

const outputDest = `${DIR}/output/`
function cssTemplate(data) {
  let w = 0
  let h = 0
  let w1 = 0
  let h1 = 0
  const total = data.sprites.length
  const images = data.sprites.reduce((pre, cur) => {
    const { x, y, width, height, total_width, total_height, name: name1 } = cur
    if (!/\d{3}$/.test(name1)) throw new Error('文件名不符合xx001')
    const name = name1.substr(name1.length - 3)
    if ((w1 && w1 !== width) || (h1 && h1 !== height)) throw new Error('图片尺寸不一致')
    if (!w) w = total_width
    if (!h) h = total_height
    if (!w1) w1 = width
    if (!h1) h1 = height
    // pre[name] = { x, y }
    return { ...pre, ...{ [name]: [x, y] } }
  }, {})
  return JSON.stringify({ images, w, h, w1, h1, total })
}
const spriteData = gulp
  .src(`${DIR}/input/*.${IMG_TYPE}`)
  .pipe(spritesmith({ imgName, cssName, algorithm: 'binary-tree', cssTemplate }))

type Plugin = (input: Buffer | NodeJS.ReadableStream) => Promise<Buffer>
const plugins = [] as Plugin[]
if (IMG_TYPE === 'gif') plugins.push(gifsicle())
if (/jpe?g/.test(IMG_TYPE)) plugins.push(mozjpeg())
if (IMG_TYPE === 'svg') plugins.push(svgo())
if (IMG_TYPE === 'png' && PNG_LOSS) plugins.push(imageminPngquant({ posterize }))
if (IMG_TYPE === 'png' && !PNG_LOSS) plugins.push(optipng())
if (TO_WEBP) plugins.push(imageminWebp())
const imgStream = spriteData.img
  .pipe(buffer())
  .pipe(imagemin(plugins, { verbose: true }))
  .pipe(rename(({ dirname, basename, extname }) => ({ dirname, basename, extname: TO_WEBP ? '.webp' : extname })))
  .pipe(gulp.dest(outputDest))

const cssStream = spriteData.css.pipe(gulp.dest(outputDest))
export default merge(imgStream, cssStream)
// export default merge(cssStream)
