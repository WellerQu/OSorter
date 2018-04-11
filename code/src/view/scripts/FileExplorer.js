import { h } from 'hyperapp'

import ICON from './ICON'
import Tags, { TAGS_MODE } from './Tags'

import { FILE_TYPE } from './constants'

import locals from '../styles/FileExplorer.sass'

const STYLE_VIDEO_SIZE = {
  width: 100,
  height: 70
}

const map = ({
  name = '文件名',
  type = FILE_TYPE.FILE,
  mediaPath = 'file:///Users/qiuwei/Movies/hnds026pl.jpg',
  isPlaying = false
}) => (
  <div class={[locals.file, locals.focus].join(' ')}>
    <div class={locals.preview}>
      {type === FILE_TYPE.VIDEO && (
        <video
          src={mediaPath}
          width={STYLE_VIDEO_SIZE.width}
          height={STYLE_VIDEO_SIZE.height}
        />
      )}
      {type === FILE_TYPE.VIDEO &&
        !!!isPlaying && <div class={locals.play} onclick={a => a} />}
      {type === FILE_TYPE.VIDEO &&
        !!isPlaying && <div class={locals.pause} onclick={a => a} />}
      {type === FILE_TYPE.IMAGE && <img src={mediaPath} />}
      {type === FILE_TYPE.FILE && <ICON iconName="default" />}
    </div>
    <div class={locals.name}>{name}</div>
  </div>
)

export default ({
  searchTags,
  files = [{}, {}, {}, {}],
  allTags = [],
  selectTagHandler
}) => (
  <div class={locals.explorer}>
    <div class={locals.tags}>
      <Tags
        mode={TAGS_MODE.FILTER}
        tags={searchTags}
        allTags={allTags}
        selectTagHandler={selectTagHandler}
      />
    </div>
    <div class={locals.container}>{files.map(n => map(n))}</div>
  </div>
)
