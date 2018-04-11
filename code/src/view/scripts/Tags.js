import { h } from 'hyperapp'

import ICON from './ICON'

import locals from '../styles/Tags.sass'

const ICON_ADD_SIZE = {
  width: '14px',
  height: '14px'
}

const backgroundColor = (tag, mode) => ({
  backgroundColor: tag.isSelected || mode === TAGS_MODE.EDITOR ? tag.color : 'Transparent'
})

export const TAGS_MODE = {
  EDITOR: 'editor',
  FILTER: 'filter'
}

export default ({ tags = [], mode = TAGS_MODE.EDITOR }) => (
  <div class={ locals.tags }>
    { 
      tags.map(n => <span class={ locals.tag } style={ backgroundColor(n) }>{ n.name }</span>) 
    }
    {
      mode === TAGS_MODE.EDITOR &&
        <span class={ [ locals.tag, locals.addControl ].join(' ') }><ICON iconName="tagAdd" size={ ICON_ADD_SIZE } /></span>
    }
  </div>
)
