import { h } from 'hyperapp'

import LOGO from './LOGO'
import ICON from './ICON'

import locals from '../styles/Tree.sass'

const isFocusClassName = isSelected =>
  isSelected ? [locals.name, locals.focus].join(' ') : locals.name

const mapToElement = (node, selectNodeHandler, expandNodeHandler) => {
  const { name, type, isExpand = false, children = [], isSelected } = node
  return (
    <div
      class={locals.node}
      onclick={e => (e.stopPropagation(), selectNodeHandler(node))}>
      {type === 'subdir' && (
        <span onclick={e => (e.stopPropagation(), expandNodeHandler(node))}>
          <ICON iconName={isExpand ? 'subdirFocus' : 'subdir'} />
        </span>
      )}
      {type !== 'subdir' && <ICON iconName={type} />}
      <span class={isFocusClassName(isSelected)}>{name}</span>
      {isExpand &&
        children.map(n =>
          mapToElement(n, selectNodeHandler, expandNodeHandler)
        )}
    </div>
  )
}

export default ({ root, selectNodeHandler, expandNodeHandler }) => (
  <div class={locals.tree}>
    <div class={locals.logo}>
      <LOGO />
    </div>
    <div class={locals.container}>
      {mapToElement(root, selectNodeHandler, expandNodeHandler)}
    </div>
  </div>
)
