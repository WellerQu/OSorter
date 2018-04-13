import { h } from 'hyperapp'

import locals from '../styles/Dialog.sass'

export default ({}, children) => (
  <div class={locals.dialog}>{ children }</div>
)
