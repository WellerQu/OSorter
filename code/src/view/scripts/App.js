import { h, app } from 'hyperapp'
import hotkeys from 'hotkeys-js'

import Dialog from './Dialog'
import Tree from './Tree'
import Detail from './Detail'
import ICON from './ICON'
import FileExplorer from './FileExplorer'

import { FILE_TYPE } from '../../constants'
import { walkTree } from './utils'

import saveDir from '../../controller/saveDir'
import saveTag from '../../controller/saveTag'
import loadLastDataTags from '../../controller/loadLastDataTags'
import loadLastDataFiles from '../../controller/loadLastDataFiles'
import loadDir from '../../controller/loadDir'

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
  allTags: [],
  fileTreeRoot: {
    name: '/',
    rawPath: '~/Movies',
    isExpand: true,
    type: FILE_TYPE.ROOT,
    children: []
  },
  fileIndex: new Map(),
  currentNode: null,
  lastNode: [],
  message: '',
  isAddingTag: false,
  isEditingRoot: false,
  searchTags: [],
  showFiles: []
}

const actions = {
  loadIndex: () => (state, actions) => {
    state.showFiles.length = 0
    state.allTags.length = 0

    try {
      const fs = require('fs')
      const path = require('path')
      const { ipcRenderer } = require('electron')

      const lastRootPath = ipcRenderer.sendSync('load-last-root')
      state.fileTreeRoot.rawPath = lastRootPath || state.fileTreeRoot.rawPath

      loadDir(state.fileTreeRoot, fs, path)

      loadLastDataTags(state.allTags, state.fileTreeRoot, fs, path)
      loadLastDataFiles(state.fileTreeRoot, fs, path)

      // 读取节点后
      actions.selectNode(state.fileTreeRoot)
      // 建立文件索引
      state.fileIndex = state.allTags.reduce((map, n) => {
        return map.set(n.name, [])
      }, new Map())

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

      state.message = 'loaded success'
    } catch (e) {
      /* handle error */
      state.message = e.message
    }

    return { ...state }
  },
  saveIndex: () => (state, actions) => {
    try {
      const fs = require('fs')
      const path = require('path')
      const { ipcRenderer } = require('electron')

      saveTag(state.allTags, state.fileTreeRoot, fs, path)
      saveDir(state.fileTreeRoot, fs, path)

      if (!ipcRenderer.sendSync('save-last-root', state.fileTreeRoot.rawPath))
        throw new Error('save config failed')

      state.message = 'saved success'
    } catch (e) {
      /* handle error */
      state.message = e.message
    }

    return { ...state }
  },
  echo: state => {
    return state
  },
  selectNode: node => state => {
    walkTree(state.fileTreeRoot, n => ((n.isSelected = false), n))

    node.isSelected = true
    if (state.currentNode) {
      state.lastNode.push(state.currentNode)
      if (state.lastNode.length > 5)
        state.lastNode = state.lastNode.slice(
          state.lastNode.length - 5,
          state.lastNode.length
        )
    }
    state.currentNode = node

    console.log(state.lastNode)

    if (node.type === FILE_TYPE.ROOT || node.type === FILE_TYPE.DIR) {
      const files = []
      walkTree(node, n => {
        if (n.type === FILE_TYPE.VIDEO || n.type === FILE_TYPE.IMAGE)
          files.push(n)
      })
      state.showFiles = files
      state.searchTags.length = 0
    }

    return { ...state }
  },
  expandNode: node => ((node.isExpand = !node.isExpand), node),
  rate: loves => (state, actions) => {
    if (state.currentNode) state.currentNode.stars = loves

    actions.saveIndex()

    return { ...state }
  },
  addTag: () => state => ((state.isAddingTag = true), { ...state }),
  selectTag: index => (state, actions) => {
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

    actions.saveIndex()

    return { ...state }
  },
  searchByTags: index => state => {
    const tag = state.allTags[index]
    if (state.searchTags.filter(n => n.name === tag.name).length > 0)
      state.searchTags = state.searchTags.filter(n => n.name !== tag.name)
    else state.searchTags.push(tag)

    const files = []
    walkTree(state.currentNode, n => {
      if (n.type === FILE_TYPE.VIDEO || n.type === FILE_TYPE.IMAGE)
        files.push(n)
    })
    state.showFiles = files

    if (state.searchTags.length > 0) {
      state.showFiles = Array.from(
        state.searchTags.reduce((files, tag) => {
          const element = state.fileIndex.get(tag.name) || []
          element.forEach(f => {
            if (
              !files.has(f) &&
              state.showFiles.find(n => n.rawPath === f.rawPath)
            )
              files.add(f)
          })
          return files
        }, new Set())
      )
    }

    return { ...state }
  },
  saveTag: tag => (state, actions) => {
    state.isAddingTag = false

    if (!tag.name) return { ...state }

    if (state.allTags.filter(n => n.name === tag.name).length > 0)
      return { ...state }

    state.allTags.push(tag)

    if (state.currentNode.tags) state.currentNode.tags.push(tag)
    else state.currentNode.tags = [tag]

    state.fileIndex.set(tag.name, [state.currentNode])

    actions.saveIndex()

    return { ...state }
  },
  cancelAddTag: () => state => {
    state.isAddingTag = false
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
    if (state.lastNode.length > 0) {
      walkTree(state.fileTreeRoot, n => ((n.isSelected = false), n))
      state.currentNode = state.lastNode.pop()
      state.currentNode.isSelected = true
    }

    console.log(state.lastNode)

    return { ...state }
  },
  openDirectory: () => (state, actions) => {
    try {
      const { dialog } = require('electron').remote
      const dirs = dialog.showOpenDialog({
        title: '设置资源目录',
        properties: ['openDirectory']
      })

      if (dirs && dirs.length > 0) {
        actions.saveRoot(dirs[0])
      }

      state.message = 'set root success'
    } catch (e) {
      /* handle error */
      state.message = e.message
    }

    return { ...state }
  },
  saveRoot: path => (state, actions) => {
    state.fileTreeRoot.rawPath = path

    actions.loadIndex()
    actions.saveIndex()

    return { ...state }
  },
  copyRawPath: path => state => {
    try {
      const { clipboard } = require('electron')
      clipboard.writeText(path)

      state.message = `copied ${path}`
    } catch (e) {
      /* handle error */
      state.message = e.message
    }

    return { ...state }
  },
  openFile: path => state => {
    try {
      const { shell } = require('electron')
      shell.showItemInFolder(path)
      shell.openItem(path)

      state.message = 'open success'
    } catch (e) {
      /* handle error */
      state.message = e.message
    }

    return { ...state }
  },
  exportTo: () => state => {
    const { showFiles = [] } = state
    const content = showFiles.map(n => n.name).join('\r\n')

    try {
      const { clipboard } = require('electron')
      clipboard.writeText(content)

      state.message = 'copied files'
    } catch (e) {
      /* handle error */
      state.message = e.message
    }

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
              exportToHandler={actions.exportTo}
            />
          )}
        {currentNode &&
          currentNode.type === FILE_TYPE.VIDEO && (
            <div class={locals.preview}>
              <video src={`file://${currentNode.rawPath}`} controls />
            </div>
          )}
        {currentNode &&
          currentNode.type === FILE_TYPE.IMAGE && (
            <div class={locals.preview}>
              <img src={`file://${currentNode.rawPath}`} />
            </div>
          )}
        {currentNode &&
          currentNode.type === FILE_TYPE.FILE && <div class={locals.preview} />}
      </div>
      {currentNode &&
        currentNode.type !== FILE_TYPE.ROOT &&
        currentNode.type !== FILE_TYPE.DIR && (
          <div class={locals.detail}>
            <Detail
              stars={currentNode.stars}
              tags={currentNode.tags}
              allTags={allTags}
              name={currentNode.name}
              rawPath={currentNode.rawPath}
              actress={currentNode.actress}
              comment={currentNode.comment}
              ratingHandler={actions.rate}
              isAddingTag={isAddingTag}
              addTagHandler={actions.addTag}
              selectTagHandler={actions.selectTag}
              saveTagHandler={actions.saveTag}
              saveDescHandler={actions.saveDesc}
              copyRawPathHandler={actions.copyRawPath}
              openFileHandler={actions.openFile}
            />
          </div>
        )}
    </div>
    <div class={locals.root}>
      <ICON iconName="root" />
      <span>{fileTreeRoot.rawPath}</span>
      <span>
        <button onclick={actions.openDirectory}>
          <ICON iconName="pencil" size={{ height: '12px', width: '12px' }} />
        </button>
      </span>
      <span class={locals.message}>{message}</span>
    </div>
  </div>
)

const instance = app(state, actions, view, document.body)
export default instance

instance.loadIndex()

hotkeys(
  'ctrl+t,ctrl+1,ctrl+2,ctrl+3,ctrl+4,ctrl+5,ctrl+shift+1,ctrl+shift+2,ctrl+shift+3,ctrl+shift+4,ctrl+shift+5,ctrl+s,ctrl+r,ctrl+e,ctrl+shift+r,esc',
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
      case 'ctrl+shift+5':
        instance.selectTag(4)
        break
      case 'ctrl+s':
        instance.saveIndex()
        break
      case 'ctrl+r':
        instance.loadIndex()
        break
      case 'ctrl+e':
        instance.exportTo()
        break
      case 'ctrl+shift+r':
        instance.wantToEditRoot()
        break
      case 'esc':
        instance.back()
        instance.cancelEditRoot()
        instance.cancelAddTag()
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
