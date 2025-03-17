import { DEFAULT_AGENT_META, DEFAULT_INBOX_AVATAR } from '@/const/meta';
import { DEFAULT_AGENT_CONFIG } from '@/const/settings';
export const DEFAULT_AGENT_LOBE_SESSION = {
    config: DEFAULT_AGENT_CONFIG,
    createdAt: new Date(),
    id: "",
    meta: DEFAULT_AGENT_META,
    model: DEFAULT_AGENT_CONFIG.model,
    type: 'agent',
    updatedAt: new Date()
}


export const INBOX_SESSION_ID = 'inbox';

