import gulp from 'gulp'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import rename from 'gulp-rename'
import spritesmith from 'gulp.spritesmith'
import imageminWebp from 'imagemin-webp'
import merge from 'merge-stream'
import { fileURLToPath } from 'node:url'
import path from 'path'
import buffer from 'vinyl-buffer'

const DIR = path.dirname(fileURLToPath(import.meta.url))
const imgName = 'sprite.png'
const cssName = 'sprite.css'
const spriteData = gulp.src(DIR + '/input/*.png').pipe(spritesmith({ imgName, cssName, algorithm: 'left-right' }))
const imgStream = spriteData.img
  .pipe(buffer())
  .pipe(imagemin([gifsicle(), mozjpeg(), optipng(), svgo(), imageminWebp()], { verbose: true }))
  .pipe(
    rename(p => {
      return { dirname: p.dirname, basename: p.basename, extname: '.webp' }
    })
  )
  .pipe(gulp.dest(DIR + '/output/'))
export default merge(imgStream)
