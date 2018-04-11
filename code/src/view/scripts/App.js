import { h, app } from 'hyperapp'

import Tree from './Tree'
import Detail from './Detail'
import ICON from './ICON'
import FileExplorer from './FileExplorer'

import * as business from '../../business'

import locals from '../styles/App.sass'

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
    rawPath: '~/Movies',
    name: '/',
    children: [
      {
        rawPath: '~/Movies/MIDE-175',
        name: 'MIDE-175',
        type: 'subdir'
      },
      {
        rawPath: '~/Movies/MIDE-176',
        name: 'MIDE-176',
        type: 'subdir'
      },
      {
        rawPath: '~/Movies/YRH-093',
        name: 'YRH-093',
        type: 'subdir',
        isExpand: true,
        children: [
          {
            rawPath: '~/Movies/YRH-093.mp4',
            name: 'YRH-093',
            type: 'video',
            isPlaying: false
          },
          {
            rawPath: '~/Movies/YRH-093.jpg',
            name: 'YRH-093',
            type: 'image'
          }
        ]
      }
    ],
    isExpand: true,
    type: 'root',
    tags: [{}, {}],
    stars: 2
  },
  currentNode: null,
  root: '~/Movies',
  allTags: [
    {
      name: '纯爱',
      color: '#C20228'
    },
    {},
    {},
    {},
    {},
    {}
  ]
}

const actions = {
  ...business,
  selectNode: node => state => {
    if (state.currentNode) state.currentNode.isSelected = false

    node.isSelected = true

    return {
      ...state,
      currentNode: node
    }
  },
  expandNode: node => ((node.isExpand = !node.isExpand), node)
}

const view = ({ fileTreeRoot, root, allTags, currentNode }, actions) => (
  <div class={locals.app}>
    <div class={locals.main}>
      <div class={locals.tree}>
        <Tree
          root={fileTreeRoot}
          selectNodeHandler={actions.selectNode}
          expandNodeHandler={actions.expandNode}
        />
      </div>
      <div class={locals.file}>
        <FileExplorer tags={allTags} />
      </div>
      {currentNode &&
        currentNode.type !== 'root' && (
          <div class={locals.detail}>
            <Detail stars={currentNode.stars} tags={currentNode.tags} />
          </div>
        )}
    </div>
    <div class={locals.root}>
      <ICON iconName="root" />
      <span>{root}</span>
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
