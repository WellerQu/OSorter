import { h } from 'hyperapp'

import locals from '../styles/LOGO.sass'

export default () => (
  <div class={ locals.LOGO }>
    <span class={ locals.name }>OSorter</span>
    <span class={ locals.version }>v1.0 alpha</span>
  </div>
)
