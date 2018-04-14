export default (root, fs, path) => {
  const content = JSON.stringify(root)
  fs.writeFileSync(path.join(root.rawPath, '.DATA_FILES'), content)
}
