import chroma from "chroma-js"

export const convertAlphaToSolid = (foreground, background) => {
  const fgColor = chroma(foreground)
  const bgColor = chroma(background)

  const alpha = fgColor.alpha()
  const alphaComplement = 1 - alpha

  const mixedColor = [
    fgColor.get("rgb.r") * alpha + bgColor.get("rgb.r") * alphaComplement,
    fgColor.get("rgb.g") * alpha + bgColor.get("rgb.g") * alphaComplement,
    fgColor.get("rgb.b") * alpha + bgColor.get("rgb.b") * alphaComplement
  ]

  const resultColor = chroma(mixedColor)

  return resultColor.hex()
}
