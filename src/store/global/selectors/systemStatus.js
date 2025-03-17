

import { INITIAL_STATUS } from "../initialState"

export const systemStatus = s => s.status

const sessionGroupKeys = s =>
    s.status.expandSessionGroupKeys || INITIAL_STATUS.expandSessionGroupKeys

const showSystemRole = s => s.status.showSystemRole
const mobileShowTopic = s => s.status.mobileShowTopic
const mobileShowPortal = s => s.status.mobileShowPortal
const showChatSideBar = s => !s.status.zenMode && s.status.showChatSideBar
const showSessionPanel = s => !s.status.zenMode && s.status.showSessionPanel
const showFilePanel = s => s.status.showFilePanel
const hidePWAInstaller = s => s.status.hidePWAInstaller
const isShowCredit = s => s.status.isShowCredit

const showChatHeader = s => !s.status.zenMode
const inZenMode = s => s.status.zenMode
const sessionWidth = s => s.status.sessionsWidth
const portalWidth = s => s.status.portalWidth || 400
const filePanelWidth = s => s.status.filePanelWidth
const inputHeight = s => s.status.inputHeight
const threadInputHeight = s => s.status.threadInputHeight

export const systemStatusSelectors = {
  filePanelWidth,
  hidePWAInstaller,
  inZenMode,
  inputHeight,
  isShowCredit,
  mobileShowPortal,
  mobileShowTopic,
  portalWidth,
  sessionGroupKeys,
  sessionWidth,
  showChatHeader,
  showChatSideBar,
  showFilePanel,
  showSessionPanel,
  showSystemRole,
  systemStatus,
  threadInputHeight
}
