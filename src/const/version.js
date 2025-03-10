import pkg from '@/../package.json';
import { BRANDING_NAME, ORG_NAME } from './branding';

export const CURRENT_VERSION = pkg.version;
export const isCustomBranding = BRANDING_NAME !== "LobeChat"
export const isCustomORG = ORG_NAME !== "LobeHub"
