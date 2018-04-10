import { h } from 'hyperapp'

import locals from '../styles/ICON.sass'

const STYLE_ICON_SIZE = {
  width: '26px',
  height: '26px'
}

export default ({ iconName, size = STYLE_ICON_SIZE }) => (
  <i class={ [locals.icon, locals[iconName]].join(' ') } style={ size }></i>
)
