export const SITE_NAME = 'Market Chronicle';
export const SITE_NAME_CN = 'A股编年史';
export const SITE_NAME_US = 'U.S. Market Chronicle';

export const DEFAULT_OG_IMAGE_PATH = '/og/default.svg';

export function getSiteDisplayName(lang: 'zh-CN' | 'en') {
  return lang === 'zh-CN' ? `${SITE_NAME} / ${SITE_NAME_CN}` : `${SITE_NAME} / ${SITE_NAME_US}`;
}

