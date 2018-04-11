import { h } from 'hyperapp'

import ICON from './ICON'

import locals from '../styles/Tags.sass'

const ICON_ADD_SIZE = {
  width: '14px',
  height: '14px'
}

const backgroundColor = (tag, selectedTags, mode) => {
  return {
    backgroundColor:
    selectedTags.filter(n => n.name === tag.name).length > 0
    ? tag.color
    : 'Transparent'
  }
}

const onUpdate = isAddingTag => element => {
  if (isAddingTag) element.querySelector('input').focus()
}
const onKeyUp = handler => event => {
  if (event.keyCode === 13)
    return handler({ name: event.target.value, color: '#0880f1' })
}

export const TAGS_MODE = {
  EDITOR: 'editor',
  FILTER: 'filter'
}

export default ({
  tags = [],
  allTags = [],
  mode = TAGS_MODE.EDITOR,
  isAddingTag = false,
  addTagHandler,
  selectTagHandler,
  saveTagHandler,
  closeTagHandler
}) => (
  <div class={locals.tags} onupdate={onUpdate(isAddingTag)}>
    {mode === TAGS_MODE.EDITOR &&
      isAddingTag && (
        <div>
          <input type="text" onkeyup={onKeyUp(saveTagHandler)} />
        </div>
      )}
    {mode === TAGS_MODE.EDITOR &&
      !isAddingTag && (
        <span
          class={[locals.tag, locals.addControl].join(' ')}
          onclick={addTagHandler}>
          <ICON iconName="tag" size={ICON_ADD_SIZE} />
          <span>new</span>
        </span>
      )}
    {allTags.map((n, i) => (
      <span
        class={locals.tag}
        style={backgroundColor(n, tags, mode)}
        onclick={ () => selectTagHandler(i) }>
        <ICON iconName="tag" size={ICON_ADD_SIZE} />
        <span>{n.name}</span>
      </span>
    ))}
  </div>
)
