import { h, app } from 'hyperapp'
import hotkeys from 'hotkeys-js'

import Tree from './Tree'
import Detail from './Detail'
import ICON from './ICON'
import FileExplorer from './FileExplorer'

import { FILE_TYPE } from './constants'
import { walkTree } from './utils'

import createStoreObject from '../../model/createStoreObject'

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
  ],
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
        rawPath: '~/Movies/SNIS985',
        name: 'SNIS985',
        type: 'subdir',
        isExpand: true,
        children: [
          {
            rawPath: 'file:///Users/qiuwei/Movies/SNIS985/SNIS985.mp4',
            name: 'SNIS985',
            type: 'video',
            actress: 'RION',
            comment: '很漂亮',
            stars: 5
          },
          {
            rawPath: 'file:///Users/qiuwei/Movies/SNIS985/SNIS985.jpg',
            name: 'SNIS985',
            type: 'image'
          }
        ]
      }
    ],
    isExpand: true,
    type: 'root',
    stars: 2
  },
  fileIndex: null, // new Map()
  currentNode: null,
  lastNode: [],
  message: '',
  isAddingTag: false,
  searchTags: [],
  showFiles: []
}

const actions = {
  loadIndex: () => (state, actions) => {
    state.message = 'loading index file'

    actions.selectNode(state.fileTreeRoot)

    state.fileIndex = state.allTags.reduce((map, n) => {
      return map.set(n.name, [])
    }, new Map())

    // 建立文件索引
    let tagged
    walkTree(state.fileTreeRoot, n => {
      if (!n.tags) return true

      if (n.type === FILE_TYPE.VIDEO || FILE_TYPE.IMAGE) {
        n.tags.forEach(t => {
          tagged = state.fileIndex.get(t.name)
          tagged.push(n)
        })
      }
    })

    return { ...state }
  },
  saveIndex: async () => {
    state.message = 'saving index file'

    try {
      if (process.env.NODE_ENV === 'production') {
        const content = JSON.stringify(
          createStoreObject(state.allTags, state.fileTreeRoot)
        )
        //const fs = require('fs')
        //const path = require('path')
        //const metaPath = path.resolve(
          //path.join(state.fileTreeRoot.rawPath, '.META')
        //)

        //await new Promise((resolve, reject) => {
          //fs.writeFile(metaPath, content, err => {
            //if (err) return reject(err)
            //resolve()
          //})
        //})
          //.then(() => (state.message = 'saved success'))
          //.catch(err => (state.message = 'saved failed'))
      }
    } catch (e) {
      /* handle error */
      state.message = e.message
    }

    return { ...state }
  },
  selectNode: node => state => {
    walkTree(state.fileTreeRoot, n => ((n.isSelected = false), n))

    node.isSelected = true
    state.currentNode && state.lastNode.push(state.currentNode)
    state.currentNode = node

    if (node.type === FILE_TYPE.ROOT || node.type === FILE_TYPE.DIR) {
      const files = []
      walkTree(node, n => {
        if (n.type === FILE_TYPE.VIDEO || n.type === FILE_TYPE.IMAGE)
          files.push(n)
      })
      state.showFiles = files
    }

    return { ...state }
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
    let tagged = state.fileIndex.get(tag.name)

    if (!state.currentNode.tags) state.currentNode.tags = []

    if (state.currentNode.tags.filter(n => n.name === tag.name).length > 0) {
      state.currentNode.tags = state.currentNode.tags.filter(
        n => n.name !== tag.name
      )

      // 更新索引
      tagged = tagged.filter(n => n.rawPath !== state.currentNode.rawPath)
      state.fileIndex.set(tag.name, tagged)
    } else {
      // 更新索引
      state.currentNode.tags.push(tag)
      tagged.push(state.currentNode)
    }

    return { ...state }
  },
  searchByTags: index => state => {
    const tag = state.allTags[index]
    if (state.searchTags.filter(n => n.name === tag.name).length > 0)
      state.searchTags = state.searchTags.filter(n => n.name !== tag.name)
    else state.searchTags.push(tag)

    if (state.searchTags.length === 0) {
      const files = []
      walkTree(state.currentNode, n => {
        if (n.type === FILE_TYPE.VIDEO || n.type === FILE_TYPE.IMAGE)
          files.push(n)
      })
      state.showFiles = files
    } else {
      state.showFiles = Array.from(state.searchTags.reduce((files, tag) => {
        const element = state.fileIndex.get(tag.name)
        element.forEach(f => {
          if (!files.has(f))
            files.add(f)
        })
        return files
      }, new Set()))
    }

    return { ...state }
  },
  saveTag: tag => state => {
    state.isAddingTag = false

    if (state.allTags.filter(n => n.name === tag.name).length > 0)
      return { ...state }

    state.allTags.push(tag)

    if (state.currentNode.tags) state.currentNode.tags.push(tag)
    else state.currentNode.tags = [tag]

    state.fileIndex.set(tag.name, [state.currentNode])

    return { ...state }
  },
  saveDesc: desc => (state, actions) => {
    if (state.currentNode && desc) {
      state.currentNode.actress = desc.actress
      state.currentNode.comment = desc.comment
    }

    actions.saveIndex()

    return { ...state }
  },
  selectFile: file => state => {
    walkTree(state.fileTreeRoot, n => ((n.isSelected = false), n))
    file.isSelected = true
    state.lastNode.push(state.currentNode)
    state.currentNode = file

    return { ...state }
  },
  back: () => state => {
    if (state.lastNode.length > 0)
      state.currentNode = state.lastNode.pop()

    return { ...state }
  }
}

const view = (
  {
    fileTreeRoot,
    allTags,
    showFiles,
    searchTags,
    currentNode,
    lastNode,
    isAddingTag,
    message
  },
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
        <div class={locals.toolbar}>
          {lastNode.length > 0 && (
            <button onclick={actions.back}>
              <ICON iconName="back" size={{ width: '12px', height: '12px' }} />
              返回
            </button>
          )}
        </div>
        {currentNode &&
          (currentNode.type === FILE_TYPE.DIR ||
            currentNode.type === FILE_TYPE.ROOT) && (
            <FileExplorer
              searchTags={searchTags}
              files={showFiles}
              allTags={allTags}
              selectTagHandler={actions.searchByTags}
              selectFileHandler={actions.selectFile}
            />
          )}
        {currentNode &&
          currentNode.type === FILE_TYPE.VIDEO && (
            <div class={locals.preview}>
              <video src={currentNode.rawPath} controls />
            </div>
          )}
        {currentNode &&
          currentNode.type === FILE_TYPE.IMAGE && (
            <div class={locals.preview}>
              <img src={currentNode.rawPath} />
            </div>
          )}
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
              saveDescHandler={actions.saveDesc}
            />
          </div>
        )}
    </div>
    <div class={locals.root}>
      <ICON iconName="root" />
      <span>{fileTreeRoot.rawPath}</span>
      <span>{message}</span>
    </div>
  </div>
)

const instance = app(state, actions, view, document.body)
export default instance

instance.loadIndex()

hotkeys(
  'ctrl+t,ctrl+1,ctrl+2,ctrl+3,ctrl+4,ctrl+5,ctrl+shift+1,ctrl+shift+2,ctrl+shift+3,ctrl+shift+4,ctrl+s,ctrl+r,esc',
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
      case 'ctrl+s':
        instance.saveIndex()
        break
      case 'ctrl+r':
        instance.loadIndex()
        break
      case 'esc':
        instance.back()
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
