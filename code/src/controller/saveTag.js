export default (allTags, root, fs, path) => {
  const content = JSON.stringify(allTags)
  fs.writeFileSync(path.join(root.rawPath, '.DATA_TAGS'), content)
}
