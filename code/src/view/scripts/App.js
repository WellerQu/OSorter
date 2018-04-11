import { h, app } from 'hyperapp'

import Tree from './Tree'
import Detail from './Detail'
import ICON from './ICON'
import FileExplorer from './FileExplorer'

import * as business from '../../business'

import locals from '../styles/App.sass'

//import readDir from '../../business/readDir'

/*
 * define struct Node
 * - name: strig
 * - mediaPath: string
 * - children: Array<Node>
 * - isExpand: boolean
 * - icon: string
 * - isSelected: boolean
 * - type: string<file|dir|image|video>
 * - tags: Array<Tag>
 */

/*
 * define struct Tag
 * - name: string
 * - color: string
 * - isSelected: boolean
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
    icon: 'root',
    tags: [{}, {}],
    stars: 2,
  },
  currentNode: null,
  root: '~/Movies',
  tags: [{
    name: '纯爱',
    color: '#C20228'
  }, {}, {}, {}, {}, {}]
}

const actions = {
  ...business
}

const view = ({ fileTreeRoot, root, tags, currentNode }, actions) => (
  <div class={ locals.app }>
    <div class={ locals.main }>
      <div class={ locals.tree }>
        <Tree root={ fileTreeRoot }/>
      </div>
      <div class={ locals.file }>
        <FileExplorer tags={ tags } />
      </div>
      {
        currentNode &&
          <div class={ locals.detail }>
            <Detail stars={ currentNode.stars } tags={ currentNode.tags } />
          </div>
      }
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
