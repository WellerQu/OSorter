export default (
  rawPath,
  name,
  type,
  actress = '',
  comment = '',
  stars = 0,
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
