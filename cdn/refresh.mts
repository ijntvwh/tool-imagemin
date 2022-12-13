import * as dotenv from 'dotenv'
import { dirname, join } from 'path'
import qiniu from 'qiniu'

const dir = dirname(import.meta.url).replace('file://', '')

dotenv.config({ path: join(dir, 'qiniu.env') })

const accessKey = process.env.QINIU_AK
const secretKey = process.env.QINIU_SK
const PREFIX = process.env.QINIU_PREFIX

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const cdnManager = new qiniu.cdn.CdnManager(mac)

const files = [
  'ar/test/board.gltf',
]


const urls = files.map(s => PREFIX + s)

cdnManager.refreshUrls(urls, function (err, respBody, respInfo) {
  if (err) throw err
  console.log(respInfo.statusCode == 200 ? respBody : respInfo)
})
