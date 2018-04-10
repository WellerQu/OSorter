import { h } from 'hyperapp'

import LOGO from './LOGO'
import ICON from './ICON'

import locals from '../styles/Tree.sass'

// <ICON iconName="root"></ICON>
const mapTo = ({ name, icon, isExpand = false, children = [] }) => (
  <div class={ locals.node }>
    <ICON iconName={ icon }></ICON>
    <span class={ locals.name }>{ name }</span>
    { isExpand && children.map(n => mapTo(n)) }
  </div>
)

export default ({ root }) => (
  <div class={ locals.tree }>
    <div class={ locals.logo }>
      <LOGO />
    </div>
    <div class={ locals.container }>
      { mapTo(root) }
    </div>
  </div>
)
