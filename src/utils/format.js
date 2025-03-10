import dayjs from "dayjs"
import { isNumber } from "lodash-es"
import numeral from "numeral"

import { CNY_TO_USD } from "@/const/discover"

export const formatSize = (bytes, fractionDigits = 1) => {
  if (!bytes && bytes !== 0) return "--"

  const kbSize = bytes / 1024
  if (kbSize < 1024) {
    return `${kbSize.toFixed(fractionDigits)} KB`
  } else if (kbSize < 1_048_576) {
    const mbSize = kbSize / 1024
    return `${mbSize.toFixed(fractionDigits)} MB`
  } else {
    const gbSize = kbSize / 1_048_576
    return `${gbSize.toFixed(fractionDigits)} GB`
  }
}

/**
 * format speed from Byte number to string like KB/s, MB/s or GB/s
 */
export const formatSpeed = (byte, fractionDigits = 2) => {
  if (!byte && byte !== 0) return "--"

  let word = ""

  // Byte
  if (byte <= 1000) {
    word = byte.toFixed(fractionDigits) + " Byte/s"
  }
  // KB
  else if (byte / 1024 <= 1000) {
    word = (byte / 1024).toFixed(fractionDigits) + " KB/s"
  }
  // MB
  else if (byte / 1024 / 1024 <= 1000) {
    word = (byte / 1024 / 1024).toFixed(fractionDigits) + " MB/s"
  }
  // GB
  else {
    word = (byte / 1024 / 1024 / 1024).toFixed(fractionDigits) + " GB/s"
  }

  return word
}

export const formatTime = timeInSeconds => {
  if (!timeInSeconds && timeInSeconds !== 0) return "--"
  if (!isNumber(timeInSeconds)) return timeInSeconds

  if (timeInSeconds < 60) {
    return `${timeInSeconds.toFixed(1)} s`
  } else if (timeInSeconds < 3600) {
    return `${(timeInSeconds / 60).toFixed(1)} min`
  } else {
    return `${(timeInSeconds / 3600).toFixed(2)} h`
  }
}

export const formatShortenNumber = num => {
  if (!num && num !== 0) return "--"
  if (!isNumber(num)) return num

  // 使用Intl.NumberFormat来添加千分号
  const formattedWithComma = new Intl.NumberFormat("en-US").format(num)

  // 格式化为 K 或 M
  if (num >= 10_000_000) {
    return (num / 1_000_000).toFixed(1) + "M"
  } else if (num >= 10_000) {
    return (num / 1000).toFixed(1) + "K"
  } else if (num === 0) {
    return 0
  } else {
    return formattedWithComma
  }
}

export const formatNumber = (num, fractionDigits) => {
  if (!num && num !== 0) return "--"

  if (!fractionDigits) return new Intl.NumberFormat("en-US").format(num)
  const [a, b] = num.toFixed(fractionDigits).split(".")
  return `${numeral(a).format("0,0")}.${b}`
}

export const formatIntergerNumber = num => {
  if (!num && num !== 0) return "--"

  return numeral(num).format("0,0")
}

export const formatTokenNumber = num => {
  if (!num && num !== 0) return "--"

  if (num > 0 && num < 1024) return "1K"

  let kiloToken = Math.floor(num / 1024)
  if ((num >= 1024 && num < 1024 * 41) || num >= 128_000) {
    kiloToken = Math.floor(num / 1000)
  }
  if (num === 131_072) return "128K"
  return kiloToken < 1000 ? `${kiloToken}K` : `${Math.floor(kiloToken / 1000)}M`
}

export const formatPrice = (price, fractionDigits = 2) => {
  if (!price && price !== 0) return "--"

  if (fractionDigits === 0) return numeral(price).format("0,0")

  const [a, b] = price.toFixed(fractionDigits).split(".")
  return `${numeral(a).format("0,0")}.${b}`
}

export const formatPriceByCurrency = (price, currency) => {
  if (currency === "CNY") {
    return formatPrice(price / CNY_TO_USD)
  }
  return formatPrice(price)
}

export const formatDate = date => {
  if (!date) return "--"

  return dayjs(date).format("YYYY-MM-DD")
}
