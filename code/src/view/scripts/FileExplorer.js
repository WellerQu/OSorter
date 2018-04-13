import { h } from 'hyperapp'

import ICON from './ICON'
import Tags, { TAGS_MODE } from './Tags'

import { FILE_TYPE } from './constants'

import locals from '../styles/FileExplorer.sass'

const STYLE_VIDEO_SIZE = {
  width: 100,
  height: 70
}

const isSelectClassName = isSelected => {
  if (isSelected) return [locals.file, locals.focus].join(' ')
  else return locals.file
}

const mapToElement = (file, selectFileHandler) => {
  const {
    name = '文件名',
    type = FILE_TYPE.FILE,
    rawPath = 'file:///Users/qiuwei/Movies/hnds026pl.jpg',
    isSelected = false
  } = file

  return (
    <div
      class={isSelectClassName(isSelected)}
      onclick={() => selectFileHandler(file)}>
      <div class={locals.preview}>
        {type === FILE_TYPE.VIDEO && (
          <video
            src={rawPath}
            width={STYLE_VIDEO_SIZE.width}
            height={STYLE_VIDEO_SIZE.height}
          />
        )}
        {type === FILE_TYPE.IMAGE && <img src={rawPath} />}
        {type === FILE_TYPE.FILE && <ICON iconName="default" />}
      </div>
      <div class={locals.name}>{name}</div>
    </div>
  )
}

export default ({
  searchTags,
  files = [],
  allTags = [],
  selectTagHandler,
  selectFileHandler,
  exportToHandler
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
    <div class={locals.toolbar}>
      <button onclick={() => exportToHandler()}>
        <ICON iconName="export" size={{ width: '12px', height: '12px' }} />
        导出到剪切板
      </button>
    </div>
    <div class={locals.container}>
      {files.map(n => mapToElement(n, selectFileHandler))}
    </div>
  </div>
)
