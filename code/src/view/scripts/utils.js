export const walkTree = (startNode, handler) => {
  if (handler(startNode) === false) return

  const { children = [] } = startNode

  children.forEach(n => {
    return walkTree(n, handler)
  })
}
