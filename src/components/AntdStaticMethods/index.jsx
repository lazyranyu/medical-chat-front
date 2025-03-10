// Entry component
import { App } from "antd"
import { memo } from "react"

let message
let notification
let modal

export default memo(() => {
  const staticFunction = App.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification
  return null
})

export { message, modal, notification }
