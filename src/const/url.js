import qs from 'query-string';
import urlJoin from 'url-join';

import { INBOX_SESSION_ID } from './session';
import {withBasePath} from "@/utils/basePath";

export const UTM_SOURCE = 'chat_preview';
export const OFFICIAL_SITE = 'https://lobehub.com/';
export const DOCUMENTS = urlJoin(OFFICIAL_SITE, '/docs');
export const DOCUMENTS_REFER_URL = `${DOCUMENTS}?utm_source=${UTM_SOURCE}`;
export const EMAIL_BUSINESS = 'hello@lobehub.com';
export const EMAIL_SUPPORT = 'support@lobehub.com';
export const USAGE_DOCUMENTS = urlJoin(DOCUMENTS, '/usage');
export const OFFICIAL_URL = 'https://lobechat.com/';
export const OG_URL = '/og/cover.png?v=1';
export const imageUrl = filename => withBasePath(`/images/${filename}`)

export const GITHUB =   'https://github.com/lobehub/lobe-chat';
export const DISCORD = 'https://discord.gg/AYFPHvv2jT';
export const MEDIDUM = 'https://medium.com/@lobehub';
export const X = 'https://x.com/lobehub';
export const SESSION_CHAT_URL = (id = INBOX_SESSION_ID, mobile) =>
    qs.stringifyUrl({
        query: mobile
            ? { session: id, showMobileWorkspace: mobile }
            : { session: id },
        url: "/chat"
    })
