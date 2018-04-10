import { h, app } from 'hyperapp'
import locals from '../styles/App.sass'

const state = {
  containers: 'Hello World'
}

const actions = {}

const view = ({ containers }, actions) => (
  <div class={locals.app}>
    <h1>Margaret 1.0</h1>
    <div>{ containers }</div>
  </div>
)

export default app(state, actions, view, document.body)

if (module.hot) {
  module.hot.accept('./App.js', () => {
    window.location.href = window.location.href
  })
}
