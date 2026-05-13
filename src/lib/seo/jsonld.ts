import { DEFAULT_OG_IMAGE_PATH, SITE_NAME } from './site';

export function buildArticleJsonLd(params: {
  title: string;
  description: string;
  canonicalUrl: string;
  language: string;
  modified?: string;
  imageUrl?: string;
}) {
  const { title, description, canonicalUrl, language, modified, imageUrl } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: language,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    image: imageUrl ?? DEFAULT_OG_IMAGE_PATH,
    ...(modified ? { dateModified: modified } : {}),
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function buildDatasetJsonLd(params: {
  name: string;
  description: string;
  apiUrl: string;
  canonicalUrl: string;
  modified?: string;
}) {
  const { name, description, apiUrl, canonicalUrl, modified } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url: canonicalUrl,
    ...(modified ? { dateModified: modified } : {}),
    distribution: [
      {
        '@type': 'DataDownload',
        contentUrl: apiUrl,
        encodingFormat: 'application/json',
      },
    ],
  };
}

