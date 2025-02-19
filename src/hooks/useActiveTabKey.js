import { usePathname } from "next/navigation"

/**
 * Returns the active tab key (chat/market/settings/...)
 */
export const useActiveTabKey = () => {
  const pathname = usePathname()

  return pathname.split("/").find(Boolean)
}
