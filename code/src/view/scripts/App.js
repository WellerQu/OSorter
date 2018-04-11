import { h, app } from 'hyperapp'
import hotkeys from 'hotkeys-js'

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
            isPlaying: false,
            actress: '波多野结衣',
            comment: '很漂亮',
            stars: 5
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
    stars: 2
  },
  currentNode: null,
  root: '~/Movies',
  isAddingTag: false,
  allTags: [
    {
      name: '纯爱',
      color: '#C20228'
    },
    {
      name: 'JK',
      color: '#C20228'
    },
    {
      name: '御姐',
      color: '#C20228'
    },
    {
      name: '萝莉',
      color: '#C20228'
    }
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
  expandNode: node => ((node.isExpand = !node.isExpand), node),
  rate: loves => state => {
    if (state.currentNode) state.currentNode.stars = loves
    return { ...state }
  },
  addTag: () => state => ((state.isAddingTag = true), { ...state }),
  selectTag: index => state => {
    if (!state.currentNode) return

    const tag = state.allTags[index]

    if (!state.currentNode.tags)
      state.currentNode.tags = []

    if (state.currentNode.tags.filter(n => n.name === tag.name).length > 0)
      state.currentNode.tags = state.currentNode.tags.filter(n => n.name !== tag.name)
    else
      state.currentNode.tags.push(tag)

    return { ...state }
  },
  saveTag: tag => state => {
    state.isAddingTag = false
    state.allTags.push(tag)

    if (state.currentNode.tags) state.currentNode.tags.push(tag)
    else state.currentNode.tags = [tag]

    return { ...state }
  }
}

const view = (
  { fileTreeRoot, root, allTags, currentNode, isAddingTag },
  actions
) => (
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
        <FileExplorer allTags={allTags} />
      </div>
      {currentNode &&
        currentNode.type !== 'root' && (
          <div class={locals.detail}>
            <Detail
              stars={currentNode.stars}
              tags={currentNode.tags}
              allTags={allTags}
              name={currentNode.name}
              actress={currentNode.actress}
              comment={currentNode.comment}
              ratingHandler={actions.rate}
              isAddingTag={isAddingTag}
              addTagHandler={actions.addTag}
              selectTagHandler={actions.selectTag}
              saveTagHandler={actions.saveTag}
            />
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

hotkeys(
  'ctrl+t,ctrl+1,ctrl+2,ctrl+3,ctrl+4,ctrl+5,ctrl+shift+1,ctrl+shift+2,ctrl+shift+3,ctrl+shift+4',
  (event, handler) => {
    switch (handler.key) {
      case 'ctrl+t':
        instance.addTag()
        break
      case 'ctrl+1':
        instance.rate(1)
        break
      case 'ctrl+2':
        instance.rate(2)
        break
      case 'ctrl+3':
        instance.rate(3)
        break
      case 'ctrl+4':
        instance.rate(4)
        break
      case 'ctrl+5':
        instance.rate(5)
        break
      case 'ctrl+shift+1':
        instance.selectTag(0)
        break
      case 'ctrl+shift+2':
        instance.selectTag(1)
        break
      case 'ctrl+shift+3':
        instance.selectTag(2)
        break
      case 'ctrl+shift+4':
        instance.selectTag(3)
        break
      default:
        console.info('no hot key')
    }
  }
)

if (module.hot) {
  module.hot.accept('./App.js', () => {
    window.location.href = window.location.href
  })
}
