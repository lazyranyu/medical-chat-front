// initialState.js
import { AsyncLocalStorage } from '@/utils/localStorage';
export const SidebarTabKey = {
  Chat: 'chat',
  Discover: 'discover',
  Files: 'files',
  Me: 'me',
  Setting: 'settings',
};

export const ChatSettingsTabs = {
  Chat: 'chat',
  Meta: 'meta',
  Modal: 'modal',
  Plugin: 'plugin',
  Prompt: 'prompt',
  TTS: 'tts',
};

export const SettingsTabs = {
  About: 'about',
  Agent: 'agent',
  Common: 'common',
  LLM: 'llm',
  Provider: 'provider',
  Sync: 'sync',
  SystemAgent: 'system-agent',
  TTS: 'tts',
};

export const ProfileTabs = {
  Profile: 'profile',
  Security: 'security',
  Stats: 'stats',
};

export const INITIAL_STATUS = {
  expandSessionGroupKeys: ['pinned', 'default'], // Assuming SessionDefaultGroup values
  filePanelWidth: 320,
  hidePWAInstaller: false,
  hideThreadLimitAlert: false,
  inputHeight: 200,
  mobileShowTopic: false,
  portalWidth: 400,
  sessionsWidth: 320,
  showChatSideBar: true,
  showFilePanel: true,
  showSessionPanel: true,
  showSystemRole: false,
  threadInputHeight: 200,
  zenMode: false,
};

export const initialState = {
  initClientDBStage: 'idle', // Assuming DatabaseLoadingState.Idle value
  isMobile: false,
  isStatusInit: false,
  sidebarKey: SidebarTabKey.Chat,
  status: INITIAL_STATUS,
  statusStorage: new AsyncLocalStorage('LOBE_SYSTEM_STATUS'), // Assuming AsyncLocalStorage is defined elsewhere
};
