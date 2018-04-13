import createNode from '../model/createNode'
import { FILE_TYPE } from '../constants'

const VIDEO_EXT = [
  '.avi',
  '.mp4',
  '.rmvb',
  '.rm',
  '.asf',
  '.divx',
  '.mpg',
  '.mpeg',
  '.mpe',
  '.wmv',
  '.mkv',
  '.vob'
]
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.raw']
const walkDir = (node, fs, path) => {
  const files = fs.readdirSync(node.rawPath)
  node.children = files.map(f => {
    const rawPath = path.join(node.rawPath, f)
    const extname = path.extname(f).toLowerCase()
    const stat = fs.statSync(rawPath)

    let type = FILE_TYPE.FILE
    if (stat.isDirectory()) type = FILE_TYPE.DIR
    else if (stat.isFile()) {
      type = ~VIDEO_EXT.indexOf(extname)
        ? FILE_TYPE.VIDEO
        : ~IMAGE_EXT.indexOf(extname) ? FILE_TYPE.IMAGE : FILE_TYPE.FILE
    }

    const subNode = createNode(rawPath, f, type)

    if (type === FILE_TYPE.DIR)
      walkDir(subNode, fs, path)

    return subNode
  })
}

export default (node, fs, path) => walkDir(node, fs, path)

