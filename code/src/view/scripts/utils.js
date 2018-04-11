export const findNodeFromTree = (startNode, targetNode) => {
  if (startNode.rawPath === targetNode.rawPath) 
    return startNode

  const { children = [] } = startNode

  for (let i = 0, item = children[i]; item; item = children[++i]) {
    if (item.icon !== 'subdir')
      continue

    return findNodeFromTree(item, targetNode)
  }
};
