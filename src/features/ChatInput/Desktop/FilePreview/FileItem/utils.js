export const getHarmoniousSize = (
    inputWidth,
    inputHeight,
    { spacing = 24, containerWidth, containerHeight }
) => {
  let width = String(inputWidth)
  let height = String(inputHeight)

  const maxWidth = containerWidth - spacing
  const maxHeight = containerHeight - spacing

  if (inputHeight >= inputWidth && inputHeight >= maxHeight) {
    height = maxHeight + "px"
    width = "auto"
  } else if (inputWidth >= inputHeight && inputWidth >= maxWidth) {
    height = "auto"
    width = maxWidth + "px"
  } else {
    width = width + "px"
    height = height + "px"
  }

  return { height, width }
}
