import { h } from 'hyperapp'

import ICON from './ICON'
import Tags from './Tags'
import Stars from './Stars'

import locals from '../styles/Detail.sass'

const onSaveButtonClick = saveDescHandler => event => {
  const actress = document
    .querySelector('.' + locals.actress)
    .querySelector('input').value
  const comment = document
    .querySelector('.' + locals.comment)
    .querySelector('textarea').value

  saveDescHandler({ actress, comment })
}

export default ({
  name = '未命名文件',
  rawPath = '',
  stars,
  tags,
  allTags,
  actress,
  comment,
  ratingHandler,
  isAddingTag,
  addTagHandler,
  selectTagHandler,
  saveTagHandler,
  saveDescHandler,
  copyRawPathHandler,
}) => (
  <div class={locals.detail}>
    <div class={locals.name}>{name}</div>
    <div class={locals.path}>
      <div title={rawPath}>{rawPath}</div>
      <button onclick={ () => copyRawPathHandler(rawPath) }>
        <ICON iconName="copy" size={{ width: '12px', height: '12px' }}></ICON>
      </button>
  </div>
    <div class={locals.stars}>
      <Stars stars={stars} ratingHandler={ratingHandler} />
    </div>
    <div class={locals.tags}>
      <Tags
        tags={tags}
        allTags={allTags}
        isAddingTag={isAddingTag}
        addTagHandler={addTagHandler}
        selectTagHandler={selectTagHandler}
        saveTagHandler={saveTagHandler}
      />
    </div>
    <div class={locals.form}>
      <div class={locals.actress}>
        <label for="">主演</label>
        <input type="text" value={actress} />
      </div>
      <div class={locals.comment}>
        <label for="">评价</label>
        <textarea rows="6">{comment}</textarea>
      </div>
      <div>
        <button onclick={onSaveButtonClick(saveDescHandler)}>
          <ICON iconName="pencil" size={{ width: '16px', height: '16px' }} />保存
        </button>
      </div>
    </div>
  </div>
)
