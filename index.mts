import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminPngquant from 'imagemin-pngquant'

imagemin(['origin/*.{jpg,png}'], {
  destination: 'dist',
  plugins: [imageminJpegtran(), imageminPngquant({ strip: true })],
})
