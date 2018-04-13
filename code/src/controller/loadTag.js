export default (allTags, dataTagPath, fs, path) => {
  try {
    const content = fs.readFileSync(path.join(dataTagPath, '.DATA_TAGS'))
    const tags = JSON.parse(content.toString())
    Array.prototype.push.apply(allTags, tags)
  } catch (e) {
    /* handle error */
  }
}
