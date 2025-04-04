import qs from "query-string"

import { BRANDING_LOGO_URL } from "@/const/branding"
import { getCanonicalUrl } from "@/server/utils/url"

const MAX_AGE = 31_536_000
const COLOR = "#000000"

export class Manifest {
  generate({ color = COLOR, description, name, id, icons, screenshots }) {
    return {
      background_color: color,
      cache_busting_mode: "all",
      categories: ["productivity", "design", "development", "education"],
      description: description,
      display: "standalone",
      display_override: ["tabbed"],
      edge_side_panel: {
        preferred_width: 480
      },
      handle_links: "auto",
      icons: icons.map(item => this._getIcon(item)),
      id: id,
      immutable: "true",
      max_age: MAX_AGE,
      name: name,
      orientation: "portrait",
      related_applications: [
        {
          platform: "webapp",
          url: getCanonicalUrl("manifest.webmanifest")
        }
      ],
      scope: "/",
      // screenshots: screenshots.map(item => this._getScreenshot(item)),
      short_name: name,
      splash_pages: null,
      start_url: ".",
      tab_strip: {
        new_tab_button: {
          url: "/"
        }
      },
      theme_color: color
    }
  }

  _getImage = (url, version = 1) => ({
    cache_busting_mode: "query",
    immutable: "true",
    max_age: MAX_AGE,
    src: qs.stringifyUrl({
      query: { v: version },
      url: BRANDING_LOGO_URL || url
    })
  })

  _getIcon = ({ url, version, sizes, purpose }) => ({
    ...this._getImage(url, version),
    purpose,
    sizes,
    type: "image/png"
  })

  _getScreenshot = ({ form_factor, url, version, sizes }) => ({
    ...this._getImage(url, version),
    form_factor,
    sizes: sizes || form_factor === "wide" ? "1280x676" : "640x1138",
    type: "image/png"
  })
}

export const manifestModule = new Manifest()
