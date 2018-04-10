import { h, app } from 'hyperapp'

import Tree from './Tree'
import Detail from './Detail'
import ICON from './ICON'

import locals from '../styles/App.sass'

//import readDir from '../../business/readDir'

/*
 * define struct Node
 * - name: strig
 * - children: Array<Node>
 * - isExpand: boolean
 * - icon: string
 */

const state = {
  fileTreeRoot: {
    name: '/',
    children: [{
      name: 'MIDE-175',
      icon: 'subdir'
    }, {
      name: 'MIDE-175',
      icon: 'subdir'
    }],
    isExpand: true,
    icon: 'root'
  },
  root: '~/Movies',
  stars: 2,
  tags: [{
    name: '纯爱',
    color: '#C20228'
  }, {}, {}, {}, {}, {}]
}

const actions = {
  loadDir() {
    console.log('TODO: load dir')
  }
}

const view = ({ fileTreeRoot, root, stars, tags }, actions) => (
  <div class={ locals.app }>
    <div class={ locals.main }>
      <div class={ locals.tree }>
        <Tree root={ fileTreeRoot }/>
      </div>
      <div class={ locals.file } />
      <div class={ locals.detail }>
        <Detail stars={ stars  } tags={ tags } />
      </div>
    </div>
    <div class={ locals.root }>
      <ICON iconName="root" />
      <span>{ root }</span>
    </div>
  </div>
)

const instance = app(state, actions, view, document.body)
export default instance

instance.loadDir()

if (module.hot) {
  module.hot.accept('./App.js', () => {
    window.location.href = window.location.href
  })
}
