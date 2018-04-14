const FLAGS = {
  SAME: 'same',
  DIFF: 'diff'
}

const update = (left, right) => {
  if (right.actress) left.actress = right.actress
  if (right.comment) left.comment = right.comment
  if (right.tags) left.tags = right.tags
  if (right.stars) left.stars = right.stars

  right.children.forEach(n => {
    const existNode = left.children.find(
      m => n.rawPath === m.rawPath && n.type === m.type
    )
    if (!existNode) return true

    update(existNode, n)
  })
}

export default (root, fs, path) => {
  try {
    const content = fs.readFileSync(path.join(root.rawPath, '.DATA_FILES'))
    const rightNode = JSON.parse(content.toString())

    update(root, rightNode)
  } catch (e) {
    /* handle error */
    console.error(e)
  }
}
