export default (
  rawPath,
  name,
  type,
  actress,
  comment,
  stars = 1,
  tags = [],
  children = []
) => ({
  rawPath,
  name,
  type,
  actress,
  comment,
  stars,
  tags,
  children
})
