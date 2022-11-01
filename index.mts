import imagemin from 'imagemin'
import imageminJpegtran from 'imagemin-jpegtran'
// import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'

imagemin(['origin/*.{jpg,png}'], {
  destination: 'dist',
  // plugins: [imageminMozjpeg(), imageminPngquant({ strip: true })],
  plugins: [imageminJpegtran(), imageminPngquant({ strip: true })],
})
