import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'
import { fileURLToPath } from 'node:url'
import path from 'path'

const DIR = path.dirname(fileURLToPath(import.meta.url))

imagemin([DIR + '/input/*.{jpg,png}'], {
  destination: DIR + '/output',
  plugins: [imageminJpegtran(), imageminPngquant({ strip: true })],
})
