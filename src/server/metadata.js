import qs from "query-string"

import { BRANDING_NAME } from "@/const/branding"
import { DEFAULT_LANG } from "@/const/locale"
import { OG_URL } from "@/const/url"
import { locales } from "@/locales/resources"
import { getCanonicalUrl } from "@/server/utils/url"
import { formatDescLength, formatTitleLength } from "@/utils/genOG"

export class Meta {
  generate({
             description = "LobeChat offers you the best ChatGPT, OLLaMA, Gemini, Claude WebUI user experience",
             title,
             image = OG_URL,
             url,
             type = "website",
             tags,
             alternate,
             locale = DEFAULT_LANG
           }) {
    // eslint-disable-next-line no-param-reassign
    const formatedTitle = formatTitleLength(title, 21)
    // eslint-disable-next-line no-param-reassign
    const formatedDescription = formatDescLength(description, tags)
    const siteTitle = title.includes(BRANDING_NAME)
        ? title
        : title + ` · ${BRANDING_NAME}`
    return {
      alternates: {
        canonical: getCanonicalUrl(
            alternate ? qs.stringifyUrl({ query: { hl: locale }, url }) : url
        ),
        languages: alternate ? this.genAlternateLocales(locale, url) : undefined
      },
      description: formatedDescription,
      openGraph: this.genOpenGraph({
        alternate,
        description,
        image,
        locale,
        title: siteTitle,
        type,
        url
      }),
      other: {
        robots: "index,follow"
      },
      title: formatedTitle,
      twitter: this.genTwitter({ description, image, title: siteTitle, url })
    }
  }

  genAlternateLocales = (locale, path = "/") => {
    let links = {}
    const defaultLink = getCanonicalUrl(path)
    for (const alterLocales of locales) {
      links[alterLocales] = qs.stringifyUrl({
        query: { hl: alterLocales },
        url: defaultLink
      })
    }
    return {
      "x-default": defaultLink,
      ...links
    }
  }

  genTwitter({ description, title, image, url }) {
    return {
      card: "summary_large_image",
      description,
      images: [image],
      site: "@lobehub",
      title,
      url
    }
  }

  genOpenGraph({
                 alternate,
                 locale = DEFAULT_LANG,
                 description,
                 title,
                 image,
                 url,
                 type = "website"
               }) {
    const data = {
      description,
      images: [
        {
          alt: title,
          url: image
        }
      ],
      locale,
      siteName: "LobeChat",
      title,
      type,
      url
    }

    if (alternate) {
      data["alternateLocale"] = locales
    }

    return data
  }
}

export const metadataModule = new Meta()
