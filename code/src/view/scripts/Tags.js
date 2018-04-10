import { h } from 'hyperapp'

import ICON from './ICON'

import locals from '../styles/Tags.sass'

/*
 * define struct Tag
 * - name: string
 * - color: string
 */

const ICON_ADD_SIZE = {
  width: '20px',
  height: '20px'
}

export default ({ tags = [] }) => (
  <div class={ locals.tags }>
    { tags.map(n => <span class={ locals.tag } style={{ backgroundColor: n.color  }}>{ n.name }</span>) }
    <span class={ locals.tag }><ICON iconName="tagAdd" size={ ICON_ADD_SIZE } /></span>
  </div>
)
