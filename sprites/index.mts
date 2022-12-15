import gulp from 'gulp'
import imagemin from 'gulp-imagemin'
// import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import rename from 'gulp-rename'
import spritesmith from 'gulp.spritesmith'
import imageminPngquant from 'imagemin-pngquant'
import imageminWebp from 'imagemin-webp'
import merge from 'merge-stream'
import { fileURLToPath } from 'node:url'
import path from 'path'
import buffer from 'vinyl-buffer'

const DIR = path.dirname(fileURLToPath(import.meta.url))
const imgName = 'sprite.png'
const cssName = 'sprite.json'
function cssTemplate(data) {
  let w = 0
  let h = 0
  const images = data.sprites.map(element => {
    if (!w) w = element.total_width
    if (!h) h = element.total_height
    const { x, y, width, height, name: name1 } = element
    if (!/\d{3}$/.test(name1)) throw new Error('文件名不符合xx001')
    const name = name1.substr(name1.length - 3)
    return { x, y, width, height, name }
  })
  return JSON.stringify({ images, w, h })
}
const spriteData = gulp
  .src(DIR + '/input/*.png')
  .pipe(spritesmith({ imgName, cssName, algorithm: 'binary-tree', cssTemplate }))
const imgStream = spriteData.img
  .pipe(buffer())
  .pipe(imagemin([imageminPngquant({ posterize: 4 }), imageminWebp()], { verbose: true }))
  // .pipe(imagemin([gifsicle(), mozjpeg(), optipng(), svgo(), imageminWebp()], { verbose: true }))
  .pipe(
    rename(p => {
      return { dirname: p.dirname, basename: p.basename, extname: '.webp' }
    })
  )
  .pipe(gulp.dest(DIR + '/output/'))

const cssStream = spriteData.css.pipe(gulp.dest(DIR + '/output/'))
export default merge(imgStream, cssStream)
